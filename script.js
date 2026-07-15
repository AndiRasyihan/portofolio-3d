/* ═══════════════════════════════════════════
   PORTOFOLIO FUTURISTIK — RASYIHAN.dev
   Mesin interaksi & scene 3D (Three.js)
   ═══════════════════════════════════════════ */

"use strict";

const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* ══════════ PRELOADER ══════════ */

(function preloader() {
  const countEl = document.getElementById("preloaderCount");
  const fillEl = document.getElementById("preloaderFill");
  let progress = 0;

  const tick = setInterval(() => {
    progress = Math.min(100, progress + Math.random() * 14 + 4);
    countEl.textContent = Math.floor(progress) + "%";
    fillEl.style.width = progress + "%";
    if (progress >= 100) {
      clearInterval(tick);
      setTimeout(() => document.body.classList.add("loaded"), 350);
    }
  }, 90);
})();

/* ══════════ SCENE 3D — THREE.JS ══════════ */

(function scene3D() {
  if (typeof THREE === "undefined") return;

  const canvas = document.getElementById("bg-canvas");
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x04060f, 0.0016);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 70;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* ── Partikel bintang ── */
  const PARTICLE_COUNT = window.innerWidth < 768 ? 800 : 1800;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const palette = [
    new THREE.Color(0x00f0ff),
    new THREE.Color(0x7b2ff7),
    new THREE.Color(0xff2ec4),
    new THREE.Color(0xffffff),
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 420;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 420;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 420;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particles = new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  scene.add(particles);

  /* ── Geometri wireframe melayang ── */
  const shapes = new THREE.Group();

  const icosa = new THREE.Mesh(
    new THREE.IcosahedronGeometry(15, 1),
    new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    }),
  );
  icosa.position.set(34, 8, -26);
  shapes.add(icosa);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(8, 2.2, 96, 14),
    new THREE.MeshBasicMaterial({
      color: 0x7b2ff7,
      wireframe: true,
      transparent: true,
      opacity: 0.13,
    }),
  );
  knot.position.set(-36, -14, -32);
  shapes.add(knot);

  const octa = new THREE.Mesh(
    new THREE.OctahedronGeometry(6, 0),
    new THREE.MeshBasicMaterial({
      color: 0xff2ec4,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    }),
  );
  octa.position.set(-16, 22, -44);
  shapes.add(octa);

  scene.add(shapes);

  /* ── Interaksi mouse & scroll ── */
  let mouseX = 0,
    mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const scrollY = window.scrollY || 0;

    if (!reducedMotion) {
      particles.rotation.y = t * 0.018 + scrollY * 0.00022;
      particles.rotation.x = Math.sin(t * 0.08) * 0.06 + scrollY * 0.0001;

      icosa.rotation.x = t * 0.16;
      icosa.rotation.y = t * 0.22;
      icosa.position.y = 8 + Math.sin(t * 0.55) * 3.4;

      knot.rotation.x = t * 0.1;
      knot.rotation.z = t * 0.14;
      knot.position.y = -14 + Math.cos(t * 0.45) * 3;

      octa.rotation.y = t * 0.3;
      octa.rotation.z = t * 0.12;
      octa.position.x = -16 + Math.sin(t * 0.4) * 4;

      shapes.rotation.y = scrollY * 0.00035;

      camera.position.x += (mouseX * 5 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 5 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
    }

    renderer.render(scene, camera);
  })();
})();

/* ══════════ KURSOR KUSTOM ══════════ */

(function customCursor() {
  if (isTouch) return;

  const ring = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");
  let tx = -100,
    ty = -100,
    rx = -100,
    ry = -100;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    dot.style.left = tx + "px";
    dot.style.top = ty + "px";
  });

  (function follow() {
    rx += (tx - rx) * 0.16;
    ry += (ty - ry) * 0.16;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(follow);
  })();

  const hoverTargets = "a, button, input, textarea, [data-tilt], .glass-card";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.add("hovering");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.remove("hovering");
  });
})();

/* ══════════ BAHASA (ID / EN) ══════════ */

const I18N = {
  id: {
    preload: "MEMUAT SISTEM…",
    nav_home: "Beranda",
    nav_about: "Tentang",
    nav_skills: "Keahlian",
    nav_projects: "Proyek",
    nav_contact: "Kontak",
    nav_hire: "Rekrut Saya",
    hero_badge: "TERSEDIA UNTUK PROYEK BARU",
    hero_hello: "Halo, saya",
    hero_desc:
      "Mahasiswa Informatika yang membangun aplikasi Android, mengotomasi hal-hal membosankan dengan Python, dan mendesain antarmuka yang bikin orang berhenti scroll.",
    cta_work: "Lihat Karya",
    cta_cv: "Unduh CV",
    social_follow: "IKUTI SAYA",
    k_about: "01 // TENTANG SAYA",
    h_about: 'Manusia di balik <span class="grad-text">layar</span>',
    about_p1:
      'Saya <strong>Andi Rasyihan Jawahir</strong> — mahasiswa Informatika di Fakultas Teknik Unismuh Makassar yang percaya bahwa kode terbaik adalah kode yang <em>terasa</em>, bukan cuma berjalan.',
    about_p2:
      "Perjalanan saya dimulai dari proyek web sekolah, lalu berkembang menjadi kecintaan membangun perangkat lunak utuh: aplikasi Android dengan Kotlin & Firebase, sistem berbasis AI seperti computer vision dan deep learning, sampai web interaktif seperti yang sedang kamu lihat sekarang.",
    about_p3:
      'Filosofi saya sederhana: <span class="mono-accent">estetika + fungsi = pengalaman</span>. Setiap piksel dan setiap baris kode harus punya alasan untuk ada.',
    stat_repo: "Repositori GitHub",
    stat_tech: "Teknologi Dikuasai",
    stat_years: "Tahun Ngoprek",
    stat_curious: "Rasa Penasaran",
    k_skills: "02 // KEAHLIAN",
    h_skills: 'Senjata di <span class="grad-text">arsenal</span> saya',
    lvl_a: "Mahir",
    lvl_b: "Menengah",
    lvl_c: "Familiar",
    sk_py: "Otomasi, AI & scripting",
    sk_kt: "Aplikasi mobile & Firebase",
    sk_html: "Layout responsif & animasi",
    sk_js: "Web interaktif & WebGL",
    sk_fb: "Auth & database realtime",
    sk_java: "Algoritma & OOP",
    sk_git: "Version control & kolaborasi",
    sk_ux: "Desain antarmuka & prototipe",
    sk_php: "Web full-stack",
    sk_ml: "Deep learning & computer vision",
    k_projects: "03 // PROYEK PILIHAN",
    h_projects: 'Karya yang saya <span class="grad-text">banggakan</span>',
    p_rinra:
      "Website profil hotel premium dengan konsep urban resort, integrasi mall, dan panduan wisata lokal Makassar.",
    p_plat:
      "Sistem deteksi & pembacaan plat nomor kendaraan otomatis berbasis computer vision — kamera melihat, AI membaca.",
    p_diabetes:
      "Model deep learning untuk memprediksi risiko diabetes dari data medis — kecerdasan buatan untuk kesehatan.",
    p_resto:
      "Aplikasi E-Menu modern dengan input nomor meja, filter kategori makanan/minuman, dan keranjang pesanan interaktif.",
    p_wedding:
      "Undangan pernikahan digital dengan fitur RSVP, peta lokasi interaktif, dan animasi visual yang estetik.",
    p_kripto:
      "Sistem autentikasi dengan enkripsi kriptografi — melindungi kredensial pengguna dari mata-mata digital.",
    p_madrasah:
      "Platform web yang menghubungkan ekosistem madrasah — informasi, komunikasi, dan layanan dalam satu pintu digital.",
    p_myday:
      "Aplikasi Android jurnal & produktivitas harian dengan sinkronisasi cloud real-time dan desain Material 3 yang bersih.",
    p_porto:
      "Situs yang sedang kamu jelajahi — partikel WebGL, geometri wireframe, glassmorphism, dan interaksi magnetik.",
    cta_repos: "Jelajahi 22 Repositori di GitHub",
    k_journey: "04 // PERJALANAN",
    h_journey: 'Lini masa <span class="grad-text">evolusi</span>',
    t1_h: "Web Pertama",
    t1_p: "Merilis situs web pertama saat kelas 11 — awal perkenalan dengan HTML, CSS, dan dunia pengembangan web.",
    t2_h: "Proyek UKK & Masuk Kuliah",
    t2_p: "Menuntaskan rangkaian proyek UKK berbasis PHP full-stack, lalu resmi menjadi mahasiswa Informatika FT Unismuh Makassar.",
    t3_h: "Eksplorasi Meluas",
    t3_p: "Mendalami algoritma dengan Java, mencicipi Next.js & TypeScript, membangun proyek web PHP, hingga aplikasi Android MyDay.",
    t4_h: "Era AI & Keamanan",
    t4_p: "Terjun ke deep learning (DiabetesAI), computer vision (Scan Plat AI), kriptografi, dan platform MadrasahConnect.",
    k_contact: "05 // KONTAK",
    h_contact:
      'Mari bangun sesuatu yang <span class="grad-text">luar biasa</span>',
    contact_sub:
      "Punya ide proyek, tawaran kolaborasi, atau sekadar ingin menyapa? Kotak masuk saya selalu terbuka.",
    lbl_location: "LOKASI",
    f_name: "NAMA",
    f_msg: "PESAN",
    ph_name: "Nama kamu",
    ph_email: "email@kamu.com",
    ph_msg: "Ceritakan ide kerennya…",
    f_send: "Kirim Pesan",
    foot_note: "Dirakit dengan kopi & kode — © 2026 Andi Rasyihan Jawahir",
    foot_top: "KEMBALI KE ATAS ↑",
    toast_mail: "Membuka aplikasi email kamu — pesan siap dikirim!",
    roles: [
      "Android Developer",
      "Python Enthusiast",
      "Web Developer",
      "Desktop Customizer",
      "UI/UX Explorer",
    ],
  },
  en: {
    preload: "LOADING SYSTEM…",
    nav_home: "Home",
    nav_about: "About",
    nav_skills: "Skills",
    nav_projects: "Projects",
    nav_contact: "Contact",
    nav_hire: "Hire Me",
    hero_badge: "OPEN TO NEW PROJECTS",
    hero_hello: "Hi, I'm",
    hero_desc:
      "A Computer Science student who builds Android apps, automates boring things with Python, and designs interfaces that make people stop scrolling.",
    cta_work: "View Work",
    cta_cv: "Download CV",
    social_follow: "FOLLOW ME",
    k_about: "01 // ABOUT ME",
    h_about: 'The human behind the <span class="grad-text">screen</span>',
    about_p1:
      "I'm <strong>Andi Rasyihan Jawahir</strong> — a Computer Science student at the Faculty of Engineering, Unismuh Makassar, who believes the best code is code you can <em>feel</em>, not just run.",
    about_p2:
      "My journey began with school web projects and grew into a passion for building complete software: Android apps with Kotlin & Firebase, AI-powered systems like computer vision and deep learning, and interactive web experiences like the one you're exploring right now.",
    about_p3:
      'My philosophy is simple: <span class="mono-accent">aesthetics + function = experience</span>. Every pixel and every line of code must earn its place.',
    stat_repo: "GitHub Repositories",
    stat_tech: "Technologies Used",
    stat_years: "Years Tinkering",
    stat_curious: "Curiosity",
    k_skills: "02 // SKILLS",
    h_skills: 'Weapons in my <span class="grad-text">arsenal</span>',
    lvl_a: "Advanced",
    lvl_b: "Intermediate",
    lvl_c: "Familiar",
    sk_py: "Automation, AI & scripting",
    sk_kt: "Mobile apps & Firebase",
    sk_html: "Responsive layouts & animation",
    sk_js: "Interactive web & WebGL",
    sk_fb: "Auth & realtime database",
    sk_java: "Algorithms & OOP",
    sk_git: "Version control & collaboration",
    sk_ux: "Interface design & prototyping",
    sk_php: "Full-stack web",
    sk_ml: "Deep learning & computer vision",
    k_projects: "03 // FEATURED PROJECTS",
    h_projects: 'Work I\'m <span class="grad-text">proud of</span>',
    p_rinra:
      "Premium hotel profile website featuring an urban resort concept, mall integration, and a local Makassar travel guide.",
    p_plat:
      "Automatic license plate detection & reading system powered by computer vision — the camera sees, the AI reads.",
    p_diabetes:
      "A deep learning model that predicts diabetes risk from medical data — artificial intelligence for healthcare.",
    p_resto:
      "A modern E-Menu app with table number input, food & drink category filters, and an interactive order cart.",
    p_wedding:
      "A digital wedding invitation with RSVP, an interactive location map, and elegant visual animations.",
    p_kripto:
      "An authentication system with cryptographic encryption — protecting user credentials from digital eavesdroppers.",
    p_madrasah:
      "A web platform connecting the madrasah ecosystem — information, communication, and services in one digital gateway.",
    p_myday:
      "An Android daily journal & productivity app with real-time cloud sync and a clean Material 3 design.",
    p_porto:
      "The site you're exploring right now — WebGL particles, wireframe geometry, glassmorphism, and magnetic interactions.",
    cta_repos: "Explore 22 Repositories on GitHub",
    k_journey: "04 // JOURNEY",
    h_journey: 'A timeline of <span class="grad-text">evolution</span>',
    t1_h: "First Website",
    t1_p: "Launched my first website in 11th grade — my introduction to HTML, CSS, and the world of web development.",
    t2_h: "Capstone Projects & University",
    t2_p: "Completed a series of full-stack PHP capstone (UKK) projects, then officially became a CS student at FT Unismuh Makassar.",
    t3_h: "Expanding Horizons",
    t3_p: "Dived into algorithms with Java, tasted Next.js & TypeScript, built PHP web projects, and shipped the MyDay Android app.",
    t4_h: "The AI & Security Era",
    t4_p: "Ventured into deep learning (DiabetesAI), computer vision (Scan Plat AI), cryptography, and the MadrasahConnect platform.",
    k_contact: "05 // CONTACT",
    h_contact: 'Let\'s build something <span class="grad-text">extraordinary</span>',
    contact_sub:
      "Got a project idea, a collaboration offer, or just want to say hi? My inbox is always open.",
    lbl_location: "LOCATION",
    f_name: "NAME",
    f_msg: "MESSAGE",
    ph_name: "Your name",
    ph_email: "you@email.com",
    ph_msg: "Tell me about your cool idea…",
    f_send: "Send Message",
    foot_note: "Built with coffee & code — © 2026 Andi Rasyihan Jawahir",
    foot_top: "BACK TO TOP ↑",
    toast_mail: "Opening your email app — message ready to send!",
    roles: [
      "Android Developer",
      "Python Enthusiast",
      "Web Developer",
      "Desktop Customizer",
      "UI/UX Explorer",
    ],
  },
};

let currentLang = localStorage.getItem("lang") || "id";

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  const dict = I18N[lang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const key = el.dataset.i18nPh;
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });

  const toggle = document.getElementById("langToggle");
  if (toggle) toggle.textContent = lang === "id" ? "EN" : "ID";
}

document.getElementById("langToggle").addEventListener("click", () => {
  applyLang(currentLang === "id" ? "en" : "id");
});
applyLang(currentLang);

/* ══════════ EFEK KETIK ══════════ */

(function typing() {
  const el = document.getElementById("typingText");
  let roleIdx = 0,
    charIdx = 0,
    deleting = false;

  function tick() {
    const roles = I18N[currentLang].roles;
    const word = roles[roleIdx % roles.length];
    el.textContent = word.slice(0, charIdx);

    let delay;
    if (!deleting) {
      charIdx++;
      delay = 70 + Math.random() * 60;
      if (charIdx > word.length) {
        deleting = true;
        delay = 1900;
      }
    } else {
      charIdx--;
      delay = 38;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % I18N[currentLang].roles.length;
        delay = 420;
      }
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1300);
})();

/* ══════════ GLITCH BERKALA ══════════ */

(function glitchLoop() {
  const el = document.querySelector(".glitch");
  if (!el || reducedMotion) return;
  setInterval(() => {
    el.classList.add("glitching");
    setTimeout(() => el.classList.remove("glitching"), 320);
  }, 3800);
})();

/* ══════════ NAVBAR & SCROLL ══════════ */

(function navScroll() {
  const navbar = document.getElementById("navbar");
  const progress = document.getElementById("scrollProgress");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = [...document.querySelectorAll("section[id]")];

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 40);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

    let current = sections[0]?.id;
    for (const sec of sections) {
      if (y >= sec.offsetTop - window.innerHeight * 0.4) current = sec.id;
    }
    navLinks.forEach((link) =>
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + current,
      ),
    );
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Menu mobile */
  const hamburger = document.getElementById("hamburger");
  hamburger.addEventListener("click", () =>
    document.body.classList.toggle("menu-open"),
  );
  document
    .querySelectorAll("#navLinks a")
    .forEach((a) =>
      a.addEventListener("click", () =>
        document.body.classList.remove("menu-open"),
      ),
    );
})();

/* ══════════ REVEAL SAAT SCROLL ══════════ */

(function reveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay =
            (entry.target.dataset.delay || (i % 4) * 90) + "ms";
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

/* ══════════ COUNTER STATISTIK ══════════ */

(function counters() {
  const nums = document.querySelectorAll(".stat-num[data-target]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        const start = performance.now();
        const dur = 1600;

        (function step(now) {
          const p = Math.min(1, (now - start) / dur);
          el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        })(start);

        observer.unobserve(el);
      });
    },
    { threshold: 0.6 },
  );
  nums.forEach((el) => observer.observe(el));
})();

/* ══════════ TILT 3D KARTU ══════════ */

(function tilt() {
  if (isTouch || reducedMotion) return;

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      card.style.transform = `perspective(800px) rotateY(${(px - 0.5) * 12}deg) rotateX(${(0.5 - py) * 12}deg) translateY(-4px)`;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ══════════ TOMBOL MAGNETIK ══════════ */

(function magnetic() {
  if (isTouch || reducedMotion) return;

  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
})();

/* ══════════ FORM KONTAK ══════════ */

(function contactForm() {
  const form = document.getElementById("contactForm");
  const toast = document.getElementById("toast");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = form.nama.value.trim();
    const email = form.email.value.trim();
    const pesan = form.pesan.value.trim();

    const subject = encodeURIComponent(`[Portofolio] Pesan dari ${nama}`);
    const body = encodeURIComponent(
      `Nama: ${nama}\nEmail: ${email}\n\n${pesan}`,
    );
    window.location.href = `mailto:andirasyihan43289@gmail.com?subject=${subject}&body=${body}`;

    toast.textContent = I18N[currentLang].toast_mail;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3200);
    form.reset();
  });
})();
