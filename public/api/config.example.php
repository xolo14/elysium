<?php
/**
 * Copy this file to config.php and fill in Neon + admin values.
 *
 *   cp api/config.example.php api/config.php
 *
 * Get DATABASE_URL from: https://console.neon.tech → Connection details
 */
return [
  'database_url' => 'postgresql://neondb_owner:YOUR_PASSWORD@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',

  'neon' => [
    'host' => 'ep-xxxx.ap-southeast-1.aws.neon.tech',
    'port' => '5432',
    'database' => 'neondb',
    'user' => 'neondb_owner',
    'password' => 'YOUR_PASSWORD',
    'sslmode' => 'require',
  ],

  'admin_password' => 'change-me',
  'booking_email' => 'elysium.hyd@gmail.com',
  'mail_from' => 'noreply@yourdomain.com',
];
