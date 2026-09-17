/* =====================================================
   MR GAMING PRO
   JAVASCRIPT
   Acode + Firebase Authentication + Notifications
===================================================== */


/* =====================================================
   FIREBASE AUTHENTIFICATION
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
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


/* =========================
   CONFIG FIREBASE
========================= */

const FIREBASE_CONFIG = {

  apiKey:
    "AIzaSyBT7dBeqf2NyE1od-7ZREg6SwOlkMUbw0E",

  authDomain:
    "globoost.firebaseapp.com",

  projectId:
    "globoost",

  storageBucket:
    "globoost.firebasestorage.app",

  messagingSenderId:
    "386284505924",

  appId:
    "1:386284505924:web:ff47d077addeef77252511",

  measurementId:
    "G-4BC7Q37JH1"

};


/* =========================
   INITIALISATION FIREBASE
========================= */

const firebaseApp =
  initializeApp(
    FIREBASE_CONFIG
  );


const auth =
  getAuth(
    firebaseApp
  );


const googleProvider =
  new GoogleAuthProvider();



/* =====================================================
   CHARGEMENT
===================================================== */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      () => {

        const loader =
          document.getElementById(
            "loader"
          );


        if (loader) {

          loader.classList.add(
            "hide"
          );

        }

      },
      1000
    );

  }
);



/* =====================================================
   VIBRATION
===================================================== */

function vibrate() {

  if (
    "vibrate" in navigator
  ) {

    navigator.vibrate(35);

  }

}



/* Tous les boutons */

document.addEventListener(
  "click",
  (event) => {

    const element =
      event.target.closest(
        "button, .social-card, .customer-service a"
      );


    if (element) {

      vibrate();

    }

  }
);



/* =====================================================
   NAVIGATION
===================================================== */

function showPage(
  pageName
) {

  const pages =
    document.querySelectorAll(
      ".page"
    );


  const navItems =
    document.querySelectorAll(
      ".nav-item"
    );


  pages.forEach(
    page => {

      page.classList.remove(
        "active-page"
      );

    }
  );


  const selectedPage =
    document.getElementById(
      "page-" + pageName
    );


  if (selectedPage) {

    selectedPage.classList.add(
      "active-page"
    );

  }


  navItems.forEach(
    item => {

      item.classList.remove(
        "active"
      );


      if (
        item.dataset.page ===
        pageName
      ) {

        item.classList.add(
          "active"
        );

      }

    }
  );


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



/* =====================================================
   PAGE INITIALE
===================================================== */

function loadInitialPage() {

  const hash =
    window.location.hash
      .replace(
        "#",
        ""
      );


  const allowedPages = [

    "accueil",
    "services",
    "evenements",
    "plateformes",
    "reseaux"

  ];


  if (
    allowedPages.includes(
      hash
    )
  ) {

    showPage(hash);

  } else {

    showPage(
      "accueil"
    );

  }

}



document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadInitialPage();


    /* Navigation */

    document
      .querySelectorAll(
        ".nav-item"
      )
      .forEach(
        item => {

          item.addEventListener(
            "click",
            () => {

              showPage(
                item.dataset.page
              );

            }
          );

        }
      );

  }
);



/* =====================================================
   ÉVÉNEMENT FC MOBILE
===================================================== */

function openEvent() {

  vibrate();


  alert(
    "FC Mobile — Numéro Légendaire\n\n" +
    "L'événement est disponible sur MR GAMING PRO."
  );

}



/* =====================================================
   INSTALLATION WEB APP
===================================================== */

let deferredPrompt =
  null;


window.addEventListener(
  "beforeinstallprompt",
  event => {

    event.preventDefault();

    deferredPrompt =
      event;

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


  deferredPrompt =
    null;

}



window.addEventListener(
  "appinstalled",
  () => {

    console.log(
      "MR GAMING PRO installé."
    );


    deferredPrompt =
      null;

  }
);



/* =====================================================
   AUTHENTIFICATION
===================================================== */


/* =========================
   ÉLÉMENTS HTML
========================= */

const authModal =
  document.getElementById(
    "auth-modal"
  );


const authButton =
  document.getElementById(
    "auth-button"
  );


const authClose =
  document.getElementById(
    "auth-close"
  );


const loginForm =
  document.getElementById(
    "login-form"
  );


const registerForm =
  document.getElementById(
    "register-form"
  );


const accountForm =
  document.getElementById(
    "account-form"
  );


const authMessage =
  document.getElementById(
    "auth-message"
  );



/* =========================
   MESSAGE
========================= */

function showAuthMessage(
  message
) {

  if (!authMessage) {
    return;
  }


  authMessage.textContent =
    message;

}



function clearAuthMessage() {

  if (!authMessage) {
    return;
  }


  authMessage.textContent =
    "";

}



/* =========================
   OUVRIR
========================= */

function openAuth() {

  vibrate();


  if (!authModal) {
    return;
  }


  authModal.classList.add(
    "show"
  );


  clearAuthMessage();


  if (auth.currentUser) {

    showAccount(
      auth.currentUser
    );

  } else {

    showLogin();

  }

}



/* =========================
   FERMER
========================= */

function closeAuth() {

  if (!authModal) {
    return;
  }


  authModal.classList.remove(
    "show"
  );


  clearAuthMessage();

}



/* =========================
   AFFICHER LOGIN
========================= */

function showLogin() {

  clearAuthMessage();


  loginForm.classList.remove(
    "hidden"
  );


  registerForm.classList.add(
    "hidden"
  );


  accountForm.classList.add(
    "hidden"
  );

}



/* =========================
   AFFICHER INSCRIPTION
========================= */

function showRegister() {

  clearAuthMessage();


  loginForm.classList.add(
    "hidden"
  );


  registerForm.classList.remove(
    "hidden"
  );


  accountForm.classList.add(
    "hidden"
  );

}



/* =========================
   AFFICHER COMPTE
========================= */

function showAccount(
  user
) {

  loginForm.classList.add(
    "hidden"
  );


  registerForm.classList.add(
    "hidden"
  );


  accountForm.classList.remove(
    "hidden"
  );


  const accountName =
    document.getElementById(
      "account-name"
    );


  const accountEmail =
    document.getElementById(
      "account-email"
    );


  if (accountName) {

    accountName.textContent =
      user.displayName ||
      "Utilisateur";

  }


  if (accountEmail) {

    accountEmail.textContent =
      user.email ||
      "";

  }

}



/* =====================================================
   CONNEXION EMAIL
===================================================== */

async function loginWithEmail() {

  vibrate();


  const email =
    document.getElementById(
      "login-email"
    ).value.trim();


  const password =
    document.getElementById(
      "login-password"
    ).value;


  if (
    !email ||
    !password
  ) {

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


    showAuthMessage(
      "Connexion réussie."
    );


    setTimeout(
      () => {

        closeAuth();

      },
      700
    );


  } catch (error) {

    console.error(
      error
    );


    let message =
      "Impossible de se connecter.";


    if (
      error.code ===
      "auth/invalid-credential"
    ) {

      message =
        "Email ou mot de passe incorrect.";

    }


    if (
      error.code ===
      "auth/user-not-found"
    ) {

      message =
        "Aucun compte avec cet email.";

    }


    if (
      error.code ===
      "auth/wrong-password"
    ) {

      message =
        "Mot de passe incorrect.";

    }


    if (
      error.code ===
      "auth/invalid-email"
    ) {

      message =
        "Adresse email invalide.";

    }


    if (
      error.code ===
      "auth/operation-not-allowed"
    ) {

      message =
        "La connexion Email/Password n'est pas activée dans Firebase.";

    }


    showAuthMessage(
      message
    );

  }

}



/* =====================================================
   INSCRIPTION EMAIL
===================================================== */

async function registerWithEmail() {

  vibrate();


  const name =
    document.getElementById(
      "register-name"
    ).value.trim();


  const email =
    document.getElementById(
      "register-email"
    ).value.trim();


  const password =
    document.getElementById(
      "register-password"
    ).value;


  if (
    !name ||
    !email ||
    !password
  ) {

    showAuthMessage(
      "Remplis tous les champs."
    );

    return;

  }


  if (
    password.length < 6
  ) {

    showAuthMessage(
      "Le mot de passe doit contenir au moins 6 caractères."
    );

    return;

  }


  try {

    showAuthMessage(
      "Création du compte..."
    );


    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


    await updateProfile(
      result.user,
      {
        displayName: name
      }
    );


    showAuthMessage(
      "Compte créé avec succès."
    );


    setTimeout(
      () => {

        closeAuth();

      },
      700
    );


  } catch (error) {

    console.error(
      error
    );


    let message =
      "Impossible de créer le compte.";


    if (
      error.code ===
      "auth/email-already-in-use"
    ) {

      message =
        "Cette adresse email est déjà utilisée.";

    }


    if (
      error.code ===
      "auth/invalid-email"
    ) {

      message =
        "Adresse email invalide.";

    }


    if (
      error.code ===
      "auth/weak-password"
    ) {

      message =
        "Le mot de passe est trop faible.";

    }


    if (
      error.code ===
      "auth/operation-not-allowed"
    ) {

      message =
        "La connexion Email/Password n'est pas activée dans Firebase.";

    }


    showAuthMessage(
      message
    );

  }

}



/* =====================================================
   GOOGLE
===================================================== */

async function loginWithGoogle() {

  vibrate();


  try {

    showAuthMessage(
      "Connexion avec Google..."
    );


    await signInWithPopup(
      auth,
      googleProvider
    );


    showAuthMessage(
      "Connexion réussie."
    );


    setTimeout(
      () => {

        closeAuth();

      },
      700
    );


  } catch (error) {

    console.error(
      error
    );


    let message =
      "Impossible de se connecter avec Google.";


    if (
      error.code ===
      "auth/popup-closed-by-user"
    ) {

      message =
        "Connexion annulée.";

    }


    if (
      error.code ===
      "auth/popup-blocked"
    ) {

      message =
        "La fenêtre Google a été bloquée par le navigateur.";

    }


    if (
      error.code ===
      "auth/unauthorized-domain"
    ) {

      message =
        "Ce domaine n'est pas autorisé dans Firebase.";

    }


    if (
      error.code ===
      "auth/operation-not-allowed"
    ) {

      message =
        "La connexion Google n'est pas activée dans Firebase.";

    }


    showAuthMessage(
      message
    );

  }

}



/* =====================================================
   DÉCONNEXION
===================================================== */

async function logoutUser() {

  vibrate();


  try {

    await signOut(
      auth
    );


    showAuthMessage(
      "Déconnexion réussie."
    );


    showLogin();


  } catch (error) {

    console.error(
      error
    );


    showAuthMessage(
      "Erreur lors de la déconnexion."
    );

  }

}



/* =====================================================
   ÉTAT UTILISATEUR
===================================================== */

onAuthStateChanged(
  auth,
  user => {

    if (!authButton) {
      return;
    }


    if (user) {

      authButton.innerHTML =
        '<i class="fa-solid fa-user-check"></i>' +
        '<span>Mon compte</span>';


      authButton.classList.add(
        "connected"
      );


      if (
        authModal &&
        authModal.classList.contains(
          "show"
        )
      ) {

        showAccount(
          user
        );

      }


      console.log(
        "Utilisateur connecté :",
        user.email
      );


    } else {

      authButton.innerHTML =
        '<i class="fa-solid fa-user"></i>' +
        '<span>Connexion</span>';


      authButton.classList.remove(
        "connected"
      );

    }

  }
);



/* =====================================================
   BOUTONS AUTH
===================================================== */

if (authButton) {

  authButton.addEventListener(
    "click",
    openAuth
  );

}


if (authClose) {

  authClose.addEventListener(
    "click",
    closeAuth
  );

}


document
  .getElementById(
    "show-register"
  )
  ?.addEventListener(
    "click",
    showRegister
  );


document
  .getElementById(
    "show-login"
  )
  ?.addEventListener(
    "click",
    showLogin
  );


document
  .getElementById(
    "login-submit"
  )
  ?.addEventListener(
    "click",
    loginWithEmail
  );


document
  .getElementById(
    "register-submit"
  )
  ?.addEventListener(
    "click",
    registerWithEmail
  );


document
  .getElementById(
    "google-login"
  )
  ?.addEventListener(
    "click",
    loginWithGoogle
  );


document
  .getElementById(
    "google-register"
  )
  ?.addEventListener(
    "click",
    loginWithGoogle
  );


document
  .getElementById(
    "logout-button"
  )
  ?.addEventListener(
    "click",
    logoutUser
);



/* =====================================================
   FERMER MODAL EN DEHORS
===================================================== */

if (authModal) {

  authModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        authModal
      ) {

        closeAuth();

      }

    }
  );

}



/* =====================================================
   NOTIFICATIONS FIREBASE
===================================================== */

const FCM_VAPID_KEY =
  "BBrtZEQfPWxPIQBScNgttFUa7_34haM3leS2MbznWN2RCPP3fzSZHx6Qd1_LzbwjBpwLzerJxbQAhRBxk6ocHdk";


const NOTIFICATION_TOKEN_KEY =
  "mrGamingNotificationToken";


/* =========================
   NOTIFICATIONS
========================= */

async function enableNotifications() {

  const button =
    document.getElementById(
      "enable-notifications"
    );


  if (!button) {
    return;
  }


  if (
    !("Notification" in window)
  ) {

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

    button.disabled =
      true;


    button.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i>';


    const permission =
      await Notification.requestPermission();


    if (
      permission !==
      "granted"
    ) {

      alert(
        "Les notifications n'ont pas été autorisées."
      );


      button.disabled =
        false;


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
      getMessaging(
        firebaseApp
      );


    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );


    const token =
      await getToken(
        messaging,
        {
          vapidKey:
            FCM_VAPID_KEY,

          serviceWorkerRegistration:
            registration
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


    console.log(
      "FCM TOKEN :",
      token
    );


    button.classList.add(
      "enabled"
    );


    button.innerHTML =
      '<i class="fa-solid fa-bell"></i>';


    alert(
      "Notifications activées avec succès !"
    );


    onMessage(
      messaging,
      payload => {

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
      "Erreur : " +
      error.message
    );


    button.disabled =
      false;


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


    if (!button) {
      return;
    }


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
      Notification.permission ===
        "granted"
    ) {

      button.classList.add(
        "enabled"
      );

    }

  }
);



/* =====================================================
   FONCTIONS DISPONIBLES
===================================================== */

window.showPage =
  showPage;

win