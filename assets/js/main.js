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
    // pageIdはBlogger側でページタイトルを変更しても変わらない固定値のため、
    // 辰巳様が固定ページのタイトルを自由に変更しても対象ページの取得は継続します。
    // 調べ方：
    //   ・Bloggerの固定ページ編集画面を開いたときのURL
    //     https://www.blogger.com/blog/page/edit/<ブログID>/<ページID> の末尾の数字
    //   ・または /feeds/pages/default?alt=json を開き、対象ページの
    //     entry.id の "...page-XXXXXXXXXXXXXXXXXXX" の数字部分
    var NOTICE_CONFIG = {
      blogUrl: "https://kumanomien.blogspot.com", // 本番：クマノミ園様のBlogger URL
      pageId: "2767251117867366656" // 本番：クマノミ園様の「お知らせ」固定ページID（/feeds/pages/default?alt=jsonで確認済み）
    };

    // entry.id.$t は "tag:blogger.com,1999:blog-<blogId>.page-<pageId>" 形式。
    // pageIdは最大19桁の数値になりうるため、精度が落ちないよう常に文字列として扱う。
    var extractPageId = function (entryId) {
      var m = /\.page-(\d+)$/.exec(entryId || "");
      return m ? m[1] : null;
    };

    // ヘッダーナビは1行表示を維持するため、文字コード（サロゲートペア）単位で
    // 安全に10文字＋「…」へ切り詰める。アコーディオン側は全文表示のため使わない。
    var truncateForNav = function (text, maxChars) {
      var chars = Array.from(text || "");
      if (chars.length <= maxChars) return text || "";
      return chars.slice(0, maxChars).join("") + "…";
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
      SPAN: true, DIV: true, BLOCKQUOTE: true, HR: true, SUB: true, SUP: true,
      TABLE: true, CAPTION: true, THEAD: true, TBODY: true, TFOOT: true,
      TR: true, TH: true, TD: true
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
      IMG: ["src", "alt", "width", "height", "border"],
      TH: ["colspan", "rowspan"],
      TD: ["colspan", "rowspan"]
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

    // ---- style属性の値レベル検証 ----------------------------------------
    // Bloggerが画像の左/中央/右寄せに使うfloat/clear/margin、文字装飾に使う
    // color/background-color/font-size等は「見た目を作るだけ」で安全と判断し、
    // プロパティ単位で許可する。position/z-index/transform等の
    // レイアウト破壊・画面乗っ取りにつながるプロパティは許可リストに含めない
    // （＝そもそも通らない）。
    var DANGEROUS_VALUE_RE = /url\s*\(|expression\s*\(|javascript:|vbscript:|@import|behavior\s*:/i;
    var hasDangerousValue = function (value) {
      return DANGEROUS_VALUE_RE.test(String(value));
    };

    var validateKeyword = function (allowedList) {
      return function (value) {
        return allowedList.indexOf(String(value).trim().toLowerCase()) !== -1;
      };
    };

    // px/em/rem/pt/%の数値指定を、単位ごとの上限つきで検証する。
    // Blogger実出力にvw/vh等のビューポート単位は現れないため許可リストに含めない
    // （＝それらの単位の値はそもそも通らない）。
    var validateLength = function (opts) {
      opts = opts || {};
      var allowNegative = !!opts.allowNegative;
      var maxByUnit = opts.max || { px: 64, em: 4, rem: 4, pt: 48, "%": 200 };
      var allowKeywords = opts.allowKeywords || [];
      return function (value) {
        var v = String(value).trim().toLowerCase();
        if (allowKeywords.indexOf(v) !== -1) return true;
        var m = /^(-?[\d.]+)(px|em|rem|pt|%)$/.exec(v);
        if (!m) return false;
        var num = parseFloat(m[1]);
        var unit = m[2];
        if (isNaN(num)) return false;
        if (!allowNegative && num < 0) return false;
        return Math.abs(num) <= (maxByUnit[unit] || 0);
      };
    };

    var validateColor = function (value) {
      // 構文として妥当な色かどうかはCSSOMへの再代入時点で既に保証されている
      // （不正な値はブラウザが黙って無視し空文字になる）ため、ここでは
      // 危険な記法（url()等）が紛れ込んでいないかだけを追加で確認する。
      return !hasDangerousValue(value);
    };

    var validateTextDecoration = function (value) {
      return /^(none|underline|overline|line-through)(\s+(none|underline|overline|line-through))*$/i.test(
        String(value).trim()
      );
    };

    var validateLineHeight = function (value) {
      var v = String(value).trim();
      if (/^[\d.]+$/.test(v)) {
        var n = parseFloat(v);
        return n > 0 && n <= 3;
      }
      return validateLength({ max: { px: 64, em: 3, rem: 3, pt: 48, "%": 300 } })(v);
    };

    var marginLengthValidator = validateLength({ max: { px: 64, em: 4, rem: 4, pt: 48, "%": 20 } });
    var paddingLengthValidator = validateLength({ max: { px: 32, em: 2, rem: 2, pt: 24, "%": 10 } });

    // 許可するCSSプロパティと、その値の検証関数。
    // ここに載っていないプロパティ（position/z-index/top/left/right/bottom/
    // transform/animation/filter/backdrop-filter/clip-path/behavior/
    // overflow/display/cursor/pointer-events/visibility等）は無条件に除去される。
    // margin/paddingは実際のBlogger出力に合わせて個別方向のみ許可し、
    // ショートハンド（margin: 1em 2em ...）は扱わない。
    var ALLOWED_STYLE_PROPS = {
      "text-align": validateKeyword(["left", "right", "center", "justify", "start", "end"]),
      "font-weight": validateKeyword([
        "normal", "bold", "bolder", "lighter",
        "100", "200", "300", "400", "500", "600", "700", "800", "900"
      ]),
      "font-style": validateKeyword(["normal", "italic", "oblique"]),
      "text-decoration": validateTextDecoration,
      "text-decoration-line": validateTextDecoration,
      color: validateColor,
      "background-color": validateColor,
      "font-size": validateLength({
        allowKeywords: [
          "xx-small", "x-small", "small", "medium",
          "large", "x-large", "xx-large", "smaller", "larger"
        ],
        max: { px: 48, em: 3, rem: 3, pt: 36, "%": 300 }
      }),
      "line-height": validateLineHeight,
      float: validateKeyword(["left", "right", "none"]),
      clear: validateKeyword(["left", "right", "both", "none"]),
      "margin-top": marginLengthValidator,
      "margin-right": marginLengthValidator,
      "margin-bottom": marginLengthValidator,
      "margin-left": marginLengthValidator,
      "padding-top": paddingLengthValidator,
      "padding-right": paddingLengthValidator,
      "padding-bottom": paddingLengthValidator,
      "padding-left": paddingLengthValidator
    };

    // 生のstyle文字列をブラウザ自身のCSSパーサーで一度解釈させ
    // （独自の正規表現でCSS構文を解析するより確実）、そこから許可プロパティ
    // だけを値検証つきで拾い直して再構築する。
    var styleScratch = document.createElement("span");
    var sanitizeStyleValue = function (rawStyle) {
      if (!rawStyle) return "";
      styleScratch.setAttribute("style", "");
      try {
        styleScratch.style.cssText = rawStyle;
      } catch (e) {
        return "";
      }
      var out = [];
      for (var i = 0; i < styleScratch.style.length; i++) {
        var prop = styleScratch.style[i];
        var validator = ALLOWED_STYLE_PROPS[prop];
        if (!validator) continue;
        var value = styleScratch.style.getPropertyValue(prop);
        if (!value || hasDangerousValue(value) || !validator(value)) continue;
        out.push(prop + ": " + value);
      }
      return out.join("; ");
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
        var rawStyle = child.getAttribute("style");
        Array.prototype.slice.call(child.attributes).forEach(function (attr) {
          var name = attr.name.toLowerCase();
          if (name === "style") return; // styleは下で別途サニタイズする
          if (allowedAttrs.indexOf(name) === -1) {
            child.removeAttribute(attr.name);
          }
        });
        if (rawStyle) {
          var cleanedStyle = sanitizeStyleValue(rawStyle);
          if (cleanedStyle) {
            child.setAttribute("style", cleanedStyle);
          } else {
            child.removeAttribute("style");
          }
        }
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
    var noticeSummaryLabel = document.getElementById("noticeSummaryLabel");
    var noticeNavLink = document.getElementById("noticeNavLink");
    if (!noticeSection || !noticeCard || !noticeContent) return;

    var hideNotice = function () {
      noticeSection.hidden = true;
      if (noticeNavLink) noticeNavLink.hidden = true;
    };

    var callbackName = "__kumanomiNoticeCallback";
    var timeoutId = setTimeout(hideNotice, 8000);

    window[callbackName] = function (data) {
      clearTimeout(timeoutId);
      try {
        var entries = (data && data.feed && data.feed.entry) || [];
        var match = null;
        for (var i = 0; i < entries.length; i++) {
          var entryId = entries[i].id && entries[i].id.$t;
          if (extractPageId(entryId) === NOTICE_CONFIG.pageId) {
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
        // 表示用タイトルは常にBloggerの「現在の」ページタイトルを使う
        // （対象ページの特定にはpageIdのみを使い、タイトルは使わない）。
        var pageTitle = (match.title && match.title.$t) || "";
        noticeContent.innerHTML = safeHtml;
        if (noticeSummaryLabel) noticeSummaryLabel.textContent = pageTitle; // アコーディオン側は全文表示
        if (noticeNavLink) {
          noticeNavLink.textContent = truncateForNav(pageTitle, 10); // ヘッダーは10文字+「…」
          noticeNavLink.hidden = false;
        }
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
