<?php
require __DIR__ . '/_bootstrap.php';

$error = '';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && ($_POST['action'] ?? '') === 'login') {
  $password = trim((string) ($_POST['password'] ?? ''));
  $expected = desk_password();

  if ($expected === '') {
    $error = 'admin_password is empty in api/config.php. Set a password and try again.';
  } elseif (!hash_equals($expected, $password)) {
    $error = 'Incorrect password. Use the value of admin_password in api/config.php.';
  } else {
    session_regenerate_id(true);
    $_SESSION['elysium_desk_auth'] = true;
    $_SESSION['elysium_desk_at'] = time();
    header('Location: ./index.php?ok=1');
    exit;
  }
}

$loggedIn = desk_is_logged_in();
$bookings = $loggedIn ? desk_load_bookings() : [];
$dbReady = false;
if ($loggedIn) {
  try {
    $dbReady = elysium_db_configured($config) && (bool) elysium_pdo($config);
  } catch (Throwable $e) {
    $dbReady = false;
  }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Elysium Desk — Booking requests</title>
  <style>
    :root {
      --forest: #06332c;
      --ivory: #f7f4e9;
      --sand: #da9953;
      --muted: #5c6b66;
      --line: rgba(6, 51, 44, 0.14);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "DM Sans", system-ui, sans-serif;
      background: var(--ivory);
      color: var(--forest);
      min-height: 100vh;
    }
    .wrap { max-width: 960px; margin: 0 auto; padding: 2rem 1.25rem 3rem; }
    .eyebrow {
      font-size: 0.7rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
      margin: 0 0 0.5rem;
    }
    h1 { font-family: Georgia, "Times New Roman", serif; font-weight: 500; font-size: 2rem; margin: 0 0 1.5rem; }
    .card {
      background: #fff;
      border: 1px solid var(--line);
      padding: 1.5rem;
    }
    label { display: block; font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
    input[type="password"] {
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.75rem 0;
      border: 0;
      border-bottom: 1px solid var(--line);
      background: transparent;
      font-size: 1rem;
      color: var(--forest);
    }
    input:focus { outline: none; border-bottom-color: var(--forest); }
    button, .btn {
      display: inline-block;
      margin-top: 1.25rem;
      background: var(--forest);
      color: var(--ivory);
      border: 0;
      padding: 0.85rem 1.4rem;
      font-size: 0.75rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      cursor: pointer;
      text-decoration: none;
    }
    .btn-outline {
      background: transparent;
      color: var(--forest);
      border: 1px solid var(--line);
      margin-left: 0.5rem;
    }
    .error { color: #8b2e2e; margin-top: 1rem; font-size: 0.95rem; }
    .top {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
    th, td { text-align: left; padding: 0.85rem 0.5rem; border-bottom: 1px solid var(--line); vertical-align: top; }
    th { font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
    a.link { color: var(--forest); }
    .empty { color: var(--muted); padding: 1rem 0; }
    .note { margin-top: 1.5rem; font-size: 0.85rem; color: var(--muted); line-height: 1.5; }
    .pill { display:inline-block; padding:.2rem .5rem; border:1px solid var(--line); font-size:.7rem; letter-spacing:.08em; text-transform:uppercase; }
  </style>
</head>
<body>
  <div class="wrap">
    <?php if (!$loggedIn): ?>
      <p class="eyebrow">Elysium Hotels</p>
      <h1>Desk login</h1>
      <div class="card" style="max-width: 420px;">
        <form method="post" action="">
          <input type="hidden" name="action" value="login" />
          <label for="password">Admin password</label>
          <input id="password" name="password" type="password" required autocomplete="current-password" />
          <?php if ($error !== ''): ?>
            <p class="error"><?= desk_h($error) ?></p>
          <?php endif; ?>
          <button type="submit">Sign in</button>
        </form>
        <p class="note">
          Password = <code>admin_password</code> in <code>api/config.php</code>
          <?php if (desk_password() === 'change-me' || desk_password() === 'Suites@26'): ?>
            <br />Default in package: <strong><?= desk_h(desk_password()) ?></strong> — change it after first login.
          <?php endif; ?>
          <br />Correct admin URL on shared hosting:
          <a href="./">/desk/</a> (not /admin)
        </p>
      </div>
    <?php else: ?>
      <div class="top">
        <div>
          <p class="eyebrow">Shared hosting desk</p>
          <h1 style="margin-bottom: 0;">Booking requests</h1>
        </div>
        <div>
          <a class="btn btn-outline" href="setup-database.php" style="margin-top:0;">Setup Neon DB</a>
          <a class="btn btn-outline" href="logout.php" style="margin-top:0;">Log out</a>
        </div>
      </div>

      <p class="note" style="margin-top:0;">
        Database:
        <span class="pill"><?= $dbReady ? 'Neon connected' : 'Not connected — open Setup Neon DB' ?></span>
        · Source: <?= count($bookings) && (($bookings[0]['source'] ?? '') === 'neon') ? 'Neon' : 'Local files / Neon' ?>
      </p>

      <div class="card">
        <?php if (count($bookings) === 0): ?>
          <p class="empty">No booking requests yet. New submissions from the website appear here.</p>
        <?php else: ?>
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th>Guest</th>
                <th>Stay</th>
                <th>Contact</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($bookings as $b): ?>
                <?php
                  $id = (string) ($b['id'] ?? '');
                  $when = (string) ($b['at'] ?? '');
                  $whenLabel = $when !== '' ? date('d M Y, H:i', strtotime($when)) : '—';
                  $suite = (string) ($b['suiteName'] ?? '');
                  $hotel = (string) ($b['hotelName'] ?? $b['hotelId'] ?? '');
                ?>
                <tr>
                  <td><?= desk_h($whenLabel) ?></td>
                  <td>
                    <strong><?= desk_h((string) ($b['guestName'] ?? '')) ?></strong><br />
                    <span style="color: var(--muted);"><?= desk_h($hotel) ?> · <?= desk_h($suite) ?></span>
                  </td>
                  <td>
                    <?= desk_h((string) ($b['checkIn'] ?? '')) ?> → <?= desk_h((string) ($b['checkOut'] ?? '')) ?><br />
                    <?= desk_h((string) ($b['guests'] ?? '')) ?> guests
                  </td>
                  <td>
                    <a class="link" href="mailto:<?= desk_h((string) ($b['guestEmail'] ?? '')) ?>"><?= desk_h((string) ($b['guestEmail'] ?? '')) ?></a><br />
                    <a class="link" href="tel:<?= desk_h(preg_replace('/\s+/', '', (string) ($b['guestPhone'] ?? ''))) ?>"><?= desk_h((string) ($b['guestPhone'] ?? '')) ?></a>
                  </td>
                  <td><a class="link" href="view.php?id=<?= urlencode($id) ?>">View</a></td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        <?php endif; ?>
      </div>
      <p class="note">
        Requests are stored in Neon when configured, plus a local backup under <code>_bookings/</code>.
        Emails go to <strong><?= desk_h((string) ($config['booking_email'] ?? '')) ?></strong>.
      </p>
    <?php endif; ?>
  </div>
</body>
</html>
