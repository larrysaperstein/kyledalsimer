// 1️⃣ SMOOTH SCROLL FOR ANCHORS
(function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
})();

// 2️⃣ HAMBURGER NAV
(function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    // Click toggle
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
      // Animate links
      const links = navLinks.querySelectorAll('li');
      links.forEach((link, index) => {
        link.style.animation = navLinks.classList.contains('open')
          ? `navLinkFade 0.3s ease forwards ${index / 7 + 0.2}s`
          : '';
      });
    });

    // Keyboard accessibility
    hamburger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('open');
      }
    });
  }
})();

// 3️⃣ SCROLLING GALLERY (for index page)
(function initGalleryScroll() {
  const track = document.getElementById("galleryTrack");
  if (!track) return; // exit if gallery doesn't exist

  // Duplicate items for seamless scroll
  track.innerHTML += track.innerHTML;

  let pos = 0;
  let speed = 0.2;

  function animate(){
    pos -= speed;
    if(Math.abs(pos) >= track.scrollWidth / 2){
      pos = 0;
    }
    track.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(animate);
  }

  animate();

  // Pause on hover
  track.addEventListener("mouseenter", () => speed = 0);
  track.addEventListener("mouseleave", () => speed = 0.2);
})();

// 4️⃣ LIGHTBOX
(function initLightbox() {
  const track = document.getElementById("galleryTrack");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");

  if (!track || !lightbox || !lbImg) return;

  const images = [...track.querySelectorAll("img")];
  let index = 0;

  function show(i){
    index = (i + images.length) % images.length;
    lbImg.src = images[index].src;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox(){
    lightbox.classList.remove("open");
    setTimeout(() => { document.body.style.overflow = ""; }, 350);
  }

  images.forEach((img, i) => img.addEventListener("click", () => show(i)));

  document.querySelector(".lb-close")?.addEventListener("click", closeLightbox);
  document.querySelector(".lb-next")?.addEventListener("click", () => show(index + 1));
  document.querySelector(".lb-prev")?.addEventListener("click", () => show(index - 1));

  document.addEventListener("keydown", e => {
    if(!lightbox.classList.contains("open")) return;
    if(e.key === "ArrowRight") show(index + 1);
    if(e.key === "ArrowLeft") show(index - 1);
    if(e.key === "Escape") closeLightbox();
  });

  lightbox.addEventListener("click", e => {
    if(e.target === lightbox) closeLightbox();
  });
})();

// 5️⃣ REVEAL ON SCROLL
(function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal, .revealup");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
})();

// 7️⃣ CLOSE MOBILE NAV ON LINK CLICK
(function closeMobileNavOnClick() {
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');

  if (!navLinks || !hamburger) return;

  const links = navLinks.querySelectorAll('a[href^="#"], a[href^="../index.html#"]');

  links.forEach(link => {
    link.addEventListener('click', () => {
      // Only act on mobile
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');

        // Reset any link animations
        navLinks.querySelectorAll('li').forEach(li => li.style.animation = '');
      }
    });
  });
})();

/* =========================
   PAGE FADE & SMOOTH SCROLL
   ========================= */

(function pageFadeTransitions() {
  const wrapper = document.getElementById('page-wrapper');
  if (!wrapper) return;

  // --- FADE IN ON PAGE LOAD ---
  wrapper.style.opacity = 0;
  requestAnimationFrame(() => {
    wrapper.style.transition = 'opacity 0.5s ease-in-out';
    wrapper.style.opacity = 1;
  });

  // --- SELECT ALL LINKS ---
  const links = document.querySelectorAll('a[href]');

  links.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');

      // Ignore external links or anchors handled by target="_blank"
      const isExternal = link.target === '_blank' || href.startsWith('mailto:') || href.startsWith('tel:');
      if (isExternal) return;

      const currentPath = window.location.pathname;
      const [linkPath, anchor] = href.split('#');

      // --- SAME PAGE ANCHOR ---
      if ((linkPath === '' || linkPath === currentPath) && anchor) {
        e.preventDefault();
        const targetEl = document.getElementById(anchor);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }

        // Close mobile nav if open
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
        }
        return;
      }

      // --- CROSS-PAGE OR FULL PAGE NAVIGATION ---
      e.preventDefault();

      // Fade out wrapper
      wrapper.classList.add('fade-out');

      setTimeout(() => {
        if (anchor) {
          window.location.href = `${linkPath}#${anchor}`;
        } else {
          window.location.href = linkPath;
        }
      }, 500); // match CSS fade duration
    });
  });
})();