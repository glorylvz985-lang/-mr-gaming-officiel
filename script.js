/* =====================================================
   MR GAMING PRO — SCRIPT COMPLET
   Compatible WEB + APK (WebView Android)
   NON-module (pas de "type=module")
===================================================== */

(function () {
  "use strict";

  /* =====================================================
     CHARGEMENT IMMÉDIAT DU LOADER
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
    var button = event.target.closest(
      "button, .social-card, .customer-service a"
    );
    if (button) vibrate();
  });


  /* =====================================================
     NAVIGATION
  ===================================================== */

  var allowedPages = [
    "accueil",
    "services",
    "evenements",
    "plateformes",
    "reseaux",
    "compte"
  ];

  function showPage(pageName) {

    document.querySelectorAll(".page").forEach(function (p) {
      p.classList.remove("active-page");
    });

    document.querySelectorAll(".nav-item").forEach(function (n) {
      n.classList.remove("active");
    });

    var page = document.getElementById("page-" + pageName);
    if (page) page.classList.add("active-page");

    document.querySelectorAll(".nav-item").forEach(function (item) {
      if (item.dataset.page === pageName) item.classList.add("active");
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      history.replaceState(null, "", "#" + pageName);
    } catch (e) {}
  }

  function loadInitialPage() {
    var hash = window.location.hash.replace("#", "");
    showPage(allowedPages.indexOf(hash) !== -1 ? hash : "accueil");
  }

  document.addEventListener("DOMContentLoaded", loadInitialPage);


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

  var deferredPrompt = null;

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
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
    deferredPrompt = null;
  });


  /* =====================================================
     FIREBASE — CHARGEMENT DYNAMIQUE
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

  var auth = null;
  var googleProvider = null;
  var firebaseApp = null;

  /* Éléments DOM */
  var authModal = document.getElementById("auth-modal");
  var accountButton = document.getElementById("account-button");
  var closeAuthButton = document.getElementById("close-auth");

  var loginContainer = document.getElementById("login-form-container");
  var registerContainer = document.getElementById("register-form-container");
  var accountContainer = document.getElementById("user-account-container");

  var loginForm = document.getElementById("login-form");
  var registerForm = document.getElementById("register-form");

  var showRegisterButton = document.getElementById("show-register");
  var showLoginButton = document.getElementById("show-login");
  var logoutButton = document.getElementById("logout-button");

  var loggedUserEmail = document.getElementById("logged-user-email");
  var accountName = document.getElementById("account-name");
  var authMessage = document.getElementById("auth-message");

  var googleLoginButton = document.getElementById("google-login");
  var googleRegisterButton = document.getElementById("google-register");

  var guestView = document.getElementById("guest-view");
  var userView = document.getElementById("user-view");
  var welcomeTitle = document.getElementById("welcome-title");
  var welcomeSubtitle = document.getElementById("welcome-subtitle");
  var userHeroName = document.getElementById("user-hero-name");
  var userHeroEmail = document.getElementById("user-hero-email");


  /* =====================================================
     MESSAGE AUTH
  ===================================================== */

  function showAuthMessage(message, isError) {
    if (!authMessage) return;
    authMessage.textContent = message || "";
    authMessage.style.color = isError ? "#ff5577" : "var(--pink2)";
  }


  /* =====================================================
     VUES INTERNES MODALE
  ===================================================== */

  function hideAllViews() {
    if (loginContainer) loginContainer.classList.add("hidden");
    if (registerContainer) registerContainer.classList.add("hidden");
    if (accountContainer) accountContainer.classList.add("hidden");
  }

  function showLogin() {
    hideAllViews();
    if (loginContainer) loginContainer.classList.remove("hidden");
    showAuthMessage("");
  }

  function showRegister() {
    hideAllViews();
    if (registerContainer) registerContainer.classList.remove("hidden");
    showAuthMessage("");
  }

  function showAccount(user) {
    hideAllViews();
    if (accountContainer) accountContainer.classList.remove("hidden");

    if (accountName) {
      accountName.textContent = (user && user.displayName) || "Utilisateur";
    }
    if (loggedUserEmail) {
      loggedUserEmail.textContent = (user && user.email) || "—";
    }
    showAuthMessage("");
  }


  /* =====================================================
     ESPACE UTILISATEUR (page #compte)
  ===================================================== */

  function updateUserSpace(user) {

    if (user) {

      if (guestView) guestView.classList.add("hidden");
      if (userView) userView.classList.remove("hidden");

      if (welcomeTitle) welcomeTitle.textContent = "Mon espace";
      if (welcomeSubtitle) {
        welcomeSubtitle.textContent = "Bienvenue dans ton espace personnel.";
      }
      if (userHeroName) {
        userHeroName.textContent = user.displayName || "Utilisateur";
      }
      if (userHeroEmail) {
        userHeroEmail.textContent = user.email || "—";
      }

    } else {

      if (guestView) guestView.classList.remove("hidden");
      if (userView) userView.classList.add("hidden");

      if (welcomeTitle) welcomeTitle.textContent = "Mon espace";
      if (welcomeSubtitle) {
        welcomeSubtitle.textContent =
          "Connecte-toi pour accéder à ton espace personnel.";
      }
    }
  }


  /* =====================================================
     OUVRIR / FERMER MODALE
  ===================================================== */

  function openAuth() {
    vibrate();

    if (authModal) authModal.classList.add("show");

    if (auth && auth.currentUser) {
      showAccount(auth.currentUser);
    } else {
      showLogin();
    }
  }

  function closeAuth() {
    if (authModal) authModal.classList.remove("show");
    showAuthMessage("");
  }


  /* =====================================================
     AUTHENTIFICATION (email + Google)
  ===================================================== */

  function loginWithEmail() {

    if (!auth) {
      showAuthMessage("Authentification indisponible. Vérifie ta connexion.", true);
      return;
    }

    var email = document.getElementById("login-email");
    var password = document.getElementById("login-password");

    if (!email || !password || !email.value.trim() || !password.value) {
      showAuthMessage("Remplis tous les champs.", true);
      return;
    }

    showAuthMessage("Connexion en cours...");

    auth.signInWithEmailAndPassword(email.value.trim(), password.value)
      .then(function () {
        closeAuth();
        if (loginForm) loginForm.reset();
        showPage("compte");
      })
      .catch(function (error) {
        console.error(error);
        var message = "Impossible de se connecter.";
        if (error.code === "auth/invalid-credential") message = "Email ou mot de passe incorrect.";
        else if (error.code === "auth/user-not-found") message = "Aucun compte avec cet email.";
        else if (error.code === "auth/wrong-password") message = "Mot de passe incorrect.";
        else if (error.code === "auth/invalid-email") message = "Adresse email invalide.";
        else if (error.code === "auth/network-request-failed") message = "Problème de connexion internet.";
        showAuthMessage(message, true);
      });
  }


  function registerWithEmail() {

    if (!auth) {
      showAuthMessage("Authentification indisponible.", true);
      return;
    }

    var name = document.getElementById("register-name");
    var email = document.getElementById("register-email");
    var password = document.getElementById("register-password");
    var confirm = document.getElementById("register-confirm-password");

    if (!name || !email || !password || !confirm ||
        !name.value.trim() || !email.value.trim() ||
        !password.value || !confirm.value) {
      showAuthMessage("Remplis tous les champs.", true);
      return;
    }

    if (password.value.length < 6) {
      showAuthMessage("Le mot de passe doit contenir au moins 6 caractères.", true);
      return;
    }

    if (password.value !== confirm.value) {
      showAuthMessage("Les deux mots de passe ne correspondent pas.", true);
      return;
    }

    showAuthMessage("Création du compte...");

    auth.createUserWithEmailAndPassword(email.value.trim(), password.value)
      .then(function (cred) {
        if (cred.user && cred.user.updateProfile) {
          return cred.user.updateProfile({ displayName: name.value.trim() });
        }
      })
      .then(function () {
        closeAuth();
        if (registerForm) registerForm.reset();
        showPage("compte");
      })
      .catch(function (error) {
        console.error(error);
        var message = "Impossible de créer le compte.";
        if (error.code === "auth/email-already-in-use") message = "Cette adresse email est déjà utilisée.";
        else if (error.code === "auth/invalid-email") message = "Adresse email invalide.";
        else if (error.code === "auth/weak-password") message = "Mot de passe trop faible.";
        else if (error.code === "auth/network-request-failed") message = "Problème de connexion internet.";
        showAuthMessage(message, true);
      });
  }


  function loginWithGoogle() {

    if (!auth || !googleProvider) {
      showAuthMessage("Google indisponible.", true);
      return;
    }

    showAuthMessage("Connexion avec Google...");

    auth.signInWithPopup(googleProvider)
      .then(function () {
        closeAuth();
        showPage("compte");
      })
      .catch(function (error) {
        console.error(error);
        if (error.code === "auth/popup-closed-by-user") return;
        if (error.code === "auth/popup-blocked") {
          showAuthMessage("La fenêtre Google a été bloquée.", true);
          return;
        }
        if (error.code === "auth/operation-not-supported-in-this-environment") {
          showAuthMessage("Google non supporté dans cette application.", true);
          return;
        }
        showAuthMessage("Impossible de se connecter avec Google.", true);
      });
  }


  function logoutUser() {

    if (!auth) {
      closeAuth();
      return;
    }

    auth.signOut()
      .then(function () {
        closeAuth();
        showPage("accueil");
        showAuthMessage("");
      })
      .catch(function (error) {
        console.error(error);
        showAuthMessage("Erreur lors de la déconnexion.", true);
      });
  }


  /* =====================================================
     LISTENERS UI
  ===================================================== */

  if (accountButton) accountButton.addEventListener("click", openAuth);
  if (closeAuthButton) closeAuthButton.addEventListener("click", closeAuth);

  if (showRegisterButton) showRegisterButton.addEventListener("click", showRegister);
  if (showLoginButton) showLoginButton.addEventListener("click", showLogin);

  if (logoutButton) logoutButton.addEventListener("click", logoutUser);

  if (googleLoginButton) googleLoginButton.addEventListener("click", loginWithGoogle);
  if (googleRegisterButton) googleRegisterButton.addEventListener("click", loginWithGoogle);

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      vibrate();
      loginWithEmail();
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      vibrate();
      registerWithEmail();
    });
  }

  if (authModal) {
    authModal.addEventListener("click", function (e) {
      if (e.target === authModal) closeAuth();
    });
  }

  document.querySelectorAll(".nav-item").forEach(function (item) {
    item.addEventListener("click", function () {
      showPage(item.dataset.page);
    });
  });


  /* =====================================================
     CHARGEMENT DE FIREBASE VIA CDN COMPAT
  ===================================================== */

  function loadScript(src, callback) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = callback;
    s.onerror = function () {
      console.warn("Impossible de charger :", src);
    };
    document.head.appendChild(s);
  }

  loadScript(
    "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
    function () {
      loadScript(
        "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js",
        function () {

          try {

            firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
            auth = firebase.auth();
            googleProvider = new firebase.auth.GoogleAuthProvider();

            auth.onAuthStateChanged(function (user) {

              if (accountButton) {
                accountButton.innerHTML = user
                  ? '<i class="fa-solid fa-user-check"></i>'
                  : '<i class="fa-solid fa-user"></i>';
                accountButton.classList.toggle("connected", !!user);
              }

              if (authModal && authModal.classList.contains("show")) {
                if (user) showAccount(user);
                else showLogin();
              }

              updateUserSpace(user);

              if (user && window.location.hash === "#compte") {
                showPage("compte");
              }

              console.log(user ? "Connecté : " + user.email : "Déconnecté");
            });

            console.log("✅ Firebase initialisé.");

          } catch (err) {
            console.error("Erreur Firebase :", err);
          }
        }
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

    if (location.protocol !== "https:" &&
        location.hostname !== "localhost") {
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

        alert("Notifications activées !");
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
      if (savedToken && "Notification" in window &&
          Notification.permission === "granted") {
        button.classList.add("enabled");
      }
    } catch (e) {}
  });


  /* =====================================================
     EXPOSITION GLOBALE
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