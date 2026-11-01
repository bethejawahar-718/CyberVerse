const input = document.getElementById("numberInput");
const fromBase = document.getElementById("fromBase");
const errorBox = document.getElementById("inputError");
const stepsList = document.getElementById("stepsList");
const stepCount = document.getElementById("stepCount");
const toast = document.getElementById("toast");

const BASE_NAMES = { 2: "binary", 8: "octal", 10: "decimal", 16: "hexadecimal" };
const OUTPUT_IDS = { 2: "binaryOutput", 8: "octalOutput", 10: "decimalOutput", 16: "hexOutput" };
let completedChallenges = 0;
let currentChallenge = null;
let challengeLocked = false;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function cleanNumber(raw) {
  return raw.trim().replaceAll("_", "");
}

function parseInteger(raw, base) {
  const value = cleanNumber(raw);
  if (!value) throw new Error("Enter a number before converting.");
  const signless = value.startsWith("-") ? value.slice(1) : value;
  if (!signless) throw new Error("Enter digits after the minus sign.");
  const patterns = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-fA-F]+$/
  };
  if (!patterns[base].test(signless)) {
    const valid = { 2: "0 and 1", 8: "0–7", 10: "0–9", 16: "0–9 and A–F" };
    throw new Error(`Invalid ${BASE_NAMES[base]} number. Allowed digits: ${valid[base]}.`);
  }
  // Parse each digit using the selected base. BigInt preserves large integer precision.
  const negative = value.startsWith("-");
  const digits = negative ? value.slice(1) : value;
  const digitValues = "0123456789ABCDEF";
  let result = 0n;
  for (const character of digits.toUpperCase()) {
    const digit = digitValues.indexOf(character);
    result = result * BigInt(base) + BigInt(digit);
  }
  return negative ? -result : result;
}

function toBaseString(value, base) {
  return value.toString(base).toUpperCase();
}

function divisionSteps(decimalValue, targetBase, label) {
  if (decimalValue === 0n) return [`Decimal 0 is 0 in ${label}.`];
  const negative = decimalValue < 0n;
  let current = negative ? -decimalValue : decimalValue;
  const rows = [];
  while (current > 0n) {
    const quotient = current / BigInt(targetBase);
    const remainder = current % BigInt(targetBase);
    rows.push(`${current} ÷ ${targetBase} = ${quotient}, remainder ${remainder.toString(targetBase).toUpperCase()}.`);
    current = quotient;
  }
  rows.push(`Read the remainders from bottom to top to get ${toBaseString(decimalValue, targetBase)}${negative ? " (keep the minus sign)" : ""}.`);
  return rows;
}

function makeSteps(value, sourceBase, decimalValue) {
  const steps = [];
  const sourceName = BASE_NAMES[sourceBase];
  steps.push(`Input: ${value.toString().toUpperCase()} in ${sourceName} (base ${sourceBase}).`);
  if (sourceBase !== 10) {
    const unsigned = value < 0n ? -value : value;
    const digits = unsigned.toString(sourceBase).toUpperCase();
    const expanded = [...digits].reverse().map((digit, position) => `${digit} × ${sourceBase}^${position}`).reverse();
    steps.push(`Place-value expansion: ${expanded.join(" + ")}.`);
    steps.push(`Add the place values: decimal ${decimalValue.toString()}.`);
  } else {
    steps.push(`The input is already decimal: ${decimalValue.toString()}.`);
  }
  steps.push("Convert decimal to binary using repeated division by 2:");
  steps.push(...divisionSteps(decimalValue, 2, "binary"));
  steps.push("Convert decimal to octal using repeated division by 8:");
  steps.push(...divisionSteps(decimalValue, 8, "octal"));
  steps.push("Convert decimal to hexadecimal using repeated division by 16:");
  steps.push(...divisionSteps(decimalValue, 16, "hexadecimal"));
  return steps;
}

function renderSteps(steps) {
  stepsList.replaceChildren();
  steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });
  stepCount.textContent = `${steps.length} ${steps.length === 1 ? "step" : "steps"}`;
}

function convert() {
  const base = Number(fromBase.value);
  let value;
  try {
    value = parseInteger(input.value, base);
  } catch (error) {
    errorBox.textContent = error.message;
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return;
  }

  errorBox.textContent = "";
  input.removeAttribute("aria-invalid");
  const values = {
    2: toBaseString(value, 2),
    8: toBaseString(value, 8),
    10: value.toString(10),
    16: toBaseString(value, 16)
  };
  Object.entries(OUTPUT_IDS).forEach(([baseKey, id]) => {
    document.getElementById(id).textContent = values[Number(baseKey)];
  });
  document.getElementById("decimalValue").textContent = `Decimal: ${values[10]}`;
  renderSteps(makeSteps(value, base, value));
}

document.getElementById("convertBtn").addEventListener("click", convert);
input.addEventListener("keydown", event => {
  if (event.key === "Enter") convert();
});
fromBase.addEventListener("change", () => {
  errorBox.textContent = "";
  input.removeAttribute("aria-invalid");
  convert();
});
document.getElementById("resetBtn").addEventListener("click", () => {
  input.value = "42";
  fromBase.value = "10";
  errorBox.textContent = "";
  input.removeAttribute("aria-invalid");
  convert();
  showToast("Converter reset.");
});

document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    const value = document.getElementById(button.dataset.copy).textContent;
    try {
      await navigator.clipboard.writeText(value);
      showToast("Result copied.");
    } catch {
      showToast(`Result: ${value}`);
    }
  });
});

// Challenges use a known integer and compare normalized answers in the target base.
const challengeBases = [
  { base: 2, name: "binary", difficulty: "BEGINNER" },
  { base: 8, name: "octal", difficulty: "BEGINNER" },
  { base: 16, name: "hexadecimal", difficulty: "BEGINNER" },
  { base: 10, name: "decimal", difficulty: "BEGINNER" },
  { base: 2, name: "binary", difficulty: "PRACTICE" },
  { base: 16, name: "hexadecimal", difficulty: "PRACTICE" }
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nextChallenge() {
  const target = challengeBases[randomInt(0, challengeBases.length - 1)];
  const sourceBases = [2, 8, 10, 16].filter(base => base !== target.base);
  const sourceBase = sourceBases[randomInt(0, sourceBases.length - 1)];
  const value = BigInt(randomInt(10, 250));
  currentChallenge = {
    value,
    sourceBase,
    targetBase: target.base,
    answer: value.toString(target.base).toUpperCase(),
    targetName: target.name
  };
  challengeLocked = false;

  document.getElementById("challengeNumber").textContent = `CHALLENGE ${String(completedChallenges + 1).padStart(2, "0")}`;
  document.getElementById("challengeDifficulty").textContent = target.difficulty;
  document.getElementById("challengeQuestion").textContent =
    `Convert ${value.toString(sourceBase).toUpperCase()} (${BASE_NAMES[sourceBase]}) to ${target.name}.`;
  document.getElementById("challengeAnswer").value = "";
  document.getElementById("challengeFeedback").textContent = "";
  document.getElementById("challengeFeedback").className = "feedback";
  document.getElementById("hintText").hidden = true;
  document.getElementById("hintText").textContent =
    `First convert ${value.toString(sourceBase).toUpperCase()} from ${BASE_NAMES[sourceBase]} to decimal. Then convert decimal ${value.toString()} to ${target.name}.`;
  document.getElementById("challengeAnswer").focus();
}

document.getElementById("checkAnswerBtn").addEventListener("click", () => {
  if (!currentChallenge || challengeLocked) return;
  const answer = cleanNumber(document.getElementById("challengeAnswer").value).toUpperCase();
  const feedback = document.getElementById("challengeFeedback");
  if (!answer) {
    feedback.textContent = "Type your answer first.";
    feedback.className = "feedback failure";
    return;
  }
  // BigInt parsing in the target base ensures leading zeroes are accepted.
  let isCorrect = false;
  const validPatterns = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^[0-9]+$/, 16: /^[0-9A-F]+$/ };
  if (validPatterns[currentChallenge.targetBase].test(answer)) {
    try {
      let parsedAnswer = 0n;
      const symbols = "0123456789ABCDEF";
      for (const character of answer) {
        parsedAnswer = parsedAnswer * BigInt(currentChallenge.targetBase) +
          BigInt(symbols.indexOf(character));
      }
      isCorrect = parsedAnswer === currentChallenge.value;
    } catch {
      isCorrect = false;
    }
  }

  if (isCorrect) {
    completedChallenges += 1;
    document.getElementById("score").textContent = String(completedChallenges);
    feedback.textContent = `Correct! ${currentChallenge.value.toString(10)} in ${currentChallenge.targetName} is ${currentChallenge.answer}.`;
    feedback.className = "feedback success";
    challengeLocked = true;
  } else {
    feedback.textContent = "Not quite. Check the base and try again, or use the hint.";
    feedback.className = "feedback failure";
  }
});

document.getElementById("challengeAnswer").addEventListener("keydown", event => {
  if (event.key === "Enter") document.getElementById("checkAnswerBtn").click();
});
document.getElementById("hintBtn").addEventListener("click", () => {
  document.getElementById("hintText").hidden = false;
});
document.getElementById("nextChallengeBtn").addEventListener("click", nextChallenge);

convert();
nextChallenge();
