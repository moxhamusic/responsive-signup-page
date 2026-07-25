document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signin-form");
  const banner = document.getElementById("signin-banner");

  const params = new URLSearchParams(window.location.search);
  if (params.get("justRegistered") === "1") {
    banner.textContent = "Account created. Sign in with your new details.";
    banner.classList.add("show", "success");
  }

  const emailField = {
    input: document.getElementById("email"),
    fieldEl: document.getElementById("email-field"),
    hintEl: document.getElementById("email-hint"),
    validate: Validators.email,
    messages: { error: "Enter a valid email, e.g. example@mail.com" },
  };
  const passwordField = {
    input: document.getElementById("password"),
    fieldEl: document.getElementById("password-field"),
    hintEl: document.getElementById("password-hint"),
  };

  const runEmail = bindField(emailField);

  passwordField.input.addEventListener("input", () => {
    if (passwordField.input.value.length) {
      clearField(passwordField.fieldEl, passwordField.hintEl);
    }
  });

  // Show/hide password
  document.querySelectorAll(".pw-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetInput = document.getElementById(btn.dataset.target);
      const nowVisible = targetInput.type === "password";
      targetInput.type = nowVisible ? "text" : "password";
      btn.textContent = nowVisible ? "Hide" : "Show";
      btn.setAttribute("aria-pressed", String(nowVisible));
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    banner.className = "form-banner";

    let ok = true;

    if (!Validators.required(emailField.input.value)) {
      showFieldError(emailField.fieldEl, emailField.hintEl, "Email is required.");
      ok = false;
    } else if (!runEmail()) {
      ok = false;
    }

    if (!Validators.required(passwordField.input.value)) {
      showFieldError(passwordField.fieldEl, passwordField.hintEl, "Password is required.");
      ok = false;
    }

    if (!ok) {
      banner.textContent = "Please fix the highlighted fields before continuing.";
      banner.classList.add("show", "error");
      return;
    }

    const result = Store.authenticate(emailField.input.value, passwordField.input.value);

    if (!result.ok && result.reason === "no-account") {
      showFieldError(
        emailField.fieldEl,
        emailField.hintEl,
        "No account found for this email. Please sign up first."
      );
      banner.textContent = "This email is not registered yet.";
      banner.classList.add("show", "error");
      return;
    }

    if (!result.ok && result.reason === "bad-password") {
      showFieldError(passwordField.fieldEl, passwordField.hintEl, "Incorrect password.");
      banner.textContent = "Email and password do not match our records.";
      banner.classList.add("show", "error");
      return;
    }

    Store.startSession(result.user);
    banner.textContent = "Welcome back! Redirecting…";
    banner.classList.add("show", "success");
    form.querySelectorAll("input, button").forEach((el) => (el.disabled = true));
    setTimeout(() => {
      window.location.href = "landing.html";
    }, 700);
  });
});
