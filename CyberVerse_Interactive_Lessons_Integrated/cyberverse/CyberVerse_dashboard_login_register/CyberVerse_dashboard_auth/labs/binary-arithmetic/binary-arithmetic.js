const operation = document.getElementById("operation");
const operandA = document.getElementById("operandA");
const operandB = document.getElementById("operandB");
const calcError = document.getElementById("calcError");
const stepsList = document.getElementById("stepsList");

function parseBinary(raw, label) {
  const value = raw.trim().replaceAll("_", "");
  if (!value) throw new Error(`Enter binary digits for ${label}.`);
  if (!/^[01]+$/.test(value)) throw new Error(`${label} can contain only 0 and 1 (underscores may separate groups).`);
  if (value.length > 16) throw new Error(`${label} must be 16 bits or fewer.`);
  return { text: value, number: BigInt(`0b${value}`) };
}

function toBinary(number) {
  return number.toString(2);
}

function addSteps(aText, bText, a, b, result) {
  const steps = [];
  steps.push(`A = ${aText}₂ = ${a.toString(10)}₁₀.`);
  steps.push(`B = ${bText}₂ = ${b.toString(10)}₁₀.`);
  if (operation.value === "add") {
    steps.push("Add from the rightmost bit, just like decimal addition.");
    steps.push("Binary rules: 0+0=0, 0+1=1, 1+0=1, and 1+1=10 (write 0 and carry 1).");
    steps.push(`Decimal check: ${a} + ${b} = ${result}.`);
  } else {
    steps.push("Subtract B from A. When a 0 must subtract 1, borrow from the next available 1 bit.");
    steps.push(`Decimal check: ${a} − ${b} = ${result}.`);
    if (result < 0n) steps.push("The result is negative; the minus sign is shown before the binary magnitude.");
  }
  steps.push(`Convert the result to binary: ${result.toString(2)}₂.`);
  return steps;
}

function renderSteps(steps) {
  stepsList.replaceChildren();
  steps.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    stepsList.appendChild(li);
  });
  document.getElementById("stepsCount").textContent = `${steps.length} steps`;
}

function calculate() {
  try {
    const aData = parseBinary(operandA.value, "Operand A");
    const bData = parseBinary(operandB.value, "Operand B");
    const a = aData.number;
    const b = bData.number;
    const result = operation.value === "add" ? a + b : a - b;
    calcError.textContent = "";
    operandA.removeAttribute("aria-invalid");
    operandB.removeAttribute("aria-invalid");

    document.getElementById("displayA").textContent = aData.text;
    document.getElementById("displayB").textContent = bData.text;
    document.getElementById("operatorSymbol").textContent = operation.value === "add" ? "+" : "−";
    document.getElementById("binaryResult").textContent = toBinary(result);
    document.getElementById("decimalA").textContent = a.toString(10);
    document.getElementById("decimalB").textContent = b.toString(10);
    document.getElementById("decimalResult").textContent = result.toString(10);
    document.getElementById("resultDecimal").textContent = `Decimal: ${result.toString(10)}`;
    renderSteps(addSteps(aData.text, bData.text, a, b, result));
  } catch (error) {
    calcError.textContent = error.message;
    if (!operandA.value.trim() || !/^[01_]+$/.test(operandA.value.trim())) {
      operandA.setAttribute("aria-invalid", "true");
      operandA.focus();
    } else {
      operandB.setAttribute("aria-invalid", "true");
      operandB.focus();
    }
  }
}

document.getElementById("calculateBtn").addEventListener("click", calculate);
[operandA, operandB].forEach(input => input.addEventListener("keydown", event => {
  if (event.key === "Enter") calculate();
}));
operation.addEventListener("change", calculate);
document.getElementById("resetBtn").addEventListener("click", () => {
  operation.value = "add";
  operandA.value = "1011";
  operandB.value = "0110";
  calcError.textContent = "";
  calculate();
});

let solved = 0;
let challenge = null;
let challengeSolved = false;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nextChallenge() {
  const isAddition = Math.random() < 0.6;
  let a = randomInt(2, 31);
  let b = randomInt(1, 20);
  if (!isAddition && b > a) [a, b] = [b, a];
  const aBig = BigInt(a);
  const bBig = BigInt(b);
  const result = isAddition ? aBig + bBig : aBig - bBig;
  challenge = { a: aBig, b: bBig, result, op: isAddition ? "+" : "−" };
  challengeSolved = false;
  document.getElementById("challengeLabel").textContent = `CHALLENGE ${String(solved + 1).padStart(2, "0")}`;
  document.getElementById("difficulty").textContent = result > 31n ? "PRACTICE" : "BEGINNER";
  document.getElementById("question").textContent =
    `Calculate ${aBig.toString(2)} ${challenge.op} ${bBig.toString(2)} in binary.`;
  document.getElementById("answerInput").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "feedback";
  document.getElementById("hint").hidden = true;
  document.getElementById("hint").textContent =
    `Decimal check: ${a} ${isAddition ? "+" : "−"} ${b} = ${result}. Convert ${result} to binary, or work bit by bit.`;
}

document.getElementById("checkBtn").addEventListener("click", () => {
  if (!challenge || challengeSolved) return;
  const raw = document.getElementById("answerInput").value.trim().replaceAll("_", "");
  const feedback = document.getElementById("feedback");
  if (!raw) {
    feedback.textContent = "Enter your binary answer first.";
    feedback.className = "feedback failure";
    return;
  }
  if (!/^-?[01]+$/.test(raw)) {
    feedback.textContent = "Use only 0 and 1. A leading minus sign is allowed for negative results.";
    feedback.className = "feedback failure";
    return;
  }
  let answer;
  try {
    const negative = raw.startsWith("-");
    const digits = negative ? raw.slice(1) : raw;
    answer = BigInt(`0b${digits}`);
    if (negative) answer = -answer;
  } catch {
    feedback.textContent = "That answer could not be read. Try again.";
    feedback.className = "feedback failure";
    return;
  }
  if (answer === challenge.result) {
    solved++;
    document.getElementById("score").textContent = String(solved);
    feedback.textContent = `Correct! The answer is ${challenge.result.toString(2)}₂ (${challenge.result.toString(10)} in decimal).`;
    feedback.className = "feedback success";
    challengeSolved = true;
  } else {
    feedback.textContent = "Not quite. Check the carry or borrow and try again.";
    feedback.className = "feedback failure";
  }
});

document.getElementById("answerInput").addEventListener("keydown", event => {
  if (event.key === "Enter") document.getElementById("checkBtn").click();
});
document.getElementById("hintBtn").addEventListener("click", () => {
  document.getElementById("hint").hidden = false;
});
document.getElementById("nextBtn").addEventListener("click", nextChallenge);

calculate();
nextChallenge();
