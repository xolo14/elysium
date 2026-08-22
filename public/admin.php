<?php
// Shared hosting: React /admin needs Node — send users to PHP desk
header('Location: /desk/', true, 302);
exit;
