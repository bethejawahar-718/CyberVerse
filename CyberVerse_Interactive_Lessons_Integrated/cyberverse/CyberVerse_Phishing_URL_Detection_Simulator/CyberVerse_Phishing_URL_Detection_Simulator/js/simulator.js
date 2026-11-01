(() => {
  "use strict";

  const form = document.querySelector("#analyzer-form");
  const input = document.querySelector("#url-input");
  const errorBox = document.querySelector("#form-error");
  const results = document.querySelector("#results");
  const charCount = document.querySelector("#char-count");

  const $ = (selector) => document.querySelector(selector);

  input.addEventListener("input", () => {
    charCount.textContent = `${input.value.length} / 2048`;
    errorBox.hidden = true;
  });

  document.querySelectorAll("[data-example]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.example;
      charCount.textContent = `${input.value.length} / 2048`;
      errorBox.hidden = true;
      analyzeAndRender(input.value);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    analyzeAndRender(input.value);
  });

  function parseUserUrl(raw) {
    let value = raw.trim();
    if (!value) throw new Error("Enter a URL to analyze.");
    if (value.length > 2048) throw new Error("The URL is too long.");
    if (/[\u0000-\u0020]/.test(value)) {
      // Trimmed outer whitespace is allowed; internal whitespace is not.
      if (/\S\s+\S/.test(value)) throw new Error("The URL contains spaces. Check the address and try again.");
      value = value.trim();
    }
    if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)) value = `https://${value}`;
    let parsed;
    try { parsed = new URL(value); }
    catch { throw new Error("That does not look like a valid URL. Check its spelling and format."); }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("For this learning lab, use an http:// or https:// URL.");
    }
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      throw new Error("The URL needs a recognizable hostname, such as example.com.");
    }
    if (parsed.username || parsed.password) {
      // Keep the URL parseable but explicitly flag embedded credentials below.
    }
    return parsed;
  }

  function analyzeUrl(raw) {
    const url = parseUserUrl(raw);
    const host = url.hostname.toLowerCase();
    const full = `${url.hostname}${url.pathname}${url.search}${url.hash}`.toLowerCase();
    const findings = [];
    let score = 0;

    const add = (severity, title, explanation, points = 0) => {
      findings.push({ severity, title, explanation, points });
      score += points;
    };

    if (url.protocol === "https:") {
      add("good", "HTTPS connection scheme", "The URL uses HTTPS, which normally encrypts traffic in transit. This does not prove the site is legitimate.", 0);
    } else {
      add("warn", "Unencrypted HTTP", "The URL uses HTTP rather than HTTPS. Avoid entering sensitive information on unencrypted pages.", 12);
    }

    if (url.username || url.password || raw.includes("@")) {
      add("bad", "Potentially misleading @ symbol or embedded credentials", "An @ symbol can separate user information from the actual hostname. Read the hostname carefully; the text before @ is not the destination domain.", 24);
    }

    const labels = host.split(".");
    if (host.length > 45) {
      add("warn", "Unusually long hostname", "Long hostnames can make the destination harder to read. Inspect each domain label carefully.", 8);
    }
    if (labels.length >= 5) {
      add("warn", "Many subdomain labels", "Several subdomains can obscure the registered domain. Read the hostname from right to left and verify the actual domain.", 8);
    }
    if (host.startsWith("xn--") || labels.some(label => label.startsWith("xn--"))) {
      add("warn", "Punycode / internationalized hostname", "The hostname contains an xn-- label. Internationalized domains can be legitimate, but look-alike characters are sometimes abused.", 18);
    }

    const ipHost = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || /^\[[0-9a-f:]+\]$/i.test(host);
    if (ipHost) {
      add("warn", "IP address used as hostname", "A raw IP address is less common for public account pages. Verify why the destination uses an IP before trusting it.", 14);
    }

    const riskyWords = [
      ["login", "Login-related wording", 5],
      ["signin", "Sign-in wording", 5],
      ["verify", "Verification wording", 7],
      ["account", "Account-related wording", 4],
      ["secure", "Security-themed wording", 4],
      ["update", "Update wording", 4],
      ["password", "Password-related wording", 7],
      ["wallet", "Wallet-related wording", 5],
      ["billing", "Billing-related wording", 5],
      ["confirm", "Confirmation wording", 4]
    ];
    const foundWords = riskyWords.filter(([word]) => full.includes(word));
    if (foundWords.length >= 3) {
      add("warn", "Several sensitive-action keywords", `Found terms often seen in account workflows: ${foundWords.map(x => x[0]).join(", ")}. These words are not proof of phishing, but unexpected links deserve extra scrutiny.`, Math.min(15, foundWords.length * 3));
    } else if (foundWords.length) {
      add("warn", "Sensitive-action wording", `Found: ${foundWords.map(x => x[0]).join(", ")}. Check whether you expected this link and verify the domain independently.`, Math.min(7, foundWords.length * 2));
    }

    if (host.includes("xn--") || /%[0-9a-f]{2}/i.test(url.pathname)) {
      // Punycode is reported above; percent encoding in the path gets a neutral caution.
      if (/%[0-9a-f]{2}/i.test(url.pathname)) {
        add("warn", "Encoded path characters", "The path contains percent-encoded characters. This is common on the web, but can make an address harder to read.", 4);
      }
    }

    if (url.port && !((url.protocol === "https:" && url.port === "443") || (url.protocol === "http:" && url.port === "80"))) {
      add("warn", "Non-default port", `The URL uses port ${url.port}. This can be legitimate in some services, but is worth checking if unexpected.`, 8);
    }

    if (url.hostname.includes("-") && /(?:pay|account|login|secure|verify|support|brand|service)/i.test(url.hostname)) {
      add("warn", "Hyphenated hostname with sensitive wording", "Hyphens are normal in domains, but a hostname combining them with account or brand-like wording should be checked carefully.", 7);
    }

    const suspiciousTld = /\.(zip|mov|top|click|country|gq|tk|work|support)$/i.test(host);
    if (suspiciousTld) {
      add("warn", "Domain ending merits extra scrutiny", "Some domain endings are used by both legitimate and abusive sites. Do not judge by the ending alone; verify the organization and domain.", 5);
    }

    if (url.pathname.length > 100) {
      add("warn", "Long URL path", "A long path can make a link harder to inspect. Expand shortened links only with a trusted security tool, not by opening them.", 5);
    }

    if (!findings.some(f => f.severity !== "good")) {
      add("good", "No configured warning patterns detected", "This simulator did not find its selected warning patterns. That does not establish that the URL is safe.", 0);
    }

    score = Math.max(0, Math.min(100, score));
    let verdict, summary, color;
    if (score >= 45) {
      verdict = "HIGHER RISK PATTERNS";
      summary = "Several warning signs were detected. Do not interact until independently verified.";
      color = "var(--red)";
    } else if (score >= 20) {
      verdict = "REVIEW CAREFULLY";
      summary = "Some warning signs were detected. Verify the destination independently.";
      color = "var(--yellow)";
    } else {
      verdict = "FEWER FLAGS DETECTED";
      summary = "Few configured warning signs were found. This is not a safety guarantee.";
      color = "var(--green)";
    }
    return { url, findings, score, verdict, summary, color };
  }

  function analyzeAndRender(raw) {
    try {
      const report = analyzeUrl(raw);
      errorBox.hidden = true;
      renderReport(report);
      results.hidden = false;
      results.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    } catch (error) {
      results.hidden = true;
      errorBox.textContent = error.message || "Could not analyze this input.";
      errorBox.hidden = false;
    }
  }

  function renderReport(report) {
    const { url, findings, score, verdict, summary, color } = report;
    $("#verdict-badge").textContent = verdict;
    $("#verdict-badge").style.color = color;
    $("#verdict-badge").style.borderColor = color;
    $("#verdict-badge").style.background = "transparent";
    $("#risk-score").textContent = score;
    $("#score-summary").textContent = summary;
    $("#score-ring").style.setProperty("--score", `${score}%`);
    $("#score-ring").style.setProperty("--ring-color", color);
    $("#detail-protocol").textContent = url.protocol.replace(":", "").toUpperCase();
    $("#detail-host").textContent = url.hostname;
    $("#detail-domain").textContent = url.hostname.split(".").slice(-2).join(".");
    $("#detail-port").textContent = url.port || "Default";
    $("#normalized-url").textContent = url.href;
    $("#finding-count").textContent = `${findings.length} signal${findings.length === 1 ? "" : "s"}`;
    const list = $("#findings-list");
    list.replaceChildren();
    findings.forEach((finding) => {
      const item = document.createElement("article");
      item.className = `finding ${finding.severity}`;
      const icon = document.createElement("span");
      icon.className = "finding-icon";
      icon.textContent = finding.severity === "good" ? "✓" : finding.severity === "bad" ? "!" : "△";
      const body = document.createElement("div");
      const title = document.createElement("h4");
      title.textContent = finding.title;
      const description = document.createElement("p");
      description.textContent = finding.explanation;
      body.append(title, description);
      const points = document.createElement("span");
      points.className = "finding-points";
      points.textContent = finding.points ? `+${finding.points} RISK` : "INFO";
      item.append(icon, body, points);
      list.append(item);
    });
  }

  // One-question, local knowledge check.
  const quizOptions = document.querySelectorAll(".quiz-option");
  const quizFeedback = $("#quiz-feedback");
  const quizState = $("#quiz-state");
  const quizReset = $("#quiz-reset");
  quizOptions.forEach(option => option.addEventListener("click", () => {
    if (option.disabled) return;
    const correct = option.dataset.correct === "true";
    quizOptions.forEach(button => {
      button.disabled = true;
      if (button.dataset.correct === "true") button.classList.add("correct");
    });
    if (!correct) option.classList.add("wrong");
    quizFeedback.textContent = correct
      ? "Correct. Use a known official address or app instead of following an unexpected sign-in link."
      : "Not quite. Urgency and HTTPS alone do not establish trust. Verify through an independently known channel.";
    quizFeedback.style.color = correct ? "var(--green)" : "var(--yellow)";
    quizFeedback.hidden = false;
    quizState.textContent = correct ? "PASSED" : "REVIEW";
    quizReset.hidden = false;
  }));
  quizReset.addEventListener("click", () => {
    quizOptions.forEach(button => {
      button.disabled = false;
      button.classList.remove("correct", "wrong");
    });
    quizFeedback.hidden = true;
    quizReset.hidden = true;
    quizState.textContent = "NOT ANSWERED";
  });
})();
