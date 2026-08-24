<?php
/**
 * Shared helpers for the PHP desk admin (shared hosting).
 */

declare(strict_types=1);

if (session_status() !== PHP_SESSION_ACTIVE) {
  $https =
    (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || ((string) ($_SERVER['SERVER_PORT'] ?? '') === '443')
    || (strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https');

  session_name('elysium_desk');
  session_set_cookie_params([
    'lifetime' => 60 * 60 * 12,
    'path' => '/',
    'secure' => $https,
    'httponly' => true,
    'samesite' => 'Lax',
  ]);
  session_start();
}

require_once dirname(__DIR__) . '/api/db.php';

$configFile = dirname(__DIR__) . '/api/config.php';
if (!is_file($configFile)) {
  http_response_code(500);
  exit('Missing api/config.php — upload api/config.php to the server.');
}

/** @var array $config */
$config = require $configFile;

function desk_bookings_dir(): string
{
  return dirname(__DIR__) . '/_bookings';
}

function desk_is_logged_in(): bool
{
  return !empty($_SESSION['elysium_desk_auth']);
}

function desk_require_login(): void
{
  if (!desk_is_logged_in()) {
    header('Location: ./index.php');
    exit;
  }
}

function desk_password(): string
{
  global $config;
  return trim((string) ($config['admin_password'] ?? ''));
}

function desk_h(string $value): string
{
  return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function desk_load_bookings(): array
{
  global $config;

  if (elysium_db_configured($config)) {
    try {
      $rows = elysium_list_bookings(150, $config);
      return array_map(static function (array $r) {
        return [
          'id' => (string) $r['id'],
          'hotelId' => (string) $r['hotel_id'],
          'suiteName' => (string) $r['suite_name'],
          'hotelName' => (string) ($r['hotel_name'] ?? ''),
          'guestName' => (string) $r['guest_name'],
          'guestEmail' => (string) $r['guest_email'],
          'guestPhone' => (string) $r['guest_phone'],
          'checkIn' => (string) $r['check_in'],
          'checkOut' => (string) $r['check_out'],
          'guests' => (string) $r['guests'],
          'nights' => (string) ($r['nights'] ?? ''),
          'status' => (string) ($r['status'] ?? 'pending'),
          'at' => (string) ($r['created_at'] ?? ''),
          'source' => 'neon',
        ];
      }, $rows);
    } catch (Throwable $e) {
      // fall through to JSON
    }
  }

  $dir = desk_bookings_dir();
  if (!is_dir($dir)) {
    return [];
  }

  $files = glob($dir . '/*.json') ?: [];
  $rows = [];

  foreach ($files as $file) {
    $json = json_decode((string) file_get_contents($file), true);
    if (!is_array($json)) {
      continue;
    }
    $json['_file'] = basename($file);
    $json['source'] = 'file';
    $rows[] = $json;
  }

  usort($rows, static function ($a, $b) {
    return strcmp((string) ($b['at'] ?? ''), (string) ($a['at'] ?? ''));
  });

  return $rows;
}

function desk_load_booking(string $id): ?array
{
  global $config;

  if (elysium_db_configured($config)) {
    try {
      $r = elysium_get_booking($id, $config);
      if ($r) {
        return [
          'id' => (string) $r['id'],
          'hotelId' => (string) $r['hotel_id'],
          'suiteName' => (string) $r['suite_name'],
          'hotelName' => (string) ($r['hotel_name'] ?? ''),
          'guestName' => (string) $r['guest_name'],
          'guestEmail' => (string) $r['guest_email'],
          'guestPhone' => (string) $r['guest_phone'],
          'checkIn' => (string) $r['check_in'],
          'checkOut' => (string) $r['check_out'],
          'guests' => (string) $r['guests'],
          'nights' => (string) ($r['nights'] ?? ''),
          'status' => (string) ($r['status'] ?? 'pending'),
          'at' => (string) ($r['created_at'] ?? ''),
          'mailed' => true,
          'source' => 'neon',
        ];
      }
    } catch (Throwable $e) {
      // fall through
    }
  }

  $safe = preg_replace('/[^a-zA-Z0-9_\-]/', '', $id);
  $file = desk_bookings_dir() . '/' . $safe . '.json';
  if (!is_file($file)) {
    return null;
  }
  $json = json_decode((string) file_get_contents($file), true);
  return is_array($json) ? $json : null;
}
