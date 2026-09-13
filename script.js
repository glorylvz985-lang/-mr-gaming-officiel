/* =========================================================
   MR GAMING PRO
   SCRIPT PRINCIPAL + NOTIFICATIONS
========================================================= */

const LOGO_URL =
"https://i.ibb.co/Fq3Rn0N1/c536964c08ca2bee74c4a8b26f03926d.webp";


/* =========================================================
   VIBRATION
========================================================= */

function vibrate(pattern = 20) {

    try {

        if (
            "vibrate" in navigator &&
            typeof navigator.vibrate === "function"
        ) {

            navigator.vibrate(pattern);

        }

    } catch (error) {}

}


/* =========================================================
   LOADING
========================================================= */

let loadingHidden = false;


function hideLoading() {

    if (loadingHidden) return;

    const loadingScreen =
        document.getElementById(
            "loading-screen"
        );

    if (!loadingScreen) return;

    loadingHidden = true;

    loadingScreen.classList.add("hide");

    setTimeout(() => {

        try {
            loadingScreen.remove();
        } catch (error) {}

    }, 750);

}


window.addEventListener(
    "load",
    () => {

        setTimeout(
            hideLoading,
            700
        );

    }
);


setTimeout(
    hideLoading,
    4000
);


/* =========================================================
   LOGOS
========================================================= */

function setupLogoFallback() {

    const loadingLogo =
        document.getElementById(
            "loading-logo"
        );

    const loadingFallback =
        document.getElementById(
            "loading-fallback"
        );


    if (loadingLogo) {

        loadingLogo.addEventListener(
            "error",
            () => {

                loadingLogo.style.display =
                    "none";

                if (loadingFallback) {

                    loadingFallback.style.display =
                        "grid";

                }

            }
        );

    }


    const brandLogo =
        document.getElementById(
            "brand-logo"
        );

    const brandFallback =
        document.getElementById(
            "brand-fallback"
        );


    if (brandLogo) {

        brandLogo.addEventListener(
            "error",
            () => {

                brandLogo.style.display =
                    "none";

                if (brandFallback) {

                    brandFallback.style.display =
                        "grid";

                }

            }
        );

    }

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );

    const sections =
        document.querySelectorAll(
            ".page-section"
        );


    function showSection(id) {

        let found = false;


        sections.forEach(section => {

            if (section.id === id) {

                section.classList.add(
                    "active-section"
                );

                found = true;

            } else {

                section.classList.remove(
                    "active-section"
                );

            }

        });


        if (!found) {

            id = "accueil";

            sections.forEach(section => {

                section.classList.toggle(
                    "active-section",
                    section.id === "accueil"
                );

            });

        }


        navItems.forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.section === id
            );

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    window.showPage =
        showSection;


    navItems.forEach(item => {

        item.addEventListener(
            "click",
            event => {

                event.preventDefault();

                vibrate(18);

                const section =
                    item.dataset.section;

                showSection(section);

                history.replaceState(
                    null,
                    "",
                    "#" + section
                );

            }
        );

    });


    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const target =
                        link.getAttribute(
                            "href"
                        );

                    if (!target) return;

                    const id =
                        target.substring(1);

                    const section =
                        document.getElementById(
                            id
                        );

                    if (!section) return;


                    event.preventDefault();

                    vibrate(18);

                    showSection(id);

                    history.replaceState(
                        null,
                        "",
                        "#" + id
                    );

                }
            );

        });


    const hash =
        window.location.hash
            .replace("#", "")
            .trim();


    const allowed = [
        "accueil",
        "services",
        "evenements",
        "plateformes",
        "reseaux"
    ];


    if (allowed.includes(hash)) {

        showSection(hash);

    } else {

        showSection("accueil");

    }

}


/* =========================================================
   MESSAGE ÉVÉNEMENT
========================================================= */

window.showEventMessage =
function(eventName) {

    vibrate([
        20,
        40,
        20
    ]);

    alert(
        eventName +
        "\n\nLes informations de cet événement seront bientôt disponibles sur MR GAMING PRO."
    );

};


/* =========================================================
   FIREBASE
========================================================= */

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


const VAPID_KEY =
"BBrtZEQfPWxPIQBScNgttFUa7_34haM3leS2MbznWN2RCPP3fzSZHx6Qd1_LzbwjBpwLzerJxbQAhRBxk6ocHdk";


const NOTIFICATION_TOKEN_KEY =
"mrGamingNotificationToken";


let firebaseApp = null;

let messaging = null;

let notificationLoading = false;

let foregroundListenerStarted = false;


/* =========================================================
   BOUTON NOTIFICATION
========================================================= */

function getNotificationButton() {

    return document.getElementById(
        "enable-notifications"
    );

}


function setNotificationActive(active) {

    const button =
        getNotificationButton();

    if (!button) return;


    button.classList.toggle(
        "active",
        active
    );


    if (active) {

        button.title =
            "Notifications activées";

        button.setAttribute(
            "aria-label",
            "Notifications activées"
        );

    } else {

        button.title =
            "Activer les notifications";

        button.setAttribute(
            "aria-label",
            "Activer les notifications"
        );

    }

}


/* =========================================================
   FIREBASE NOTIFICATIONS
========================================================= */

async function enableNotifications() {

    const button =
        getNotificationButton();


    if (!button) return;


    if (notificationLoading) return;


    vibrate([
        20,
        50,
        20
    ]);


    /* Vérification navigateur */

    if (!("Notification" in window)) {

        alert(
            "Les notifications ne sont pas prises en charge par ce navigateur."
        );

        return;

    }


    if (!("serviceWorker" in navigator)) {

        alert(
            "Les Service Workers ne sont pas disponibles dans ce navigateur."
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


    notificationLoading = true;


    const oldHTML =
        button.innerHTML;


    try {

        button.disabled = true;

        button.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i>';


        /* =================================================
           PERMISSION
        ================================================= */

        let permission =
            Notification.permission;


        if (permission === "default") {

            permission =
                await Notification.requestPermission();

        }


        if (permission !== "granted") {

            if (permission === "denied") {

                alert(
                    "Les notifications sont bloquées. Autorise-les dans les paramètres de Chrome pour ce site."
                );

            }


            button.disabled = false;

            button.innerHTML =
                oldHTML;

            notificationLoading = false;

            return;

        }


        /* =================================================
           SERVICE WORKER
        ================================================= */

        const registration =
            await navigator.serviceWorker.register(
                "/firebase-messaging-sw.js",
                {
                    scope: "/"
                }
            );


        await navigator.serviceWorker.ready;


        console.log(
            "Service Worker Firebase prêt."
        );


        /* =================================================
           CHARGEMENT FIREBASE
        ================================================= */

        const firebaseModule =
            await import(
                "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"
            );


        const messagingModule =
            await import(
                "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging.js"
            );


        /* Vérification */

        if (
            typeof messagingModule.isSupported ===
            "function"
        ) {

            const supported =
                await messagingModule.isSupported();


            if (!supported) {

                throw new Error(
                    "Firebase Messaging n'est pas compatible avec ce navigateur."
                );

            }

        }


        /* =================================================
           INITIALISATION
        ================================================= */

        if (!firebaseApp) {

            firebaseApp =
                firebaseModule.initializeApp(
                    FIREBASE_CONFIG
                );

        }


        if (!messaging) {

            messaging =
                messagingModule.getMessaging(
                    firebaseApp
                );

        }


        /* =================================================
           TOKEN
        ================================================= */

        const token =
            await messagingModule.getToken(
                messaging,
                {
                    vapidKey:
                        VAPID_KEY,

                    serviceWorkerRegistration:
                        registration
                }
            );


        if (!token) {

            throw new Error(
                "Firebase n'a pas généré de token."
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


        /* =================================================
           MESSAGE AU PREMIER PLAN
        ================================================= */

        if (!foregroundListenerStarted) {

            messagingModule.onMessage(
                messaging,
                async payload => {

                    console.log(
                        "Notification reçue :",
                        payload
                    );


                    const title =
                        payload?.notification?.title ||
                        "MR GAMING PRO";


                    const body =
                        payload?.notification?.body ||
                        "Une nouvelle actualité est disponible !";


                    try {

                        const currentRegistration =
                            await navigator.serviceWorker.ready;


                        await currentRegistration.showNotification(
                            title,
                            {
                                body: body,

                                icon: LOGO_URL,

                                badge: LOGO_URL,

                                vibrate: [
                                    200,
                                    100,
                                    200
                                ],

                                data: {
                                    url:
                                        window.location.origin
                                }

                            }
                        );

                    } catch (error) {

                        console.error(
                            "Erreur notification :",
                            error
                        );

                    }

                }
            );


            foregroundListenerStarted = true;

        }


        /* =================================================
           SUCCÈS
        ================================================= */

        setNotificationActive(true);


        button.disabled = false;

        button.innerHTML =
            '<i class="fa-solid fa-bell"></i>';


        notificationLoading = false;


        /* Notification de confirmation */

        try {

            await registration.showNotification(
                "MR GAMING PRO",
                {
                    body:
                        "Les notifications sont maintenant activées !",

                    icon:
                        LOGO_URL,

                    badge:
                        LOGO_URL,

                    vibrate: [
                        200,
                        100,
                        200
                    ],

                    data: {
                        url:
                            window.location.origin
                    }

                }
            );

        } catch (error) {

            console.warn(
                "Notification locale impossible :",
                error
            );

        }


    } catch (error) {

        console.error(
            "Erreur Firebase Notifications :",
            error
        );


        button.disabled = false;

        button.innerHTML =
            oldHTML;


        notificationLoading = false;


        /*
         * IMPORTANT :
         * On affiche la vraie erreur.
         */

        alert(
            "Erreur des notifications :\n\n" +
            (
                error &&
                error.message
                ?
                error.message
                :
                String(error)
            )
        );

    }

}


/* =========================================================
   ÉTAT INITIAL
========================================================= */

function setupNotificationButton() {

    const button =
        getNotificationButton();


    if (!button) return;


    button.addEventListener(
        "click",
        enableNotifications
    );


    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        setNotificationActive(true);

    }

}


/* =========================================================
   DÉMARRAGE
========================================================= */

function initializeSite() {

    try {
        setupLogoFallback();
    } catch (error) {
        console.error(
            "Erreur logos :",
            error
        );
    }


    try {
        setupNavigation();
    } catch (error) {
        console.error(
            "Erreur navigation :",
            error
        );
    }


    try {
        setupNotificationButton();
    } catch (error) {
        console.error(
            "Erreur notifications :",
            error
        );
    }


    /* Vibration globale */

    try {

        document
            .querySelectorAll(
                "button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => vibrate(18)
                );

            });

    } catch (error) {}


    /* Protection horizontale */

    try {

        document.documentElement.style.maxWidth =
            "100%";

        document.body.style.maxWidth =
            "100%";

        document.body.style.overflowX =
            "hidden";

    } catch (error) {}


    console.log(
        "%c MR GAMING PRO ",
        "background:#ff008c;color:white;padding:8px;border-radius:8px;font-weight:bold;"
    );

    console.log(
        "Plateforme Gaming chargée avec succès."
    );

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSite
    );

} else {

    initializeSite();

}