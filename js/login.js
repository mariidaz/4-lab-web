document.getElementById("openLogin").addEventListener("click", () => {
  document.getElementById("loginModal").classList.remove("hidden");
});

document.getElementById("openRegister").addEventListener("click", () => {
  document.getElementById("registerModal").classList.remove("hidden");
});

document.querySelectorAll(".close").forEach(btn => {
  btn.addEventListener("click", () => {
    const modalId = btn.getAttribute("data-close");
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("hidden");
  });
});

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.add("hidden");
  }
});

let token = localStorage.getItem("token");
let role = localStorage.getItem("role");

if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && currentTime > payload.exp) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      token = null;
      role = null;
    }
  } catch (error) {
    console.error("Помилка при розборі токену:", error.message);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }
}

if (role === "admin") {
  const link = document.getElementById("navbar-signin");
  if (link) {
    link.href = "admin.html";
    link.textContent = "Panel";
  }
}

// Реєстрація
document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('register-username').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const message = document.getElementById('registerMessage');
  const role = document.getElementById('register-role').value;

  message.style.color = 'red';

  const errors = [];
  if (!username) errors.push("Ім’я користувача є обов’язковим");
  if (username.length < 3) errors.push("Логін має містити щонайменше 3 символи");
  if (!email.includes('@')) errors.push("Невірний формат email");
  if (password.length < 6) errors.push("Пароль має містити щонайменше 6 символів");
  if (password !== confirmPassword) errors.push("Паролі не збігаються");

  if (errors.length > 0) {
    message.innerHTML = errors.join("<br>");
  } else {
    try {
      const result = await register(username, password, role);
      if (result && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", role);
        message.style.color = 'green';
        message.innerText = "Реєстрація пройшла успішно!";
        alert("Реєстрація успішна!");
        document.getElementById("registerModal").classList.add("hidden");
        showUserInfo(username, role);
      } else {
        message.innerText = "Помилка при реєстрації. Спробуйте ще раз.";
      }
    } catch (error) {
      console.error("Помилка реєстрації:", error.message);
    }
  }
});

// Логін
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const message = document.getElementById('loginMessage');

  try {
    const result = await login(username, password);
    if (result && result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);
      message.style.color = 'green';
      message.innerText = "Успішна авторизація!";
      alert("Вхід успішний!");
      document.getElementById("loginModal").classList.add("hidden");
      showUserInfo(username, result.role);

      if (result.role === "admin") {
        setTimeout(() => { window.location.href = "admin.html"; }, 1500);
      }
    } else {
      message.style.color = 'red';
      message.innerText = "Авторизація не пройдена. Перевірте введені дані.";
    }
  } catch (error) {
    console.error("Помилка при вході:", error.message);
  }
});

// API-запити
async function login(username, password) {
  const url = "https://chnu-student-interview-preparation.netlify.app/.netlify/functions/userLogin";

  const info = { username, password };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info)
    });

    if (!response.ok) throw new Error(`Помилка HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Помилка при вході:", error.message);
  }
}

async function register(username, password, role) {
  const url = "https://chnu-student-interview-preparation.netlify.app/.netlify/functions/userRegister";

  const info = { username, password, role };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info)
    });

    if (!response.ok) throw new Error(`Помилка HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Помилка при реєстрації:", error.message);
  }
}

// function showUserInfo(username, role) {
//   const userGreeting = document.getElementById("userGreeting");
//   userGreeting.textContent = `Привіт, ${username} (${role})`;
//   document.getElementById("userInfo").classList.remove("hidden");
// }

// document.getElementById("logoutBtn").addEventListener("click", () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("role");
//   alert("Ви вийшли з акаунту!");
//   document.getElementById("userInfo").classList.add("hidden");
// });

// document.addEventListener("DOMContentLoaded", checkLoginStatus);

