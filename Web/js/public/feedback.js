

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('feedbackForm');
  const messageBox = document.getElementById('feedbackMessage');

  form.addEventListener('submit', function (e) {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (name.length > 100 || email.length > 100 || message.length > 1000) {
      e.preventDefault();
      messageBox.textContent = "Please check input lengths (Name/Email max 100, Message max 1000 characters).";
    }
  });
});
