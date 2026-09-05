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

  // V4のCSS連続スライド。一時停止操作だけを追加。
  var hero = document.querySelector(".hero");
  var motionButton = document.querySelector(".hero-motion");
  if (hero && motionButton) {
    motionButton.addEventListener("click", function () {
      var paused = hero.classList.toggle("is-paused");
      motionButton.setAttribute("aria-pressed", String(paused));
      motionButton.setAttribute("aria-label", paused ? "写真の動きを再開" : "写真の動きを停止");
      motionButton.textContent = paused ? "再生" : "一時停止";
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
});
