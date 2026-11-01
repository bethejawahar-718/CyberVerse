(() => {
  "use strict";

  const bitGrid = document.getElementById("bitGrid");
  const placeRows = document.getElementById("placeRows");
  const headlineDecimal = document.getElementById("headlineDecimal");
  const binaryValue = document.getElementById("binaryValue");
  const decimalValue = document.getElementById("decimalValue");
  const hexValue = document.getElementById("hexValue");
  const sumFormula = document.getElementById("sumFormula");
  const liveFeedback = document.getElementById("liveFeedback");
  const targetValue = document.getElementById("targetValue");
  const targetHint = document.getElementById("targetHint");
  const challengeFeedback = document.getElementById("challengeFeedback");
  const scoreOutput = document.getElementById("score");

  let score = 0;
  let target = 173;
  let hintShown = false;
  let challengeCompleted = false;

  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  const questions = [
    { q: "How many bits are in one byte?", options: ["4", "8", "16", "32"], answer: 1, explain: "One byte contains 8 bits." },
    { q: "What is the largest unsigned value that fits in 8 bits?", options: ["128", "255", "256", "512"], answer: 1, explain: "Eight bits have 2⁸ = 256 patterns, from 0 through 255." },
    { q: "What is binary 00001010 in decimal?", options: ["8", "10", "12", "20"], answer: 1, explain: "8 + 2 = 10." },
    { q: "Which hexadecimal digits represent decimal 15?", options: ["A", "C", "E", "F"], answer: 3, explain: "Hexadecimal uses A=10, B=11, C=12, D=13, E=14, F=15." },
    { q: "In 10000000, which bit is set?", options: ["Bit 0", "Bit 3", "Bit 7", "All bits"], answer: 2, explain: "The leftmost bit is bit 7 and has place value 128." }
  ];

  function createBitControls() {
    weights.forEach((weight, index) => {
      const bitNumber = 7 - index;
      const cell = document.createElement("div");
      cell.className = "bit-cell";
      cell.innerHTML = `<input type="checkbox" id="bit-${bitNumber}" aria-label="Bit ${bitNumber}, place value ${weight}"><label for="bit-${bitNumber}">BIT ${bitNumber}</label><span class="weight">${weight}</span>`;
      cell.querySelector("input").addEventListener("change", () => {
        updateDisplay();
        liveFeedback.textContent = `Bit ${bitNumber} is now ${cell.querySelector("input").checked ? "1" : "0"}.`;
        liveFeedback.classList.remove("error");
      });
      bitGrid.appendChild(cell);

      const row = document.createElement("div");
      row.className = "place-row";
      row.setAttribute("role", "row");
      row.innerHTML = `<span>${bitNumber}</span><span>2<sup>${bitNumber}</sup></span><span>${weight}</span><span id="selected-${bitNumber}">Off</span>`;
      placeRows.appendChild(row);
    });
  }

  function currentValue() {
    let value = 0;
    weights.forEach((weight, index) => {
      const bitNumber = 7 - index;
      if (document.getElementById(`bit-${bitNumber}`).checked) value += weight;
    });
    return value;
  }

  function setValue(value) {
    const safeValue = Math.max(0, Math.min(255, Math.floor(Number(value) || 0)));
    for (let bit = 0; bit < 8; bit++) {
      document.getElementById(`bit-${bit}`).checked = Boolean(safeValue & (1 << bit));
    }
    updateDisplay();
  }

  function updateDisplay() {
    const value = currentValue();
    const binary = value.toString(2).padStart(8, "0");
    headlineDecimal.textContent = value;
    binaryValue.textContent = binary;
    decimalValue.textContent = String(value);
    hexValue.textContent = value.toString(16).toUpperCase().padStart(2, "0");

    const terms = [];
    weights.forEach((weight, index) => {
      const bitNumber = 7 - index;
      const selected = document.getElementById(`bit-${bitNumber}`).checked;
      const selectedCell = document.getElementById(`selected-${bitNumber}`);
      selectedCell.textContent = selected ? "On (1)" : "Off (0)";
      selectedCell.className = selected ? "selected" : "";
      if (selected) terms.push(weight);
    });
    sumFormula.textContent = terms.length ? terms.join(" + ") + " = " + value : "0 = 0";
  }

  function setFeedback(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle("error", isError);
  }

  function newChallenge() {
    const previous = target;
    do { target = Math.floor(Math.random() * 256); } while (target === previous);
    targetValue.textContent = target;
    targetHint.textContent = "Convert the target into an 8-bit binary pattern.";
    hintShown = false;
    challengeCompleted = false;
    setFeedback(challengeFeedback, "Set the bits, then check your answer.");
  }

  function renderQuiz() {
    const container = document.getElementById("quizQuestions");
    questions.forEach((question, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "quiz-question";
      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.textContent = `${index + 1}. ${question.q}`;
      fieldset.appendChild(legend);
      question.options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        label.className = "quiz-option";
        label.innerHTML = `<input type="radio" name="quiz-${index}" value="${optionIndex}"><span>${option}</span>`;
        fieldset.appendChild(label);
      });
      const explain = document.createElement("p");
      explain.className = "muted small explanation";
      explain.hidden = true;
      explain.id = `explain-${index}`;
      wrapper.append(fieldset, explain);
      container.appendChild(wrapper);
    });
  }

  document.getElementById("clearBtn").addEventListener("click", () => {
    setValue(0);
    setFeedback(liveFeedback, "All bits cleared. Current value is 0.");
  });
  document.getElementById("randomBtn").addEventListener("click", () => {
    const value = Math.floor(Math.random() * 256);
    setValue(value);
    setFeedback(liveFeedback, `Random value generated: ${value}.`);
  });
  document.getElementById("invertBtn").addEventListener("click", () => {
    for (let bit = 0; bit < 8; bit++) {
      const control = document.getElementById(`bit-${bit}`);
      control.checked = !control.checked;
    }
    updateDisplay();
    setFeedback(liveFeedback, "All bits inverted: every 0 became 1 and every 1 became 0.");
  });
  document.querySelectorAll(".copy-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const text = document.getElementById(button.dataset.copy).textContent;
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "Copied!";
      } catch {
        setFeedback(liveFeedback, `Copy was blocked by the browser. Select and copy this value: ${text}`, true);
      }
      window.setTimeout(() => { button.textContent = "Copy"; }, 1300);
    });
  });

  document.getElementById("hintBtn").addEventListener("click", () => {
    const binary = target.toString(2).padStart(8, "0");
    targetHint.textContent = `Hint: binary pattern is ${binary}. Left to right, set a bit to 1 when its place value is included in ${target}.`;
    hintShown = true;
    setFeedback(challengeFeedback, "Hint revealed. Use it to set the switches.");
  });
  document.getElementById("checkBtn").addEventListener("click", () => {
    const value = currentValue();
    if (value === target) {
      if (!challengeCompleted) {
        score += hintShown ? 5 : 10;
        scoreOutput.textContent = score;
        challengeCompleted = true;
      }
      setFeedback(challengeFeedback, `Correct! ${target} is ${target.toString(2).padStart(8, "0")} in binary. ${hintShown ? "You earned 5 points with the hint." : "You earned 10 points."}`);
    } else {
      const relation = value < target ? "higher" : "lower";
      setFeedback(challengeFeedback, `Not quite. Your value is ${value}; the target is ${target}. Try a ${relation} value and check the place values.`, true);
    }
  });
  document.getElementById("newChallengeBtn").addEventListener("click", newChallenge);

  document.getElementById("quizSubmitBtn").addEventListener("click", () => {
    let correct = 0;
    let answered = 0;
    questions.forEach((question, index) => {
      const selected = document.querySelector(`input[name="quiz-${index}"]:checked`);
      const wrapper = document.querySelectorAll(".quiz-question")[index];
      const explanation = document.getElementById(`explain-${index}`);
      wrapper.classList.remove("correct", "incorrect");
      if (selected) {
        answered++;
        const isCorrect = Number(selected.value) === question.answer;
        if (isCorrect) correct++;
        wrapper.classList.add(isCorrect ? "correct" : "incorrect");
        explanation.textContent = `${isCorrect ? "Correct. " : "Review: "}${question.explain}`;
        explanation.hidden = false;
      } else {
        explanation.textContent = `Not answered. ${question.explain}`;
        explanation.hidden = false;
        wrapper.classList.add("incorrect");
      }
    });
    setFeedback(document.getElementById("quizFeedback"), `Score: ${correct}/${questions.length}. Answered: ${answered}/${questions.length}. Review the explanations above.`);
  });

  createBitControls();
  renderQuiz();
  setValue(0);
  targetValue.textContent = target;
})();