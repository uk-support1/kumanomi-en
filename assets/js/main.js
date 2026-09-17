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

  // ヒーロー写真スライドの一時停止操作
  var hero = document.querySelector(".hero");
  var motionButton = document.querySelector(".hero-motion");
  if (hero && motionButton) {
    motionButton.addEventListener("click", function () {
      var paused = hero.classList.toggle("is-paused");
      motionButton.setAttribute("aria-pressed", String(paused));
      motionButton.setAttribute("aria-label", paused ? "写真の動きを再開" : "写真の動きを停止");
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

  // ===== サンゴギャラリー：写真クリックで拡大表示（#life内サンゴ3カテゴリ専用処理） =====
  (function () {
    var clusters = document.querySelectorAll(".coral-cluster");
    var modal = document.getElementById("coralGalleryModal");
    var modalImg = document.getElementById("coralGalleryImg");
    if (!clusters.length || !modal || !modalImg) return;

    var categoryEl = document.getElementById("coralGalleryCategory");
    var titleEl = document.getElementById("coralGalleryTitle");
    var captionEl = document.getElementById("coralGalleryCaption");
    var closeBtn = document.getElementById("coralGalleryClose");
    var backdrop = document.getElementById("coralGalleryBackdrop");
    var prevBtn = document.getElementById("coralGalleryPrev");
    var nextBtn = document.getElementById("coralGalleryNext");

    var currentPhotos = [];
    var currentIndex = 0;
    var currentCategory = "";

    var updateOrientation = function () {
      var isPortrait = modalImg.naturalHeight > modalImg.naturalWidth;
      modal.classList.toggle("is-portrait", isPortrait);
    };

    var renderCurrentPhoto = function () {
      var photo = currentPhotos[currentIndex];
      if (!photo) return;
      modal.classList.remove("is-portrait");
      modalImg.onload = updateOrientation;
      modalImg.src = photo.src;
      modalImg.alt = photo.alt;
      // 写真ごとの表題がある場合はカテゴリ名を出さず、表題だけを表示する
      if (categoryEl) categoryEl.textContent = photo.title ? "" : currentCategory;
      if (titleEl) titleEl.textContent = photo.title;
      if (captionEl) captionEl.textContent = photo.caption;
      if (modalImg.complete && modalImg.naturalWidth) {
        updateOrientation();
      }
    };

    var openGallery = function (cluster, startIndex) {
      var photoEls = cluster.querySelectorAll(".coral-photo");
      currentPhotos = Array.prototype.map.call(photoEls, function (fig) {
        var im = fig.querySelector("img");
        return {
          src: im.getAttribute("src"),
          alt: im.getAttribute("alt") || "",
          title: fig.getAttribute("data-title") || "",
          caption: fig.getAttribute("data-caption") || ""
        };
      });
      currentIndex = startIndex;
      currentCategory = cluster.getAttribute("data-category") || "";
      renderCurrentPhoto();
      modal.hidden = false;
    };

    var closeGallery = function () {
      modal.hidden = true;
    };

    var showNext = function () {
      if (!currentPhotos.length) return;
      currentIndex = (currentIndex + 1) % currentPhotos.length;
      renderCurrentPhoto();
    };

    var showPrev = function () {
      if (!currentPhotos.length) return;
      currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
      renderCurrentPhoto();
    };

    clusters.forEach(function (cluster) {
      var photoEls = cluster.querySelectorAll(".coral-photo");
      photoEls.forEach(function (fig, index) {
        fig.addEventListener("click", function () {
          openGallery(cluster, index);
        });
        fig.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openGallery(cluster, index);
          }
        });
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeGallery);
    if (backdrop) backdrop.addEventListener("click", closeGallery);
    if (nextBtn) nextBtn.addEventListener("click", showNext);
    if (prevBtn) prevBtn.addEventListener("click", showPrev);

    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    });
  })();

  // ===== 間取り図モーダル（サンゴギャラリーとは独立した専用処理） =====
  (function () {
    var trigger = document.getElementById("floorplanTrigger");
    var modal = document.getElementById("floorplanModal");
    var closeBtn = document.getElementById("floorplanModalClose");
    var backdrop = document.getElementById("floorplanModalBackdrop");
    if (!trigger || !modal) return;

    var openModal = function () {
      modal.hidden = false;
    };
    var closeModal = function () {
      modal.hidden = true;
    };

    trigger.addEventListener("click", openModal);
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal();
      }
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") closeModal();
    });
  })();

  // ===== お知らせ（Blogger固定ページの本文をJSONPで取得して表示） =====
  (function () {
    // 本番反映時は、この2値だけを変更すれば差し替えできます。
    var NOTICE_CONFIG = {
      blogUrl: "https://niiza-yasuragi.blogspot.com", // テスト用（本番はクマノミ園様のBlogger URLに差し替え）
      pageTitle: "お知らせ（クマノミ園様のテスト用）" // テスト用（本番は「お知らせ」に差し替え）
    };

    // Blogger本文をそのままinnerHTMLへ渡さず、許可した要素・属性だけを残すサニタイズ処理。
    // <template>でパースするだけでは埋め込みscript等は動かないが、
    // 実DOMへ挿入した際にonerror等のイベント属性は発火しうるため、必ずこの処理を通す。
    var ALLOWED_TAGS = {
      P: true, BR: true,
      STRONG: true, B: true, EM: true, I: true, U: true,
      UL: true, OL: true, LI: true,
      H2: true, H3: true, H4: true,
      A: true, IMG: true,
      SPAN: true, DIV: true, BLOCKQUOTE: true, HR: true, SUB: true, SUP: true
    };
    // 中身ごと除去する要素（スクリプト実行やフォーム送信等につながるもの）。
    var STRIP_WITH_CONTENTS = {
      SCRIPT: true, STYLE: true, IFRAME: true, OBJECT: true, EMBED: true,
      FORM: true, LINK: true, META: true, NOSCRIPT: true, TEMPLATE: true,
      SVG: true, MATH: true, BUTTON: true, INPUT: true, TEXTAREA: true,
      SELECT: true, VIDEO: true, AUDIO: true, SOURCE: true, TRACK: true, BASE: true
    };
    var ALLOWED_ATTRS = {
      A: ["href"],
      IMG: ["src", "alt", "width", "height"]
    };

    var isSafeUrl = function (value, allowedSchemes) {
      var cleaned = String(value)
        .replace(/[\u0000-\u0020\u007f]/g, "")
        .toLowerCase();
      for (var i = 0; i < allowedSchemes.length; i++) {
        if (cleaned.indexOf(allowedSchemes[i]) === 0) return true;
      }
      return false;
    };

    var sanitizeTree = function (node) {
      var children = Array.prototype.slice.call(node.childNodes);
      children.forEach(function (child) {
        if (child.nodeType === Node.COMMENT_NODE) {
          child.parentNode.removeChild(child);
          return;
        }
        if (child.nodeType !== Node.ELEMENT_NODE) {
          return; // テキストノードはそのまま
        }
        var tag = child.tagName;
        if (STRIP_WITH_CONTENTS[tag]) {
          child.parentNode.removeChild(child);
          return;
        }
        // 先に子要素を再帰的にサニタイズしてから、このタグ自体の可否を判定する
        // （許可されないタグの中に危険な要素が入れ子になっているケースを取りこぼさないため）
        sanitizeTree(child);
        if (!ALLOWED_TAGS[tag]) {
          // タグは許可しないが、既にサニタイズ済みの中身はそのまま残して展開する
          while (child.firstChild) {
            node.insertBefore(child.firstChild, child);
          }
          child.parentNode.removeChild(child);
          return;
        }
        var allowedAttrs = ALLOWED_ATTRS[tag] || [];
        Array.prototype.slice.call(child.attributes).forEach(function (attr) {
          if (allowedAttrs.indexOf(attr.name.toLowerCase()) === -1) {
            child.removeAttribute(attr.name);
          }
        });
        if (tag === "A" && child.hasAttribute("href")) {
          if (!isSafeUrl(child.getAttribute("href"), ["http:", "https:", "mailto:"])) {
            child.removeAttribute("href");
          }
        }
        if (tag === "IMG" && child.hasAttribute("src")) {
          if (!isSafeUrl(child.getAttribute("src"), ["http:", "https:", "data:image/"])) {
            child.removeAttribute("src");
          }
        }
      });
    };

    var sanitizeNoticeHtml = function (html) {
      var template = document.createElement("template");
      template.innerHTML = html;
      sanitizeTree(template.content);
      return template.innerHTML;
    };

    var noticeSection = document.querySelector(".notice-section");
    var noticeCard = document.getElementById("noticeCard");
    var noticeContent = document.getElementById("noticeContent");
    if (!noticeSection || !noticeCard || !noticeContent) return;

    var hideNotice = function () {
      noticeSection.hidden = true;
    };

    var callbackName = "__kumanomiNoticeCallback";
    var timeoutId = setTimeout(hideNotice, 8000);

    window[callbackName] = function (data) {
      clearTimeout(timeoutId);
      try {
        var entries = (data && data.feed && data.feed.entry) || [];
        var match = null;
        for (var i = 0; i < entries.length; i++) {
          var title = entries[i].title && entries[i].title.$t;
          if (title === NOTICE_CONFIG.pageTitle) {
            match = entries[i];
            break;
          }
        }
        var rawHtml = match && match.content && match.content.$t;
        if (!match || !rawHtml || !rawHtml.replace(/<[^>]*>/g, "").trim()) {
          hideNotice();
          return;
        }
        var safeHtml = sanitizeNoticeHtml(rawHtml);
        if (!safeHtml || !safeHtml.replace(/<[^>]*>/g, "").trim()) {
          hideNotice();
          return;
        }
        noticeContent.innerHTML = safeHtml;
      } catch (e) {
        hideNotice();
      }
    };

    var feedScript = document.createElement("script");
    feedScript.src =
      NOTICE_CONFIG.blogUrl.replace(/\/$/, "") +
      "/feeds/pages/default?alt=json-in-script&callback=" +
      callbackName;
    feedScript.onerror = hideNotice;
    document.body.appendChild(feedScript);
  })();
});
