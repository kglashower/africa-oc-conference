// Day 1 — Tuesday 13 October 2026
// Sessions: Devotion (Kyle), OC training "why" and "what" (Cameron),
// Ministry assets & stewardship (Sarah), CRM / Workbooks vs Hopeworks (Kyle).
//
// Each question: { q: {en, fr}, a: [ {en, fr} x4 ], correct: index into a }
// The game shuffles question order and answer order automatically.

window.QUIZ_DAYS = window.QUIZ_DAYS || [];
window.QUIZ_DAYS.push({
  id: "day1",
  label: { en: "Day 1 · Tuesday", fr: "Jour 1 · Mardi" },
  questions: [
    {
      q: { en: "In the morning devotion from Ephesians 4, operations was compared to which part of the body?",
           fr: "Dans la méditation du matin sur Éphésiens 4, les opérations ont été comparées à quelle partie du corps ?" },
      a: [
        { en: "The ligaments", fr: "Les ligaments" },
        { en: "The heart", fr: "Le cœur" },
        { en: "The hands and feet", fr: "Les mains et les pieds" },
        { en: "The backbone", fr: "La colonne vertébrale" }
      ],
      correct: 0
    },
    {
      q: { en: "In Cameron's bus analogy, what role does operations play?",
           fr: "Dans l'analogie du bus de Cameron, quel rôle jouent les opérations ?" },
      a: [
        { en: "The mechanic", fr: "Le mécanicien" },
        { en: "The driver", fr: "Le chauffeur" },
        { en: "The ticket collector", fr: "Le contrôleur" },
        { en: "The navigator", fr: "Le navigateur" }
      ],
      correct: 0
    },
    {
      q: { en: "Which principle, learned from Sarah, does Cameron want to guide Africa operations?",
           fr: "Quel principe, appris de Sarah, Cameron veut-il voir guider les opérations en Afrique ?" },
      a: [
        { en: "No reporting, no supporting", fr: "Pas de rapport, pas de soutien" },
        { en: "Trust first, verify later", fr: "Faire confiance d'abord, vérifier ensuite" },
        { en: "Ship now, count later", fr: "Expédier maintenant, compter plus tard" },
        { en: "More books, more reach", fr: "Plus de livres, plus de portée" }
      ],
      correct: 0
    },
    {
      q: { en: "Which of these is NOT one of the six OC responsibility areas Cameron presented?",
           fr: "Lequel de ces domaines ne fait PAS partie des six responsabilités du CO présentées par Cameron ?" },
      a: [
        { en: "Donor fundraising", fr: "Collecte de fonds auprès des donateurs" },
        { en: "Inventory management", fr: "Gestion des stocks" },
        { en: "Asset management", fr: "Gestion des actifs" },
        { en: "Supply chain management", fr: "Gestion de la chaîne d'approvisionnement" }
      ],
      correct: 0
    },
    {
      q: { en: "A container stuck at a border costs about $500 per day. Cameron said that equals roughly how many children not reached?",
           fr: "Un conteneur bloqué à la frontière coûte environ 500 $ par jour. Selon Cameron, cela représente environ combien d'enfants non atteints ?" },
      a: [
        { en: "About 1,500", fr: "Environ 1 500" },
        { en: "About 150", fr: "Environ 150" },
        { en: "About 5,000", fr: "Environ 5 000" },
        { en: "About 500", fr: "Environ 500" }
      ],
      correct: 0
    },
    {
      q: { en: "In the parable of the talents (Matthew 25), which servant got in trouble with the master?",
           fr: "Dans la parabole des talents (Matthieu 25), quel serviteur a eu des ennuis avec le maître ?" },
      a: [
        { en: "The one who buried his talent", fr: "Celui qui a enterré son talent" },
        { en: "The one who lost money trading", fr: "Celui qui a perdu de l'argent en commerçant" },
        { en: "The one who received five talents", fr: "Celui qui a reçu cinq talents" },
        { en: "The one who gave his talent away", fr: "Celui qui a donné son talent" }
      ],
      correct: 0
    },
    {
      q: { en: "According to 1 Corinthians 4:2, what is REQUIRED of a steward?",
           fr: "Selon 1 Corinthiens 4:2, qu'est-ce qui est EXIGÉ d'un intendant ?" },
      a: [
        { en: "To be found faithful", fr: "Être trouvé fidèle" },
        { en: "To be found successful", fr: "Être trouvé prospère" },
        { en: "To be well-resourced", fr: "Être bien équipé" },
        { en: "To be brilliant", fr: "Être brillant" }
      ],
      correct: 0
    },
    {
      q: { en: "In Sarah's sticky-note exercise, which country was the example, planning to reach 200,000 children with film outreach?",
           fr: "Dans l'exercice des post-it de Sarah, quel pays servait d'exemple, avec l'objectif d'atteindre 200 000 enfants par des projections de films ?" },
      a: [
        { en: "Cameroon", fr: "Cameroun" },
        { en: "Kenya", fr: "Kenya" },
        { en: "Ethiopia", fr: "Éthiopie" },
        { en: "Zambia", fr: "Zambie" }
      ],
      correct: 0
    },
    {
      q: { en: "Which question CANNOT be answered from Hopeworks and belongs in the CRM (Workbooks)?",
           fr: "Quelle question ne peut PAS être répondue dans Hopeworks et relève du CRM (Workbooks) ?" },
      a: [
        { en: "Which church leaders we equipped are now discipling children?", fr: "Quels responsables d'église formés font maintenant des disciples parmi les enfants ?" },
        { en: "How many children received Scripture last quarter?", fr: "Combien d'enfants ont reçu les Écritures le trimestre dernier ?" },
        { en: "How many books are in the warehouse?", fr: "Combien de livres sont dans l'entrepôt ?" },
        { en: "What is the outstanding balance?", fr: "Quel est le solde impayé ?" }
      ],
      correct: 0
    },
    {
      q: { en: "Which country was the first in Africa to implement the CRM and leads in contacts loaded?",
           fr: "Quel pays a été le premier en Afrique à mettre en place le CRM et compte le plus de contacts chargés ?" },
      a: [
        { en: "Kenya", fr: "Kenya" },
        { en: "South Africa", fr: "Afrique du Sud" },
        { en: "Uganda", fr: "Ouganda" },
        { en: "Nigeria", fr: "Nigéria" }
      ],
      correct: 0
    }
  ]
});
