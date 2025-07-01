document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        window.location.replace("index.html");
      } else {
        const message = document.getElementById("message");
        message.textContent = "Erreur dans l’identifiant ou le mot de passe";
        message.classList.add("visible");
      }
    } catch (error) {
      alert("Erreur réseau ou serveur.");
      document.getElementById("message").textContent =
        "Erreur réseau ou serveur.";
    }
  });
