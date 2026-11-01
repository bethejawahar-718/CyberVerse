const GATES = {
  AND: { title: "AND gate", text: "Output is 1 only when both inputs are 1.", formula: "Y = A · B", fn: (a,b) => a & b },
  OR:  { title: "OR gate", text: "Output is 1 when at least one input is 1.", formula: "Y = A + B", fn: (a,b) => a | b },
  NOT: { title: "NOT gate", text: "Output is the opposite of input A. This gate uses one input.", formula: "Y = ¬A", fn: a => a === 0 ? 1 : 0 },
  NAND:{ title: "NAND gate", text: "NAND is the opposite of AND. Output is 0 only when both inputs are 1.", formula: "Y = ¬(A · B)", fn: (a,b) => (a & b) === 1 ? 0 : 1 },
  NOR: { title: "NOR gate", text: "NOR is the opposite of OR. Output is 1 only when both inputs are 0.", formula: "Y = ¬(A + B)", fn: (a,b) => (a | b) === 1 ? 0 : 1 },
  XOR: { title: "XOR gate", text: "Output is 1 when the two inputs are different.", formula: "Y = A ⊕ B", fn: (a,b) => a !== b ? 1 : 0 },
  XNOR:{ title: "XNOR gate", text: "Output is 1 when the two inputs are the same.", formula: "Y = ¬(A ⊕ B)", fn: (a,b) => a === b ? 1 : 0 }
};

let inputA = 0;
let inputB = 0;
let currentGate = "AND";

const $ = id => document.getElementById(id);

function gateOutput(gate, a, b) {
  return GATES[gate].fn(a, b);
}

function setGate(gate) {
  currentGate = gate;
  $("gateSelect").value = gate;
  document.querySelectorAll(".gate-chip").forEach(button => {
    const selected = button.dataset.gate === gate;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  $("guideSymbol").textContent = gate;
  $("guideTitle").textContent = GATES[gate].title;
  $("guideText").textContent = GATES[gate].text;
  $("guideFormula").textContent = GATES[gate].formula;
  $("gateVisual").textContent = gate;
  $("inputBControl").hidden = gate === "NOT";
  $("wireB").hidden = gate === "NOT";
  $("bHeader").textContent = gate === "NOT" ? "—" : "B";
  render();
}

function renderTruthTable() {
  const body = $("truthTableBody");
  body.replaceChildren();
  const rows = currentGate === "NOT"
    ? [{a:0,b:null},{a:1,b:null}]
    : [{a:0,b:0},{a:0,b:1},{a:1,b:0},{a:1,b:1}];

  rows.forEach(row => {
    const output = gateOutput(currentGate, row.a, row.b);
    const tr = document.createElement("tr");
    if (row.a === inputA && (currentGate === "NOT" || row.b === inputB)) tr.classList.add("active-row");
    [row.a, row.b === null ? "—" : row.b, output, (row.a === inputA && (currentGate === "NOT" || row.b === inputB)) ? "CURRENT" : ""].forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
}

function render() {
  const output = gateOutput(currentGate, inputA, inputB);
  $("inputAValue").textContent = String(inputA);
  $("inputBValue").textContent = String(inputB);
  $("nodeA").textContent = String(inputA);
  $("nodeB").textContent = String(inputB);
  $("outputNode").textContent = String(output);
  $("outputValue").textContent = String(output);
  $("outputMeaning").textContent = output === 1 ? "HIGH · TRUE" : "LOW · FALSE";
  $("outputExplanation").textContent = currentGate === "NOT"
    ? `NOT reverses A: input ${inputA} produces output ${output}.`
    : `${currentGate} with A = ${inputA} and B = ${inputB} produces ${output}. ${GATES[currentGate].text}`;
  $("aZero").setAttribute("aria-pressed", String(inputA === 0));
  $("aOne").setAttribute("aria-pressed", String(inputA === 1));
  $("bZero").setAttribute("aria-pressed", String(inputB === 0));
  $("bOne").setAttribute("aria-pressed", String(inputB === 1));
  renderTruthTable();
}

$("gateSelect").addEventListener("change", event => setGate(event.target.value));
document.querySelectorAll(".gate-chip").forEach(button => button.addEventListener("click", () => setGate(button.dataset.gate)));
$("aZero").addEventListener("click", () => { inputA = 0; render(); });
$("aOne").addEventListener("click", () => { inputA = 1; render(); });
$("bZero").addEventListener("click", () => { inputB = 0; render(); });
$("bOne").addEventListener("click", () => { inputB = 1; render(); });

let solved = 0;
let challenge = null;
let answered = false;

function randomInt(max) { return Math.floor(Math.random() * max); }

function newChallenge() {
  const gates = Object.keys(GATES);
  const gate = gates[randomInt(gates.length)];
  const a = randomInt(2);
  const b = randomInt(2);
  challenge = { gate, a, b, answer: gateOutput(gate, a, b) };
  answered = false;
  $("challengeNumber").textContent = `CHALLENGE ${String(solved + 1).padStart(2, "0")}`;
  $("challengeQuestion").textContent = gate === "NOT"
    ? `What is the output of NOT when A = ${a}?`
    : `What is the output of ${gate} when A = ${a} and B = ${b}?`;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("hint").hidden = true;
  $("hint").textContent = GATES[gate].text;
  document.querySelectorAll(".answer-option").forEach(button => {
    button.disabled = false;
    button.style.borderColor = "";
  });
}

document.querySelectorAll(".answer-option").forEach(button => {
  button.addEventListener("click", () => {
    if (answered || !challenge) return;
    const picked = Number(button.dataset.answer);
    const feedback = $("feedback");
    if (picked === challenge.answer) {
      solved++;
      $("score").textContent = String(solved);
      feedback.textContent = `Correct! ${challenge.gate} produces output ${challenge.answer} for these inputs.`;
      feedback.className = "feedback success";
      answered = true;
      document.querySelectorAll(".answer-option").forEach(option => option.disabled = true);
      button.style.borderColor = "var(--green)";
    } else {
      feedback.textContent = "Not quite. Review the gate's rule and try again.";
      feedback.className = "feedback failure";
      button.style.borderColor = "var(--red)";
    }
  });
});

$("hintBtn").addEventListener("click", () => { $("hint").hidden = false; });
$("nextBtn").addEventListener("click", newChallenge);

setGate("AND");
newChallenge();
