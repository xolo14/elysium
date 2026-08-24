<?php
/**
 * Neon / Postgres helpers for shared hosting.
 *
 * Prefer PDO (pdo_pgsql) when available; otherwise use Neon SQL-over-HTTP
 * (works on Hostinger shared plans that lack the PostgreSQL PHP extension).
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

function elysium_connection_url(array $config): ?string
{
  $url = trim((string) ($config['database_url'] ?? ''));
  if ($url !== '') {
    return $url;
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

  return sprintf(
    'postgresql://%s:%s@%s:%s/%s?sslmode=%s',
    rawurlencode($user),
    rawurlencode($pass),
    $host,
    $port,
    $db,
    $sslmode
  );
}

/** @deprecated use elysium_connection_url — kept for older call sites */
function elysium_build_dsn(array $config): ?array
{
  $url = elysium_connection_url($config);
  if ($url === null) {
    return null;
  }

  $parts = parse_url($url);
  if ($parts === false || empty($parts['host'])) {
    throw new RuntimeException('Invalid database_url in config.php');
  }

  $user = isset($parts['user']) ? rawurldecode($parts['user']) : '';
  $pass = isset($parts['pass']) ? rawurldecode($parts['pass']) : '';
  $db = isset($parts['path']) ? ltrim($parts['path'], '/') : 'neondb';
  $db = explode('?', $db, 2)[0];
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

  return ['dsn' => $dsn, 'user' => $user, 'pass' => $pass, 'url' => $url];
}

function elysium_db_configured(array $config): bool
{
  return elysium_connection_url($config) !== null;
}

function elysium_neon_http_endpoint(string $connectionUrl): string
{
  $parts = parse_url($connectionUrl);
  if ($parts === false || empty($parts['host'])) {
    throw new RuntimeException('Invalid Neon connection URL');
  }

  // Same rewrite as @neondatabase/serverless: first label → "api."
  $apiHost = preg_replace('/^[^.]+\./', 'api.', $parts['host'], 1);
  return 'https://' . $apiHost . '/sql';
}

/**
 * Run a parameterized SQL query against Neon.
 * Uses PDO when pdo_pgsql is available; otherwise Neon SQL-over-HTTP.
 *
 * @param list<mixed> $params Positional params ($1, $2, …)
 * @return list<array<string, mixed>>
 */
function elysium_sql(string $query, array $params = [], ?array $config = null): array
{
  $config = $config ?? elysium_load_config();
  $url = elysium_connection_url($config);
  if ($url === null) {
    throw new RuntimeException('Neon credentials are not set in api/config.php');
  }

  if (extension_loaded('pdo_pgsql')) {
    return elysium_sql_via_pdo($query, $params, $config);
  }

  return elysium_sql_via_http($query, $params, $url);
}

function elysium_sql_via_pdo(string $query, array $params, array $config): array
{
  $creds = elysium_build_dsn($config);
  if ($creds === null) {
    throw new RuntimeException('Neon credentials are not set in api/config.php');
  }

  static $pdo = null;
  if (!$pdo instanceof PDO) {
    $pdo = new PDO($creds['dsn'], $creds['user'], $creds['pass'], [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
  }

  $stmt = $pdo->prepare($query);
  foreach ($params as $i => $value) {
    $stmt->bindValue($i + 1, $value);
  }
  $stmt->execute();

  if ($stmt->columnCount() === 0) {
    return [];
  }

  return $stmt->fetchAll();
}

function elysium_sql_via_http(string $query, array $params, string $connectionUrl): array
{
  $endpoint = elysium_neon_http_endpoint($connectionUrl);
  $payload = json_encode(
    [
      'query' => $query,
      'params' => array_map(static function ($value) {
        if ($value instanceof DateTimeInterface) {
          return $value->format('Y-m-d H:i:sP');
        }
        if (is_bool($value)) {
          return $value ? 't' : 'f';
        }
        return $value;
      }, array_values($params)),
    ],
    JSON_UNESCAPED_SLASHES
  );

  if ($payload === false) {
    throw new RuntimeException('Could not encode Neon query payload');
  }

  $headers = [
    'Content-Type: application/json',
    'Neon-Connection-String: ' . $connectionUrl,
    'Neon-Raw-Text-Output: true',
    'Neon-Array-Mode: true',
  ];

  $body = null;
  $status = 0;

  if (function_exists('curl_init')) {
    $ch = curl_init($endpoint);
    curl_setopt_array($ch, [
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => $payload,
      CURLOPT_HTTPHEADER => $headers,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_CONNECTTIMEOUT => 15,
    ]);
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($body === false) {
      throw new RuntimeException('Neon HTTP error: ' . ($err !== '' ? $err : 'request failed'));
    }
  } else {
    $context = stream_context_create([
      'http' => [
        'method' => 'POST',
        'header' => implode("\r\n", $headers),
        'content' => $payload,
        'timeout' => 30,
        'ignore_errors' => true,
      ],
    ]);
    $body = file_get_contents($endpoint, false, $context);
    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
      $status = (int) $m[1];
    }
    if ($body === false) {
      throw new RuntimeException('Neon HTTP error: request failed (enable curl or allow_url_fopen)');
    }
  }

  $decoded = json_decode($body, true);
  if ($status >= 400) {
    $message = is_array($decoded) ? (string) ($decoded['message'] ?? $body) : (string) $body;
    throw new RuntimeException('Neon query failed (HTTP ' . $status . '): ' . $message);
  }

  if (!is_array($decoded)) {
    throw new RuntimeException('Neon returned an invalid response');
  }

  $fields = $decoded['fields'] ?? [];
  $rows = $decoded['rows'] ?? [];
  if (!is_array($fields) || !is_array($rows)) {
    return [];
  }

  $names = [];
  foreach ($fields as $field) {
    $names[] = (string) ($field['name'] ?? '');
  }

  $out = [];
  foreach ($rows as $row) {
    if (!is_array($row)) {
      continue;
    }
    $assoc = [];
    foreach ($names as $i => $name) {
      if ($name === '') {
        continue;
      }
      $assoc[$name] = $row[$i] ?? null;
    }
    $out[] = $assoc;
  }

  return $out;
}

/** @deprecated Prefer elysium_sql(). Kept so older code can still open PDO when available. */
function elysium_pdo(?array $config = null): PDO
{
  $config = $config ?? elysium_load_config();
  if (!extension_loaded('pdo_pgsql')) {
    throw new RuntimeException(
      'PHP pdo_pgsql is not installed. The site now uses Neon HTTP automatically — refresh and run Setup again.'
    );
  }
  $creds = elysium_build_dsn($config);
  if ($creds === null) {
    throw new RuntimeException('Neon credentials are not set in api/config.php');
  }
  return new PDO($creds['dsn'], $creds['user'], $creds['pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
}

function elysium_db_transport(?array $config = null): string
{
  $config = $config ?? elysium_load_config();
  if (!elysium_db_configured($config)) {
    return 'none';
  }
  return extension_loaded('pdo_pgsql') ? 'pdo_pgsql' : 'neon_http';
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
    $out[] = rtrim($statement, "; \t\r\n");
  }
  return array_values(array_filter($out));
}

function elysium_run_sql_file(string $path, ?array $config = null): array
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
      elysium_sql($statement, [], $config);
      $results[] = [
        'ok' => true,
        'sql' => mb_substr($statement, 0, 80) . (mb_strlen($statement) > 80 ? '…' : ''),
      ];
    } catch (Throwable $e) {
      $msg = $e->getMessage();
      $ignorable = str_contains($msg, 'already exists')
        || str_contains($msg, 'duplicate key')
        || str_contains($msg, 'already present');
      $results[] = [
        'ok' => $ignorable,
        'ignored' => $ignorable,
        'error' => $msg,
        'sql' => mb_substr($statement, 0, 80) . (mb_strlen($statement) > 80 ? '…' : ''),
      ];
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
function elysium_create_booking(array $data, ?array $config = null): string
{
  $config = $config ?? elysium_load_config();
  $nights = elysium_nights_between((string) $data['checkIn'], (string) $data['checkOut']);

  $suiteRows = elysium_sql(
    'SELECT id, rate_paise FROM suites WHERE hotel_id = $1 AND name = $2 LIMIT 1',
    [$data['hotelId'], $data['suiteName']],
    $config
  );
  $suite = $suiteRows[0] ?? null;
  if (!$suite) {
    throw new RuntimeException('Suite not found for this hotel. Run desk/setup-database.php first.');
  }

  $nightly = (int) $suite['rate_paise'];
  $total = $nightly * $nights;

  $inserted = elysium_sql(
    'INSERT INTO bookings (
      hotel_id, suite_id, guest_name, guest_email, guest_phone,
      check_in, check_out, guests, nights, nightly_rate_paise, total_paise
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6::date, $7::date, $8, $9, $10, $11
    ) RETURNING id',
    [
      $data['hotelId'],
      (int) $suite['id'],
      $data['guestName'],
      $data['guestEmail'],
      $data['guestPhone'],
      $data['checkIn'],
      $data['checkOut'],
      (int) $data['guests'],
      $nights,
      $nightly,
      $total,
    ],
    $config
  );

  $id = $inserted[0]['id'] ?? null;
  if (!$id) {
    throw new RuntimeException('Failed to create booking in Neon');
  }

  return (string) $id;
}

function elysium_list_bookings(int $limit = 100, ?array $config = null): array
{
  return elysium_sql(
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
    LIMIT $1',
    [$limit],
    $config
  );
}

function elysium_get_booking(string $id, ?array $config = null): ?array
{
  $rows = elysium_sql(
    'SELECT
      b.*,
      s.name AS suite_name,
      h.name AS hotel_name
    FROM bookings b
    JOIN suites s ON s.id = b.suite_id
    JOIN hotels h ON h.id = b.hotel_id
    WHERE b.id = $1
    LIMIT 1',
    [$id],
    $config
  );
  return $rows[0] ?? null;
}
