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
$ok = elysium_send_booking_mail($config, $to, $subject, $body, (string) $data['guestEmail']);

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

function elysium_send_booking_mail(array $config, string $to, string $subject, string $body, string $replyTo): bool
{
  $from = trim((string) ($config['mail_from'] ?? 'noreply@elysiumhotels.in'));
  if (!filter_var($from, FILTER_VALIDATE_EMAIL)) {
    $from = 'noreply@elysiumhotels.in';
  }

  $smtpHost = trim((string) ($config['smtp_host'] ?? ''));
  $smtpUser = trim((string) ($config['smtp_user'] ?? ''));
  $smtpPass = (string) ($config['smtp_password'] ?? '');
  if ($smtpHost !== '' && $smtpUser !== '' && $smtpPass !== '') {
    try {
      elysium_smtp_send($config, $to, $subject, $body, $from, $replyTo);
      return true;
    } catch (Throwable $e) {
      return false;
    }
  }

  $headers = [
    'From: Elysium Hotels <' . $from . '>',
    'Reply-To: ' . $replyTo,
    'Content-Type: text/plain; charset=utf-8',
  ];

  return @mail($to, $subject, $body, implode("\r\n", $headers), '-f ' . $from);
}

function elysium_smtp_send(array $config, string $to, string $subject, string $body, string $from, string $replyTo): void
{
  $host = trim((string) ($config['smtp_host'] ?? 'smtp.gmail.com'));
  $port = (int) ($config['smtp_port'] ?? 465);
  $user = trim((string) ($config['smtp_user'] ?? ''));
  $pass = (string) ($config['smtp_password'] ?? '');
  $remote = ($port === 465 ? 'ssl://' : 'tcp://') . $host . ':' . $port;
  $fp = stream_socket_client($remote, $errno, $errstr, 20, STREAM_CLIENT_CONNECT);
  if ($fp === false) {
    throw new RuntimeException('SMTP connection failed');
  }
  stream_set_timeout($fp, 20);

  $expect = static function ($socket, array $ok) : void {
    $data = '';
    while (($line = fgets($socket, 515)) !== false) {
      $data .= $line;
      if (isset($line[3]) && $line[3] === ' ') {
        break;
      }
    }
    $code = (int) substr($data, 0, 3);
    if (!in_array($code, $ok, true)) {
      throw new RuntimeException('SMTP rejected the message');
    }
  };
  $expect($fp, [220]);
  fwrite($fp, "EHLO elysiumhotels.in\r\n");
  $expect($fp, [250]);
  fwrite($fp, "AUTH LOGIN\r\n");
  $expect($fp, [334]);
  fwrite($fp, base64_encode($user) . "\r\n");
  $expect($fp, [334]);
  fwrite($fp, base64_encode($pass) . "\r\n");
  $expect($fp, [235]);
  $envelope = filter_var($user, FILTER_VALIDATE_EMAIL) ? $user : $from;
  fwrite($fp, 'MAIL FROM:<' . $envelope . ">\r\n");
  $expect($fp, [250]);
  fwrite($fp, 'RCPT TO:<' . $to . ">\r\n");
  $expect($fp, [250, 251]);
  fwrite($fp, "DATA\r\n");
  $expect($fp, [354]);
  $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
  $message = implode("\r\n", [
    'From: Elysium Hotels <' . $envelope . '>',
    'To: <' . $to . '>',
    'Reply-To: <' . $replyTo . '>',
    'Subject: ' . $encodedSubject,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    '',
    str_replace(["\r\n", "\r"], "\n", $body),
  ]);
  $message = str_replace("\n", "\r\n", $message);
  $message = preg_replace('/^\./m', '..', $message) ?? $message;
  fwrite($fp, $message . "\r\n.\r\n");
  $expect($fp, [250]);
  fwrite($fp, "QUIT\r\n");
  fclose($fp);
}
