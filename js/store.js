/* =========================================================
   store.js — a tiny localStorage-backed user store.
   This is a front-end-only demo: there is no real server, so
   "authentication" simply means the entered email + password
   match a record that was saved during Sign Up on this device.
   Passwords are stored in plain text here for demo purposes
   only — a production app must never do this; it should hash
   passwords server-side (e.g. bcrypt) and never store them
   client-side at all.
   ========================================================= */

const Store = {
  USERS_KEY: "wanderpass_users",
  SESSION_KEY: "wanderpass_session",

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
    } catch {
      return [];
    }
  },

  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  findByEmail(email) {
    const normalized = email.trim().toLowerCase();
    return this.getUsers().find((u) => u.email.toLowerCase() === normalized);
  },

  register(user) {
    const users = this.getUsers();
    if (this.findByEmail(user.email)) {
      return { ok: false, reason: "duplicate" };
    }
    users.push({
      fullName: user.fullName.trim(),
      email: user.email.trim(),
      phone: user.phone.trim(),
      city: user.city.trim(),
      password: user.password, // demo only, see note above
    });
    this.saveUsers(users);
    return { ok: true };
  },

  authenticate(email, password) {
    const user = this.findByEmail(email);
    if (!user) return { ok: false, reason: "no-account" };
    if (user.password !== password) return { ok: false, reason: "bad-password" };
    return { ok: true, user };
  },

  startSession(user) {
    sessionStorage.setItem(
      this.SESSION_KEY,
      JSON.stringify({ fullName: user.fullName, email: user.email })
    );
  },

  getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(this.SESSION_KEY));
    } catch {
      return null;
    }
  },

  endSession() {
    sessionStorage.removeItem(this.SESSION_KEY);
  },
};
