/* =====================================================
   MR GAMING PRO — SCRIPT
===================================================== */


/* =====================================================
   CHARGEMENT
===================================================== */

window.addEventListener("load", () => {

  setTimeout(() => {

    const loader = document.getElementById("loader");

    if (loader) {
      loader.classList.add("hide");
    }

  }, 900);

});


/* =====================================================
   NAVIGATION ENTRE LES RUBRIQUES
   UNE SEULE PAGE VISIBLE À LA FOIS
===================================================== */

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

  history.replaceState(null, "", "#" + pageName);
}


/* =====================================================
   PAGE AU DÉMARRAGE
===================================================== */

function loadInitialPage() {

  const hash = window.location.hash.replace("#", "");

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

document.addEventListener("DOMContentLoaded", loadInitialPage);


/* =====================================================
   NOTIFICATIONS FIREBASE
===================================================== */

const FIREBASE_CONFIG = {

  apiKey:
    "AIzaSyBT7dEFq2FnyE1od-7ZReg6SwOlkMUbw0E",

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


/* =====================================================
   CHARGER FIREBASE SEULEMENT AU CLIC
===================================================== */

let firebaseStarted = false;


async function enableNotifications() {

  const button =
    document.getElementById("enable-notifications");

  if (!button) return;


  /* Navigateur compatible ? */

  if (!("Notification" in window)) {

    alert(
      "Les notifications ne sont pas prises en charge par ce navigateur."
    );

    return;
  }


  /* HTTPS obligatoire */

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


    /* Permission */

    const permission =
      await Notification.requestPermission();


    if (permission !== "granted") {

      alert(
        "Les notifications n'ont pas été autorisées."
      );

      button.disabled = false;

      button.innerHTML =
        '<i class="fa-solid fa-bell"></i><span class="notification-dot"></span>';

      return;
    }


    /* Import Firebase */

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
      initializeApp(FIREBASE_CONFIG);


    const messaging =
      getMessaging(app);


    /* Service Worker */

    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );


    /* Token FCM */

    const token =
      await getToken(messaging, {

        vapidKey: FCM_VAPID_KEY,

        serviceWorkerRegistration:
          registration

      });


    if (token) {

      localStorage.setItem(
        NOTIFICATION_TOKEN_KEY,
        token
      );

      console.log(
        "FCM TOKEN :",
        token
      );

      button.classList.add("enabled");

      button.innerHTML =
        '<i class="fa-solid fa-bell"></i>';

      alert(
        "Notifications activées avec succès !"
      );

    } else {

      throw new Error(
        "Impossible de récupérer le token FCM."
      );

    }


    /* Notifications lorsque le site est ouvert */

    onMessage(messaging, payload => {

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


      /* Notification locale si permission */

      if (Notification.permission === "granted") {

        new Notification(title, {

          body: body,

          icon:
            "https://i.ibb.co/Fq3Rn0N1/c536964c08ca2bee74c4a8b26f03926d.webp"

        });

      }

    });


    firebaseStarted = true;


  } catch (error) {

    console.error(
      "Erreur notifications :",
      error
    );

    alert(
      "Impossible d'activer les notifications. Vérifie que le fichier firebase-messaging-sw.js est bien à la racine du site."
    );


    button.disabled = false;

    button.innerHTML =
      '<i class="fa-solid fa-bell"></i><span class="notification-dot"></span>';

  }

}


/* =====================================================
   BOUTON NOTIFICATION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const button =
    document.getElementById("enable-notifications");

  if (!button) return;


  button.addEventListener(
    "click",
    enableNotifications
  );


  /* Déjà activées ? */

  const savedToken =
    localStorage.getItem(
      NOTIFICATION_TOKEN_KEY
    );


  if (
    savedToken &&
    Notification.permission === "granted"
  ) {

    button.classList.add("enabled");

  }

});