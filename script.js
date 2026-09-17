/* =====================================================
   MR GAMING PRO
   SCRIPT COMPLET
   NAVIGATION + AUTH FIREBASE + NOTIFICATIONS
===================================================== */


/* =====================================================
   FIREBASE
===================================================== */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBT7dBeqf2NyE1od-7ZREg6SwOlkMUbw0E",
  authDomain: "globoost.firebaseapp.com",
  projectId: "globoost",
  storageBucket: "globoost.firebasestorage.app",
  messagingSenderId: "386284505924",
  appId: "1:386284505924:web:ff47d077addeef77252511",
  measurementId: "G-4BC7Q37JH1"
};


const firebaseApp =
  initializeApp(FIREBASE_CONFIG);

const auth =
  getAuth(firebaseApp);

const googleProvider =
  new GoogleAuthProvider();


/* =====================================================
   CHARGEMENT
===================================================== */

window.addEventListener("load", () => {

  setTimeout(() => {

    const loader =
      document.getElementById("loader");

    if (loader) {
      loader.classList.add("hide");
    }

  }, 1000);

});


/* =====================================================
   VIBRATION
===================================================== */

function vibrate() {

  if ("vibrate" in navigator) {
    navigator.vibrate(35);
  }

}


document.addEventListener("click", (event) => {

  const button =
    event.target.closest(
      "button, .social-card, .customer-service a"
    );

  if (button) {
    vibrate();
  }

});


/* =====================================================
   NAVIGATION
===================================================== */

function showPage(pageName) {

  const pages =
    document.querySelectorAll(".page");

  const navItems =
    document.querySelectorAll(".nav-item");


  pages.forEach(page => {
    page.classList.remove("active-page");
  });


  const selectedPage =
    document.getElementById(
      "page-" + pageName
    );


  if (selectedPage) {
    selectedPage.classList.add("active-page");
  }


  navItems.forEach(item => {

    item.classList.remove("active");

    if (item.dataset.page === pageName) {
      item.classList.add("active");
    }

  });


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  history.replaceState(
    null,
    "",
    "#" + pageName
  );

}


function loadInitialPage() {

  const hash =
    window.location.hash.replace("#", "");

  const allowedPages = [
    "accueil",
    "services",
    "evenements",
    "plateformes",
    "reseaux"
  ];


  if (allowedPages.includes(hash)) {
    showPage(hash);
  } else {
    showPage("accueil");
  }

}


document.addEventListener(
  "DOMContentLoaded",
  loadInitialPage
);


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
   INSTALLATION PWA
===================================================== */

let deferredPrompt = null;


window.addEventListener(
  "beforeinstallprompt",
  (event) => {

    event.preventDefault();

    deferredPrompt = event;

    console.log(
      "Installation de MR GAMING PRO disponible."
    );

  }
);


async function installApp() {

  if (!deferredPrompt) {

    alert(
      "Si Chrome propose « Installer l'application », " +
      "utilise cette option pour installer MR GAMING PRO."
    );

    return;

  }


  deferredPrompt.prompt();

  const result =
    await deferredPrompt.userChoice;

  console.log(
    "Installation :",
    result.outcome
  );

  deferredPrompt = null;

}


window.addEventListener(
  "appinstalled",
  () => {

    console.log(
      "MR GAMING PRO installé."
    );

    deferredPrompt = null;

  }
);


/* =====================================================
   AUTHENTIFICATION FIREBASE
===================================================== */

const authModal =
  document.getElementById("auth-modal");

const accountButton =
  document.getElementById("account-button");

const closeAuthButton =
  document.getElementById("close-auth");

const loginForm =
  document.getElementById("login-form");

const registerForm =
  document.getElementById("register-form");

const loginContainer =
  document.getElementById(
    "login-form-container"
  );

const registerContainer =
  document.getElementById(
    "register-form-container"
  );

const accountContainer =
  document.getElementById(
    "user-account-container"
  );

const showRegisterButton =
  document.getElementById("show-register");

const showLoginButton =
  document.getElementById("show-login");

const logoutButton =
  document.getElementById("logout-button");

const loggedUserEmail =
  document.getElementById("logged-user-email");


/* =====================================================
   MESSAGE AUTH
===================================================== */

function showAuthMessage(message) {

  alert(message);

}


/* =====================================================
   OUVRIR LE COMPTE
===================================================== */

function openAuth() {

  vibrate();

  if (!authModal) return;

  authModal.classList.add("show");


  const user =
    auth.currentUser;


  if (user) {

    showAccount(user);

  } else {

    showLogin();

  }

}


/* =====================================================
   FERMER
===================================================== */

function closeAuth() {

  if (!authModal) return;

  authModal.classList.remove("show");

}


/* =====================================================
   AFFICHER CONNEXION
===================================================== */

function showLogin() {

  if (loginContainer) {
    loginContainer.style.display = "block";
  }

  if (registerContainer) {
    registerContainer.style.display = "none";
  }

  if (accountContainer) {
    accountContainer.style.display = "none";
  }

}


/* =====================================================
   AFFICHER INSCRIPTION
===================================================== */

function showRegister() {

  if (loginContainer) {
    loginContainer.style.display = "none";
  }

  if (registerContainer) {
    registerContainer.style.display = "block";
  }

  if (accountContainer) {
    accountContainer.style.display = "none";
  }

}


/* =====================================================
   AFFICHER COMPTE
===================================================== */

function showAccount(user) {

  if (loginContainer) {
    loginContainer.style.display = "none";
  }

  if (registerContainer) {
    registerContainer.style.display = "none";
  }

  if (accountContainer) {
    accountContainer.style.display = "block";
  }


  if (loggedUserEmail) {

    loggedUserEmail.textContent =
      user.email || "Utilisateur connecté";

  }

}


/* =====================================================
   CONNEXION EMAIL
===================================================== */

async function loginWithEmail() {

  const emailInput =
    document.getElementById("login-email");

  const passwordInput =
    document.getElementById("login-password");


  if (!emailInput || !passwordInput) {
    return;
  }


  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;


  if (!email || !password) {

    showAuthMessage(
      "Remplis tous les champs."
    );

    return;

  }


  try {

    showAuthMessage(
      "Connexion en cours..."
    );


    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );


    closeAuth();

    loginForm.reset();


  } catch (error) {

    console.error(error);

    let message =
      "Impossible de se connecter.";


    if (
      error.code ===
      "auth/invalid-credential"
    ) {

      message =
        "Email ou mot de passe incorrect.";

    } else if (
      error.code ===
      "auth/user-not-found"
    ) {

      message =
        "Aucun compte avec cet email.";

    } else if (
      error.code ===
      "auth/wrong-password"
    ) {

      message =
        "Mot de passe incorrect.";

    } else if (
      error.code ===
      "auth/invalid-email"
    ) {

      message =
        "Adresse email invalide.";

    }


    showAuthMessage(message);

  }

}


/* =====================================================
   INSCRIPTION EMAIL
===================================================== */

async function registerWithEmail() {

  const emailInput =
    document.getElementById("register-email");

  const passwordInput =
    document.getElementById("register-password");

  const confirmInput =
    document.getElementById(
      "register-confirm-password"
    );


  if (
    !emailInput ||
    !passwordInput ||
    !confirmInput
  ) {
    return;
  }


  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;

  const confirmPassword =
    confirmInput.value;


  if (
    !email ||
    !password ||
    !confirmPassword
  ) {

    showAuthMessage(
      "Remplis tous les champs."
    );

    return;

  }


  if (password.length < 6) {

    showAuthMessage(
      "Le mot de passe doit contenir au moins 6 caractères."
    );

    return;

  }


  if (password !== confirmPassword) {

    showAuthMessage(
      "Les deux mots de passe ne correspondent pas."
    );

    return;

  }


  try {

    showAuthMessage(
      "Création du compte..."
    );


    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );


    closeAuth();

    registerForm.reset();


  } catch (error) {

    console.error(error);

    let message =
      "Impossible de créer le compte.";


    if (
      error.code ===
      "auth/email-already-in-use"
    ) {

      message =
        "Cette adresse email est déjà utilisée.";

    } else if (
      error.code ===
      "auth/invalid-email"
    ) {

      message =
        "Adresse email invalide.";

    } else if (
      error.code ===
      "auth/weak-password"
    ) {

      message =
        "Le mot de passe est trop faible.";

    }


    showAuthMessage(message);

  }

}


/* =====================================================
   GOOGLE
===================================================== */

async function loginWithGoogle() {

  try {

    showAuthMessage(
      "Connexion avec Google..."
    );


    await signInWithPopup(
      auth,
      googleProvider
    );


    closeAuth();


  } catch (error) {

    console.error(error);


    if (
      error.code ===
      "auth/popup-closed-by-user"
    ) {

      return;

    }


    if (
      error.code ===
      "auth/popup-blocked"
    ) {

      showAuthMessage(
        "La fenêtre Google a été bloquée par le navigateur."
      );

      return;

    }


    showAuthMessage(
      "Impossible de se connecter avec Google."
    );

  }

}


/* =====================================================
   DÉCONNEXION
===================================================== */

async function logoutUser() {

  try {

    await signOut(auth);

    closeAuth();


  } catch (error) {

    console.error(error);

    showAuthMessage(
      "Erreur lors de la déconnexion."
    );

  }

}


/* =====================================================
   FORMULAIRE CONNEXION
===================================================== */

loginForm?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    vibrate();

    loginWithEmail();

  }
);


/* =====================================================
   FORMULAIRE INSCRIPTION
===================================================== */

registerForm?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    vibrate();

    registerWithEmail();

  }
);


/* =====================================================
   BOUTONS AUTH
===================================================== */

accountButton?.addEventListener(
  "click",
  openAuth
);


closeAuthButton?.addEventListener(
  "click",
  closeAuth
);


showRegisterButton?.addEventListener(
  "click",
  showRegister
);


showLoginButton?.addEventListener(
  "click",
  showLogin
);


logoutButton?.addEventListener(
  "click",
  logoutUser
);


/* =====================================================
   CLIQUER EN DEHORS DU MODAL
===================================================== */

authModal?.addEventListener(
  "click",
  (event) => {

    if (event.target === authModal) {
      closeAuth();
    }

  }
);


/* =====================================================
   ÉTAT FIREBASE
===================================================== */

onAuthStateChanged(
  auth,
  (user) => {

    if (!accountButton) return;


    if (user) {

      accountButton.innerHTML =
        '<i class="fa-solid fa-user-check"></i>';

      accountButton.classList.add(
        "connected"
      );


      if (
        authModal &&
        authModal.classList.contains("show")
      ) {

        showAccount(user);

      }


      console.log(
        "Utilisateur connecté :",
        user.email
      );


    } else {

      accountButton.innerHTML =
        '<i class="fa-solid fa-user"></i>';

      accountButton.classList.remove(
        "connected"
      );

    }

  }
);


/* =====================================================
   NOTIFICATIONS FIREBASE
===================================================== */

const FCM_VAPID_KEY =
  "BBrtZEQfPWxPIQBScNgttFUa7_34haM3leS2MbznWN2RCPP3fzSZHx6Qd1_LzbwjBpwLzerJxbQAhRBxk6ocHdk";


const NOTIFICATION_TOKEN_KEY =
  "mrGamingNotificationToken";


async function enableNotifications() {

  const button =
    document.getElementById(
      "enable-notifications"
    );


  if (!button) return;


  if (!("Notification" in window)) {

    alert(
      "Les notifications ne sont pas prises en charge par ce navigateur."
    );

    return;

  }


  if (
    location.protocol !== "https:" &&
    location.hostname !== "localhost"
  ) {

    alert(
      "Les notifications nécessitent un site HTTPS."
    );

    return;

  }


  try {

    button.disabled = true;

    button.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i>';


    const permission =
      await Notification.requestPermission();


    if (permission !== "granted") {

      alert(
        "Les notifications n'ont pas été autorisées."
      );

      button.disabled = false;

      button.innerHTML =
        '<i class="fa-solid fa-bell"></i>' +
        '<span class="notification-dot"></span>';

      return;

    }


    const {
      getMessaging,
      getToken,
      onMessage
    } = await import(
      "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging.js"
    );


    const messaging =
      getMessaging(firebaseApp);


    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );


    const token =
      await getToken(
        messaging,
        {
          vapidKey: FCM_VAPID_KEY,
          serviceWorkerRegistration: registration
        }
      );


    if (!token) {
      throw new Error(
        "Impossible de récupérer le token FCM."
      );
    }


    localStorage.setItem(
      NOTIFICATION_TOKEN_KEY,
      token
    );


    button.classList.add("enabled");

    button.innerHTML =
      '<i class="fa-solid fa-bell"></i>';


    alert(
      "Notifications activées avec succès !"
    );


    onMessage(
      messaging,
      (payload) => {

        console.log(
          "Notification reçue :",
          payload
        );

        const title =
          payload.notification?.title ||
          "MR GAMING PRO";

        const body =
          payload.notification?.body ||
          "Une nouvelle actualité est disponible !";


        if (
          Notification.permission ===
          "granted"
        ) {

          new Notification(
            title,
            {
              body: body,

              icon:
                "https://i.ibb.co/Fq3Rn0N1/c536964c08ca2bee74c4a8b26f03926d.webp"
            }
          );

        }

      }
    );


  } catch (error) {

    console.error(
      "Erreur notifications :",
      error
    );


    alert(
      "Impossible d'activer les notifications.\n\n" +
      error.message
    );


    button.disabled = false;

    button.innerHTML =
      '<i class="fa-solid fa-bell"></i>' +
      '<span class="notification-dot"></span>';

  }

}


/* =====================================================
   INITIALISATION NOTIFICATIONS
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const button =
      document.getElementById(
        "enable-notifications"
      );


    if (!button) return;


    button.addEventListener(
      "click",
      enableNotifications
    );


    const savedToken =
      localStorage.getItem(
        NOTIFICATION_TOKEN_KEY
      );


    if (
      savedToken &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {

      button.classList.add(
        "enabled"
      );

    }

  }
);


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