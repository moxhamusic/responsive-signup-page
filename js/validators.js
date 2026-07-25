/* =========================================================
   validators.js — pure validation functions, no DOM here
   ========================================================= */

const Validators = {
  required(value) {
    return value.trim().length > 0;
  },

  fullName(value) {
    // required, at least 2 letters, allows spaces/hyphens/apostrophes
    return /^[A-Za-z][A-Za-z\s'-]{1,49}$/.test(value.trim());
  },

  email(value) {
    // pragmatic RFC-5322-ish check: local@domain.tld
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value.trim());
  },

  phone(value) {
    // exactly 10 digits, no letters/symbols
    return /^\d{10}$/.test(value.trim());
  },

  city(value) {
    // alphabets only (spaces allowed for multi-word city names)
    return /^[A-Za-z\s]{2,}$/.test(value.trim());
  },

  password(value) {
    // at least 8 chars, at least one letter AND one number
    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value);
  },

  confirmPassword(password, confirm) {
    return password.length > 0 && password === confirm;
  },
};

/* =========================================================
   Small DOM helper: wires one <input> to a validator fn and
   toggles is-valid / is-invalid classes + inline hint text.
   ========================================================= */
function bindField({ input, hintEl, fieldEl, validate, messages }) {
  function run() {
    const value = input.value;
    const empty = value.trim().length === 0;

    if (empty) {
      fieldEl.classList.remove("is-valid", "is-invalid");
      hintEl.textContent = "";
      return false;
    }

    const ok = validate(value);
    fieldEl.classList.toggle("is-valid", ok);
    fieldEl.classList.toggle("is-invalid", !ok);
    hintEl.textContent = ok ? (messages.ok || "") : messages.error;
    return ok;
  }

  input.addEventListener("input", run);
  input.addEventListener("blur", run);
  return run; // caller can invoke run() on submit to force-validate
}

function showFieldError(fieldEl, hintEl, message) {
  fieldEl.classList.remove("is-valid");
  fieldEl.classList.add("is-invalid");
  hintEl.textContent = message;
}

function clearField(fieldEl, hintEl) {
  fieldEl.classList.remove("is-valid", "is-invalid");
  hintEl.textContent = "";
}
