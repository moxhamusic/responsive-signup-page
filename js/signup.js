document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  const banner = document.getElementById("signup-banner");

  const fields = {
    fullName: {
      input: document.getElementById("fullName"),
      fieldEl: document.getElementById("fullName-field"),
      hintEl: document.getElementById("fullName-hint"),
      validate: Validators.fullName,
      messages: { error: "Enter your name using letters only (2–50 characters)." },
    },
    email: {
      input: document.getElementById("email"),
      fieldEl: document.getElementById("email-field"),
      hintEl: document.getElementById("email-hint"),
      validate: Validators.email,
      messages: { error: "Enter a valid email, e.g. example@mail.com" },
    },
    phone: {
      input: document.getElementById("phone"),
      fieldEl: document.getElementById("phone-field"),
      hintEl: document.getElementById("phone-hint"),
      validate: Validators.phone,
      messages: { error: "Phone number must be exactly 10 digits." },
    },
    city: {
      input: document.getElementById("city"),
      fieldEl: document.getElementById("city-field"),
      hintEl: document.getElementById("city-hint"),
      validate: Validators.city,
      messages: { error: "City must contain alphabets only." },
    },
    password: {
      input: document.getElementById("password"),
      fieldEl: document.getElementById("password-field"),
      hintEl: document.getElementById("password-hint"),
      validate: Validators.password,
      messages: { error: "At least 8 characters, with letters and numbers." },
    },
  };

  const runners = {};
  Object.entries(fields).forEach(([key, cfg]) => {
    runners[key] = bindField(cfg);
  });

  // Confirm password depends on the live value of password
  const confirmInput = document.getElementById("confirmPassword");
  const confirmField = document.getElementById("confirmPassword-field");
  const confirmHint = document.getElementById("confirmPassword-hint");

  function runConfirm() {
    const value = confirmInput.value;
    if (value.trim().length === 0) {
      clearField(confirmField, confirmHint);
      return false;
    }
    const ok = Validators.confirmPassword(fields.password.input.value, value);
    confirmField.classList.toggle("is-valid", ok);
    confirmField.classList.toggle("is-invalid", !ok);
    confirmHint.textContent = ok ? "" : "Passwords do not match.";
    return ok;
  }
  confirmInput.addEventListener("input", runConfirm);
  confirmInput.addEventListener("blur", runConfirm);
  fields.password.input.addEventListener("input", () => {
    if (confirmInput.value.length) runConfirm();
  });

  // Show/hide password toggles
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

    const results = Object.entries(fields).map(([key, cfg]) => {
      const value = cfg.input.value;
      if (!Validators.required(value)) {
        showFieldError(cfg.fieldEl, cfg.hintEl, "This field is required.");
        return false;
      }
      return runners[key]();
    });
    const confirmOk = Validators.required(confirmInput.value)
      ? runConfirm()
      : (showFieldError(confirmField, confirmHint, "Please confirm your password."), false);

    const allOk = results.every(Boolean) && confirmOk;
    if (!allOk) {
      banner.textContent = "Please fix the highlighted fields before continuing.";
      banner.classList.add("show", "error");
      return;
    }

    const result = Store.register({
      fullName: fields.fullName.input.value,
      email: fields.email.input.value,
      phone: fields.phone.input.value,
      city: fields.city.input.value,
      password: fields.password.input.value,
    });

    if (!result.ok && result.reason === "duplicate") {
      showFieldError(
        fields.email.fieldEl,
        fields.email.hintEl,
        "An account with this email already exists. Try signing in instead."
      );
      banner.textContent = "This email is already registered.";
      banner.classList.add("show", "error");
      return;
    }

    banner.textContent = "Account created! Redirecting you to sign in…";
    banner.classList.add("show", "success");
    form.querySelectorAll("input, button").forEach((el) => (el.disabled = true));
    setTimeout(() => {
      window.location.href = "signin.html?justRegistered=1";
    }, 900);
  });
});
