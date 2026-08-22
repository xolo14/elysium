<?php
/**
 * Copy to config.php and fill Neon + admin values.
 */
return [
  'database_url' => 'postgresql://neondb_owner:YOUR_PASSWORD@ep-xxxx.aws.neon.tech/neondb?sslmode=require',

  'neon' => [
    'host' => 'ep-xxxx.aws.neon.tech',
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
