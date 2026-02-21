<?php
require_once __DIR__ . '/../../core/Controller.php';
require_once __DIR__ . '/../models/User.php';

class AuthController extends Controller {

  public function login() {
    if ($_POST) {
      $user = User::find($_POST['username']);
      if ($user && password_verify($_POST['password'], $user['password_hash'])) {
        echo "LOGIN SUCCESS";
        return;
      }
    }
    $this->render('auth/login');
  }

  public function register() {
    if ($_POST) {
      User::create($_POST['username'], $_POST['password']);
      echo "REGISTERED";
      return;
    }
    $this->render('auth/register');
  }
}
