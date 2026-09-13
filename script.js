/* =====================================================
   MR GAMING PRO — SCRIPT COMPLET
===================================================== */


/* =========================
   CHARGEMENT
========================= */

window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");

    if (loader) {
      loader.classList.add("hide");
    }
  }, 1000);
});


/* =========================
   VIBRATION
========================= */

function vibrate() {
  if ("vibrate" in navigator) {
    navigator.vibrate(35);
  }
}


document.addEventListener("click", (event) => {
  const element = event.target.closest(
    "button, .social-card, .customer-service a"
  );

  if (element) {
    vibrate();
  }
});


/* =========================
   NAVIGATION
========================= */

function showPage(pageName) {

  const pages = document.querySelectorAll(".page");
  const navItems = document.querySelectorAll(".nav-item");

  pages.forEach(page => {
    page.classList.remove("active-page");
  });

  const selectedPage =
    document.getElementById("page-" + pageName);

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


/* =========================
   PAGE DE DÉPART
========================= */

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


/* =========================
   ÉVÉNEMENT FC MOBILE
========================= */

function openEvent() {

  vibrate();

  alert(
    "FC Mobile — Numéro Légendaire\n\n" +
    "L'événement est disponible sur MR GAMING PRO."
  );
}


/* =========================
   INSTALLATION WEB APP
========================= */

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
   FIREBASE CLOUD MESSAGING
   CONFIGURATION FIREBASE MISE À JOUR
===================================================== */

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
    "1:386284505924:web:00ebb826dc8fc60d252511",

  measurementId:
    "G-B3KKJGWGN6"
};


/* =========================
   CLÉ VAPID
========================= */

const FCM_VAPID_KEY =
  "BBrtZEQfPWxPIQBScNgttFUa7_34haM3leS2MbznWN2RCPP3fzSZHx6Qd1_LzbwjBpwLzerJxbQAhRBxk6ocHdk";


/* =========================
   TOKEN
========================= */

const NOTIFICATION_TOKEN_KEY =
  "mrGamingNotificationToken";

let firebaseStarted = false;


/* =====================================================
   ACTIVER LES NOTIFICATIONS
===================================================== */

async function enableNotifications() {

  const button =
    document.getElementById(
      "enable-notifications"
    );

  if (!button) return;


  /* Vérification navigateur */

  if (!("Notification" in window)) {

    alert(
      "Les notifications ne sont pas prises en charge par ce navigateur."
    );

    return;
  }


  /* Vérification HTTPS */

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


    /* =========================
       PERMISSION
    ========================= */

    let permission =
      Notification.permission;


    if (permission !== "granted") {

      permission =
        await Notification.requestPermission();
    }


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


    /* =========================
       FIREBASE
    ========================= */

    const {
      initializeApp
    } = await import(
      "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"
    );


    const {
      getMessaging,
      getToken,
      onMessage
    } = await import(
      "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging.js"
    );


    /* Initialisation Firebase */

    const app =
      initializeApp(
        FIREBASE_CONFIG
      );


    /* Messaging */

    const messaging =
      getMessaging(app);


    /* =========================
       SERVICE WORKER
    ========================= */

    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/"
        }
      );


    console.log(
      "Firebase Service Worker enregistré :",
      registration
    );


    /* Attendre que le SW soit prêt */

    await navigator.serviceWorker.ready;


    /* =========================
       TOKEN FCM
    ========================= */

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
        "Firebase n'a pas retourné de token."
      );
    }


    /* Sauvegarde du token */

    localStorage.setItem(
      NOTIFICATION_TOKEN_KEY,
      token
    );


    console.log(
      "FCM TOKEN :",
      token
    );


    /* =========================
       INTERFACE ACTIVÉE
    ========================= */

    button.classList.add(
      "enabled"
    );

    button.disabled = false;

    button.innerHTML =
      '<i class="fa-solid fa-bell"></i>';


    alert(
      "Notifications activées avec succès !"
    );


    firebaseStarted = true;


    /* =========================
       NOTIFICATIONS AU PREMIER PLAN
    ========================= */

    onMessage(
      messaging,
      (payload) => {

        console.log(
          "Notification reçue :",
          payload
        );


        const title =
          payload.notification?.title ||
          payload.data?.title ||
          "MR GAMING PRO";


        const body =
          payload.notification?.body ||
          payload.data?.body ||
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
                "https://i.ibb.co/Fq3Rn0N1/c536964c08ca2bee74c4a8b26f03926d.webp",

              badge:
                "https://i.ibb.co/Fq3Rn0N1/c536964c08ca2bee74c4a8b26f03926d.webp",

              vibrate: [
                200,
                100,
                200
              ]
            }
          );
        }

      }
    );


  } catch (error) {

    console.error(
      "ERREUR FIREBASE NOTIFICATIONS :",
      error
    );


    button.disabled = false;

    button.innerHTML =
      '<i class="fa-solid fa-bell"></i>' +
      '<span class="notification-dot"></span>';


    let message =
      error?.message ||
      "Erreur inconnue";


    if (
      error?.code ===
      "messaging/permission-blocked"
    ) {

      message =
        "Les notifications sont bloquées pour ce site dans Chrome.";

    }


    if (
      error?.code ===
      "messaging/unsupported-browser"
    ) {

      message =
        "Ce navigateur ne prend pas en charge les notifications Firebase.";

    }


    if (
      error?.code ===
      "messaging/invalid-vapid-key"
    ) {

      message =
        "La clé VAPID Firebase est incorrecte.";

    }


    if (
      error?.code ===
      "messaging/failed-service-worker-registration"
    ) {

      message =
        "Le Service Worker Firebase ne peut pas être enregistré.";

    }


    if (
      error?.code ===
      "messaging/token-subscribe-failed"
    ) {

      message =
        "Firebase n'arrive pas à créer l'abonnement aux notifications.";

    }


    alert(
      "Impossible d'activer les notifications.\n\n" +
      "Erreur : " +
      message
    );
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


    /* =========================
       TOKEN DÉJÀ SAUVEGARDÉ
    ========================= */

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

      button.innerHTML =
        '<i class="fa-solid fa-bell"></i>';
    }

  }
);


/* =====================================================
   FIN MR GAMING PRO
===================================================== */