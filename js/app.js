// ═══════════════════════════════════════════
// Section Navigation
// ═══════════════════════════════════════════
function showSection(id) {
  document
    .querySelectorAll('.section')
    .forEach((s) => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  // Update terminal prompt
  const prompt = document.querySelector('.terminal-prompt');
  if (id === 'landing') {
    prompt.innerHTML =
      'root@securesensei:~$ select_path<span class="cursor-blink"></span>';
  } else if (id === 'nontech') {
    prompt.innerHTML =
      'root@securesensei:~/nontech$ ls modules/<span class="cursor-blink"></span>';
  } else if (id === 'tech') {
    prompt.innerHTML =
      'root@securesensei:~/tech$ ls modules/<span class="cursor-blink"></span>';
  }
}

// ═══════════════════════════════════════════
// Binary Rain Generator
// ═══════════════════════════════════════════
(function generateBinaryRain() {
  const container = document.getElementById('binaryRain');
  const columns = Math.floor(window.innerWidth / 28);

  for (let i = 0; i < columns; i++) {
    const col = document.createElement('div');
    col.className = 'binary-col';
    col.style.left = i * 28 + 'px';
    col.style.animationDuration = 8 + Math.random() * 14 + 's';
    col.style.animationDelay = -Math.random() * 12 + 's';

    let text = '';
    const chars = '01';
    const length = 30 + Math.floor(Math.random() * 40);
    for (let j = 0; j < length; j++) {
      text += chars[Math.floor(Math.random() * 2)] + '\n';
    }
    col.textContent = text;
    container.appendChild(col);
  }
})();
