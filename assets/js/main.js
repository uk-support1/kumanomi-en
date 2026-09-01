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

  var form = document.getElementById("contactForm");
  var nextField = document.getElementById("formNext");
  if (form && nextField) {
    nextField.value = location.origin + location.pathname + "?sent=true#contact";
  }

  var params = new URLSearchParams(location.search);
  var successMessage = document.getElementById("formSuccess");
  if (params.get("sent") === "true" && successMessage) {
    successMessage.hidden = false;
    if (form) {
      form.hidden = true;
    }
  }
});
