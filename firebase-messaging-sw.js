/* =====================================================
   MR GAMING PRO
   FIREBASE CLOUD MESSAGING SERVICE WORKER
===================================================== */

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js"
);


/* =====================================================
   FIREBASE
===================================================== */

firebase.initializeApp({

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
    "1:386284505924:web:ff47d077addeef77252511"

});


const messaging =
  firebase.messaging();


/* =====================================================
   NOTIFICATION EN ARRIÈRE-PLAN
===================================================== */

messaging.onBackgroundMessage(
  function(payload) {

    console.log(
      "[firebase-messaging-sw.js]",
      payload
    );


    const title =
      payload.notification?.title ||
      "MR GAMING PRO";


    const body =
      payload.notification?.body ||
      "Une nouvelle actualité est disponible !";


    const options = {

      body: body,

      icon:
        "https://i.ibb.co/Fq3Rn0N1/c536964c08ca2bee74c4a8b26f03926d.webp",

      badge:
        "https://i.ibb.co/Fq3Rn0N1/c536964c08ca2bee74c4a8b26f03926d.webp",

      vibrate: [
        200,
        100,
        200
      ],

      data: {
        url: "/"
      }

    };


    self.registration.showNotification(
      title,
      options
    );

  }
);


/* =====================================================
   CLIC SUR LA NOTIFICATION
===================================================== */

self.addEventListener(
  "notificationclick",
  function(event) {

    event.notification.close();


    const targetUrl =
      event.notification?.data?.url ||
      "/";


    event.waitUntil(

      clients.matchAll({
        type: "window",
        includeUncontrolled: true
      }).then(function(clientList) {

        for (const client of clientList) {

          if (
            "focus" in client
          ) {

            return client.focus();

          }

        }


        if (
          clients.openWindow
        ) {

          return clients.openWindow(
            targetUrl
          );

        }

      })

    );

  }
);