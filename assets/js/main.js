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
});
