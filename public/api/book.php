<?php
/**
 * Shared-hosting booking endpoint.
 * Saves to Neon when configured; always emails + local JSON backup.
 */
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

require_once __DIR__ . '/db.php';

try {
  $config = elysium_load_config();
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
  exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON']);
  exit;
}

$required = ['hotelId', 'suiteName', 'guestName', 'guestEmail', 'guestPhone', 'checkIn', 'checkOut', 'guests'];
foreach ($required as $key) {
  if (!isset($data[$key]) || $data[$key] === '') {
    http_response_code(400);
    echo json_encode(['error' => "Missing field: $key"]);
    exit;
  }
}

if (!filter_var($data['guestEmail'], FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid email']);
  exit;
}

$id = 'req_' . bin2hex(random_bytes(4));
$storedInNeon = false;
$dbError = null;

if (elysium_db_configured($config)) {
  try {
    $id = elysium_create_booking($data, $config);
    $storedInNeon = true;
  } catch (Throwable $e) {
    $dbError = $e->getMessage();
  }
}

$to = $config['booking_email'] ?? 'elysium.hyd@gmail.com';
$subject = 'Elysium booking request — ' . $data['suiteName'];
$lines = [
  'New booking request from the website',
  '',
  'Reference: ' . $id,
  'Stored in Neon: ' . ($storedInNeon ? 'yes' : 'no'),
  'Hotel: ' . $data['hotelId'],
  'Suite: ' . $data['suiteName'],
  'Guest: ' . $data['guestName'],
  'Email: ' . $data['guestEmail'],
  'Phone: ' . $data['guestPhone'],
  'Check-in: ' . $data['checkIn'],
  'Check-out: ' . $data['checkOut'],
  'Guests: ' . $data['guests'],
  'Rooms: ' . ($data['rooms'] ?? 1),
];
if ($dbError) {
  $lines[] = 'DB note: ' . $dbError;
}

$body = implode("\n", $lines);
$from = $config['mail_from'] ?? ('noreply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost'));
$headers = [
  'From: Elysium Website <' . $from . '>',
  'Reply-To: ' . $data['guestEmail'],
  'Content-Type: text/plain; charset=utf-8',
];

$ok = @mail($to, $subject, $body, implode("\r\n", $headers));

$logDir = __DIR__ . '/../_bookings';
if (!is_dir($logDir)) {
  @mkdir($logDir, 0755, true);
}
@file_put_contents(
  $logDir . '/' . preg_replace('/[^a-zA-Z0-9_\-]/', '', $id) . '.json',
  json_encode(
    array_merge($data, [
      'id' => $id,
      'mailed' => (bool) $ok,
      'neon' => $storedInNeon,
      'dbError' => $dbError,
      'at' => date('c'),
    ]),
    JSON_PRETTY_PRINT
  )
);

if (!$storedInNeon && elysium_db_configured($config) && $dbError) {
  // Credentials set but insert failed — still accept request via email/JSON
  echo json_encode([
    'id' => $id,
    'status' => 'pending',
    'mailed' => (bool) $ok,
    'neon' => false,
    'warning' => $dbError,
  ]);
  exit;
}

echo json_encode([
  'id' => $id,
  'status' => 'pending',
  'mailed' => (bool) $ok,
  'neon' => $storedInNeon,
]);
