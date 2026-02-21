<!DOCTYPE html>
<html>
<head>
  <title>Cyber Lab</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Press Start 2P', monospace;
      background: radial-gradient(circle at top, #1a1a3a 0%, #0b0b12 60%);
    }
  </style>
</head>

<body class="min-h-screen text-white">

<div class="flex max-w-[1200px] mx-auto my-10 bg-[#121225] border border-[#2e2e5f] shadow-2xl">

  <!-- SIDEBAR -->
  <aside class="w-[220px] bg-[#0f0f1f] border-r border-[#2e2e5f] p-4 text-xs space-y-4">
    <div class="text-[#b983ff] text-sm mb-4">CYBER LAB</div>

    <nav class="space-y-3">
      <a href="?page=home" class="block hover:text-[#ff6fae]">▸ Dashboard</a>
      <a href="?page=labs" class="block hover:text-[#ff6fae]">▸ Labs</a>
      <a href="?page=profile" class="block hover:text-[#ff6fae]">▸ Profile</a>
      <a href="?page=login" class="block hover:text-[#ff6fae]">▸ Login</a>
    </nav>
  </aside>

  <!-- MAIN -->
  <div class="flex-1 flex flex-col">

    <!-- HEADER -->
    <header class="flex justify-between items-center px-6 py-4 border-b border-[#2e2e5f] bg-[#0f0f1f]">
      <div class="text-xs text-[#5ad7ff]">
        LV.01 ▓▓░░░ EXP
      </div>

      <!-- PROFILE -->
      <div class="flex items-center gap-3">
        <span class="text-xs text-gray-300">guest</span>
        <div class="w-8 h-8 rounded-full bg-[#b983ff] flex items-center justify-center text-black">
          G
        </div>
      </div>
    </header>

    <!-- CONTENT -->
    <main class="p-6 flex-1">
      <?= $content ?>
    </main>

    <!-- SYSTEM BAR -->
    <div class="bg-black text-[#9dff6f] text-xs px-6 py-3 border-t border-[#2e2e5f]">
      > SYSTEM ONLINE · OBSERVE · ANALYZE · EXPLOIT
    </div>

  </div>
</div>

</body>
</html>
