/*!
 * Start Bootstrap - Business Casual v7.0.9 (https://startbootstrap.com/theme/business-casual)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-casual/blob/master/LICENSE)
 */
window.addEventListener("DOMContentLoaded", () => {
  const hours = document.body.querySelectorAll(".list-hours li");
  if (hours.length) {
    const today = hours[new Date().getDay()];
    if (today) today.classList.add("today");
  }
});

/* Price modal
 * One modal per services page; the card button carries the service slug.
 * Prices are kept here so the three language versions share one source.
 */
(function () {
  "use strict";

  var PRICES = {
    "portuguese-lessons": {
      en: {
        title: "European Portuguese Lessons Online",
        lines: [
          "€20 / 50-min lesson",
          "€18/lesson when the month is paid in advance",
          "5-lesson pack: €80 (valid 6 weeks)",
          "10-lesson pack: €150 (valid 3 months)"
        ]
      },
      pt: {
        title: "Aulas de português europeu online",
        lines: [
          "20 € / aula de 50 min",
          "18 €/aula com o mês pago adiantado",
          "Pack de 5 aulas: 80 € (válido 6 semanas)",
          "Pack de 10 aulas: 150 € (válido 3 meses)"
        ]
      },
      fr: {
        title: "Cours de portugais européen en ligne",
        lines: [
          "20 € / cours de 50 min",
          "18 €/cours avec le mois payé d'avance",
          "Pack de 5 cours : 80 € (valable 6 semaines)",
          "Pack de 10 cours : 150 € (valable 3 mois)"
        ]
      }
    },
    translation: {
      en: {
        title: "Portuguese–English Translation",
        lines: ["€0.10 per word, minimum €15", "Technical texts quoted separately."]
      },
      pt: {
        title: "Tradução português–inglês",
        lines: ["0,10 € por palavra, mínimo 15 €", "Textos técnicos orçamentados à parte."]
      },
      fr: {
        title: "Traduction portugais–anglais",
        lines: [
          "0,10 € par mot, minimum 15 €",
          "Les textes techniques font l'objet d'un devis séparé."
        ]
      }
    },
    "seasonal-courses": {
      en: {
        title: "Christmas courses",
        lines: [
          "A1: 10 lessons of 90 min — 300 € (starts 16 November 2026)",
          "A2: 20 lessons of 90 min — 500 € (starts 16 November 2026)",
          "Groups of 4 to 6 students, online, with teacher Helena",
          "A2 opens only with a minimum of 4 enrolments"
        ]
      },
      pt: {
        title: "Cursos de português — edição de Natal",
        lines: [
          "A1: 10 aulas de 90 min — 300 € (início a 16 de novembro de 2026)",
          "A2: 20 aulas de 90 min — 500 € (início a 16 de novembro de 2026)",
          "Grupos de 4 a 6 alunos, online, com a professora Helena",
          "O A2 só abre com um mínimo de 4 inscritos"
        ]
      },
      fr: {
        title: "Cours de portugais — édition de Noël",
        lines: [
          "A1 : 10 cours de 90 min — 300 € (début le 16 novembre 2026)",
          "A2 : 20 cours de 90 min — 500 € (début le 16 novembre 2026)",
          "Groupes de 4 à 6 élèves, en ligne, avec la professeure Helena",
          "L'A2 n'ouvre qu'avec un minimum de 4 inscrits"
        ]
      }
    },
    "personal-support": {
      en: {
        title: "Personal Support in Portugal",
        lines: [
          "Call preparation: €20/hour",
          "Accompaniment: €25/hour (transport not included)",
          "Writing in Portuguese: €15/hour (minimum 1 hour)"
        ]
      },
      pt: {
        title: "Apoio pessoal em Portugal",
        lines: [
          "Preparação de chamadas: 20 €/hora",
          "Acompanhamento: 25 €/hora (transporte não incluído)",
          "Escrita em português: 15 €/hora (mínimo 1 hora)"
        ]
      },
      fr: {
        title: "Accompagnement personnel au Portugal",
        lines: [
          "Préparation d'appels : 20 €/heure",
          "Accompagnement : 25 €/heure (transport non inclus)",
          "Rédaction en portugais : 15 €/heure (minimum 1 heure)"
        ]
      }
    },
    bureaucracy: {
      en: {
        title: "Bureaucracy & admin",
        lines: ["€20/hour, minimum 1 hour"]
      },
      pt: {
        title: "Burocracia e papelada",
        lines: ["20 €/hora, mínimo 1 hora"]
      },
      fr: {
        title: "Bureaucratie et paperasse",
        lines: ["20 €/heure, minimum 1 heure"]
      }
    },
    finance: {
      en: {
        title: "Finance & spreadsheets",
        lines: [
          "€25 per spreadsheet",
          "€95.50 with three sessions (guidance, set-up, adjustment)"
        ]
      },
      pt: {
        title: "Finanças e folhas de cálculo",
        lines: [
          "25 € por folha",
          "95,50 € com três sessões (orientação, configuração, ajuste)"
        ]
      },
      fr: {
        title: "Finances et tableurs",
        lines: [
          "25 € par feuille",
          "95,50 € avec trois séances (orientation, configuration, ajustement)"
        ]
      }
    },
    ciple: {
      en: {
        title: "CIPLE A2 Preparation",
        lines: [
          "CIPLE A2 preparation: 10 lessons, €150",
          "Two lessons a week, in the five weeks before the exam",
          "Includes exam simulations"
        ]
      },
      pt: {
        title: "Preparação CIPLE A2",
        lines: [
          "Preparação CIPLE A2: 10 aulas, 150 €",
          "Duas aulas por semana, nas cinco semanas antes do exame",
          "Inclui simulações de exame"
        ]
      },
      fr: {
        title: "Préparation CIPLE A2",
        lines: [
          "Préparation CIPLE A2 : 10 cours, 150 €",
          "Deux cours par semaine, pendant les cinq semaines avant l'examen",
          "Comprend des examens blancs"
        ]
      }
    }
  };

  var UI = {
    en: {
      booking: "/booking",
      subject: function (title) {
        return "Prices and questions — " + title;
      },
      body: function (title) {
        return "Hello,\n\nI would like to know more about " + title + ".\n\nThank you!";
      }
    },
    pt: {
      booking: "/pt/booking",
      subject: function (title) {
        return "Preços e dúvidas — " + title;
      },
      body: function (title) {
        return "Olá,\n\nGostaria de saber mais sobre " + title + ".\n\nObrigada!";
      }
    },
    fr: {
      booking: "/fr/booking",
      subject: function (title) {
        return "Prix et questions — " + title;
      },
      body: function (title) {
        return "Bonjour,\n\nJ'aimerais en savoir plus sur " + title + ".\n\nMerci !";
      }
    }
  };

  function initPriceModal() {
    var modalEl = document.getElementById("price-modal");
    if (!modalEl || !window.bootstrap || !window.bootstrap.Modal) return;

    var lang = (document.documentElement.lang || "en").toLowerCase();
    if (lang.indexOf("pt") === 0) {
      lang = "pt";
    } else if (lang.indexOf("fr") === 0) {
      lang = "fr";
    } else {
      lang = "en";
    }

    var ui = UI[lang];
    var modal = new window.bootstrap.Modal(modalEl);
    var titleEl = document.getElementById("price-modal-title");
    var listEl = modalEl.querySelector(".price-list");
    var emailEl = document.getElementById("price-modal-email");
    var bookEl = document.getElementById("price-modal-book");
    var currentSlug = null;

    function dataFor(slug) {
      var entry = PRICES[slug];
      if (!entry) return null;
      return entry[lang] || entry.en;
    }

    function render(slug) {
      var data = dataFor(slug);
      if (!data) return;

      if (titleEl) titleEl.textContent = data.title;

      if (listEl) {
        listEl.classList.remove("is-open");
        while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
        data.lines.forEach(function (line) {
          var item = document.createElement("li");
          item.textContent = line;
          listEl.appendChild(item);
        });
      }

      if (emailEl) {
        emailEl.href =
          "mailto:aulas.napontadalingua@gmail.com?subject=" +
          encodeURIComponent(ui.subject(data.title)) +
          "&body=" +
          encodeURIComponent(ui.body(data.title));
      }

      if (bookEl) {
        bookEl.href = ui.booking + "?service=" + encodeURIComponent(slug);
      }
    }

    function replaceHash(hash) {
      try {
        window.history.replaceState(null, "", hash);
      } catch (error) {
        /* Some preview contexts do not allow history changes. */
      }
    }

    function clearHash() {
      if (window.location.hash.indexOf("#prices-") === 0) {
        replaceHash(window.location.pathname + window.location.search);
      }
    }

    modalEl.addEventListener("show.bs.modal", function (event) {
      var trigger = event.relatedTarget;
      var slug = trigger && trigger.getAttribute ? trigger.getAttribute("data-service") : null;
      if (!slug || !PRICES[slug]) slug = currentSlug;
      if (!slug || !PRICES[slug]) slug = "portuguese-lessons";
      currentSlug = slug;
      render(slug);
      replaceHash("#prices-" + slug);
    });

    modalEl.addEventListener("shown.bs.modal", function () {
      if (listEl) listEl.classList.add("is-open");
    });

    modalEl.addEventListener("hide.bs.modal", function () {
      if (listEl) listEl.classList.remove("is-open");
      clearHash();
    });

    var deepLink = /^#prices-([a-z-]+)$/.exec(window.location.hash);
    if (deepLink && PRICES[deepLink[1]]) {
      currentSlug = deepLink[1];
      render(deepLink[1]);
      modal.show();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPriceModal);
  } else {
    initPriceModal();
  }
})();
