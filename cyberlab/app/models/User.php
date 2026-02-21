<?php
require_once __DIR__ . '/../../core/Database.php';

class User {
  public static function find($username) {
    $db = Database::connect();
    $stmt = $db->prepare("SELECT * FROM users WHERE username=?");
    $stmt->execute([$username]);
    return $stmt->fetch();
  }

  public static function create($u, $p) {
    $hash = password_hash($p, PASSWORD_DEFAULT);
    $db = Database::connect();
    $stmt = $db->prepare(
      "INSERT INTO users (username, password_hash) VALUES (?,?)"
    );
    return $stmt->execute([$u, $hash]);
  }
}
