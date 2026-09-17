/* =====================================================
   MR GAMING PRO
   SCRIPT COMPLET — NAV + AUTH FIREBASE + ESPACE USER
===================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


/* =====================================================
   FIREBASE
===================================================== */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBT7dBeqf2NyE1od-7ZREg6SwOlkMUbw0E",
  authDomain: "globoost.firebaseapp.com",
  projectId: "globoost",
  storageBucket: "globoost.firebasestorage.app",
  messagingSenderId: "386284505924",
  appId: "1:386284505924:web:ff47d077addeef77252511",
  measurementId: "G-4BC7Q37JH1"
};

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();


/* =====================================================
   LOADER
===================================================== */

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader")?.classList.add("hide");
  }, 1000);
});


/* =====================================================
   VIBRATION
===================================================== */

function vibrate() {
  if ("vibrate" in navigator) navigator.vibrate(35);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button, .social-card, .customer-service a");
  if (button) vibrate();
});


/* =====================================================
   NAVIGATION
===================================================== */

const allowedPages = [
  "accueil",
  "services",
  "evenements",
  "plateformes",
  "reseaux",
  "compte"
];

function showPage(pageName) {

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  document.getElementById("page-" + pageName)?.classList.add("active-page");

  document.querySelectorAll(".nav-item").forEach(item => {
    if (item.dataset.page === pageName) item.classList.add("active");
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", "#" + pageName);
}

function loadInitialPage() {
  const hash = window.location.hash.replace("#", "");
  showPage(allowedPages.includes(hash) ? hash : "accueil");
}

document.addEventListener("DOMContentLoaded", loadInitialPage);


/* =====================================================
   ÉVÉNEMENT
===================================================== */

function openEvent() {
  vibrate();
  alert(
    "FC Mobile — Numéro Légendaire\n\n" +
    "L'événement est disponible sur MR GAMING PRO."
  );
}


/* =====================================================
   PWA
===================================================== */

let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

async function installApp() {
  if (!deferredPrompt) {
    alert("Utilise « Installer l'application » dans ton navigateur.");
    return;
  }
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
}

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
});


/* =====================================================
   ÉLÉMENTS AUTH
===================================================== */

const authModal = document.getElementById("auth-modal");
const accountButton = document.getElementById("account-button");
const closeAuthButton = document.getElementById("close-auth");

const loginContainer = document.getElementById("login-form-container");
const registerContainer = document.getElementById("register-form-container");
const accountContainer = document.getElementById("user-account-container");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const showRegisterButton = document.getElementById("show-register");
const showLoginButton = document.getElementById("show-login");
const logoutButton = document.getElementById("logout-button");

const loggedUserEmail = document.getElementById("logged-user-email");
const accountName = document.getElementById("account-name");
const authMessage = document.getElementById("auth-message");

const googleLoginButton = document.getElementById("google-login");
const googleRegisterButton = document.getElementById("google-register");

/* Espace utilisateur (page #compte) */
const guestView = document.getElementById("guest-view");
const userView = document.getElementById("user-view");
const welcomeTitle = document.getElementById("welcome-title");
const welcomeSubtitle = document.getElementById("welcome-subtitle");
const userHeroName = document.getElementById("user-hero-name");
const userHeroEmail = document.getElementById("user-hero-email");


/* =====================================================
   MESSAGE
===================================================== */

function showAuthMessage(message, isError = false) {
  if (!authMessage) return;
  authMessage.textContent = message;
  authMessage.style.color = isError ? "#ff5577" : "var(--pink2)";
}


/* =====================================================
   OUVRIR / FERMER MODALE
===================================================== */

function openAuth() {
  vibrate();
  authModal?.classList.add("show");
  if (auth.currentUser) showAccount(auth.currentUser);
  else showLogin();
}

function closeAuth() {
  authModal?.classList.remove("show");
  showAuthMessage("");
}


/* =====================================================
   VUES INTERNES MODALE
===================================================== */

function hideAllViews() {
  loginContainer?.classList.add("hidden");
  registerContainer?.classList.add("hidden");
  accountContainer?.classList.add("hidden");
}

function showLogin() {
  hideAllViews();
  loginContainer?.classList.remove("hidden");
  showAuthMessage("");
}

function showRegister() {
  hideAllViews();
  registerContainer?.classList.remove("hidden");
  showAuthMessage("");
}

function showAccount(user) {
  hideAllViews();
  accountContainer?.classList.remove("hidden");

  if (accountName) {
    accountName.textContent = user.displayName || "Utilisateur";
  }
  if (loggedUserEmail) {
    loggedUserEmail.textContent = user.email || "—";
  }
  showAuthMessage("");
}


/* =====================================================
   ESPACE UTILISATEUR (page #compte)
===================================================== */

function updateUserSpace(user) {

  if (user) {

    guestView?.classList.add("hidden");
    userView?.classList.remove("hidden");

    if (welcomeTitle) welcomeTitle.textContent = "Mon espace";

    if (welcomeSubtitle) {
      welcomeSubtitle.textContent = "Bienvenue dans ton espace personnel.";
    }

    if (userHeroName) {
      userHeroName.textContent = user.displayName || "Utilisateur";
    }

    if (userHeroEmail) {
      userHeroEmail.textContent = user.email || "—";
    }

    const statGames = document.getElementById("stat-games");
    const statEvents = document.getElementById("stat-events");
    const statLevel = document.getElementById("stat-level");

    if (statGames) statGames.textContent = "0";
    if (statEvents) statEvents.textContent = "0";
    if (statLevel) statLevel.textContent = "1";

  } else {

    guestView?.classList.remove("hidden");
    userView?.classList.add("hidden");

    if (welcomeTitle) welcomeTitle.textContent = "Mon espace";

    if (welcomeSubtitle) {
      welcomeSubtitle.textContent =
        "Connecte-toi pour accéder à ton espace personnel.";
    }
  }
}


/* =====================================================
   CONNEXION EMAIL
===================================================== */

async function loginWithEmail() {

  const email = document.getElementById("login-email")?.value.trim();
  const password = document.getElementById("login-password")?.value;

  if (!email || !password) {
    showAuthMessage("Remplis tous les champs.", true);
    return;
  }

  try {
    showAuthMessage("Connexion en cours...");
    await signInWithEmailAndPassword(auth, email, password);
    closeAuth();
    loginForm?.reset();
    showPage("compte");
  } catch (error) {
    console.error(error);
    let message = "Impossible de se connecter.";
    if (error.code === "auth/invalid-credential") message = "Email ou mot de passe incorrect.";
    else if (error.code === "auth/user-not-found") message = "Aucun compte avec cet email.";
    else if (error.code === "auth/wrong-password") message = "Mot de passe incorrect.";
    else if (error.code === "auth/invalid-email") message = "Adresse email invalide.";
    showAuthMessage(message, true);
  }
}


/* =====================================================
   INSCRIPTION EMAIL
===================================================== */

async function registerWithEmail() {

  const name = document.getElementById("register-name")?.value.trim();
  const email = document.getElementById("register-email")?.value.trim();
  const password = document.getElementById("register-password")?.value;
  const confirm = document.getElementById("register-confirm-password")?.value;

  if (!name || !email || !password || !confirm) {
    showAuthMessage("Remplis tous les champs.", true);
    return;
  }

  if (password.length < 6) {
    showAuthMessage("Le mot de passe doit contenir au moins 6 caractères.", true);
    return;
  }

  if (password !== confirm) {
    showAuthMessage("Les deux mots de passe ne correspondent pas.", true);
    return;
  }

  try {
    showAuthMessage("Création du compte...");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    closeAuth();
    registerForm?.reset();
    showPage("compte");
  } catch (error) {
    console.error(error);
    let message = "Impossible de créer le compte.";
    if (error.code === "auth/email-already-in-use") message = "Cette adresse email est déjà utilisée.";
    else if (error.code === "auth/invalid-email") message = "Adresse email invalide.";
    else if (error.code === "auth/weak-password") message = "Mot de passe trop faible.";
    showAuthMessage(message, true);
  }
}


/* =====================================================
   GOOGLE
===================================================== */

async function loginWithGoogle() {
  try {
    showAuthMessage("Connexion avec Google...");
    await signInWithPopup(auth, googleProvider);
    closeAuth();
    showPage("compte");
  } catch (error) {
    console.error(error);
    if (error.code === "auth/popup-closed-by-user") return;
    if (error.code === "auth/popup-blocked") {
      showAuthMessage("La fenêtre Google a été bloquée.", true);
      return;
    }
    showAuthMessage("Impossible de se connecter avec Google.", true);
  }
}


/* =====================================================
   DÉCONNEXION
===================================================== */

async function logoutUser() {
  try {
    await signOut(auth);
    closeAuth();
    showPage("accueil");
    showAuthMessage("");
  } catch (error) {
    console.error(error);
    showAuthMessage("Erreur lors de la déconnexion.", true);
  }
}


/* =====================================================
   LISTENERS
===================================================== */

accountButton?.addEventListener("click", openAuth);
closeAuthButton?.addEventListener("click", closeAuth);

showRegisterButton?.addEventListener("click", showRegister);
showLoginButton?.addEventListener("click", showLogin);

logoutButton?.addEventListener("click", logoutUser);

googleLoginButton?.addEventListener("click", loginWithGoogle);
googleRegisterButton?.addEventListener("click", loginWithGoogle);

loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  vibrate();
  loginWithEmail();
});

registerForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  vibrate();
  registerWithEmail();
});

authModal?.addEventListener("click", (e) => {
  if (e.target === authModal) closeAuth();
});

document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => {
    showPage(item.dataset.page);
  });
});


/* =====================================================
   ÉTAT FIREBASE
===================================================== */

onAuthStateChanged(auth, (user) => {

  if (accountButton) {
    accountButton.innerHTML = user
      ? '<i class="fa-solid fa-user-check"></i>'
      : '<i class="fa-solid fa-user"></i>';
    accountButton.classList.toggle("connected", !!user);
  }

  if (authModal?.classList.contains("show")) {
    user ? showAccount(user) : showLogin();
  }

  updateUserSpace(user);

  if (user && window.location.hash === "#compte") {
    showPage("compte");
  }

  console.log(user ? "Connecté : " + user.email : "Déconnecté");
});


/* =====================================================
   NOTIFICATIONS
===================================================== */

const FCM_VAPID_KEY =
  "BBrtZEQfPWxPIQBScNgttFUa7_34haM3leS2MbznWN2RCPP3fzSZHx6Qd1_LzbwjBpwLzerJxbQAhRBxk6ocHdk";

const NOTIFICATION_TOKEN_KEY = "mrGamingNotificationToken";

async function enableNotifications() {

  const button = document.getElementById("enable-notifications");
  if (!button) return;

  if (!("Notification" in window)) {
    alert("Notifications non prises en charge.");
    return;
  }

  if (location.protocol !== "https:" && location.hostname !== "localhost") {
    alert("Les notifications nécessitent HTTPS.");
    return;
  }

  try {
    button.disabled = true;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("Notifications non autorisées.");
      button.disabled = false;
      button.innerHTML = '<i class="fa-solid fa-bell"></i><span class="notification-dot"></span>';
      return;
    }

    const { getMessaging, getToken, onMessage } = await import(
      "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging.js"
    );

    const messaging = getMessaging(firebaseApp);

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const token = await getToken(messaging, {
      vapidKey: FCM_VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (!token) throw new Error("Token FCM introuvable.");

    localStorage.setItem(NOTIFICATION_TOKEN_KEY, token);

    button.classList.add("enabled");
    button.innerHTML = '<i class="fa-solid fa-bell"></i>';

    alert("Notifications activées !");

    onMessage(messaging, (payload) => {
      const title = payload.notification?.title || "MR GAMING PRO";
      const body = payload.notification?.body || "Nouvelle actualité !";
      if (Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "https://i.ibb.co/Fq3Rn0N1/c536964c08ca2bee74c4a8b26f03926d.webp"
        });
      }
    });

  } catch (error) {
    console.error("Erreur notifications :", error);
    alert("Impossible d'activer les notifications.\n\n" + error.message);
    button.disabled = false;
    button.innerHTML = '<i class="fa-solid fa-bell"></i><span class="notification-dot"></span>';
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const button = document.getElementById("enable-notifications");
  if (!button) return;

  button.addEventListener("click", enableNotifications);

  const savedToken = localStorage.getItem(NOTIFICATION_TOKEN_KEY);

  if (savedToken && "Notification" in window && Notification.permission === "granted") {
    button.classList.add("enabled");
  }
});


/* =====================================================
   FONCTIONS GLOBALES
===================================================== */

window.showPage = showPage;
window.openEvent = openEvent;
window.installApp = installApp;

window.openAuth = openAuth;
window.closeAuth = closeAuth;
window.showLogin = showLogin;
window.showRegister = showRegister;

window.loginWithEmail = loginWithEmail;
window.registerWithEmail = registerWithEmail;
window.loginWithGoogle = loginWithGoogle;
window.logoutUser = logoutUser;