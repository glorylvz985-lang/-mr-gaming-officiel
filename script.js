/* =========================================================
   MR GAMING PRO
   JAVASCRIPT
========================================================= */


/* =========================================================
   VIBRATION
========================================================= */

function vibrate(duration = 20) {

    try {

        if (
            "vibrate" in navigator
        ) {

            navigator.vibrate(duration);

        }

    } catch (error) {

        console.log(
            "Vibration non disponible."
        );

    }

}



/* =========================================================
   ÉVÉNEMENTS
=========================================================

   POUR AJOUTER UN ÉVÉNEMENT :

   Copie simplement un bloc { ... }

   et modifie les informations.

========================================================= */

const EVENTS = [

    {

        title:
            "Tournoi Gaming MR GAMING PRO",

        date:
            "Date à définir",

        description:
            "Participe au prochain tournoi gaming organisé par MR GAMING PRO.",

        image:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",

        status:
            "À VENIR",

        statusClass:
            "",

        link:
            "https://t.me/mprogamings",

        button:
            "Participer"

    },


    /*
    ========================================================
    EXEMPLE D'UN DEUXIÈME ÉVÉNEMENT
    ========================================================

    {

        title:
            "Tournoi eFootball",

        date:
            "20 Septembre 2026",

        description:
            "Affronte les meilleurs joueurs lors de notre tournoi.",

        image:
            "TON-IMAGE-ICI",

        status:
            "EN COURS",

        statusClass:
            "live",

        link:
            "https://t.me/mprogamings",

        button:
            "Participer"

    }

    */

];



/* =========================================================
   AFFICHER LES ÉVÉNEMENTS
========================================================= */

function renderEvents() {

    const container =
        document.getElementById(
            "events-container"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (EVENTS.length === 0) {

        container.innerHTML = `

            <div class="event-card">

                <div class="event-content">

                    <h3>
                        Aucun événement
                    </h3>

                    <p>
                        Aucun événement n'est actuellement disponible.
                    </p>

                </div>

            </div>

        `;

        return;

    }


    EVENTS.forEach((event) => {


        const article =
            document.createElement("article");


        article.className =
            "event-card animate-on-scroll";


        article.innerHTML = `

            <div class="event-image">

                <img
                    src="${event.image}"
                    alt="${event.title}"
                    loading="lazy"
                >

                <span
                    class="event-status ${event.statusClass || ""}"
                >

                    ${event.status}

                </span>

            </div>


            <div class="event-content">

                <div class="event-date">

                    <i class="fa-regular fa-calendar"></i>

                    ${event.date}

                </div>


                <h3>
                    ${event.title}
                </h3>


                <p>
                    ${event.description}
                </p>


                <a
                    href="${event.link}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="card-button event-button"
                >

                    <i class="fa-solid fa-arrow-right"></i>

                    ${event.button}

                </a>

            </div>

        `;


        container.appendChild(article);


    });


    initScrollAnimations();


    document
        .querySelectorAll(".event-button")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => vibrate(30)
            );

        });

}



/* =========================================================
   NAVIGATION
========================================================= */

function navigateTo(
    sectionId,
    button = null
) {

    vibrate(20);


    const section =
        document.getElementById(
            sectionId
        );


    if (!section) {

        return;

    }


    section.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });


    document
        .querySelectorAll(".nav-item")
        .forEach((item) => {

            item.classList.remove(
                "active"
            );

        });


    if (button) {

        button.classList.add(
            "active"
        );

    } else {

        const navButton =
            document.querySelector(
                `.nav-item[data-target="${sectionId}"]`
            );


        if (navButton) {

            navButton.classList.add(
                "active"
            );

        }

    }

}



/* =========================================================
   BOUTON SCROLL
========================================================= */

function scrollToSection(
    sectionId
) {

    navigateTo(sectionId);

}



/* =========================================================
   NAVIGATION ACTIVE
========================================================= */

function updateActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    let current =
        "accueil";


    sections.forEach((section) => {

        const rect =
            section.getBoundingClientRect();


        if (
            rect.top <= 180 &&
            rect.bottom >= 180
        ) {

            current =
                section.id;

        }

    });


    document
        .querySelectorAll(".nav-item")
        .forEach((button) => {

            button.classList.toggle(

                "active",

                button.dataset.target === current

            );

        });

}



/* =========================================================
   ANIMATION DES CARTES
========================================================= */

function initScrollAnimations() {

    const elements =
        document.querySelectorAll(
            ".animate-on-scroll"
        );


    if (!("IntersectionObserver" in window)) {

        elements.forEach((element) => {

            element.classList.add(
                "visible"
            );

        });

        return;

    }


    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.12
            }

        );


    elements.forEach((element) => {

        observer.observe(element);

    });

}



/* =========================================================
   LIENS EXTERNES
========================================================= */

function prepareExternalLinks() {

    document
        .querySelectorAll(
            'a[target="_blank"]'
        )
        .forEach((link) => {

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );

        });

}



/* =========================================================
   EFFET TOUCH MOBILE
========================================================= */

function initTouchEffect() {

    document
        .querySelectorAll(
            ".service-card, .event-card, .social-card, .contact-card, .platform-card"
        )
        .forEach((card) => {


            card.addEventListener(
                "touchstart",
                () => {

                    card.style.transform =
                        "scale(.97)";

                },
                {
                    passive: true
                }
            );


            card.addEventListener(
                "touchend",
                () => {

                    card.style.transform =
                        "";

                },
                {
                    passive: true
                }
            );

        });

}



/* =========================================================
   VIBRATION GLOBALE DES BOUTONS
========================================================= */

function initButtonVibration() {

    document
        .querySelectorAll(
            "button, .card-button, .social-card, .contact-card, .footer-socials a"
        )
        .forEach((element) => {

            element.addEventListener(
                "click",
                () => {

                    vibrate(18);

                }
            );

        });

}



/* =========================================================
   VIBRATION AU LANCEMENT
========================================================= */

function startupVibration() {

    setTimeout(() => {

        vibrate([40, 50, 70]);

    }, 100);

}



/* =========================================================
   CHARGEMENT
========================================================= */

window.addEventListener(
    "load",
    () => {


        /* Afficher les événements */

        renderEvents();


        /* Vibration */

        startupVibration();


        /* Fermer loading */

        setTimeout(() => {

            const loading =
                document.getElementById(
                    "loading-screen"
                );


            if (loading) {

                loading.classList.add(
                    "hide"
                );

            }


            vibrate(35);


        }, 2500);


    }
);



/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initScrollAnimations();

        prepareExternalLinks();

        initTouchEffect();

        initButtonVibration();

        updateActiveNavigation();

    }
);



/* =========================================================
   SCROLL
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        updateActiveNavigation();

    },
    {
        passive: true
    }
);