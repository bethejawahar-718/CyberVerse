(() => {
  "use strict";

  const expressionInput = document.getElementById("expressionInput");
  const truthTableBody = document.getElementById("truthTableBody");
  const expressionFeedback = document.getElementById("expressionFeedback");
  const compareFeedback = document.getElementById("compareFeedback");
  const compareTable = document.getElementById("compareTable");
  const challengeFeedback = document.getElementById("challengeFeedback");
  const scoreOutput = document.getElementById("score");
  let score = 0;
  let activeChallenge = null;
  let challengeAnswered = false;

  const quiz = [
    { q: "In Boolean algebra, what does 1 usually represent?", options: ["FALSE", "TRUE", "Unknown", "A variable only"], answer: 1, explain: "1 represents TRUE and 0 represents FALSE." },
    { q: "When is A AND B equal to 1?", options: ["When A or B is 1", "Only when both A and B are 1", "Only when both are 0", "Always"], answer: 1, explain: "AND returns 1 only if both inputs are 1." },
    { q: "What is A OR 0 equal to?", options: ["0", "1", "A", "NOT A"], answer: 2, explain: "The identity law says A OR 0 = A." },
    { q: "Which law is shown by NOT (A AND B) = NOT A OR NOT B?", options: ["Identity law", "Idempotent law", "De Morgan's law", "Domination law"], answer: 2, explain: "This is one of De Morgan's laws." },
    { q: "Two expressions are equivalent when…", options: ["They look similar", "They use the same letters", "They match for every input combination", "They always output 1"], answer: 2, explain: "Equivalence requires identical outputs for all possible input combinations." }
  ];

  function tokenize(source) {
    const normalized = source.toUpperCase()
      .replace(/\bAND\b/g, "&")
      .replace(/\bOR\b/g, "|")
      .replace(/\bNOT\b/g, "!")
      .replace(/&&/g, "&")
      .replace(/\|\|/g, "|");
    const tokens = [];
    let i = 0;
    while (i < normalized.length) {
      if (/\s/.test(normalized[i])) { i++; continue; }
      const two = normalized.slice(i, i + 2);
      if (two === "&&" || two === "||") { tokens.push(two === "&&" ? "&" : "|"); i += 2; continue; }
      const ch = normalized[i];
      if ("A B C 0 1 & | ! ( )".split(" ").includes(ch)) { tokens.push(ch); i++; continue; }
      throw new Error(`Unsupported character "${source[i]}". Use only A, B, C, 0, 1, AND, OR, NOT, and parentheses.`);
    }
    if (!tokens.length) throw new Error("Enter an expression first.");
    return tokens;
  }

  function parseExpression(source) {
    const tokens = tokenize(source);
    let position = 0;
    function parseOr() {
      let node = parseAnd();
      while (tokens[position] === "|") { position++; node = { type: "or", left: node, right: parseAnd() }; }
      return node;
    }
    function parseAnd() {
      let node = parseUnary();
      while (tokens[position] === "&") { position++; node = { type: "and", left: node, right: parseUnary() }; }
      return node;
    }
    function parseUnary() {
      if (tokens[position] === "!") { position++; return { type: "not", child: parseUnary() }; }
      if (tokens[position] === "(") {
        position++;
        const node = parseOr();
        if (tokens[position] !== ")") throw new Error("Missing closing parenthesis ).");
        position++;
        return node;
      }
      const token = tokens[position];
      if (["A", "B", "C", "0", "1"].includes(token)) {
        position++;
        return token === "0" || token === "1" ? { type: "constant", value: token === "1" } : { type: "variable", name: token };
      }
      if (token === ")") throw new Error("There is an extra closing parenthesis ).");
      throw new Error("Expected a variable (A, B, C), 0, 1, NOT, or an opening parenthesis.");
    }
    const ast = parseOr();
    if (position < tokens.length) throw new Error(`Unexpected token "${tokens[position]}". Check your operators and parentheses.`);
    return ast;
  }

  function evaluate(ast, vars) {
    switch (ast.type) {
      case "constant": return ast.value;
      case "variable": return Boolean(vars[ast.name]);
      case "not": return !evaluate(ast.child, vars);
      case "and": return evaluate(ast.left, vars) && evaluate(ast.right, vars);
      case "or": return evaluate(ast.left, vars) || evaluate(ast.right, vars);
      default: throw new Error("Unknown expression node.");
    }
  }

  function combinations() {
    return [
      { A: 0, B: 0, C: 0 }, { A: 0, B: 0, C: 1 },
      { A: 0, B: 1, C: 0 }, { A: 0, B: 1, C: 1 },
      { A: 1, B: 0, C: 0 }, { A: 1, B: 0, C: 1 },
      { A: 1, B: 1, C: 0 }, { A: 1, B: 1, C: 1 }
    ];
  }

  function setFeedback(element, message, error = false) {
    element.textContent = message;
    element.classList.toggle("error", error);
  }

  function generateTable() {
    try {
      const ast = parseExpression(expressionInput.value);
      const rows = combinations();
      truthTableBody.replaceChildren();
      rows.forEach(vars => {
        const out = evaluate(ast, vars);
        const tr = document.createElement("tr");
        if (vars.A === 1 && vars.B === 1 && vars.C === 1) tr.className = "active-row";
        [vars.A, vars.B, vars.C].forEach(value => {
          const td = document.createElement("td");
          td.textContent = value;
          tr.appendChild(td);
        });
        const output = document.createElement("td");
        output.textContent = out ? "1 (TRUE)" : "0 (FALSE)";
        output.className = out ? "output-true" : "output-false";
        tr.appendChild(output);
        truthTableBody.appendChild(tr);
      });
      document.getElementById("rowCount").textContent = rows.length;
      setFeedback(expressionFeedback, "Truth table generated successfully.");
    } catch (error) {
      setFeedback(expressionFeedback, error.message, true);
    }
  }

  function compareExpressions() {
    try {
      const ast1 = parseExpression(document.getElementById("exprOne").value);
      const ast2 = parseExpression(document.getElementById("exprTwo").value);
      const rows = combinations();
      let same = true;
      const table = document.createElement("table");
      table.innerHTML = "<thead><tr><th>A</th><th>B</th><th>C</th><th>Expr. 1</th><th>Expr. 2</th><th>Match?</th></tr></thead>";
      const tbody = document.createElement("tbody");
      rows.forEach(vars => {
        const a = evaluate(ast1, vars);
        const b = evaluate(ast2, vars);
        if (a !== b) same = false;
        const tr = document.createElement("tr");
        [vars.A, vars.B, vars.C, Number(a), Number(b), a === b ? "Yes" : "No"].forEach((value, index) => {
          const td = document.createElement("td");
          td.textContent = value;
          if (index === 5) td.className = a === b ? "output-true" : "output-false";
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      compareTable.replaceChildren(table);
      compareTable.hidden = false;
      setFeedback(compareFeedback, same ? "Equivalent! The outputs match for all 8 input combinations." : "Not equivalent. At least one input combination produces different outputs.", !same);
    } catch (error) {
      compareTable.hidden = true;
      setFeedback(compareFeedback, error.message, true);
    }
  }

  const challengePool = [
    { a: "A AND (B OR C)", b: "(A AND B) OR (A AND C)", equivalent: true, law: "Distributive law: A AND (B OR C) = (A AND B) OR (A AND C)." },
    { a: "NOT (A OR B)", b: "NOT A OR NOT B", equivalent: false, law: "De Morgan's law says NOT (A OR B) = NOT A AND NOT B." },
    { a: "A OR (A AND B)", b: "A", equivalent: true, law: "Absorption law: A OR (A AND B) = A." },
    { a: "A AND NOT A", b: "1", equivalent: false, law: "A and NOT A can never both be true, so A AND NOT A = 0." },
    { a: "NOT (A AND B)", b: "NOT A OR NOT B", equivalent: true, law: "De Morgan's law: NOT (A AND B) = NOT A OR NOT B." },
    { a: "A OR 0", b: "NOT A", equivalent: false, law: "Identity law says A OR 0 = A, not NOT A." },
    { a: "A AND 1", b: "A", equivalent: true, law: "Identity law: A AND 1 = A." }
  ];

  function loadChallenge() {
    const previous = activeChallenge;
    do { activeChallenge = challengePool[Math.floor(Math.random() * challengePool.length)]; } while (challengePool.length > 1 && activeChallenge === previous);
    document.getElementById("challengeA").textContent = activeChallenge.a;
    document.getElementById("challengeB").textContent = activeChallenge.b;
    challengeAnswered = false;
    setFeedback(challengeFeedback, "Choose whether both expressions always match.");
  }

  function answerChallenge(answer) {
    if (!activeChallenge) return;
    const correct = answer === activeChallenge.equivalent;
    if (correct && !challengeAnswered) {
      score += 10;
      scoreOutput.textContent = score;
    }
    challengeAnswered = true;
    setFeedback(challengeFeedback, `${correct ? "Correct! +10 points. " : "Not quite. "} ${activeChallenge.law}`, !correct);
  }

  function renderQuiz() {
    const container = document.getElementById("quizQuestions");
    quiz.forEach((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "quiz-question";
      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.textContent = `${index + 1}. ${item.q}`;
      fieldset.appendChild(legend);
      item.options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        label.className = "quiz-option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `quiz-${index}`;
        input.value = optionIndex;
        const span = document.createElement("span");
        span.textContent = option;
        label.append(input, span);
        fieldset.appendChild(label);
      });
      const explanation = document.createElement("p");
      explanation.className = "muted small";
      explanation.id = `quiz-explain-${index}`;
      explanation.hidden = true;
      wrapper.append(fieldset, explanation);
      container.appendChild(wrapper);
    });
  }

  document.getElementById("generateBtn").addEventListener("click", generateTable);
  expressionInput.addEventListener("keydown", event => { if (event.key === "Enter") generateTable(); });
  document.querySelectorAll(".example-btn").forEach(button => {
    button.addEventListener("click", () => {
      expressionInput.value = button.dataset.expression;
      generateTable();
    });
  });
  document.getElementById("compareBtn").addEventListener("click", compareExpressions);
  document.getElementById("challengeYes").addEventListener("click", () => answerChallenge(true));
  document.getElementById("challengeNo").addEventListener("click", () => answerChallenge(false));
  document.getElementById("newChallengeBtn").addEventListener("click", loadChallenge);
  document.getElementById("quizSubmitBtn").addEventListener("click", () => {
    let correct = 0;
    let answered = 0;
    quiz.forEach((item, index) => {
      const selected = document.querySelector(`input[name="quiz-${index}"]:checked`);
      const wrapper = document.querySelectorAll(".quiz-question")[index];
      const explanation = document.getElementById(`quiz-explain-${index}`);
      wrapper.classList.remove("correct", "incorrect");
      if (selected) {
        answered++;
        const isCorrect = Number(selected.value) === item.answer;
        if (isCorrect) correct++;
        wrapper.classList.add(isCorrect ? "correct" : "incorrect");
        explanation.textContent = `${isCorrect ? "Correct. " : "Review: "}${item.explain}`;
      } else {
        wrapper.classList.add("incorrect");
        explanation.textContent = `Not answered. ${item.explain}`;
      }
      explanation.hidden = false;
    });
    setFeedback(document.getElementById("quizFeedback"), `Score: ${correct}/${quiz.length}. Answered: ${answered}/${quiz.length}. Review the explanations above.`);
  });

  renderQuiz();
  generateTable();
  compareExpressions();
  loadChallenge();
})();