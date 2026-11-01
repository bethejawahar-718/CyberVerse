(() => {
  "use strict";

  const passwordInput = document.getElementById("passwordInput");
  const toggleVisibility = document.getElementById("toggleVisibility");
  const clearButton = document.getElementById("clearButton");
  const exampleButton = document.getElementById("exampleButton");
  const meterFill = document.getElementById("meterFill");
  const strengthMeter = document.getElementById("strengthMeter");
  const strengthLabel = document.getElementById("strengthLabel");
  const strengthSummary = document.getElementById("strengthSummary");
  const checksCount = document.getElementById("checksCount");
  const recommendationText = document.getElementById("recommendationText");

  const commonPasswords = new Set([
    "password", "password1", "123456", "12345678", "qwerty", "qwerty123",
    "admin", "letmein", "welcome", "iloveyou", "abc123", "111111"
  ]);

  const checks = {
    length: password => password.length >= 12,
    lower: password => /[a-z]/.test(password),
    upper: password => /[A-Z]/.test(password),
    number: password => /\d/.test(password),
    symbol: password => /[^A-Za-z0-9]/.test(password),
    unique: password => !hasCommonPattern(password)
  };

  function hasCommonPattern(password) {
    const normalized = password.toLowerCase();
    if (commonPasswords.has(normalized)) return true;
    if (/^(.)\1+$/.test(password)) return true;
    if (/^(0123|1234|2345|3456|4567|5678|6789|9876|8765|7654)/.test(normalized)) return true;
    if (/^(qwerty|asdf|zxcv)/.test(normalized)) return true;
    if (/(password|admin|letmein)/.test(normalized)) return true;
    return false;
  }

  function estimate(password) {
    if (!password) return { score: 0, level: "Not tested", summary: "Enter a sample password to begin the analysis.", recommendation: "Start by using a longer password or passphrase that is unique to one account.", results: {} };

    const results = Object.fromEntries(Object.entries(checks).map(([key, test]) => [key, test(password)]));
    const passed = Object.values(results).filter(Boolean).length;
    let score = 0;

    // Educational heuristic only: this is not a cracking-time calculation.
    score += Math.min(password.length / 20, 1) * 40;
    score += (results.lower ? 8 : 0) + (results.upper ? 8 : 0) +
             (results.number ? 8 : 0) + (results.symbol ? 10 : 0);
    score += results.unique ? 18 : 0;
    if (password.length < 8) score = Math.min(score, 25);
    if (hasCommonPattern(password)) score = Math.min(score, 20);
    score = Math.max(0, Math.min(100, Math.round(score)));

    let level, summary;
    if (score < 30) {
      level = "Weak";
      summary = "This password is easy to guess. Increase its length and avoid common words or patterns.";
    } else if (score < 55) {
      level = "Fair";
      summary = "Some useful features are present, but this password could be stronger. Aim for 12–16 or more characters.";
    } else if (score < 80) {
      level = "Good";
      summary = "A good start. Make it longer and unique, and consider using a password manager.";
    } else {
      level = "Strong";
      summary = "This sample meets most of the lab checks. Keep it unique and enable multi-factor authentication.";
    }

    let recommendation;
    if (!results.unique) recommendation = "Avoid common passwords, repeated characters, keyboard sequences, and predictable words.";
    else if (!results.length) recommendation = "Increase the length to at least 12 characters. A memorable passphrase can work well.";
    else if (!results.symbol || !results.number) recommendation = "Consider adding more character variety, while keeping the password long and memorable.";
    else if (passed < 5) recommendation = "Use a longer, unique passphrase and include a mix of character types.";
    else recommendation = "Good work. Use a different password for every account and turn on MFA wherever possible.";

    return { score, level, summary, recommendation, results };
  }

  function render() {
    const password = passwordInput.value;
    const result = estimate(password);
    const score = result.score;

    meterFill.style.width = `${score}%`;
    meterFill.style.background = result.level === "Weak" ? "var(--red)" :
      result.level === "Fair" ? "var(--amber)" : "var(--green)";
    strengthMeter.setAttribute("aria-valuenow", String(score));
    strengthLabel.textContent = result.level;
    strengthLabel.className = `strength-label ${result.level.toLowerCase().replace(" ", "-")}`;
    strengthSummary.textContent = result.summary;
    recommendationText.textContent = result.recommendation;

    let passed = 0;
    document.querySelectorAll("[data-check]").forEach(item => {
      const key = item.dataset.check;
      const success = Boolean(result.results[key]);
      item.classList.toggle("pass", success);
      item.querySelector(".check-symbol").textContent = success ? "✓" : "○";
      item.querySelector(".check-state").textContent = success ? "Met" : "Not met";
      if (success) passed++;
    });
    checksCount.textContent = `${passed} / 6 checks`;
  }

  passwordInput.addEventListener("input", render);

  toggleVisibility.addEventListener("click", () => {
    const isVisible = passwordInput.type === "text";
    passwordInput.type = isVisible ? "password" : "text";
    toggleVisibility.textContent = isVisible ? "SHOW" : "HIDE";
    toggleVisibility.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
    toggleVisibility.setAttribute("aria-pressed", String(!isVisible));
    passwordInput.focus();
  });

  clearButton.addEventListener("click", () => {
    passwordInput.value = "";
    passwordInput.type = "password";
    toggleVisibility.textContent = "SHOW";
    toggleVisibility.setAttribute("aria-label", "Show password");
    toggleVisibility.setAttribute("aria-pressed", "false");
    render();
    passwordInput.focus();
  });

  exampleButton.addEventListener("click", () => {
    // Fictional teaching sample; never use this as a real account password.
    passwordInput.value = "River!Lantern-Cloud-47";
    render();
  });

  render();
})();
