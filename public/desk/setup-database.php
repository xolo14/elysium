<?php
require __DIR__ . '/_bootstrap.php';
require_once dirname(__DIR__) . '/api/db.php';

desk_require_login();

$config = elysium_load_config();
$messages = [];
$errors = [];
$results = [];
$dbOk = false;
$dbInfo = '';

try {
  if (elysium_db_configured($config)) {
    $pdo = elysium_pdo($config);
    $dbOk = true;
    $dbInfo = 'Connected to Neon successfully.';
  } else {
    $errors[] = 'Neon credentials are empty. Edit api/config.php first (database_url or neon fields).';
  }
} catch (Throwable $e) {
  $errors[] = $e->getMessage();
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && ($_POST['action'] ?? '') === 'setup') {
  if (!$dbOk) {
    $errors[] = 'Cannot run setup without a Neon connection.';
  } else {
    $sqlDir = dirname(__DIR__) . '/api/sql';
    $files = [
      '001_initial.sql',
      '002_booking_lifecycle.sql',
      'seed.sql',
    ];

    try {
      $pdo = elysium_pdo($config);
      foreach ($files as $file) {
        $path = $sqlDir . '/' . $file;
        $chunk = elysium_run_sql_file($pdo, $path);
        $results[$file] = $chunk;
        $failed = array_filter($chunk, static fn ($r) => empty($r['ok']));
        if ($failed) {
          $errors[] = $file . ' had errors (see details below).';
        } else {
          $messages[] = $file . ' applied.';
        }
      }

      if (!$errors) {
        $messages[] = 'Database setup complete. Hotels and suites are ready.';
      }
    } catch (Throwable $e) {
      $errors[] = $e->getMessage();
    }
  }
}

$pdoCheck = null;
$counts = null;
if ($dbOk) {
  try {
    $pdoCheck = elysium_pdo($config);
    $counts = [
      'hotels' => (int) $pdoCheck->query('SELECT COUNT(*) FROM hotels')->fetchColumn(),
      'suites' => (int) $pdoCheck->query('SELECT COUNT(*) FROM suites')->fetchColumn(),
      'bookings' => (int) $pdoCheck->query('SELECT COUNT(*) FROM bookings')->fetchColumn(),
    ];
  } catch (Throwable $e) {
    // tables may not exist yet
    $counts = null;
  }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Setup Neon database — Elysium Desk</title>
  <style>
    :root { --forest:#06332c; --ivory:#f7f4e9; --muted:#5c6b66; --line:rgba(6,51,44,.14); --sand:#da9953; }
    body { margin:0; font-family:system-ui,sans-serif; background:var(--ivory); color:var(--forest); }
    .wrap { max-width:820px; margin:0 auto; padding:2rem 1.25rem 3rem; }
    .eyebrow { font-size:.7rem; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); }
    h1 { font-family:Georgia,serif; font-weight:500; font-size:1.9rem; }
    .card { background:#fff; border:1px solid var(--line); padding:1.25rem 1.5rem; margin-top:1rem; }
    .ok { color:#1d6b4f; } .bad { color:#8b2e2e; }
    button, .btn { background:var(--forest); color:var(--ivory); border:0; padding:.85rem 1.3rem; letter-spacing:.12em; text-transform:uppercase; font-size:.72rem; cursor:pointer; text-decoration:none; display:inline-block; }
    .btn-outline { background:transparent; color:var(--forest); border:1px solid var(--line); }
    code, pre { font-size:.85rem; }
    pre { white-space:pre-wrap; background:#f3f0e6; padding:.75rem; overflow:auto; }
    ol { line-height:1.55; }
    .top { display:flex; flex-wrap:wrap; gap:1rem; justify-content:space-between; align-items:flex-end; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div>
        <p class="eyebrow">One-time setup</p>
        <h1>Create Neon database tables</h1>
      </div>
      <a class="btn btn-outline" href="index.php">← Desk</a>
    </div>

    <div class="card">
      <p><strong>Steps</strong></p>
      <ol>
        <li>Open Neon → your project → Connection string</li>
        <li>Paste it into <code>api/config.php</code> → <code>database_url</code></li>
        <li>Set <code>admin_password</code> in the same file</li>
        <li>Click <strong>Run database setup</strong> below</li>
      </ol>
      <p class="<?= $dbOk ? 'ok' : 'bad' ?>"><?= desk_h($dbOk ? $dbInfo : ($errors[0] ?? 'Not connected')) ?></p>
      <?php if ($counts): ?>
        <p>Current rows — hotels: <strong><?= (int) $counts['hotels'] ?></strong>,
          suites: <strong><?= (int) $counts['suites'] ?></strong>,
          bookings: <strong><?= (int) $counts['bookings'] ?></strong></p>
      <?php endif; ?>
    </div>

    <?php foreach ($messages as $m): ?>
      <div class="card ok"><?= desk_h($m) ?></div>
    <?php endforeach; ?>
    <?php foreach ($errors as $e): ?>
      <div class="card bad"><?= desk_h($e) ?></div>
    <?php endforeach; ?>

    <div class="card">
      <form method="post">
        <input type="hidden" name="action" value="setup" />
        <p>This creates hotels, suites, and bookings tables, then seeds Madhapur & Hitec City suites.</p>
        <button type="submit" <?= $dbOk ? '' : 'disabled' ?>>Run database setup</button>
      </form>
    </div>

    <?php if ($results): ?>
      <div class="card">
        <p class="eyebrow">Details</p>
        <?php foreach ($results as $file => $rows): ?>
          <p><strong><?= desk_h($file) ?></strong></p>
          <pre><?php
            foreach ($rows as $r) {
              $flag = !empty($r['ok']) ? (empty($r['ignored']) ? 'OK' : 'SKIP') : 'ERR';
              echo $flag . '  ' . ($r['sql'] ?? '') . "\n";
              if (!empty($r['error']) && empty($r['ignored'])) {
                echo '   → ' . $r['error'] . "\n";
              }
            }
          ?></pre>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>
</body>
</html>
