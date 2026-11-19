// SAT Math Practice App
let allQuestions = [];
let session = {
  questions: [],
  current: 0,
  correct: 0,
  domain: "mixed",
  count: 20
};

const $ = id => document.getElementById(id);

async function loadQuestions() {
  const res = await fetch("questions/all_questions.json");
  allQuestions = await res.json();
  console.log(`Loaded ${allQuestions.length} questions`);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startSession(domain, count) {
  session.domain = domain;
  session.count = count;
  session.current = 0;
  session.correct = 0;

  let pool = allQuestions;
  if (domain !== "mixed") {
    pool = allQuestions.filter(q => q.domain === domain);
  }
  session.questions = shuffle(pool).slice(0, count);

  $("setup").classList.add("hidden");
  $("results").classList.add("hidden");
  $("practice").classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  const q = session.questions[session.current];
  if (!q) return endSession();

  const pct = (session.current / session.questions.length) * 100;
  $("bar-fill").style.width = pct + "%";
  $("progress-text").textContent = `Question ${session.current + 1} of ${session.questions.length}`;

  $("domain-badge").textContent = q.domain.toUpperCase();
  $("topic-badge").textContent = q.topic || "";

  $("question").innerHTML = q.question;
  renderMathInElement($("question"), {
    delimiters: [
      {left: "$$", right: "$$", display: true},
      {left: "$", right: "$", display: false}
    ]
  });

  $("feedback").classList.add("hidden");
  $("next-btn").disabled = true;

  // Clear previous
  $("choices").innerHTML = "";
  $("spr-input").classList.add("hidden");
  $("spr-answer").value = "";

  if (q.response.type === "mc") {
    q.response.choices.forEach((choice, idx) => {
      const btn = document.createElement("button");
      btn.className = "choice";
      btn.innerHTML = choice;
      btn.onclick = () => selectChoice(idx, q);
      $("choices").appendChild(btn);
    });
    renderMathInElement($("choices"), {
      delimiters: [{left: "$", right: "$", display: false}]
    });
  } else {
    $("spr-input").classList.remove("hidden");
    $("spr-answer").focus();
  }
}

function selectChoice(idx, q) {
  const buttons = $("choices").querySelectorAll(".choice");
  buttons.forEach(b => b.disabled = true);
  const correct = q.response.correct;
  buttons[idx].classList.add(idx === correct ? "correct" : "incorrect");
  if (idx !== correct) buttons[correct].classList.add("correct");

  const isCorrect = idx === correct;
  if (isCorrect) session.correct++;
  showFeedback(isCorrect, q);
}

function submitSPR() {
  const q = session.questions[session.current];
  const raw = $("spr-answer").value.trim();
  if (!raw) return;

  const userVal = parseFloat(raw.replace(/,/g, ""));
  const correctVal = parseFloat(q.response.answer);
  const tol = q.response.tolerance || 0.01;
  const isCorrect = !isNaN(userVal) && Math.abs(userVal - correctVal) <= tol;

  if (isCorrect) session.correct++;
  showFeedback(isCorrect, q, raw);
  $("spr-answer").disabled = true;
  $("submit-spr").disabled = true;
}

function showFeedback(isCorrect, q, userAnswer = null) {
  const fb = $("feedback");
  fb.classList.remove("hidden", "correct", "incorrect");
  fb.classList.add(isCorrect ? "correct" : "incorrect");

  let html = isCorrect
    ? "<strong>Correct!</strong>"
    : `<strong>Incorrect.</strong> Correct answer: $${q.response.answer}$`;

  if (q.explanation) {
    html += `<br><br>${q.explanation}`;
  }
  fb.innerHTML = html;
  renderMathInElement(fb, {
    delimiters: [
      {left: "$$", right: "$$", display: true},
      {left: "$", right: "$", display: false}
    ]
  });

  $("next-btn").disabled = false;
}

function nextQuestion() {
  session.current++;
  if (session.current >= session.questions.length) {
    endSession();
  } else {
    showQuestion();
  }
}

function endSession() {
  const total = session.questions.length;
  const pct = Math.round((session.correct / total) * 100);
  $("practice").classList.add("hidden");
  $("results").classList.remove("hidden");
  $("score-summary").innerHTML = `
    <p>You answered <strong>${session.correct}</strong> out of <strong>${total}</strong> correctly (${pct}%).</p>
    <p>Domain: ${session.domain === "mixed" ? "Mixed" : session.domain}</p>
  `;
}

function restart() {
  $("results").classList.add("hidden");
  $("setup").classList.remove("hidden");
}

// Event listeners
document.addEventListener("DOMContentLoaded", async () => {
  await loadQuestions();

  document.querySelectorAll(".domain-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".domain-buttons button").forEach(b => b.classList.remove("primary"));
      btn.classList.add("primary");
      session.domain = btn.dataset.domain;
    });
  });

  $("start-btn").addEventListener("click", () => {
    const domain = session.domain || "mixed";
    const count = parseInt($("qcount").value);
    startSession(domain, count);
  });

  $("submit-spr").addEventListener("click", submitSPR);
  $("spr-answer").addEventListener("keypress", e => {
    if (e.key === "Enter") submitSPR();
  });

  $("next-btn").addEventListener("click", nextQuestion);
  $("end-btn").addEventListener("click", endSession);
  $("restart-btn").addEventListener("click", restart);
});
