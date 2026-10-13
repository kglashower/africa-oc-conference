(function () {
  "use strict";

  var READ_MS = 2000;        // time to read the question before the countdown starts
  var REVEAL_MS = 1000;      // answers appear (locked) after this much of the read phase
  var ANSWER_MS = 10000;     // countdown length; points = ms remaining when correct
  var QUESTIONS_PER_GAME = 10;

  var I18N = {
    en: {
      conf: "Africa Operations Conference 2026",
      title: "Knowledge Check",
      chooseLang: "Choose your language",
      yourName: "Your name",
      namePh: "Type your name",
      chooseDay: "Choose a day",
      howto: "10 questions. 2 seconds to read, then 10 seconds to answer. The faster you answer correctly, the more points you earn.",
      start: "Start",
      score: "Score",
      next: "Next",
      getReady: "Get ready…",
      correct: "Correct! +{pts}",
      wrong: "Not quite. +0",
      timeout: "Time's up! +0",
      finalLabel: "Final score",
      share: "📸 Take a screenshot and send it in the WhatsApp group!",
      again: "Play again",
      stats: "{n} of {total} correct",
      msgs: [
        [90000, "Legendary! 🏆"],
        [75000, "Outstanding! 🔥"],
        [55000, "Great job! 🎉"],
        [35000, "Well done! 👏"],
        [15000, "Good effort! 💪"],
        [0, "Thanks for playing! 🙌"]
      ]
    },
    fr: {
      conf: "Conférence des opérations Afrique 2026",
      title: "Test de connaissances",
      chooseLang: "Choisissez votre langue",
      yourName: "Votre nom",
      namePh: "Tapez votre nom",
      chooseDay: "Choisissez un jour",
      howto: "10 questions. 2 secondes pour lire, puis 10 secondes pour répondre. Plus vous répondez vite et juste, plus vous gagnez de points.",
      start: "Commencer",
      score: "Score",
      next: "Suivant",
      getReady: "Préparez-vous…",
      correct: "Correct ! +{pts}",
      wrong: "Pas tout à fait. +0",
      timeout: "Temps écoulé ! +0",
      finalLabel: "Score final",
      share: "📸 Faites une capture d'écran et envoyez-la dans le groupe WhatsApp !",
      again: "Rejouer",
      stats: "{n} sur {total} correctes",
      msgs: [
        [90000, "Légendaire ! 🏆"],
        [75000, "Exceptionnel ! 🔥"],
        [55000, "Excellent ! 🎉"],
        [35000, "Bien joué ! 👏"],
        [15000, "Bel effort ! 💪"],
        [0, "Merci d'avoir joué ! 🙌"]
      ]
    }
  };

  var state = {
    lang: "en",
    name: "",
    day: null,
    questions: [],
    index: 0,
    score: 0,
    correctCount: 0,
    phase: "idle",     // idle | read | answer | done
    tStart: 0,
    raf: 0,
    timers: []
  };

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    start: $("screen-start"), quiz: $("screen-quiz"), final: $("screen-final"),
    name: $("name"), dayList: $("day-list"), btnStart: $("btn-start"),
    progress: $("progress"), scoreLive: $("score-live"),
    timerFill: $("timer-fill"), timerNum: $("timer-num"),
    question: $("question"), answers: $("answers"),
    feedback: $("feedback"), feedbackText: $("feedback-text"), btnNext: $("btn-next"),
    finalName: $("final-name"), finalScore: $("final-score"), finalMsg: $("final-msg"),
    finalStats: $("final-stats"), finalDay: $("final-day"), btnAgain: $("btn-again"),
    confetti: $("confetti")
  };

  function t(key, vars) {
    var s = I18N[state.lang][key];
    if (typeof s !== "string") return s;
    return s.replace(/\{(\w+)\}/g, function (_, k) { return vars && k in vars ? vars[k] : ""; });
  }
  function fmt(n) { return n.toLocaleString(state.lang === "fr" ? "fr-FR" : "en-US"); }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function later(fn, ms) { state.timers.push(setTimeout(fn, ms)); }
  function clearTimers() {
    state.timers.forEach(clearTimeout); state.timers = [];
    if (state.raf) cancelAnimationFrame(state.raf); state.raf = 0;
  }
  function show(screen) {
    [el.start, el.quiz, el.final].forEach(function (s) { s.classList.add("hidden"); });
    screen.classList.remove("hidden");
  }

  function applyLang() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-i18n]").forEach(function (n) { n.textContent = t(n.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (n) { n.placeholder = t(n.getAttribute("data-i18n-placeholder")); });
    document.querySelectorAll(".lang-btn").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-lang") === state.lang); });
    renderDays();
  }

  function renderDays() {
    var days = window.QUIZ_DAYS || [];
    el.dayList.innerHTML = "";
    days.forEach(function (d) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "day-btn" + (state.day && state.day.id === d.id ? " active" : "");
      b.textContent = d.label[state.lang];
      b.addEventListener("click", function () { state.day = d; renderDays(); validate(); });
      el.dayList.appendChild(b);
    });
    if (!state.day && days.length) { state.day = days[days.length - 1]; renderDays(); }
  }

  function validate() {
    state.name = el.name.value.trim();
    el.btnStart.disabled = !(state.name && state.day);
  }

  // ---------- Game ----------
  function startGame() {
    clearTimers();
    state.questions = shuffle(state.day.questions).slice(0, QUESTIONS_PER_GAME).map(function (q) {
      var order = shuffle(q.a.map(function (_, i) { return i; }));
      return { q: q.q, a: order.map(function (i) { return q.a[i]; }), correct: order.indexOf(q.correct) };
    });
    state.index = 0; state.score = 0; state.correctCount = 0;
    el.scoreLive.textContent = "0";
    show(el.quiz);
    loadQuestion();
  }

  function loadQuestion() {
    clearTimers();
    var q = state.questions[state.index];
    state.phase = "read";
    el.progress.textContent = (state.index + 1) + " / " + state.questions.length;
    el.question.textContent = q.q[state.lang];
    el.feedback.classList.add("hidden");
    el.timerFill.style.transform = "scaleX(1)";
    el.timerFill.className = "timer-fill";
    el.timerNum.textContent = t("getReady");
    el.timerNum.className = "timer-num ready";

    el.answers.innerHTML = "";
    el.answers.className = "answers hidden-answers locked";
    q.a.forEach(function (ans, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "answer";
      b.innerHTML = '<span class="key">' + "ABCD"[i] + '</span><span class="txt"></span>';
      b.querySelector(".txt").textContent = ans[state.lang];
      b.addEventListener("click", function () { choose(i); });
      el.answers.appendChild(b);
    });

    later(function () { el.answers.classList.remove("hidden-answers"); }, REVEAL_MS);
    later(startCountdown, READ_MS);
  }

  function startCountdown() {
    state.phase = "answer";
    el.answers.classList.remove("locked");
    el.timerNum.className = "timer-num";
    state.tStart = performance.now();
    tick();
  }

  function remaining() {
    return Math.max(0, ANSWER_MS - Math.round(performance.now() - state.tStart));
  }

  function tick() {
    if (state.phase !== "answer") return;
    var r = remaining();
    var frac = r / ANSWER_MS;
    el.timerFill.style.transform = "scaleX(" + frac + ")";
    el.timerFill.className = "timer-fill" + (frac < 0.25 ? " danger" : frac < 0.5 ? " warn" : "");
    el.timerNum.textContent = fmt(r);
    if (r <= 0) { finish(-1, 0); return; }
    state.raf = requestAnimationFrame(tick);
  }

  function choose(i) {
    if (state.phase !== "answer") return;
    finish(i, remaining());
  }

  function finish(chosen, r) {
    state.phase = "done";
    clearTimers();
    var q = state.questions[state.index];
    var btns = el.answers.querySelectorAll(".answer");
    var pts = 0;
    el.answers.classList.add("done");
    btns.forEach(function (b, i) {
      if (i === q.correct) b.classList.add("correct");
      else if (i === chosen) b.classList.add("wrong");
      else b.classList.add("dim");
    });
    if (chosen === q.correct) {
      pts = r;
      state.correctCount++;
      el.feedbackText.textContent = t("correct", { pts: fmt(pts) });
      el.feedbackText.className = "feedback-text good";
    } else {
      el.feedbackText.textContent = t(chosen === -1 ? "timeout" : "wrong");
      el.feedbackText.className = "feedback-text bad";
    }
    state.score += pts;
    el.scoreLive.textContent = fmt(state.score);
    el.timerNum.textContent = fmt(r);
    el.feedback.classList.remove("hidden");
  }

  function next() {
    if (state.phase !== "done") return;
    state.index++;
    if (state.index >= state.questions.length) showFinal();
    else loadQuestion();
  }

  // ---------- Final ----------
  function showFinal() {
    show(el.final);
    el.finalName.textContent = state.name;
    el.finalDay.textContent = state.day.label[state.lang] + " · " + t("conf");
    el.finalStats.textContent = t("stats", { n: state.correctCount, total: state.questions.length });
    var msgs = t("msgs"), msg = msgs[msgs.length - 1][1];
    for (var i = 0; i < msgs.length; i++) { if (state.score >= msgs[i][0]) { msg = msgs[i][1]; break; } }
    el.finalMsg.textContent = msg;
    countUp(state.score);
    confetti();
  }

  function countUp(target) {
    var start = performance.now(), dur = 1400;
    function step(now) {
      var p = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.finalScore.textContent = fmt(Math.round(target * e));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function confetti() {
    var c = el.confetti, ctx = c.getContext("2d");
    var rect = c.parentElement.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    c.width = rect.width * dpr; c.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    var W = rect.width, H = rect.height;
    var colors = ["#f79430", "#6ccacd", "#dd603a", "#ffe0b0", "#d3edf2", "#175778"];
    var parts = [];
    for (var i = 0; i < 140; i++) {
      parts.push({
        x: Math.random() * W, y: -20 - Math.random() * H,
        w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
        vy: 1.5 + Math.random() * 2.5, vx: -1 + Math.random() * 2,
        rot: Math.random() * Math.PI, vr: -0.1 + Math.random() * 0.2,
        color: colors[i % colors.length]
      });
    }
    var t0 = performance.now();
    function frame(now) {
      ctx.clearRect(0, 0, W, H);
      var alive = false;
      parts.forEach(function (p) {
        p.y += p.vy; p.x += p.vx + Math.sin(now / 300 + p.rot) * 0.6; p.rot += p.vr;
        if (p.y < H + 20) alive = true;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive && now - t0 < 6000) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    }
    requestAnimationFrame(frame);
  }

  // ---------- Wire up ----------
  document.querySelectorAll(".lang-btn").forEach(function (b) {
    b.addEventListener("click", function () { state.lang = b.getAttribute("data-lang"); applyLang(); });
  });
  el.name.addEventListener("input", validate);
  el.name.addEventListener("keydown", function (e) { if (e.key === "Enter") { el.name.blur(); if (!el.btnStart.disabled) startGame(); } });
  el.btnStart.addEventListener("click", function () { el.name.blur(); startGame(); });
  el.btnNext.addEventListener("click", next);
  el.btnAgain.addEventListener("click", function () { clearTimers(); show(el.start); validate(); });

  try {
    var saved = localStorage.getItem("ohq-lang");
    if (saved === "en" || saved === "fr") state.lang = saved;
    var savedName = localStorage.getItem("ohq-name");
    if (savedName) el.name.value = savedName;
  } catch (e) {}
  document.querySelectorAll(".lang-btn").forEach(function (b) {
    b.addEventListener("click", function () { try { localStorage.setItem("ohq-lang", state.lang); } catch (e) {} });
  });
  el.name.addEventListener("change", function () { try { localStorage.setItem("ohq-name", el.name.value.trim()); } catch (e) {} });

  applyLang();
  validate();
})();
