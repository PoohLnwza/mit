// network.js — Network Security module data + render logic

var NET_MODULES = [
  {
    id: 'tcpip',
    title: 'TCP/IP Fundamentals',
    icon: '🌐',
    sections: [
      {
        type: 'content',
        heading: 'โมเดล TCP/IP คืออะไร?',
        text: 'TCP/IP (Transmission Control Protocol / Internet Protocol) เป็นชุดกฎ (Protocol Suite) ที่ใช้สื่อสารบนอินเทอร์เน็ต แบ่งเป็น 4 ชั้น:\n\n1. Application Layer — HTTP, HTTPS, DNS, SSH, FTP\n2. Transport Layer — TCP (reliable), UDP (fast)\n3. Internet Layer — IP, ICMP, ARP\n4. Network Access Layer — Ethernet, Wi-Fi, MAC address\n\nทุก packet ที่ส่งผ่านเน็ตต้องผ่านทั้ง 4 ชั้นนี้ เข้าใจ TCP/IP = เข้าใจ networking ทั้งหมด',
      },
      {
        type: 'diagram',
        image:
          '/Users/attachatchannakorn/secure-sensei/assets/images/what-is-a-tcp-3-way-handshake-process.jpg',
        caption: 'TCP 3-Way Handshake: SYN → SYN-ACK → ACK',
      },
      {
        type: 'content',
        heading: 'TCP 3-Way Handshake',
        text: 'ก่อนส่งข้อมูลจริง TCP ต้อง "จับมือ" กัน 3 ขั้นตอน:\n\n1. SYN — Client ส่ง SYN packet ไป Server (ขอเชื่อมต่อ)\n2. SYN-ACK — Server ตอบกลับ SYN-ACK (ยืนยันว่ารับได้)\n3. ACK — Client ส่ง ACK (ยืนยันอีกครั้ง → เริ่มส่งข้อมูล)\n\nSYN Flood Attack: ถ้าผู้โจมตีส่ง SYN จำนวนมากโดยไม่ตอบ ACK จะทำให้ Server ค้าง (DoS Attack)',
      },
      {
        type: 'content',
        heading: 'IP Address & Subnetting',
        text: 'IP Address คือ "ที่อยู่" ของอุปกรณ์ในเครือข่าย:\n\nIPv4: 192.168.1.100 (32 bits, 4 octets)\nIPv6: 2001:0db8:85a3::8a2e:0370:7334 (128 bits)\n\nPrivate IP Ranges (ใช้ในเครือข่ายภายใน):\n• 10.0.0.0/8 — Class A (10.x.x.x)\n• 172.16.0.0/12 — Class B (172.16-31.x.x)\n• 192.168.0.0/16 — Class C (192.168.x.x)\n\nSubnet Mask:\n• /24 = 255.255.255.0 — 254 hosts\n• /16 = 255.255.0.0 — 65,534 hosts\n• /8 = 255.0.0.0 — 16 million+ hosts\n\nCIDR Notation: 192.168.1.0/24 หมายถึงเครือข่าย 192.168.1.x ทั้งหมด',
      },
      {
        type: 'content',
        heading: 'Port Numbers ที่ต้องจำ',
        text: 'Port คือ "ประตู" ของ service บนเครื่อง:\n\n• Port 20/21 — FTP (File Transfer)\n• Port 22 — SSH (Secure Shell)\n• Port 23 — Telnet (ไม่ปลอดภัย!)\n• Port 25 — SMTP (Email)\n• Port 53 — DNS (Domain Name)\n• Port 80 — HTTP (Web)\n• Port 443 — HTTPS (Web Secure)\n• Port 3306 — MySQL\n• Port 3389 — RDP (Remote Desktop)\n• Port 8080 — HTTP Proxy/Alternate\n\nWell-known ports: 0-1023\nRegistered ports: 1024-49151\nDynamic ports: 49152-65535',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# ดู IP address ของเครื่อง\nip addr show\nifconfig\n\n# ดู routing table\nip route\nnetstat -r\n\n# ดู DNS resolution\nnslookup google.com\ndig google.com\n\n# ดู ARP table (MAC ↔ IP mapping)\narp -a\n\n# Ping ทดสอบ connectivity\nping -c 4 8.8.8.8\n\n# Traceroute ดูเส้นทาง packet\ntraceroute google.com',
      },
      {
        type: 'quiz',
        question: 'Port ใดใช้สำหรับ HTTPS?',
        answer: '443',
        hint: 'เป็น port ที่ใช้ HTTP แบบเข้ารหัส (Secure)',
      },
      {
        type: 'quiz',
        question:
          'TCP 3-Way Handshake มีขั้นตอนอะไรบ้าง? (ตอบ 3 คำคั่นด้วย comma)',
        answer: 'SYN, SYN-ACK, ACK',
        hint: 'เริ่มจาก SYN → Server ตอบ → Client ยืนยัน',
      },
      {
        type: 'quiz',
        question: 'IP range 192.168.0.0/16 เป็น IP ประเภทใด?',
        answer: 'Private IP',
        hint: 'ใช้ในเครือข่ายภายในเท่านั้น ไม่สามารถ route บน internet ได้',
      },
    ],
  },
  {
    id: 'packets',
    title: 'Packet Analysis',
    icon: '📦',
    sections: [
      {
        type: 'content',
        heading: 'โครงสร้างของ Network Packet',
        text: 'ทุก packet ที่ส่งผ่าน network ประกอบด้วย header หลายชั้นซ้อนกัน (Encapsulation):\n\nEthernet Frame:\n├── Ethernet Header (14 bytes) — Source MAC, Dest MAC, Type\n├── IP Header (20 bytes) — Source IP, Dest IP, TTL, Protocol\n├── TCP/UDP Header (20/8 bytes) — Source Port, Dest Port, Flags\n└── Payload (Data) — ข้อมูลจริงที่ส่ง\n\nการวิเคราะห์ packet = การ "แกะ" header แต่ละชั้นเพื่อดูว่าข้อมูลมาจากไหน ไปไหน และเป็น protocol อะไร',
      },
      {
        type: 'diagram',
        image:
          '/Users/attachatchannakorn/secure-sensei/assets/images/csg25-02-osi-encapsulation.png',
        caption: 'Network Packet Encapsulation — Ethernet → IP → TCP → Data',
      },
      {
        type: 'packet',
        label: 'ตัวอย่าง TCP SYN Packet (Hex Dump)',
        hex: [
          {
            offset: '0x0000',
            data: 'aa bb cc dd ee ff  11 22 33 44 55 66  08 00',
            layer: 'eth',
            note: 'Ethernet: Dst MAC → Src MAC → Type: IPv4',
          },
          {
            offset: '0x000e',
            data: '45 00 00 3c  00 00 40 00  40 06 00 00',
            layer: 'ip',
            note: 'IP: Ver=4, IHL=5, TTL=64, Proto=TCP(6)',
          },
          {
            offset: '0x001a',
            data: 'c0 a8 01 64  c0 a8 01 01',
            layer: 'ip',
            note: 'IP: Src=192.168.1.100, Dst=192.168.1.1',
          },
          {
            offset: '0x0022',
            data: 'c3 50 00 50  00 00 00 00  00 00 00 00',
            layer: 'tcp',
            note: 'TCP: Src Port=50000, Dst Port=80',
          },
          {
            offset: '0x002e',
            data: '50 02 ff ff  00 00 00 00',
            layer: 'tcp',
            note: 'TCP: Flags=SYN, Window=65535',
          },
        ],
      },
      {
        type: 'content',
        heading: 'TCP Flags ที่ต้องรู้',
        text: 'TCP ใช้ flags เพื่อควบคุมการเชื่อมต่อ:\n\n• SYN (S) — เริ่มการเชื่อมต่อ\n• ACK (A) — ยืนยันการรับข้อมูล\n• FIN (F) — ขอปิดการเชื่อมต่อ\n• RST (R) — รีเซ็ตการเชื่อมต่อ (ปฏิเสธ/ผิดพลาด)\n• PSH (P) — ส่งข้อมูลทันที\n• URG (U) — ข้อมูลเร่งด่วน\n\nFlag Combinations ที่น่าสงสัย:\n• SYN only (ไม่มี ACK) — อาจเป็น SYN scan\n• FIN+PSH+URG — XMAS scan (Nmap)\n• No flags — NULL scan\n• RST จำนวนมาก — Port scan ถูก reject',
      },
      {
        type: 'content',
        heading: 'Protocol ที่พบบ่อยใน Packet Capture',
        text: '• TCP — Connection-oriented, reliable (HTTP, SSH, FTP)\n• UDP — Connectionless, fast (DNS, DHCP, VoIP)\n• ICMP — Ping, Traceroute (ใช้ตรวจสอบเครือข่าย)\n• ARP — MAC ↔ IP resolution\n• DNS — Domain → IP translation\n• HTTP/HTTPS — Web traffic\n• TLS — Encrypted communication\n\nDNS Tunneling: ผู้โจมตีอาจซ่อน data ใน DNS queries เพื่อ bypass firewall\nARP Spoofing: ปลอม ARP reply เพื่อดักจับ traffic (Man-in-the-Middle)',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# ดู network interfaces\nifconfig\nip addr show\n\n# ดู connection ทั้งหมด\nnetstat -tulnp\nss -tulnp\n\n# ดู ARP table\narp -a\n\n# DNS lookup\nnslookup example.com\ndig example.com A',
      },
      {
        type: 'quiz',
        question: 'TCP flag ใดใช้เริ่มการเชื่อมต่อ?',
        answer: 'SYN',
        hint: 'เป็น flag แรกของ 3-way handshake',
      },
      {
        type: 'quiz',
        question: 'XMAS scan ใช้ TCP flags อะไรรวมกัน?',
        answer: 'FIN+PSH+URG',
        hint: 'เหมือนไฟคริสต์มาส ที่ "เปิดทุกอย่าง"',
      },
    ],
  },
  {
    id: 'traffic',
    title: 'Network Traffic Monitoring',
    icon: '📡',
    sections: [
      {
        type: 'content',
        heading: 'ทำไมต้องตรวจสอบ Network Traffic?',
        text: 'Network Traffic Analysis (NTA) เป็นหัวใจของ Blue Team:\n\n• ตรวจจับ malware communication (C2 callback)\n• ระบุ data exfiltration (ข้อมูลรั่วไหล)\n• วิเคราะห์ incident response\n• ตรวจสอบ policy compliance\n\nเครื่องมือหลัก:\n• tcpdump — CLI packet capture\n• tshark — Wireshark CLI version\n• Wireshark — GUI packet analyzer\n• Zeek (Bro) — Network security monitor',
      },
      {
        type: 'content',
        heading: 'tcpdump — Command Line Packet Capture',
        text: 'tcpdump เป็นเครื่องมือ capture packet ที่ใช้บ่อยที่สุดใน Linux:\n\nSyntax: tcpdump [options] [filters]\n\nCommon Options:\n• -i eth0 — เลือก interface\n• -n — ไม่แปลง IP เป็นชื่อ\n• -X — แสดง hex + ASCII\n• -c 10 — จับแค่ 10 packets\n• -w file.pcap — บันทึกเป็นไฟล์\n• -r file.pcap — อ่านจากไฟล์',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# Capture traffic บน eth0\nsudo tcpdump -i eth0\n\n# Capture  เฉพาะ port 80 (HTTP)\nsudo tcpdump -i eth0 port 80\n\n# Capture เฉพาะ IP ที่กำหนด\nsudo tcpdump -i eth0 host 192.168.1.100\n\n# TCP SYN packets only (detect port scan)\nsudo tcpdump -i eth0 "tcp[tcpflags] & tcp-syn != 0"\n\n# บันทึกเป็นไฟล์ pcap\nsudo tcpdump -i eth0 -w capture.pcap -c 1000\n\n# อ่านจากไฟล์ pcap แสดง hex dump\nsudo tcpdump -r capture.pcap -X -n',
      },
      {
        type: 'content',
        heading: 'tshark — Wireshark CLI',
        text: 'tshark มี filter ที่ทรงพลังกว่า tcpdump:\n\nCapture Filters: ใช้ตอน capture (BPF syntax)\nDisplay Filters: ใช้ตอนวิเคราะห์ (Wireshark syntax)\n\nDisplay Filter ที่ใช้บ่อย:\n• http — เฉพาะ HTTP traffic\n• dns — เฉพาะ DNS queries\n• tcp.flags.syn==1 — เฉพาะ SYN packets\n• ip.src==192.168.1.100 — จาก IP ที่กำหนด\n• tcp.port==443 — เฉพาะ HTTPS\n• http.request.method=="POST" — เฉพาะ HTTP POST',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# Capture ด้วย tshark\ntshark -i eth0\n\n# Capture เฉพาะ HTTP traffic\ntshark -i eth0 -Y "http"\n\n# อ่าน pcap file แสดงเฉพาะ DNS\ntshark -r capture.pcap -Y "dns"\n\n# แสดง HTTP requests\ntshark -r capture.pcap -Y "http.request" -T fields -e http.host -e http.request.uri\n\n# หา SYN scan patterns\ntshark -r capture.pcap -Y "tcp.flags.syn==1 && tcp.flags.ack==0"\n\n# Export เป็น CSV\ntshark -r capture.pcap -T fields -e frame.time -e ip.src -e ip.dst -e tcp.dstport -E separator=,',
      },
      {
        type: 'quiz',
        question: 'คำสั่ง tcpdump ใดใช้จับเฉพาะ traffic port 443?',
        answer: 'tcpdump -i eth0 port 443',
        hint: 'ใช้ filter "port" ตามด้วยหมายเลข port',
      },
      {
        type: 'quiz',
        question: 'tshark display filter ใดใช้แสดงเฉพาะ HTTP traffic?',
        answer: 'http',
        hint: 'ง่ายมาก! ใช้ชื่อ protocol ตรงๆ',
      },
      {
        type: 'quiz',
        question:
          'ถ้าต้องการบันทึก packet capture เป็นไฟล์ ต้องใช้ option ใดกับ tcpdump?',
        answer: '-w',
        hint: 'w = write',
      },
    ],
  },
  {
    id: 'firewall',
    title: 'Firewall & IDS/IPS',
    icon: '🔥',
    sections: [
      {
        type: 'content',
        heading: 'Firewall คืออะไร?',
        text: 'Firewall คือ "กำแพง" ที่กรอง traffic เข้า-ออกเครือข่าย:\n\nประเภท:\n• Packet Filter — กรองตาม IP/Port/Protocol\n• Stateful Firewall — จำ connection state\n• Application Firewall — ตรวจ Layer 7 (WAF)\n• Next-Gen Firewall (NGFW) — DPI + IPS + Threat Intelligence\n\n"Default Deny" Policy:\n— Block ทุกอย่างก่อน แล้วค่อย Allow เฉพาะที่จำเป็น\n— ปลอดภัยกว่า "Default Allow" แต่ต้อง configure ดี',
      },
      {
        type: 'content',
        heading: 'UFW — Uncomplicated Firewall',
        text: 'UFW เป็น frontend ของ iptables ที่ใช้ง่ายกว่า:\n\nเหมาะสำหรับ Ubuntu/Debian servers',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# เปิด/ปิด UFW\nsudo ufw enable\nsudo ufw disable\nsudo ufw status verbose\n\n# Allow SSH (สำคัญ! อย่าลืมก่อน enable)\nsudo ufw allow 22/tcp\n\n# Allow HTTP + HTTPS\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\n\n# Block IP ที่น่าสงสัย\nsudo ufw deny from 10.0.0.99\n\n# Allow เฉพาะ subnet\nsudo ufw allow from 192.168.1.0/24 to any port 22\n\n# ดู rules ทั้งหมด\nsudo ufw status numbered\n\n# ลบ rule\nsudo ufw delete 3',
      },
      {
        type: 'content',
        heading: 'iptables — Linux Packet Filter',
        text: 'iptables เป็น firewall ระดับ kernel ของ Linux:\n\nChains:\n• INPUT — traffic เข้ามาหาเครื่อง\n• OUTPUT — traffic ออกจากเครื่อง\n• FORWARD — traffic ผ่านเครื่อง (router)\n\nTargets:\n• ACCEPT — อนุญาต\n• DROP — ทิ้งเงียบ\n• REJECT — ปฏิเสธ + ส่ง error กลับ\n• LOG — บันทึก log',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# ดู rules ทั้งหมด\nsudo iptables -L -n -v\n\n# Block IP ที่โจมตี\nsudo iptables -A INPUT -s 10.0.0.99 -j DROP\n\n# Allow SSH\nsudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT\n\n# Allow established connections\nsudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT\n\n# Default deny\nsudo iptables -P INPUT DROP\nsudo iptables -P FORWARD DROP\n\n# Log dropped packets\nsudo iptables -A INPUT -j LOG --log-prefix "[DROPPED] "',
      },
      {
        type: 'content',
        heading: 'IDS/IPS — Intrusion Detection/Prevention',
        text: 'IDS vs IPS:\n\n• IDS (Intrusion Detection System) — ตรวจจับภัยคุกคาม แจ้งเตือน แต่ไม่ block\n• IPS (Intrusion Prevention System) — ตรวจจับ + block อัตโนมัติ\n\nเครื่องมือยอดนิยม:\n• Snort — Open-source IDS/IPS (rule-based)\n• Suricata — Multi-threaded IDS/IPS\n• OSSEC — Host-based IDS (HIDS)\n• Fail2ban — Auto-ban brute force IPs\n\nSnort Rule ตัวอย่าง:\nalert tcp any any -> $HOME_NET 22 (msg:"SSH Brute Force Attempt"; flow:to_server; threshold: type both, track by_src, count 5, seconds 60; sid:100001;)\n\nอ่าน: ถ้ามี TCP connection มาที่ port 22 มากกว่า 5 ครั้งใน 60 วินาที จาก IP เดียวกัน → แจ้งเตือน',
      },
      {
        type: 'quiz',
        question: 'คำสั่ง UFW ใดใช้อนุญาต SSH?',
        answer: 'ufw allow 22/tcp',
        hint: 'allow + port 22 + protocol tcp',
      },
      {
        type: 'quiz',
        question: 'IDS กับ IPS ต่างกันอย่างไร?',
        answer: 'IDS ตรวจจับและแจ้งเตือน IPS ตรวจจับและ block',
        hint: 'D=Detection (แจ้งเตือน), P=Prevention (ป้องกัน)',
      },
      {
        type: 'quiz',
        question: 'iptables chain ใดใช้กรอง traffic ที่เข้ามาหาเครื่อง?',
        answer: 'INPUT',
        hint: 'traffic "เข้า" = IN...',
      },
    ],
  },
];

// ── Sidebar + Content Render (same pattern as linux.js) ──
var sidebarList = document.getElementById('sidebarList');
var contentArea = document.getElementById('contentArea');
var contentTitle = document.getElementById('contentTitle');
var currentModIndex = 0;

function buildSidebar() {
  var html = '';
  NET_MODULES.forEach(function (mod, i) {
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
  var mod = NET_MODULES[index];
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
      html +=
        '<span class="dot red"></span><span class="dot yel"></span><span class="dot grn"></span>';
      html += '<span class="lang">' + section.language + '</span>';
      html += '</div>';
      html += '<div class="code-body">';
      html += '<pre>' + highlightBash(escapeHtml(section.code)) + '</pre>';
      html += '</div></div>';
    } else if (section.type === 'diagram') {
      html += '<div class="diagram-container">';
      html +=
        '<img src="' + section.image + '" alt="' + section.caption + '" />';
      html += '<p class="diagram-caption">' + section.caption + '</p>';
      html += '</div>';
    } else if (section.type === 'packet') {
      html += '<div class="packet-dump">';
      html += '<div class="packet-dump-header">';
      html +=
        '<span class="dot red"></span><span class="dot yel"></span><span class="dot grn"></span>';
      html += '<span class="label">' + section.label + '</span>';
      html += '</div>';
      html += '<div class="packet-dump-body"><pre>';
      section.hex.forEach(function (line) {
        html +=
          '<span class="pkt-offset">' +
          line.offset +
          '</span>  ' +
          '<span class="pkt-' +
          line.layer +
          '">' +
          line.data +
          '</span>' +
          '  <span class="pkt-label">' +
          line.note +
          '</span>\n';
      });
      html += '</pre></div></div>';
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
  document.querySelector('.module-sidebar').classList.remove('open');
}

// ── Quiz check ──
function checkQuiz(modIndex, sectionIndex) {
  var input = document.getElementById('quiz-' + modIndex + '-' + sectionIndex);
  var fb = document.getElementById('fb-' + modIndex + '-' + sectionIndex);
  var section = NET_MODULES[modIndex].sections[sectionIndex];

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

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function highlightBash(code) {
  return code.replace(/(#[^\n]*)/g, '<span class="comment">$1</span>');
}

var sidebarToggle = document.querySelector('.sidebar-toggle');
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', function () {
    document.querySelector('.module-sidebar').classList.toggle('open');
  });
}

buildSidebar();
loadModule(0);
