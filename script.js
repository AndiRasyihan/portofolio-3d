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

/* ══════════ EFEK KETIK ══════════ */

(function typing() {
  const el = document.getElementById("typingText");
  const roles = [
    "Android Developer",
    "Python Enthusiast",
    "Web Developer",
    "Desktop Customizer",
    "UI/UX Explorer",
  ];
  let roleIdx = 0,
    charIdx = 0,
    deleting = false;

  function tick() {
    const word = roles[roleIdx];
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
        roleIdx = (roleIdx + 1) % roles.length;
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

    toast.textContent = "Membuka aplikasi email kamu — pesan siap dikirim!";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3200);
    form.reset();
  });
})();
