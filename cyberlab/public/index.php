<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../app/controllers/AuthController.php';

class PageController extends Controller {
  public function home() {
    $this->render('home');
  }

  public function profile() {
    $this->render('profile');
  }
}

$page = $_GET['page'] ?? 'home';

$pageController = new PageController();
$auth = new AuthController();

switch ($page) {
  case 'login':
    $auth->login();
    break;

  case 'register':
    $auth->register();
    break;

  case 'profile':
    $pageController->profile();
    break;

  case 'home':
  default:
    $pageController->home();
    break;
}
