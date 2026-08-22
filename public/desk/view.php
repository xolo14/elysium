<?php
require __DIR__ . '/_bootstrap.php';
desk_require_login();

$id = (string) ($_GET['id'] ?? '');
$b = desk_load_booking($id);

if (!$b) {
  http_response_code(404);
  exit('Booking not found.');
}

$when = (string) ($b['at'] ?? '');
$whenLabel = $when !== '' ? date('d M Y, H:i', strtotime($when)) : '—';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Booking <?= desk_h((string) ($b['id'] ?? $id)) ?> — Elysium Desk</title>
  <style>
    :root { --forest: #06332c; --ivory: #f7f4e9; --muted: #5c6b66; --line: rgba(6, 51, 44, 0.14); }
    body { margin: 0; font-family: system-ui, sans-serif; background: var(--ivory); color: var(--forest); }
    .wrap { max-width: 640px; margin: 0 auto; padding: 2rem 1.25rem; }
    .eyebrow { font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
    h1 { font-family: Georgia, serif; font-weight: 500; font-size: 1.75rem; }
    .card { background: #fff; border: 1px solid var(--line); padding: 1.5rem; }
    dl { margin: 0; }
    dt { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-top: 1rem; }
    dd { margin: 0.35rem 0 0; }
    a { color: var(--forest); }
    .back { display: inline-block; margin-bottom: 1.25rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <a class="back" href="index.php">← All requests</a>
    <p class="eyebrow">Reference <?= desk_h((string) ($b['id'] ?? $id)) ?> · <?= desk_h((string) ($b['source'] ?? 'file')) ?></p>
    <h1><?= desk_h((string) ($b['guestName'] ?? 'Guest')) ?></h1>
    <div class="card">
      <dl>
        <dt>Received</dt>
        <dd><?= desk_h($whenLabel) ?></dd>
        <dt>Hotel</dt>
        <dd><?= desk_h((string) ($b['hotelName'] ?? $b['hotelId'] ?? '')) ?></dd>
        <dt>Suite</dt>
        <dd><?= desk_h((string) ($b['suiteName'] ?? '')) ?></dd>
        <dt>Check-in</dt>
        <dd><?= desk_h((string) ($b['checkIn'] ?? '')) ?></dd>
        <dt>Check-out</dt>
        <dd><?= desk_h((string) ($b['checkOut'] ?? '')) ?></dd>
        <dt>Guests</dt>
        <dd><?= desk_h((string) ($b['guests'] ?? '')) ?></dd>
        <?php if (!empty($b['nights'])): ?>
          <dt>Nights</dt>
          <dd><?= desk_h((string) $b['nights']) ?></dd>
        <?php endif; ?>
        <?php if (!empty($b['status'])): ?>
          <dt>Status</dt>
          <dd><?= desk_h((string) $b['status']) ?></dd>
        <?php endif; ?>
        <dt>Email</dt>
        <dd><a href="mailto:<?= desk_h((string) ($b['guestEmail'] ?? '')) ?>"><?= desk_h((string) ($b['guestEmail'] ?? '')) ?></a></dd>
        <dt>Phone</dt>
        <dd><a href="tel:<?= desk_h(preg_replace('/\s+/', '', (string) ($b['guestPhone'] ?? ''))) ?>"><?= desk_h((string) ($b['guestPhone'] ?? '')) ?></a></dd>
      </dl>
    </div>
  </div>
</body>
</html>
