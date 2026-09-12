/* =========================================================
   MR GAMING PRO — FIREBASE MESSAGING SERVICE WORKER
   ========================================================= */

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js"
);

/* Firebase */
firebase.initializeApp({
  apiKey: "AIzaSyBT7dEFq2FnyE1od-7ZReg6SwOlkMUbw0E",
  authDomain: "globoost.firebaseapp.com",
  projectId: "globoost",
  storageBucket: "globoost.firebasestorage.app",
  messagingSenderId: "386284505924",
  appId: "1:386284505924:web:ff47d077addeef77252511"
});

const messaging = firebase.messaging();

/* =========================================================
   NOTIFICATIONS EN ARRIÈRE-PLAN
   ========================================================= */

messaging.onBackgroundMessage(function (payload) {

  console.log("[MR GAMING PRO] Notification reçue :", payload);

  const notification = payload.notification || {};

  const title =
    notification.title ||
    payload.data?.title ||
    "MR GAMING PRO";

  const body =
    notification.body ||
    payload.data?.body ||
    "Une nouvelle actualité est disponible !";

  const url =
    payload.data?.url ||
    "https://mr-gaming-pro-alpha.vercel.app/";

  const options = {
    body: body,

    icon:
      "https://i.ibb.co/Fq3Rn0N1/c536964c08ca2bee74c4a8b26f03926d.webp",

    badge:
      "https://i.ibb.co/Fq3Rn0N1/c536964c08ca2bee74c4a8b26f03926d.webp",

    vibrate: [200, 100, 200],

    data: {
      url: url
    },

    tag: "mr-gaming-pro-notification",

    renotify: true
  };

  return self.registration.showNotification(title, options);
});

/* =========================================================
   CLIC SUR UNE NOTIFICATION
   ========================================================= */

self.addEventListener("notificationclick", function (event) {

  event.notification.close();

  const targetUrl =
    event.notification?.data?.url ||
    "https://mr-gaming-pro-alpha.vercel.app/";

  event.waitUntil(

    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    })

    .then(function (clientList) {

      /* Si le site est déjà ouvert */
      for (const client of clientList) {

        if ("focus" in client) {

          client.navigate(targetUrl);

          return client.focus();
        }
      }

      /* Sinon ouvrir le site */
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }

    })

  );

});

/* =========================================================
   INSTALLATION
   ========================================================= */

self.addEventListener("install", function () {

  console.log(
    "[MR GAMING PRO] Service Worker installé."
  );

  self.skipWaiting();

});

/* =========================================================
   ACTIVATION
   ========================================================= */

self.addEventListener("activate", function (event) {

  console.log(
    "[MR GAMING PRO] Service Worker activé."
  );

  event.waitUntil(
    self.clients.claim()
  );

});