// linux.js — Module data + render logic for Linux module page

var LINUX_MODULES = [
  {
    id: 'intro',
    title: 'Introduction to Linux & CLI',
    icon: '',
    sections: [
      {
        type: 'content',
        heading: 'Linux คืออะไร?',
        text: 'Linux เป็นระบบปฏิบัติการแบบ Open Source ที่ได้รับความนิยมอย่างมากในด้าน Cybersecurity เนื่องจากความยืดหยุ่น ความปลอดภัย และเครื่องมือจำนวนมากที่ใช้ในงาน Security\n\nDistributions ยอดนิยมสำหรับงาน Security:\n• Kali Linux — สำหรับ Penetration Testing\n• Parrot OS — สำหรับทั้ง Pentest และ Privacy\n• Ubuntu Server — สำหรับ Server Administration',
      },
      {
        type: 'content',
        heading: 'Command Line Interface (CLI)',
        text: 'CLI คือวิธีหลักในการใช้งาน Linux สำหรับงาน Security คำสั่งพื้นฐานที่ต้องรู้:',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# แสดงไดเรกทอรีปัจจุบัน\npwd\n\n# แสดงรายการไฟล์\nls -la\n\n# เปลี่ยนไดเรกทอรี\ncd /home/user/documents\n\n# สร้างไดเรกทอรี\nmkdir my_folder\n\n# แสดงเนื้อหาไฟล์\ncat /etc/hostname\n\n# ค้นหาข้อความในไฟล์\ngrep "error" /var/log/syslog',
      },
      {
        type: 'quiz',
        question:
          'คำสั่งใดใช้แสดงรายการไฟล์และโฟลเดอร์ทั้งหมด รวมถึงไฟล์ที่ซ่อน?',
        answer: 'ls -la',
        hint: 'ลองนึกถึง flag -a ที่แสดงไฟล์ทั้งหมด (all)',
      },
      {
        type: 'quiz',
        question:
          "ถ้าต้องการค้นหาคำว่า 'failed' ในไฟล์ /var/log/auth.log ต้องใช้คำสั่งอะไร?",
        answer: 'grep "failed" /var/log/auth.log',
        hint: 'ใช้คำสั่ง grep ตามด้วยคำที่ต้องการค้นหาและชื่อไฟล์',
      },
    ],
  },
  {
    id: 'filesystem',
    title: 'File System & Permissions',
    icon: '',
    sections: [
      {
        type: 'content',
        heading: 'โครงสร้าง File System ของ Linux',
        text: 'Linux ใช้โครงสร้างแบบ tree โดยมี / (root) เป็นจุดเริ่มต้น ไดเรกทอรีสำคัญที่ต้องรู้:\n\n• /etc — ไฟล์ config ของระบบ\n• /var/log — log files\n• /home — โฮมไดเรกทอรีของผู้ใช้\n• /tmp — ไฟล์ชั่วคราว\n• /bin, /sbin — โปรแกรมของระบบ',
      },
      {
        type: 'content',
        heading: 'File Permissions',
        text: 'ทุกไฟล์ใน Linux มีสิทธิ์ 3 ระดับ:\n• Owner (เจ้าของ)\n• Group (กลุ่ม)\n• Others (คนอื่น)\n\nแต่ละระดับมีสิทธิ์ 3 แบบ: Read (r=4), Write (w=2), Execute (x=1)',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# ดูสิทธิ์ของไฟล์\nls -la /etc/passwd\n# -rw-r--r-- 1 root root 2847 Jan 15 10:30 /etc/passwd\n\n# เปลี่ยนสิทธิ์ไฟล์\nchmod 755 script.sh    # rwxr-xr-x\nchmod 600 secret.key   # rw-------\n\n# เปลี่ยนเจ้าของไฟล์\nchown user:group file.txt\n\n# ค้นหาไฟล์ที่มี SUID bit (ช่องโหว่ที่พบบ่อย)\nfind / -perm -4000 -type f 2>/dev/null',
      },
      {
        type: 'quiz',
        question:
          'ถ้าต้องการตั้งค่าให้ไฟล์ secret.txt อ่านและเขียนได้เฉพาะเจ้าของเท่านั้น ต้องใช้คำสั่งอะไร?',
        answer: 'chmod 600 secret.txt',
        hint: 'Owner = rw (4+2=6), Group = none (0), Others = none (0)',
      },
      {
        type: 'quiz',
        question: 'ไดเรกทอรีใดเก็บ log files ของระบบ?',
        answer: '/var/log',
        hint: 'อยู่ภายใต้ /var',
      },
    ],
  },
  {
    id: 'users',
    title: 'Users, Groups & Processes',
    icon: '',
    sections: [
      {
        type: 'content',
        heading: 'การจัดการ Users & Groups',
        text: 'ใน Linux การจัดการผู้ใช้เป็นหัวใจสำคัญของ Security:\n\n• แต่ละ user มี UID (User ID) เฉพาะ\n• root (UID 0) มีสิทธิ์สูงสุด\n• ข้อมูลผู้ใช้เก็บใน /etc/passwd\n• รหัสผ่าน (hashed) เก็บใน /etc/shadow',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# สร้าง user ใหม่\nsudo useradd -m -s /bin/bash newuser\nsudo passwd newuser\n\n# เพิ่ม user เข้า group\nsudo usermod -aG sudo newuser\n\n# ดูข้อมูล user ปัจจุบัน\nwhoami\nid\n\n# ดูรายชื่อ user ทั้งหมด\ncat /etc/passwd\n\n# ดู user ที่ login อยู่\nwho\nw',
      },
      {
        type: 'content',
        heading: 'Process Management',
        text: 'การตรวจสอบ process เป็นทักษะสำคัญสำหรับการตรวจจับ malware หรือ unauthorized access:',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# แสดง process ทั้งหมด\nps aux\n\n# แสดง process แบบ real-time\ntop\nhtop\n\n# ค้นหา process ที่น่าสงสัย\nps aux | grep suspicious\n\n# หยุด process\nkill -9 <PID>\n\n# ดู network connections ของ process\nnetstat -tulnp\nss -tulnp',
      },
      {
        type: 'quiz',
        question: 'คำสั่งใดใช้ดูว่า user ปัจจุบันอยู่ใน group ใดบ้าง?',
        answer: 'id',
        hint: 'คำสั่งสั้นๆ 2 ตัวอักษร',
      },
      {
        type: 'quiz',
        question: 'ไฟล์ใดเก็บ password hash ของ user ทั้งหมดในระบบ?',
        answer: '/etc/shadow',
        hint: "อยู่ในไดเรกทอรี /etc และชื่อเกี่ยวกับ 'เงา'",
      },
    ],
  },
  {
    id: 'scripting',
    title: 'Shell Scripting สำหรับ Security',
    icon: '',
    sections: [
      {
        type: 'content',
        heading: 'ทำไมต้องเรียน Shell Scripting?',
        text: 'Shell Scripting ช่วยให้คุณ automate งาน security ที่ทำซ้ำๆ ได้ เช่น:\n\n• ตรวจสอบ log files อัตโนมัติ\n• สแกนหาไฟล์ที่ถูกแก้ไข\n• สร้าง report การ audit\n• Automate incident response',
      },
      {
        type: 'code',
        language: 'bash',
        code: '#!/bin/bash\n# === Security Log Monitor ===\n# สคริปต์ตรวจสอบ failed login attempts\n\nLOG_FILE="/var/log/auth.log"\nTHRESHOLD=5\n\necho "[*] Checking failed login attempts..."\n\n# นับจำนวน failed attempts ต่อ IP\ngrep "Failed password" $LOG_FILE | \\\n  awk \'{print $(NF-3)}\' | \\\n  sort | uniq -c | sort -rn | \\\n  while read count ip; do\n    if [ "$count" -ge "$THRESHOLD" ]; then\n      echo "[!] ALERT: $ip has $count failed attempts!"\n    fi\n  done\n\necho "[*] Check complete."',
      },
      {
        type: 'content',
        heading: 'สร้างสคริปต์ตรวจสอบระบบ',
        text: 'ลองเขียนสคริปต์ง่ายๆ สำหรับตรวจสอบความปลอดภัยของระบบ:',
      },
      {
        type: 'code',
        language: 'bash',
        code: '#!/bin/bash\n# === System Security Audit ===\n\necho "========== SYSTEM INFO =========="\nuname -a\necho ""\n\necho "========== LISTENING PORTS =========="\nss -tulnp\necho ""\n\necho "========== SUID FILES =========="\nfind / -perm -4000 -type f 2>/dev/null\necho ""\n\necho "========== RECENT LOGINS =========="\nlast -n 10\necho ""\n\necho "========== CRON JOBS =========="\nfor user in $(cut -d: -f1 /etc/passwd); do\n  crontab -l -u $user 2>/dev/null\ndone',
      },
      {
        type: 'quiz',
        question:
          'ในบรรทัดแรกของ shell script ต้องเขียนอะไรเพื่อระบุว่าใช้ bash?',
        answer: '#!/bin/bash',
        hint: 'เรียกว่า shebang (#!) ตามด้วย path ของ bash',
      },
      {
        type: 'quiz',
        question: 'คำสั่งใดใช้ค้นหาไฟล์ที่มี SUID bit ตั้งค่าอยู่?',
        answer: 'find / -perm -4000 -type f',
        hint: 'ใช้ find กับ -perm flag โดย SUID = 4000',
      },
    ],
  },
];

// ── Sidebar + Content Render ──
var sidebarList = document.getElementById('sidebarList');
var contentArea = document.getElementById('contentArea');
var contentTitle = document.getElementById('contentTitle');
var currentModIndex = 0;

function buildSidebar() {
  var html = '';
  LINUX_MODULES.forEach(function (mod, i) {
    html +=
      '<li class="' +
      (i === currentModIndex ? 'active' : '') +
      '" onclick="loadModule(' +
      i +
      ')">';
    html += '<span class="mod-emoji">' + mod.icon + '</span>';
    html +=
      '<span><span class="mod-num">' +
      String(i + 1).padStart(2, '0') +
      '.</span> ' +
      mod.title +
      '</span>';
    html += '</li>';
  });
  sidebarList.innerHTML = html;
}

function loadModule(index) {
  currentModIndex = index;
  buildSidebar();
  var mod = LINUX_MODULES[index];
  contentTitle.textContent = mod.icon + ' ' + mod.title;

  // Set global variables for chatbot context
  window.CURRENT_LAB_ID = mod.id;
  window.CURRENT_LAB_TITLE = mod.title;
  var quizzes = [];
  mod.sections.forEach(function (s) {
    if (s.type === 'quiz') quizzes.push(s.question);
  });
  window.CURRENT_LAB_QUIZZES = quizzes;

  var html = '';
  mod.sections.forEach(function (section, si) {
    html += '<div class="lesson-section">';

    if (section.type === 'content') {
      html += '<h2>' + section.heading + '</h2>';
      html += '<div class="lesson-text">' + escapeHtml(section.text) + '</div>';
    } else if (section.type === 'code') {
      html += '<div class="code-block">';
      html += '<div class="code-header">';
      html += '<span class="dot red"></span>';
      html += '<span class="dot yel"></span>';
      html += '<span class="dot grn"></span>';
      html += '<span class="lang">' + section.language + '</span>';
      html += '</div>';
      html += '<div class="code-body">';
      html += '<pre>' + highlightBash(escapeHtml(section.code)) + '</pre>';
      html += '</div>';
      html += '</div>';
    } else if (section.type === 'quiz') {
      html += '<div class="quiz-block">';
      html += '<span class="quiz-label">QUIZ</span>';
      html += '<p class="quiz-question">' + section.question + '</p>';
      html += '<div class="quiz-answer-row">';
      html +=
        '<input class="quiz-input" id="quiz-' +
        index +
        '-' +
        si +
        '" type="text" placeholder="พิมพ์คำตอบที่นี่..." onkeydown="if(event.key===\'Enter\')checkQuiz(' +
        index +
        ',' +
        si +
        ')">';
      html +=
        '<button class="quiz-submit" onclick="checkQuiz(' +
        index +
        ',' +
        si +
        ')">SUBMIT</button>';
      html += '</div>';
      html +=
        '<div class="quiz-feedback" id="fb-' + index + '-' + si + '"></div>';
      html += '</div>';
    }

    html += '</div>';
  });

  contentArea.innerHTML = html;
  window.scrollTo(0, 0);

  // Close sidebar on mobile
  document.querySelector('.module-sidebar').classList.remove('open');
}

// ── Quiz check ──
function checkQuiz(modIndex, sectionIndex) {
  var input = document.getElementById('quiz-' + modIndex + '-' + sectionIndex);
  var fb = document.getElementById('fb-' + modIndex + '-' + sectionIndex);
  var section = LINUX_MODULES[modIndex].sections[sectionIndex];

  if (!input.value.trim()) {
    fb.textContent = '💡 Hint: ' + section.hint;
    fb.className = 'quiz-feedback hint';
    return;
  }

  var userAnswer = input.value.trim().toLowerCase().replace(/\s+/g, ' ');
  var correctAnswer = section.answer.toLowerCase().replace(/\s+/g, ' ');

  if (userAnswer === correctAnswer) {
    fb.textContent = '✅ SUCCESS';
    fb.className = 'quiz-feedback success';
  } else {
    fb.textContent = '❌ Incorrect. Try again!';
    fb.className = 'quiz-feedback error';
    setTimeout(function () {
      fb.textContent = '💡 Hint: ' + section.hint;
      fb.className = 'quiz-feedback hint';
    }, 1500);
  }
}

// ── Helpers ──
function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function highlightBash(code) {
  return code.replace(/(#[^\n]*)/g, '<span class="comment">$1</span>');
}

// ── Mobile sidebar toggle ──
var sidebarToggle = document.querySelector('.sidebar-toggle');
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', function () {
    document.querySelector('.module-sidebar').classList.toggle('open');
  });
}

// ── Init ──
buildSidebar();
loadModule(0);
