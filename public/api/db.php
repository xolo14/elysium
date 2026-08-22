<?php
/**
 * Neon / Postgres PDO helper for shared hosting.
 */

declare(strict_types=1);

function elysium_load_config(): array
{
  static $config = null;
  if ($config !== null) {
    return $config;
  }

  $file = __DIR__ . '/config.php';
  if (!is_file($file)) {
    throw new RuntimeException('Missing api/config.php');
  }

  $config = require $file;
  if (!is_array($config)) {
    throw new RuntimeException('api/config.php must return an array');
  }

  return $config;
}

function elysium_build_dsn(array $config): ?array
{
  $url = trim((string) ($config['database_url'] ?? ''));
  if ($url !== '') {
    $parts = parse_url($url);
    if ($parts === false || empty($parts['host'])) {
      throw new RuntimeException('Invalid database_url in config.php');
    }

    $user = isset($parts['user']) ? rawurldecode($parts['user']) : '';
    $pass = isset($parts['pass']) ? rawurldecode($parts['pass']) : '';
    $db = isset($parts['path']) ? ltrim($parts['path'], '/') : 'neondb';
    $port = (string) ($parts['port'] ?? '5432');
    $sslmode = 'require';

    if (!empty($parts['query'])) {
      parse_str($parts['query'], $query);
      if (!empty($query['sslmode'])) {
        $sslmode = (string) $query['sslmode'];
      }
    }

    $dsn = sprintf(
      'pgsql:host=%s;port=%s;dbname=%s;sslmode=%s',
      $parts['host'],
      $port,
      $db,
      $sslmode
    );

    return ['dsn' => $dsn, 'user' => $user, 'pass' => $pass];
  }

  $neon = $config['neon'] ?? [];
  $host = trim((string) ($neon['host'] ?? ''));
  $user = trim((string) ($neon['user'] ?? ''));
  $pass = (string) ($neon['password'] ?? '');
  $db = trim((string) ($neon['database'] ?? 'neondb'));
  $port = trim((string) ($neon['port'] ?? '5432'));
  $sslmode = trim((string) ($neon['sslmode'] ?? 'require'));

  if ($host === '' || $user === '' || $pass === '') {
    return null;
  }

  $dsn = sprintf(
    'pgsql:host=%s;port=%s;dbname=%s;sslmode=%s',
    $host,
    $port,
    $db,
    $sslmode
  );

  return ['dsn' => $dsn, 'user' => $user, 'pass' => $pass];
}

function elysium_db_configured(array $config): bool
{
  return elysium_build_dsn($config) !== null;
}

function elysium_pdo(?array $config = null): PDO
{
  $config = $config ?? elysium_load_config();
  $creds = elysium_build_dsn($config);
  if ($creds === null) {
    throw new RuntimeException('Neon credentials are not set in api/config.php');
  }

  if (!extension_loaded('pdo_pgsql')) {
    throw new RuntimeException(
      'PHP pdo_pgsql extension is missing. Ask Hostinger support to enable PostgreSQL PDO, or use Node hosting.'
    );
  }

  $pdo = new PDO($creds['dsn'], $creds['user'], $creds['pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);

  return $pdo;
}

function elysium_split_sql(string $sql): array
{
  $parts = preg_split('/;\s*\n/', $sql) ?: [];
  $out = [];
  foreach ($parts as $part) {
    $statement = trim($part);
    if ($statement === '' || str_starts_with($statement, '--')) {
      continue;
    }
    // Keep trailing content without forcing semicolon issues
    $out[] = rtrim($statement, "; \t\r\n");
  }
  return array_values(array_filter($out));
}

function elysium_run_sql_file(PDO $pdo, string $path): array
{
  if (!is_file($path)) {
    throw new RuntimeException('SQL file missing: ' . $path);
  }

  $sql = file_get_contents($path);
  if ($sql === false) {
    throw new RuntimeException('Could not read SQL file: ' . $path);
  }

  $results = [];
  foreach (elysium_split_sql($sql) as $statement) {
    try {
      $pdo->exec($statement);
      $results[] = ['ok' => true, 'sql' => mb_substr($statement, 0, 80) . (mb_strlen($statement) > 80 ? '…' : '')];
    } catch (Throwable $e) {
      $msg = $e->getMessage();
      // Ignore "already exists" on re-runs
      $ignorable = str_contains($msg, 'already exists')
        || str_contains($msg, 'duplicate key')
        || str_contains($msg, 'already present');
      $results[] = [
        'ok' => $ignorable,
        'ignored' => $ignorable,
        'error' => $msg,
        'sql' => mb_substr($statement, 0, 80) . (mb_strlen($statement) > 80 ? '…' : ''),
      ];
      if (!$ignorable) {
        // continue other statements but flag failure
      }
    }
  }

  return $results;
}

function elysium_nights_between(string $checkIn, string $checkOut): int
{
  $a = strtotime($checkIn . ' UTC');
  $b = strtotime($checkOut . ' UTC');
  if ($a === false || $b === false || $b <= $a) {
    throw new InvalidArgumentException('Check-out must be after check-in');
  }
  return max(1, (int) round(($b - $a) / 86400));
}

/**
 * Insert booking into Neon. Returns UUID string.
 */
function elysium_create_booking(PDO $pdo, array $data): string
{
  $nights = elysium_nights_between((string) $data['checkIn'], (string) $data['checkOut']);

  $suiteStmt = $pdo->prepare(
    'SELECT id, rate_paise FROM suites WHERE hotel_id = :hotel AND name = :name LIMIT 1'
  );
  $suiteStmt->execute([
    ':hotel' => $data['hotelId'],
    ':name' => $data['suiteName'],
  ]);
  $suite = $suiteStmt->fetch();
  if (!$suite) {
    throw new RuntimeException('Suite not found for this hotel. Run desk/setup-database.php first.');
  }

  $nightly = (int) $suite['rate_paise'];
  $total = $nightly * $nights;

  $insert = $pdo->prepare(
    'INSERT INTO bookings (
      hotel_id, suite_id, guest_name, guest_email, guest_phone,
      check_in, check_out, guests, nights, nightly_rate_paise, total_paise
    ) VALUES (
      :hotel_id, :suite_id, :guest_name, :guest_email, :guest_phone,
      :check_in, :check_out, :guests, :nights, :nightly, :total
    ) RETURNING id'
  );

  $insert->execute([
    ':hotel_id' => $data['hotelId'],
    ':suite_id' => (int) $suite['id'],
    ':guest_name' => $data['guestName'],
    ':guest_email' => $data['guestEmail'],
    ':guest_phone' => $data['guestPhone'],
    ':check_in' => $data['checkIn'],
    ':check_out' => $data['checkOut'],
    ':guests' => (int) $data['guests'],
    ':nights' => $nights,
    ':nightly' => $nightly,
    ':total' => $total,
  ]);

  $row = $insert->fetch();
  if (!$row || empty($row['id'])) {
    throw new RuntimeException('Failed to create booking in Neon');
  }

  return (string) $row['id'];
}

function elysium_list_bookings(PDO $pdo, int $limit = 100): array
{
  $stmt = $pdo->prepare(
    'SELECT
      b.id,
      b.hotel_id,
      b.guest_name,
      b.guest_email,
      b.guest_phone,
      b.check_in,
      b.check_out,
      b.guests,
      b.nights,
      b.status,
      b.created_at,
      s.name AS suite_name,
      h.name AS hotel_name
    FROM bookings b
    JOIN suites s ON s.id = b.suite_id
    JOIN hotels h ON h.id = b.hotel_id
    ORDER BY b.created_at DESC
    LIMIT :lim'
  );
  $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
  $stmt->execute();
  return $stmt->fetchAll();
}

function elysium_get_booking(PDO $pdo, string $id): ?array
{
  $stmt = $pdo->prepare(
    'SELECT
      b.*,
      s.name AS suite_name,
      h.name AS hotel_name
    FROM bookings b
    JOIN suites s ON s.id = b.suite_id
    JOIN hotels h ON h.id = b.hotel_id
    WHERE b.id = :id
    LIMIT 1'
  );
  $stmt->execute([':id' => $id]);
  $row = $stmt->fetch();
  return $row ?: null;
}
