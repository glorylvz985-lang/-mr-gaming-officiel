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
   NAVIGATION
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
   FIREBASE
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
   NOTIFICATIONS
===================================================== */

async function enableNotifications() {

  const button =
    document.getElementById(
      "enable-notifications"
    );

  if (!button) return;


  /* Navigateur */

  if (!("Notification" in window)) {

    alert(
      "Ton navigateur ne prend pas en charge les notifications."
    );

    return;
  }


  /* HTTPS */

  if (
    location.protocol !== "https:" &&
    location.hostname !== "localhost"
  ) {

    alert(
      "Les notifications nécessitent HTTPS."
    );

    return;
  }


  try {

    button.disabled = true;

    button.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i>';


    /* ================================================
       PERMISSION
    ================================================ */

    let permission =
      Notification.permission;


    if (permission === "default") {

      permission =
        await Notification.requestPermission();

    }


    if (permission !== "granted") {

      throw new Error(
        "Permission refusée par le navigateur."
      );

    }


    /* ================================================
       SERVICE WORKER
    ================================================ */

    if (!("serviceWorker" in navigator)) {

      throw new Error(
        "Les Service Workers ne sont pas disponibles."
      );

    }


    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/"
        }
      );


    console.log(
      "Service Worker enregistré :",
      registration
    );


    await navigator.serviceWorker.ready;


    /* ================================================
       FIREBASE
    ================================================ */

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


    /* ================================================
       TOKEN FCM
    ================================================ */

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
        "Firebase n'a pas retourné de token FCM."
      );

    }


    /* ================================================
       SAUVEGARDE
    ================================================ */

    localStorage.setItem(
      NOTIFICATION_TOKEN_KEY,
      token
    );


    console.log(
      "================================"
    );

    console.log(
      "MR GAMING PRO — FCM TOKEN"
    );

    console.log(token);

    console.log(
      "================================"
    );


    /* ================================================
       SUCCÈS
    ================================================ */

    button.classList.add(
      "enabled"
    );

    button.disabled = false;

    button.innerHTML =
      '<i class="fa-solid fa-bell"></i>';


    alert(
      "Notifications activées avec succès !"
    );


    /* ================================================
       MESSAGE QUAND LE SITE EST OUVERT
    ================================================ */

    onMessage(
      messaging,
      function(payload) {

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
      "================================"
    );

    console.error(
      "MR GAMING PRO — ERREUR NOTIFICATION"
    );

    console.error(
      error
    );

    console.error(
      "================================"
    );


    button.disabled = false;

    button.innerHTML =
      '<i class="fa-solid fa-bell"></i>' +
      '<span class="notification-dot"></span>';


    /* AFFICHER LA VRAIE ERREUR */

    alert(
      "Erreur notifications :\n\n" +
      (error.message ||
       error.name ||
       String(error))
    );

  }

}


/* =====================================================
   BOUTON
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


    /* Vérification locale */

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