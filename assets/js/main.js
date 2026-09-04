document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Formspree標準POST送信後の ?sent=true パラメータでサンクスメッセージを表示
  var form = document.getElementById("contactForm");
  var successMessage = document.getElementById("formSuccess");
  var params = new URLSearchParams(location.search);

  if (params.get("sent") === "true") {
    if (successMessage) {
      successMessage.hidden = false;
    }
    if (form) {
      form.hidden = true;
    }
    history.replaceState(null, "", location.pathname);
  }

  // ヒーローの写真スライダー
  var slides = document.querySelectorAll("#heroSlider .hero-slide");
  var dots = document.querySelectorAll("#heroDots .hero-dot");
  if (slides.length > 1) {
    var current = 0;
    var showSlide = function (index) {
      slides[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = index;
      slides[current].classList.add("active");
      dots[current].classList.add("active");
    };
    var SLIDE_INTERVAL = 8000;
    var timer = setInterval(function () {
      showSlide((current + 1) % slides.length);
    }, SLIDE_INTERVAL);
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        clearInterval(timer);
        showSlide(index);
        timer = setInterval(function () {
          showSlide((current + 1) % slides.length);
        }, SLIDE_INTERVAL);
      });
    });
  }

  // 食事写真のライトボックス
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");

  var openLightbox = function (src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.hidden = false;
  };
  var closeLightbox = function () {
    if (!lightbox) return;
    lightbox.hidden = true;
  };

  document.querySelectorAll(".gourmet-card").forEach(function (card) {
    var img = card.querySelector("img");
    if (!img) return;
    card.addEventListener("click", function () {
      openLightbox(img.src, img.alt);
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img.src, img.alt);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  // クマノミ園について：スクロールでふわっと表示
  var revealTargets = document.querySelectorAll("[data-reveal]");
  if (revealTargets.length) {
    if ("IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      revealTargets.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      revealTargets.forEach(function (el) {
        el.classList.add("is-revealed");
      });
    }
  }
});
