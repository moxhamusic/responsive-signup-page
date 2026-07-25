document.addEventListener("DOMContentLoaded", () => {
  const session = Store.getSession();
  if (!session) {
    window.location.href = "signin.html";
    return;
  }
  document.getElementById("welcome-name").textContent = session.fullName.split(" ")[0];

  document.getElementById("logout-btn").addEventListener("click", () => {
    Store.endSession();
    window.location.href = "signin.html";
  });
});
