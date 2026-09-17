/* =====================================================
   MR GAMING PRO
   SCRIPT UNIVERSEEL — Web + APK (Android / iOS)
   Firebase COMPAT MODE (pas de modules ES6)
===================================================== */

(function () {
  "use strict";


  /* =====================================================
     LOADER (sécurité anti-blocage)
  ===================================================== */

  function hideLoader() {
    var loader = document.getElementById("loader");
    if (loader) loader.classList.add("hide");
  }

  window.addEventListener("load", function () {
    setTimeout(hideLoader, 1000);
  });

  setTimeout(hideLoader, 3000);


  /* =====================================================
     VIBRATION
  ===================================================== */

  function vibrate() {
    try {
      if ("vibrate" in navigator) navigator.vibrate(35);
    } catch (e) {}
  }

  document.addEventListener("click", function (event) {
    var element = event.target.closest("button, .social-card, .customer-service a");
    if (element) vibrate();
  });


  /* =====================================================
     NAVIGATION
  ===================================================== */

  function showPage(pageName) {

    var pages = document.querySelectorAll(".page");
    var navItems = document.querySelectorAll(".nav-item");

    pages.forEach(function (page) {
      page.classList.remove("active-page");
    });

    var selectedPage = document.getElementById("page-" + pageName);
    if (selectedPage) selectedPage.classList.add("active-page");

    navItems.forEach(function (item) {
      item.classList.remove("active");
      if (item.dataset.page === pageName) item.classList.add("active");
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      history.replaceState(null, "", "#" + pageName);
    } catch (e) {}
  }


  function loadInitialPage() {

    var hash = window.location.hash.replace("#", "");

    var allowedPages = [
      "accueil",
      "services",
      "evenements",
      "plateformes",
      "reseaux"
    ];

    if (allowedPages.indexOf(hash) !== -1) {
      showPage(hash);
    } else {
      showPage("accueil");
    }
  }


  document.addEventListener("DOMContentLoaded", function () {

    loadInitialPage();

    document.querySelectorAll(".nav-item").forEach(function (item) {
      item.addEventListener("click", function () {
        showPage(item.dataset.page);
      });
    });

  });


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

  var deferredPrompt = null;

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    console.log("Installation disponible.");
  });

  function installApp() {
    if (!deferredPrompt) {
      alert("Utilise « Installer l'application » dans ton navigateur.");
      return;
    }
    deferredPrompt.prompt();
    deferredPrompt = null;
  }

  window.addEventListener("appinstalled", function () {
    console.log("MR GAMING PRO installé.");
    deferredPrompt = null;
  });


  /* =====================================================
     ÉLÉMENTS AUTH
  ===================================================== */

  var authModal = document.getElementById("auth-modal");
  var authButton = document.getElementById("auth-button");
  var authClose = document.getElementById("auth-close");

  var loginForm = document.getElementById("login-form");
  var registerForm = document.getElementById("register-form");
  var accountForm = document.getElementById("account-form");

  var authMessage = document.getElementById("auth-message");


  /* =====================================================
     MESSAGES
  ===================================================== */

  function showAuthMessage(message) {
    if (!authMessage) return;
    authMessage.textContent = message || "";
  }

  function clearAuthMessage() {
    if (!authMessage) return;
    authMessage.textContent = "";
  }


  /* =====================================================
     VUES INTERNES
  ===================================================== */

  function showLogin() {
    clearAuthMessage();
    if (loginForm) loginForm.classList.remove("hidden");
    if (registerForm) registerForm.classList.add("hidden");
    if (accountForm) accountForm.classList.add("hidden");
  }

  function showRegister() {
    clearAuthMessage();
    if (loginForm) loginForm.classList.add("hidden");
    if (registerForm) registerForm.classList.remove("hidden");
    if (accountForm) accountForm.classList.add("hidden");
  }

  function showAccount(user) {

    if (loginForm) loginForm.classList.add("hidden");
    if (registerForm) registerForm.classList.add("hidden");
    if (accountForm) accountForm.classList.remove("hidden");

    var accountName = document.getElementById("account-name");
    var accountEmail = document.getElementById("account-email");

    if (accountName) {
      accountName.textContent = (user && user.displayName) || "Utilisateur";
    }
    if (accountEmail) {
      accountEmail.textContent = (user && user.email) || "";
    }
  }


  /* =====================================================
     OUVRIR / FERMER MODALE
  ===================================================== */

  function openAuth() {

    vibrate();

    if (!authModal) return;

    authModal.classList.add("show");
    clearAuthMessage();

    if (window.__auth && window.__auth.currentUser) {
      showAccount(window.__auth.currentUser);
    } else {
      showLogin();
    }
  }

  function closeAuth() {
    if (!authModal) return;
    authModal.classList.remove("show");
    clearAuthMessage();
  }


  /* =====================================================
     CONNEXION EMAIL
  ===================================================== */

  function loginWithEmail() {

    vibrate();

    var email = document.getElementById("login-email");
    var password = document.getElementById("login-password");

    if (!window.__auth) {
      showAuthMessage("Authentification indisponible. Vérifie ta connexion.");
      return;
    }

    if (!email || !password || !email.value.trim() || !password.value) {
      showAuthMessage("Remplis tous les champs.");
      return;
    }

    showAuthMessage("Connexion en cours...");

    window.__auth.signInWithEmailAndPassword(email.value.trim(), password.value)
      .then(function () {
        showAuthMessage("Connexion réussie.");
        setTimeout(closeAuth, 700);
      })
      .catch(function (error) {
        console.error(error);
        var message = "Impossible de se connecter.";
        if (error.code === "auth/invalid-credential") message = "Email ou mot de passe incorrect.";
        else if (error.code === "auth/user-not-found") message = "Aucun compte avec cet email.";
        else if (error.code === "auth/wrong-password") message = "Mot de passe incorrect.";
        else if (error.code === "auth/invalid-email") message = "Adresse email invalide.";
        else if (error.code === "auth/operation-not-allowed") message = "Connexion Email/Password non activée.";
        else if (error.code === "auth/network-request-failed") message = "Problème de connexion internet.";
        showAuthMessage(message);
      });
  }


  /* =====================================================
     INSCRIPTION EMAIL
  ===================================================== */

  function registerWithEmail() {

    vibrate();

    var name = document.getElementById("register-name");
    var email = document.getElementById("register-email");
    var password = document.getElementById("register-password");

    if (!window.__auth) {
      showAuthMessage("Authentification indisponible.");
      return;
    }

    if (!name || !email || !password ||
        !name.value.trim() || !email.value.trim() || !password.value) {
      showAuthMessage("Remplis tous les champs.");
      return;
    }

    if (password.value.length < 6) {
      showAuthMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    showAuthMessage("Création du compte...");

    window.__auth.createUserWithEmailAndPassword(email.value.trim(), password.value)
      .then(function (result) {
        if (result.user && result.user.updateProfile) {
          return result.user.updateProfile({ displayName: name.value.trim() });
        }
      })
      .then(function () {
        showAuthMessage("Compte créé avec succès.");
        setTimeout(closeAuth, 700);
      })
      .catch(function (error) {
        console.error(error);
        var message = "Impossible de créer le compte.";
        if (error.code === "auth/email-already-in-use") message = "Cette adresse email est déjà utilisée.";
        else if (error.code === "auth/invalid-email") message = "Adresse email invalide.";
        else if (error.code === "auth/weak-password") message = "Mot de passe trop faible.";
        else if (error.code === "auth/operation-not-allowed") message = "Connexion Email/Password non activée.";
        else if (error.code === "auth/network-request-failed") message = "Problème de connexion internet.";
        showAuthMessage(message);
      });
  }


  /* =====================================================
     GOOGLE — 2 méthodes (Popup Web + Redirect APK)
  ===================================================== */

  function loginWithGoogle() {

    vibrate();

    if (!window.__auth || !window.__googleProvider) {
      showAuthMessage("Google indisponible.");
      return;
    }

    showAuthMessage("Connexion avec Google...");

    var isWebView = /wv|Android.*Version\/[\d.]+.*Chrome/i.test(navigator.userAgent) ||
                    (window.navigator.standalone !== undefined) ||
                    /FBAN|FBAV|Instagram|Line|WhatsApp/i.test(navigator.userAgent);

    // WebView / APK → redirect
    // Navigateur normal → popup
    if (isWebView) {

      window.__auth.signInWithRedirect(window.__googleProvider)
        .catch(function (error) {
          console.error(error);
          showAuthMessage("Impossible de se connecter avec Google.");
        });

    } else {

      window.__auth.signInWithPopup(window.__googleProvider)
        .then(function () {
          showAuthMessage("Connexion réussie.");
          setTimeout(closeAuth, 700);
        })
        .catch(function (error) {
          console.error(error);

          var message = "Impossible de se connecter avec Google.";

          if (error.code === "auth/popup-closed-by-user") return;
          if (error.code === "auth/popup-blocked") {
            // Fallback redirect si popup bloquée
            window.__auth.signInWithRedirect(window.__googleProvider);
            return;
          }
          if (error.code === "auth/unauthorized-domain") message = "Domaine non autorisé dans Firebase.";
          if (error.code === "auth/operation-not-allowed") message = "Connexion Google non activée.";

          showAuthMessage(message);
        });
    }
  }


  /* =====================================================
     DÉCONNEXION
  ===================================================== */

  function logoutUser() {

    vibrate();

    if (!window.__auth) {
      closeAuth();
      return;
    }

    window.__auth.signOut()
      .then(function () {
        showAuthMessage("Déconnexion réussie.");
        showLogin();
      })
      .catch(function (error) {
        console.error(error);
        showAuthMessage("Erreur lors de la déconnexion.");
      });
  }


  /* =====================================================
     BOUTONS UI
  ===================================================== */

  if (authButton) authButton.addEventListener("click", openAuth);
  if (authClose) authClose.addEventListener("click", closeAuth);

  var showRegBtn = document.getElementById("show-register");
  var showLogBtn = document.getElementById("show-login");
  var loginSubBtn = document.getElementById("login-submit");
  var regSubBtn = document.getElementById("register-submit");
  var googleLoginBtn = document.getElementById("google-login");
  var googleRegBtn = document.getElementById("google-register");
  var logoutBtn = document.getElementById("logout-button");

  if (showRegBtn) showRegBtn.addEventListener("click", showRegister);
  if (showLogBtn) showLogBtn.addEventListener("click", showLogin);
  if (loginSubBtn) loginSubBtn.addEventListener("click", loginWithEmail);
  if (regSubBtn) regSubBtn.addEventListener("click", registerWithEmail);
  if (googleLoginBtn) googleLoginBtn.addEventListener("click", loginWithGoogle);
  if (googleRegBtn) googleRegBtn.addEventListener("click", loginWithGoogle);
  if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);

  if (authModal) {
    authModal.addEventListener("click", function (event) {
      if (event.target === authModal) closeAuth();
    });
  }


  /* =====================================================
     CHARGEMENT DYNAMIQUE FIREBASE (COMPAT MODE)
     Compatible WebView Android / iOS / Web
  ===================================================== */

  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyBT7dBeqf2NyE1od-7ZREg6SwOlkMUbw0E",
    authDomain: "globoost.firebaseapp.com",
    projectId: "globoost",
    storageBucket: "globoost.firebasestorage.app",
    messagingSenderId: "386284505924",
    appId: "1:386284505924:web:ff47d077addeef77252511",
    measurementId: "G-4BC7Q37JH1"
  };


  function loadScript(src, onLoad, onError) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = onLoad;
    s.onerror = onError || function () {
      console.warn("Impossible de charger :", src);
    };
    document.head.appendChild(s);
  }


  function initFirebase() {

    try {

      window.__firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
      window.__auth = firebase.auth();
      window.__googleProvider = new firebase.auth.GoogleAuthProvider();

      /* Email link nécessite parfois ça */
      window.__auth.useDeviceLanguage();

      /* Gérer la redirection Google après retour (APK) */
      window.__auth.getRedirectResult()
        .then(function (result) {
          if (result && result.user) {
            console.log("Connexion Google réussie :", result.user.email);
          }
        })
        .catch(function (error) {
          console.error("Erreur redirect Google :", error);
        });

      /* État utilisateur */
      window.__auth.onAuthStateChanged(function (user) {

        if (!authButton) return;

        if (user) {

          authButton.innerHTML =
            '<i class="fa-solid fa-user-check"></i>' +
            '<span>Mon compte</span>';

          authButton.classList.add("connected");

          if (authModal && authModal.classList.contains("show")) {
            showAccount(user);
          }

          console.log("Utilisateur connecté :", user.email);

        } else {

          authButton.innerHTML =
            '<i class="fa-solid fa-user"></i>' +
            '<span>Connexion</span>';

          authButton.classList.remove("connected");
        }
      });

      console.log("✅ Firebase prêt.");

    } catch (err) {
      console.error("Erreur Firebase :", err);
    }
  }


  /* Charger Firebase compat (v9 — compatible WebView) */
  loadScript(
    "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
    function () {
      loadScript(
        "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js",
        initFirebase
      );
    }
  );


  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  var NOTIFICATION_TOKEN_KEY = "mrGamingNotificationToken";

  function enableNotifications() {

    var button = document.getElementById("enable-notifications");
    if (!button) return;

    if (!("Notification" in window)) {
      alert("Notifications non prises en charge.");
      return;
    }

    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      alert("Les notifications nécessitent HTTPS.");
      return;
    }

    button.disabled = true;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    Notification.requestPermission()
      .then(function (permission) {

        if (permission !== "granted") {
          alert("Notifications non autorisées.");
          button.disabled = false;
          button.innerHTML = '<i class="fa-solid fa-bell"></i><span class="notification-dot"></span>';
          return;
        }

        alert("Notifications activées avec succès !");
        button.classList.add("enabled");
        button.innerHTML = '<i class="fa-solid fa-bell"></i>';

        try {
          localStorage.setItem(NOTIFICATION_TOKEN_KEY, "granted");
        } catch (e) {}

      })
      .catch(function (error) {
        console.error(error);
        button.disabled = false;
        button.innerHTML = '<i class="fa-solid fa-bell"></i><span class="notification-dot"></span>';
      });
  }


  document.addEventListener("DOMContentLoaded", function () {

    var button = document.getElementById("enable-notifications");
    if (!button) return;

    button.addEventListener("click", enableNotifications);

    try {
      var savedToken = localStorage.getItem(NOTIFICATION_TOKEN_KEY);
      if (savedToken && "Notification" in window && Notification.permission === "granted") {
        button.classList.add("enabled");
      }
    } catch (e) {}

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

})();