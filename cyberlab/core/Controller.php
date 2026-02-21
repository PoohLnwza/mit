<?php
class Controller {
  protected function render($viewPath) {
    ob_start();
    require __DIR__ . "/../app/views/$viewPath.php";
    $content = ob_get_clean();
    require __DIR__ . "/../app/views/layout.php";
  }
}
