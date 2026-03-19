(function () {
  if (!window.quizAttempts) window.quizAttempts = {};
})();

var SOCIAL_MODULES = [
  {
    id: 'social',
    title: 'Social Engineering',
    icon: '👥',
    sections: [
      {
        type: 'content',
        heading: 'Social Engineering คืออะไร?',
        text: 'Social Engineering (วิศวกรรมสังคม) คือเทคนิคหลอกลวงทางจิตวิทยา ที่ผู้โจมตีใช้จิตวิทยาเพื่อหลอกให้เหยื่อเปิดเผยข้อมูลส่วนตัวหรือให้สิทธิ์เข้าถึงระบบ โดยไม่ใช้การแฮกทางเทคนิค',
      },
      {
        type: 'content',
        heading: 'เป้าหมายของ Social Engineering',
        text: 'ผู้โจมตีมักจะเล่นกับความรู้สึกของมนุษย์ เช่น:\n\n1. ความกลัว (Fear) - ขู่ว่าบัญชีจะถูกปิด\n2. ความโลภ (Greed) - หลอกว่าได้รับรางวัล\n3. ความอยากรู้อยากเห็น (Curiosity) - ส่งอีเมลหัวข้อลับเฉพาะ\n4. ความเห็นใจ (Sympathy) - อ้างว่าเป็นเพื่อนที่กำลังเดือดร้อน',
      },
      {
        type: 'quiz',
        question:
          "ความรู้สึกใด ที่ผู้โจมตีมักใช้หลอกลวง เช่น 'คลิกเพื่อรับเงินรางวัลทันที' ?",
        answer: 'ความโลภ',
        hint: 'ลองคิดถึงเรื่องเงิน หรือรางวัลดูสิ',
      },
    ],
  },
  {
    id: 'social-techniques',
    title: 'เทคนิคที่พบบ่อย',
    icon: '[X]',
    sections: [
      {
        type: 'content',
        heading: 'เทคนิคการโจมตี (Common Techniques)',
        text: '1. Baiting (เหยื่อล่อ): การทิ้งสื่อเก็บข้อมูล (เช่น Flash Drive, CD) ที่มีมัลแวร์ซ่อนไว้ ในที่สาธารณะ หวังให้คนเก็บไปเสียบเครื่องคอมพิวเตอร์ด้วยความอยากรู้อยากเห็น\n2. Pretexting (สร้างสคริปต์): การสร้างเรื่องราวหลอกลวง เช่น อ้างตัวว่าเป็นฝ่ายไอทีโทรมาขอรหัสผ่านเพื่อซ่อมระบบ\n3. Tailgating / Piggybacking: การเดินตามพนักงานเข้าประตูที่มีระบบรักษาความปลอดภัย โดยไม่ได้ใช้คีย์การ์ดของตนเอง\n4. Quid Pro Quo (ยื่นหมูยื่นแมว): การเสนอผลประโยชน์บางอย่างแลกกับข้อมูล เช่น อ้างว่ามีของขวัญให้ แต่ต้องขอรหัสผ่านเพื่อยืนยัน',
      },
      {
        type: 'quiz',
        question:
          'การแกล้งทำ Flash Drive หล่นไว้หน้าบริษัทเพื่อให้พนักงานเก็บไปใช้ เรียกว่าเทคนิคใด?',
        answer: 'baiting',
        hint: "เหมือนกับการใช้ 'เหยื่อล่อ' ตกปลา",
      },
      {
        type: 'quiz',
        question:
          'การเดินตามคนอื่นเข้าประตูล็อกโดยไม่ใช้บัตรของตัวเอง เรียกว่าอะไร?',
        answer: 'tailgating',
        hint: 'ภาษาอังกฤษแปลว่า การขับรถจี้ท้าย หรือเดินตามหลังติดๆ',
      },
    ],
  },
  {
    id: 'social-defense',
    title: 'การป้องกันรับมือ',
    icon: '🛡️',
    sections: [
      {
        type: 'content',
        heading: 'วิธีป้องกันตนเองและองค์กร',
        text: '1. ความตระหนักรู้ (Security Awareness): การฝึกอบรมพนักงานให้รู้จักสังเกตและสงสัย\n2. การยืนยันตัวตน (MFA): แม้รหัสผ่านจะหลุดไป แต่ผู้โจมตีก็จะเข้าสู่ระบบไม่ได้หากไม่มีรหัส MFA (เช่น OTP จากมือถือ)\n3. นโยบายความปลอดภัย (Clean Desk Policy): ไม่จดรหัสผ่านแปะไว้หน้าจอ หรือล็อกหน้าจอคอมพิวเตอร์ทุกครั้งที่ลุกจากโต๊ะ\n4. การตรวจสอบตัวตน (Verification): หากมีคนโทรมาขอข้อมูลสำคัญ ให้วางสายและติดต่อกลับไปที่เบอร์หลักขององค์กรนั้นๆ ด้วยตนเอง',
      },
      {
        type: 'quiz',
        question:
          'เทคโนโลยีใดที่ช่วยป้องกันบัญชีผู้ใช้ได้ แม้รหัสผ่านจะถูกหลอกให้บอกไปแล้ว?',
        answer: 'mfa',
        hint: 'การยืนยันตัวตนแบบหลายปัจจัย (คำย่อ 3 ตัวอักษร)',
      },
    ],
  },
];

var sidebarList = document.getElementById('sidebarList');
var contentArea = document.getElementById('contentArea');
var contentTitle = document.getElementById('contentTitle');
var currentModIndex = 0;

function buildSidebar() {
  var html = '';
  SOCIAL_MODULES.forEach(function (mod, i) {
    // Exact completion check
    let totalQ = 0;
    let compQ = 0;
    mod.sections.forEach((s, idx) => {
      if (s.answer || s.flag) {
        totalQ++;
        const sectionId = mod.id + '-' + idx;
        if (
          window.currentModuleCompletedIds &&
          window.currentModuleCompletedIds.includes(sectionId)
        ) {
          compQ++;
        }
      }
    });
    const isCompleted = totalQ > 0 && compQ === totalQ;

    html +=
      '<li class="' +
      (i === currentModIndex ? 'active' : '') +
      (isCompleted ? ' completed' : '') +
      '" onclick="loadModule(' +
      i +
      ')">';
    html += '<span class="mod-emoji">' + (mod.icon || '👥') + '</span>';
    html +=
      '<span><span class="mod-num">' +
      String(i + 1).padStart(2, '0') +
      '.</span> ' +
      mod.title +
      '</span>';

    if (isCompleted) {
      html += '<span class="mod-ok">[OK]</span>';
    }
    html += '</li>';
  });
  sidebarList.innerHTML = html;
}

function loadModule(index) {
  currentModIndex = index;
  buildSidebar();
  var mod = SOCIAL_MODULES[index];
  contentTitle.textContent = mod.icon + ' ' + mod.title;
  window.CURRENT_LAB_ID = mod.id;
  window.CURRENT_LAB_TITLE = mod.title;
  var quizzes = [];
  mod.sections.forEach(function (s) {
    if (s.type === 'quiz') quizzes.push(s.question);
  });
  window.CURRENT_LAB_QUIZZES = quizzes;

  let pageTextForBot = 'Module: ' + mod.title + '\\n';

  var html = '';
  mod.sections.forEach(function (section, si) {
    html += '<div class="lesson-section">';

    if (section.type === 'content') {
      html += '<h2>' + section.heading + '</h2>';
      html += '<div class="lesson-text">' + escapeHtml(section.text) + '</div>';
      pageTextForBot +=
        '[เนื้อหา] ' + section.heading + '\\n' + section.text + '\\n';
    } else if (section.type === 'email_mockup') {
      html +=
        '<style>' +
        '.email-mockup { background: #fff; color: #333; border-radius: 8px; overflow: hidden; margin: 20px 0; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }' +
        '.email-header { background: #f1f3f4; padding: 15px 20px; border-bottom: 1px solid #e0e0e0; }' +
        '.email-subject { font-size: 18px; font-weight: 600; margin-bottom: 10px; color: #202124; }' +
        '.email-meta { display: flex; justify-content: space-between; font-size: 13px; color: #5f6368; }' +
        '.email-sender { display: flex; align-items: center; }' +
        '.sender-avatar { width: 36px; height: 36px; background: #1a73e8; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-right: 12px; }' +
        '.sender-name { font-weight: bold; color: #202124; }' +
        '.sender-email { color: #5f6368; margin-left: 5px; }' +
        '.email-body { padding: 24px; font-size: 14px; line-height: 1.6; }' +
        '.mockup-btn { display: inline-block; background: #0070c9; color: white !important; padding: 10px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; cursor: pointer; position: relative; }' +
        '.mockup-btn:hover { background: #005bb5; }' +
        '.mockup-btn:hover::after { content: attr(title); position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); background: #ffebee; color: #c62828; padding: 4px 8px; font-size: 11px; white-space: nowrap; border: 1px solid #ffcdd2; border-radius: 4px; z-index: 10; }' +
        '</style>';

      html += '<div class="email-mockup">';
      html += '<div class="email-header">';
      html += '<div class="email-subject">' + section.subject + '</div>';
      html += '<div class="email-meta">';
      html += '<div class="email-sender">';
      html +=
        '<div class="sender-avatar">' + section.senderName.charAt(0) + '</div>';
      html += '<div>';
      html += '<span class="sender-name">' + section.senderName + '</span>';
      html +=
        '<span class="sender-email">&lt;' + section.senderEmail + '&gt;</span>';
      html += '<div style="font-size: 11px; margin-top: 2px;">to me</div>';
      html += '</div></div>';
      html += '<div>' + section.date + '</div>';
      html += '</div></div>';
      html += '<div class="email-body">' + section.body + '</div>';
      html += '</div>';

      pageTextForBot +=
        '[หน้าจอจำลองอีเมล] ผู้ส่ง: ' +
        section.senderName +
        ' <' +
        section.senderEmail +
        '>, หัวข้อ: ' +
        section.subject +
        '\\n';
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

      pageTextForBot +=
        '[คำถาม Quiz ให้ผู้เรียนตอบ] ' +
        section.question +
        '\\n[เฉลยที่ถูกต้องของ Quiz นี้] ' +
        section.answer +
        '\\n';
    }

    html += '</div>';
  });

  contentArea.innerHTML = html;

  if (window.Chatbot) {
    window.Chatbot.setCurrentLab(mod.id);
    window.Chatbot.setPageContext(pageTextForBot);
  }

  // Auto-fill completed sections
  if (window.currentModuleCompletedIds) {
    const completedIds = window.currentModuleCompletedIds;
    mod.sections.forEach((s, idx) => {
      const sectionId = mod.id + '-' + idx;
      if (completedIds.includes(sectionId)) {
        var input = document.getElementById(
          'quiz-' + currentModIndex + '-' + idx,
        );
        if (input) {
          input.value = s.answer || s.flag || '';
          input.disabled = true;
          input.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          input.style.color = '#fff';
          var btn = input.nextElementSibling;
          if (btn && btn.tagName === 'BUTTON') {
            btn.textContent = 'SUBMITTED';
            btn.style.backgroundColor = '#00e676';
            btn.style.color = '#000';
            btn.disabled = true;
            btn.style.cursor = 'default';
          }
          var fb = document.getElementById('fb-' + currentModIndex + '-' + idx);
          if (fb) {
            fb.textContent = '[OK] ALREADY COMPLETED';
            fb.className = 'quiz-feedback success';
          }
        }
      }
    });
  }

  window.scrollTo(0, 0);

  var sidebar = document.querySelector('.module-sidebar');
  if (sidebar) {
    sidebar.classList.remove('open');
  }
}

function checkQuiz(modIndex, sectionIndex) {
  var input = document.getElementById('quiz-' + modIndex + '-' + sectionIndex);
  var fb = document.getElementById('fb-' + modIndex + '-' + sectionIndex);
  var section = SOCIAL_MODULES[modIndex].sections[sectionIndex];

  if (!input.value.trim()) {
    var qId = modIndex + '-' + sectionIndex;
    window.quizAttempts[qId] = window.quizAttempts[qId] || 0;
    fb.textContent = '[i] Hint: ' + section.hint;
    fb.className = 'quiz-feedback hint';
    return;
  }

  var userAnswer = input.value.trim().toLowerCase().replace(/\s+/g, ' ');
  var correctAnswer = section.answer.toLowerCase().replace(/\s+/g, ' ');

  if (userAnswer === correctAnswer) {
    fb.textContent = 'SUCCESS';
    fb.className = 'quiz-feedback success';
    input.disabled = true;
    input.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    input.style.color = '#fff';

    var btn = input.nextElementSibling;
    if (btn && btn.tagName === 'BUTTON') {
      btn.textContent = 'SUBMITTED';
      btn.style.backgroundColor = '#00e676';
      btn.style.color = '#000';
      btn.disabled = true;
      btn.style.cursor = 'default';
    }

    // Save granular progress
    const sectionId = SOCIAL_MODULES[modIndex].id + '-' + sectionIndex;
    if (!window.currentModuleCompletedIds)
      window.currentModuleCompletedIds = [];
    if (!window.currentModuleCompletedIds.includes(sectionId)) {
      window.currentModuleCompletedIds.push(sectionId);
    }

    // Calculate overall mission progress across all SOCIAL_MODULES to fix ghost progress
    let totalAllQ = 0;
    let compAllQ = 0;
    SOCIAL_MODULES.forEach((m) => {
      m.sections.forEach((s, idx) => {
        if (s.answer || s.flag) {
          totalAllQ++;
          if (window.currentModuleCompletedIds.includes(m.id + '-' + idx))
            compAllQ++;
        }
      });
    });
    let overallPercent =
      totalAllQ > 0 ? Math.round((compAllQ / totalAllQ) * 100) : 0;

    if (window.Auth && typeof window.Auth.saveProgress === 'function') {
      window.Auth.saveProgress(
        'social',
        overallPercent,
        window.currentModuleCompletedIds,
      );
    }

    var isLastQuiz = true;
    for (
      var i = sectionIndex + 1;
      i < SOCIAL_MODULES[modIndex].sections.length;
      i++
    ) {
      if (
        SOCIAL_MODULES[modIndex].sections[i].answer ||
        SOCIAL_MODULES[modIndex].sections[i].flag ||
        SOCIAL_MODULES[modIndex].sections[i].type === 'inbox_simulator'
      ) {
        isLastQuiz = false;
        break;
      }
    }
    if (isLastQuiz) showModuleCompletePopup(modIndex, SOCIAL_MODULES.length);
  } else {
    fb.textContent = 'ผิด ลองใหม่อีกครั้ง!';
    fb.className = 'quiz-feedback error';
    setTimeout(function () {
      fb.textContent =
        '[i] Hint: ' + (section.hint || 'โปรดอ้างอิงเนื้อหาด้านบน');
      fb.className = 'quiz-feedback hint';
    }, 1500);
  }
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setupTerminal() {
  const btn = document.getElementById('terminalPageBtn');
  if (btn && window.SimTerminal) {
    btn.onclick = () => {
      window.SimTerminal.toggle();
    };
  }
}

var sidebarToggle = document.querySelector('.sidebar-toggle');
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', function () {
    document.querySelector('.module-sidebar').classList.toggle('open');
  });
}

async function initModule() {
  let startIndex = 0;
  window.currentModuleCompletedIds = [];
  if (window.Auth && typeof window.Auth.getProgressData === 'function') {
    let progData = await window.Auth.getProgressData('social');
    window.currentModProgressData = progData;
    window.currentModuleCompletedIds = progData.completed_ids || [];
    // Calculate overall progress to fix ghost progress
    let totalAllQ = 0;
    let compAllQ = 0;
    let doneMods = 0;
    SOCIAL_MODULES.forEach((m) => {
      let mTotal = 0;
      let mDone = 0;
      m.sections.forEach((s, idx) => {
        if (s.answer || s.flag) {
          totalAllQ++;
          mTotal++;
          if (window.currentModuleCompletedIds.includes(m.id + '-' + idx)) {
            compAllQ++;
            mDone++;
          }
        }
      });
      if (mTotal > 0 && mDone === mTotal) doneMods++;
    });

    let overallPercent =
      totalAllQ > 0 ? Math.round((compAllQ / totalAllQ) * 100) : 0;

    if (window.Auth && typeof window.Auth.saveProgress === 'function') {
      await window.Auth.saveProgress(
        'social',
        overallPercent,
        window.currentModuleCompletedIds,
      );
    }
    startIndex = Math.min(doneMods, SOCIAL_MODULES.length - 1);
  }
  loadModule(startIndex);
  if (typeof setupTerminal === 'function') setupTerminal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModule);
} else {
  initModule();
}

function showModuleCompletePopup(currentModIndex, totalModules) {
  let popup = document.getElementById('congrats-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'congrats-popup';
    popup.style.cssText =
      'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; opacity:0; transition:opacity 0.3s ease; pointer-events:none; font-family:"Chakra Petch", sans-serif;';
  }

  let nextBtnHtml = '';
  if (currentModIndex < totalModules - 1) {
    nextBtnHtml = `<button onclick="document.getElementById('congrats-popup').remove(); loadModule(${currentModIndex + 1});" style="background:#00e676; color:#000; border:none; padding:12px 20px; border-radius:6px; font-family:'Chakra Petch', sans-serif; font-size:16px; font-weight:700; cursor:pointer; flex:1; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">NEXT MODULE</button>`;
  }

  popup.innerHTML = `
    <div style="background:#111; border:2px solid #00e676; border-radius:12px; padding:40px; text-align:center; max-width:450px; transform:scale(0.8); transition:transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow:0 0 40px rgba(0,230,118,0.2)">
      <div style="font-size:64px; margin-bottom:20px; animation: bounce 2s infinite;">[SUCCESS]</div>
      <h2 style="color:#00e676; font-size:28px; margin-bottom:10px; font-weight:700; letter-spacing:2px;">MISSION CLEAR!</h2>
      <p style="color:#ddd; font-size:15px; margin-bottom:30px; line-height:1.6;">ยอดเยี่ยมมาก! คุณผ่านบทเรียนนี้สำเร็จแล้ว! !!</p>
      <div style="display:flex; gap:10px; justify-content:center;">
        <button onclick="window.location.href='../index.html'" style="background:#333; color:#fff; border:1px solid #555; padding:12px 20px; border-radius:6px; font-family:'Chakra Petch', sans-serif; font-size:16px; font-weight:700; cursor:pointer; flex:1; transition:background 0.2s;" onmouseover="this.style.background='#444'" onmouseout="this.style.background='#333'">HOME</button>
        ${nextBtnHtml}
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  if (!document.getElementById('popup-animations')) {
    let style = document.createElement('style');
    style.id = 'popup-animations';
    style.innerHTML =
      '@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }';
    document.head.appendChild(style);
  }

  if (currentModIndex + 1 > (window.completedMods || 0)) {
    window.completedMods = currentModIndex + 1;
    buildSidebar();
  }

  void popup.offsetWidth; // force reflow
  popup.style.opacity = '1';
  popup.style.pointerEvents = 'auto';
  popup.children[0].style.transform = 'scale(1)';
}
