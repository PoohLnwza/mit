// ── Section navigation ──
function showSection(id) {
  document.querySelectorAll('.section').forEach(function (el) {
    el.classList.remove('active');
  });
  var target = document.getElementById(id);
  if (target) target.classList.add('active');

  // Update terminal prompt text
  var prompt = document.querySelector('.terminal-prompt');
  if (prompt) {
    if (id === 'nontech') {
      prompt.innerHTML =
        'root@securesensei:~/nontech$ ls modules/<span class="cursor-blink"></span>';
    } else if (id === 'tech') {
      prompt.innerHTML =
        'root@securesensei:~/tech$ ls modules/<span class="cursor-blink"></span>';
    } else {
      prompt.innerHTML =
        'root@securesensei:~$ select_path<span class="cursor-blink"></span>';
    }
  }
}
