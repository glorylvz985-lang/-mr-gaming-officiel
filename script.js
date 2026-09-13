/* =====================================================
   MR GAMING PRO
   SCRIPT COMPLET
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


/* Tous les boutons */

document.addEventListener("click", (event) => {

  const button =
    event.target.closest("button, .social-card, .customer-service a");

  if (button) {
    vibrate();
  }

});


/* =========================
   NAVIGATION
========================= */

function showPage(pageName) {

  const pages =
    document.querySelectorAll(".page");

  const navItems =
    document.querySelectorAll(".nav-item");


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


/*
  On récupère la demande d'installation
  lorsqu'elle est proposée par Chrome.
*/

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


/*
  Installation lorsque Chrome accepte
  l'installation de l'application.
*/

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


/* =========================
   FIREBASE NOTIFICATIONS
========================= */

const FIREBASE_CONFIG = {

  apiKey:
    "AIzaSyBT7dEFq2FNyE1od-7ZReg6SwOlkMUbw0E",

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


const FCM_VAPID_KEY =
  "BBrtZEQfPWxPIQBScNgttFUa7_34haM3leS2MbznWN2RCPP3fzSZHx6Qd1_LzbwjBpwLzerJxbQAhRBxk6ocHdk";


const NOTIFICATION_TOKEN_KEY =
  "mrGamingNotificationToken";


let firebaseStarted = false;


/* =========================
   ACTIVER NOTIFICATIONS
========================= */

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


    const app =
      initializeApp(
        FIREBASE_CONFIG
      );


    const messaging =
      getMessaging(app);


    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );


    console.log(
      "Service Worker enregistré :",
      registration
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


    button.disabled = false;


    button.innerHTML =
      '<i class="fa-solid fa-bell"></i>' +
      '<span class="notification-dot"></span>';

  }

}


/* =========================
   INITIALISATION
========================= */

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