<?php
/**
 * Elysium Hotels — Hostinger shared hosting config
 *
 * Edit on the server: public_html/elysium/api/config.php
 *
 * 1) Paste your Neon connection string into database_url
 *    OR fill neon host/user/password below
 * 2) Set admin_password
 * 3) Open /elysium/desk/setup-database.php once to create tables
 */

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'config.php') {
  http_response_code(403);
  exit('Forbidden');
}

return [
  // ---------- Neon PostgreSQL (pick ONE style) ----------

  // Style A — full connection string from Neon console (recommended)
  // Example:
  // postgresql://neondb_owner:xxxxx@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
  'database_url' => '',

  // Style B — separate fields (used only if database_url is empty)
  'neon' => [
    'host' => 'ep-xxxx.ap-southeast-1.aws.neon.tech',
    'port' => '5432',
    'database' => 'neondb',
    'user' => 'neondb_owner',
    'password' => '',
    'sslmode' => 'require',
  ],

  // ---------- Desk admin ----------
  // Login at: https://elysiumhotel.grootdigitals.com/desk/
  // Default password below — change after first login on the server
  'admin_password' => 'change-me',

  // ---------- Booking email ----------
  'booking_email' => 'elysium.hyd@gmail.com',
  'mail_from' => 'noreply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost'),
];
