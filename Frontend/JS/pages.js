
/* =========================================================
   CYBERVERSE — PAGES MODULE
   Course filters, safe labs, lesson prerequisites and mentors
   ========================================================= */

"use strict";

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);

  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  const getEmail = () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      return user?.email?.trim().toLowerCase() || null;
    } catch {
      return null;
    }
  };

  const getProgress = (key) => {
    const email = getEmail();
    if (!email) return [];

    try {
      const value = JSON.parse(localStorage.getItem(key + email) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };

  const getLessons = () =>
    window.CyberVerseProgress?.getCompletedLessons?.() ??
    getProgress("cyberverse_progress_");

  const getLabs = () =>
    window.CyberVerseProgress?.getCompletedLabs?.() ??
    getProgress("cyberverse_labs_");

  /*
   * Lesson IDs follow the existing modules.js format:
   * moduleId-level-lessonIndex
   *
   * Each level contains two lessons: indexes 0 and 1.
   */

  const LABS = [
    {
      id: "lab1",
      title: "Build Your Virtual Pentest Lab",
      level: "beginner",
      duration: "15 min",
      description:
        "Explore a fictional cyber range and learn the purpose of isolated testing environments.",
      prerequisites: [
        { moduleId: 1, level: 1, lessonIndex: 0 }
      ],
      steps: [
        "Enter the fictional CyberVerse training range.",
        "Identify the simulated workstation, server and firewall.",
        "Classify which components are inside the practice network.",
        "Complete the lab by identifying why training systems must be isolated."
      ],
      question:
        "Why should security practice take place in an isolated environment?",
      options: [
        "To avoid affecting real systems",
        "To bypass every firewall",
        "To access other people's accounts"
      ],
      answer: 0,
      explanation:
        "An isolated environment helps prevent unintended effects on real systems."
    },
    {
      id: "lab2",
      title: "Packet Capture & Analysis",
      level: "beginner",
      duration: "20 min",
      description:
        "Inspect fictional network events and distinguish normal traffic from suspicious activity.",
      prerequisites: [
        { moduleId: 4, level: 1, lessonIndex: 0 }
      ],
      steps: [
        "Open the fictional packet viewer.",
        "Review the sample DNS, HTTPS and failed-connection events.",
        "Identify which event contains repeated connection failures.",
        "Explain why a single unusual event is not always proof of an attack."
      ],
      question:
        "What is the safest first interpretation of an unusual network event?",
      options: [
        "It proves a successful attack",
        "It needs context and further investigation",
        "It should always be ignored"
      ],
      answer: 1,
      explanation:
        "Security analysts correlate events with context before drawing conclusions."
    },
    {
      id: "lab3",
      title: "Password Security Basics",
      level: "beginner",
      duration: "15 min",
      description:
        "Compare fictional passwords and learn about length, uniqueness and multi-factor authentication.",
      prerequisites: [
        { moduleId: 2, level: 1, lessonIndex: 0 }
      ],
      steps: [
        "Review three fictional password examples.",
        "Compare length and uniqueness without testing real accounts.",
        "Choose a stronger password-management approach.",
        "Select an additional authentication factor."
      ],
      question:
        "Which approach best improves account security?",
      options: [
        "Reuse one password everywhere",
        "Use unique passwords and multi-factor authentication",
        "Share passwords with trusted friends"
      ],
      answer: 1,
      explanation:
        "Unique passwords and multi-factor authentication reduce account-compromise risk."
    },
    {
      id: "lab4",
      title: "SQL Injection Awareness",
      level: "intermediate",
      duration: "20 min",
      description:
        "Use a fictional login form to learn why parameterized database queries matter.",
      prerequisites: [
        { moduleId: 7, level: 1, lessonIndex: 0 }
      ],
      steps: [
        "Inspect the simulated login form and its validation rules.",
        "Compare an unsafe query design with a parameterized design.",
        "Choose the design that treats input as data.",
        "Review the simulated security report."
      ],
      question:
        "Which practice helps prevent SQL injection?",
      options: [
        "Concatenate user input into SQL statements",
        "Use parameterized queries",
        "Hide the login button"
      ],
      answer: 1,
      explanation:
        "Parameterized queries keep user-provided values separate from SQL instructions."
    },
    {
      id: "lab5",
      title: "Cross-Site Scripting Awareness",
      level: "intermediate",
      duration: "20 min",
      description:
        "Explore a fictional comment preview to understand output encoding and safe rendering.",
      prerequisites: [
        { moduleId: 7, level: 1, lessonIndex: 1 }
      ],
      steps: [
        "Open the simulated comment preview.",
        "Compare plain text with safely encoded output.",
        "Choose the rendering method that prevents input from becoming executable markup.",
        "Review the simulated finding and recommended fix."
      ],
      question:
        "How should untrusted text normally be displayed on a web page?",
      options: [
        "As executable HTML by default",
        "Using safe output encoding appropriate to the context",
        "By disabling every browser security feature"
      ],
      answer: 1,
      explanation:
        "Context-appropriate output encoding helps prevent untrusted input from being interpreted as code."
    },
    {
      id: "lab6",
      title: "Firewall & IDS Decisions",
      level: "intermediate",
      duration: "20 min",
      description:
        "Configure fictional firewall rules and review simulated intrusion-detection alerts.",
      prerequisites: [
        { moduleId: 5, level: 1, lessonIndex: 0 }
      ],
      steps: [
        "Inspect the simulated network policy.",
        "Review the sample allowed and denied connections.",
        "Choose the least-permissive rule that still supports the required service.",
        "Classify a fictional IDS alert and document your decision."
      ],
      question:
        "What does the principle of least privilege recommend?",
      options: [
        "Allow every connection",
        "Allow only what is necessary",
        "Disable monitoring"
      ],
      answer: 1,
      explanation:
        "Least privilege limits access to the minimum needed for a legitimate purpose."
    },
    {
      id: "lab7",
      title: "Linux Permissions Simulator",
      level: "advanced",
      duration: "25 min",
      description:
        "Review fictional file permissions and correct an unsafe access configuration in a simulated terminal.",
      prerequisites: [
        { moduleId: 6, level: 1, lessonIndex: 0 }
      ],
      steps: [
        "Open the read-only fictional terminal scenario.",
        "Review the sample file owner, group and permission settings.",
        "Choose a safer permission policy for the fictional file.",
        "Explain why unnecessary administrative access increases risk."
      ],
      question:
        "What is the preferred way to assign permissions?",
      options: [
        "Give everyone full access",
        "Grant only the access each role requires",
        "Make every file public"
      ],
      answer: 1,
      explanation:
        "Restricting permissions reduces unnecessary exposure and privilege."
    },
    {
      id: "lab8",
      title: "Digital Forensics Timeline",
      level: "advanced",
      duration: "25 min",
      description:
        "Investigate a fictional incident timeline and preserve evidence integrity.",
      prerequisites: [
        { moduleId: 8, level: 1, lessonIndex: 0 }
      ],
      steps: [
        "Review the fictional event log and timestamps.",
        "Arrange events into chronological order.",
        "Identify which records may be relevant to the incident.",
        "Choose the evidence-handling action that preserves integrity."
      ],
      question:
        "Why is evidence integrity important?",
      options: [
        "It makes evidence easier to alter",
        "It helps establish that evidence has not been improperly changed",
        "It removes the need to document actions"
      ],
      answer: 1,
      explanation:
        "Documented handling and integrity checks help preserve the reliability of digital evidence."
    },
    {
      id: "lab9",
      title: "CyberVerse Capstone Challenge",
      level: "advanced",
      duration: "30 min",
      description:
        "Combine security fundamentals, network analysis and incident response in a fictional CTF-style scenario.",
      prerequisites: [
        { moduleId: 1, level: 1, lessonIndex: 0 },
        { moduleId: 4, level: 1, lessonIndex: 0 },
        { moduleId: 5, level: 1, lessonIndex: 0 },
        { moduleId: 8, level: 1, lessonIndex: 0 }
      ],
      steps: [
        "Read the fictional incident brief.",
        "Review the provided sample alerts and asset inventory.",
        "Select the best containment and investigation priorities.",
        "Submit your final defensive recommendation."
      ],
      question:
        "What is a sound first response to a credible security incident?",
      options: [
        "Delete every available log",
        "Follow the incident-response process and preserve relevant evidence",
        "Ignore the alert until the next day"
      ],
      answer: 1,
      explanation:
        "A documented response process supports containment, investigation and recovery."
    }
  ];

  const MENTORS = [
    {
      id: "nova",
      name: "Nova",
      avatar: "✦",
      specialty: "Cybersecurity Fundamentals",
      description: "Explains core security ideas and beginner concepts.",
      suggestions: [
        "Explain the CIA triad",
        "How do I start learning security?",
        "What is phishing?"
      ]
    },
    {
      id: "cipher",
      name: "Cipher",
      avatar: "⌘",
      specialty: "Cryptography & Privacy",
      description: "Helps you understand encryption, hashing and authentication.",
      suggestions: [
        "Explain hashing",
        "Encryption vs hashing",
        "What is multi-factor authentication?"
      ]
    },
    {
      id: "ghost",
      name: "Ghost",
      avatar: "◈",
      specialty: "Web & Application Security",
      description: "Teaches safe web development and common vulnerabilities.",
      suggestions: [
        "What is SQL injection?",
        "Explain XSS safely",
        "How do parameterized queries work?"
      ]
    },
    {
      id: "recon",
      name: "Recon",
      avatar: "⌖",
      specialty: "Defensive Analysis",
      description: "Explains network monitoring, logs and incident response.",
      suggestions: [
        "How do firewalls work?",
        "How do I read security logs?",
        "Explain incident response"
      ]
    }
  ];

  function isLabUnlocked(lab) {
    if (!lab.prerequisites?.length) return true;

    const progress = window.CyberVerseProgress;

    if (progress?.hasCompletedLessons) {
      return progress.hasCompletedLessons(lab.prerequisites);
    }

    const completed = new Set(getLessons());

    return lab.prerequisites.every((item) =>
      completed.has(`${item.moduleId}-${item.level}-${item.lessonIndex}`)
    );
  }

  function saveLab(labId) {
    const email = getEmail();
    if (!email) {
      alert("Please sign in to save your lab progress.");
      return false;
    }

    if (window.CyberVerseProgress?.saveLabCompletion) {
      return window.CyberVerseProgress.saveLabCompletion(labId);
    }

    const key = "cyberverse_labs_" + email;
    const completed = getProgress("cyberverse_labs_");

    if (!completed.includes(labId)) {
      completed.push(labId);
      localStorage.setItem(key, JSON.stringify(completed));
    }

    return true;
  }

  /* ---------------- COURSE FILTERS ---------------- */

  function initCourseFilters() {
    const buttons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".course-card");

    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter || "all";

        buttons.forEach((item) => {
          item.classList.toggle("active", item === button);
        });

        cards.forEach((card) => {
          const level = (card.dataset.level || "").toLowerCase();
          card.hidden = filter !== "all" && level !== filter;
        });
      });
    });
  }

  /* ---------------- LABS ---------------- */

  function initLabs() {
    const grid = $("#labGrid");
    const modal = $("#labModal");

    if (!grid || !modal) return;

    const modalTitle = $("#labModalTitle");
    const modalMeta = $("#labModalMeta");
    const modalDesc = $("#labModalDesc");
    const modalSteps = $("#labModalSteps");
    const closeBtn = $("#labModalCloseBtn");
    const completeBtn = $("#labModalCompleteBtn");

    let activeLab = null;
    let selectedAnswer = null;
    let answered = false;

    function renderLabs() {
      const completed = new Set(getLabs());

      grid.innerHTML = LABS.map((lab, index) => {
        const done = completed.has(lab.id);
        const unlocked = isLabUnlocked(lab);
        const stateClass = done ? "is-complete" : "";
        const levelClass = escapeHTML(lab.level);
        const actionLabel = done
          ? "Review Lab"
          : unlocked
            ? "Open Lab"
            : "Complete Prerequisites";

        return `
          <article class="lab-card ${stateClass}"
                   data-lab-id="${escapeHTML(lab.id)}">
            <div class="lab-card-top">
              <span class="lab-card-num">LAB ${String(index + 1).padStart(2, "0")}</span>
              <span class="lab-complete-badge">${done ? "✓ COMPLETE" : ""}</span>
            </div>
            <h3>${escapeHTML(lab.title)}</h3>
            <p>${escapeHTML(lab.description)}</p>
            <div class="module-meta">
              <span class="tag tag-${levelClass}">${levelClass}</span>
              <span class="lab-duration">${escapeHTML(lab.duration)}</span>
            </div>
            <p class="lab-lock-state" aria-live="polite">
              ${done ? "✓ Completed" : unlocked ? "● Unlocked" : "🔒 Locked — finish prerequisite lessons"}
            </p>
            <button
              class="btn ${unlocked ? "btn-primary" : "btn-ghost"} lab-open-btn"
              type="button"
              data-open-lab="${escapeHTML(lab.id)}"
              ${unlocked ? "" : 'aria-disabled="true"'}
            >${actionLabel}</button>
          </article>`;
      }).join("");
    }

    function closeModal() {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      activeLab = null;
      selectedAnswer = null;
      answered = false;
    }

    function openLab(lab) {
      if (!isLabUnlocked(lab)) {
        alert("This lab is locked. Complete its prerequisite lessons first.");
        return;
      }

      activeLab = lab;
      selectedAnswer = null;
      answered = false;

      if (modalTitle) modalTitle.textContent = lab.title;
      if (modalMeta) {
        modalMeta.innerHTML = `
          <span class="tag tag-${escapeHTML(lab.level)}">${escapeHTML(lab.level)}</span>
          <span class="lab-duration">${escapeHTML(lab.duration)}</span>`;
      }
      if (modalDesc) modalDesc.textContent = lab.description;

      if (modalSteps) {
        modalSteps.innerHTML = `
          <ol class="lab-step-list">
            ${lab.steps.map((step) => `<li>${escapeHTML(step)}</li>`).join("")}
          </ol>
          <section class="lab-quiz" style="margin-top:20px">
            <h4 style="margin-bottom:12px">Knowledge check</h4>
            <p style="margin-bottom:12px">${escapeHTML(lab.question)}</p>
            <div class="lab-answer-options">
              ${lab.options.map((option, index) => `
                <label style="display:flex;gap:10px;align-items:flex-start;margin:10px 0">
                  <input type="radio" name="cyberverseLabAnswer" value="${index}">
                  <span>${escapeHTML(option)}</span>
                </label>
              `).join("")}
            </div>
            <button class="btn btn-outline" type="button" id="checkLabAnswer">
              Check answer
            </button>
            <p id="labQuizFeedback" role="status" style="margin-top:12px"></p>
          </section>`;
      }

      if (completeBtn) {
        completeBtn.disabled = false;
        completeBtn.textContent = "Mark Lab as Complete";
        completeBtn.classList.remove("is-complete");
      }

      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
    }

    grid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-open-lab]");
      if (!button) return;

      const lab = LABS.find((item) => item.id === button.dataset.openLab);
      if (!lab) return;

      if (!isLabUnlocked(lab)) {
        alert("Complete the prerequisite lessons shown in your course modules to unlock this lab.");
        return;
      }

      openLab(lab);
    });

    if (modalSteps) {
      modalSteps.addEventListener("click", (event) => {
        if (event.target.id !== "checkLabAnswer" || !activeLab) return;

        const selected = $('input[name="cyberverseLabAnswer"]:checked', modalSteps);
        const feedback = $("#labQuizFeedback", modalSteps);

        if (!selected) {
          if (feedback) feedback.textContent = "Choose an answer first.";
          return;
        }

        selectedAnswer = Number(selected.value);
        answered = selectedAnswer === activeLab.answer;

        if (feedback) {
          feedback.textContent = answered
            ? "Correct! " + activeLab.explanation
            : "Not quite. Review the steps and try again.";
        }

        if (completeBtn) {
          completeBtn.disabled = !answered;
        }
      });
    }

    if (completeBtn) {
      completeBtn.addEventListener("click", () => {
        if (!activeLab) return;

        if (!isLabUnlocked(activeLab)) {
          alert("This lab is locked. Complete its prerequisite lessons first.");
          closeModal();
          renderLabs();
          return;
        }

        if (!answered || selectedAnswer !== activeLab.answer) {
          alert("Answer the knowledge check correctly before completing this lab.");
          return;
        }

        if (!saveLab(activeLab.id)) return;

        completeBtn.textContent = "✓ Lab Completed";
        completeBtn.classList.add("is-complete");
        completeBtn.disabled = true;

        renderLabs();
      });
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
      }
    });

    // Other tabs/pages may update the same localStorage progress.
    window.addEventListener("storage", renderLabs);

    // Called when the page opens and whenever the user refreshes.
    renderLabs();

    // Allow the lesson system to request a lab refresh after completion.
    window.addEventListener("cyberverse:progress-updated", renderLabs);
  }

  /* ---------------- AI MENTORS ---------------- */

  function initMentors() {
    const grid = $("#mentorGrid");
    const panel = $("#chatPanel");

    if (!grid || !panel) return;

    const avatar = $("#chatAvatar");
    const name = $("#chatName");
    const specialty = $("#chatSpecialty");
    const messages = $("#chatMessages");
    const input = $("#chatInput");
    const sendBtn = $("#chatSendBtn");
    const suggestions = $("#chatSuggestions");

    let activeMentor = null;

    const mentorResponse = (message) => {
      const text = message.toLowerCase();

      if (/cia triad|\bconfidentiality\b|\bintegrity\b|\bavailability\b/.test(text)) {
        return "The CIA triad is a security model: confidentiality protects information from unauthorized access, integrity protects accuracy, and availability ensures systems remain accessible when needed.";
      }

      if (/phish|social engineer/.test(text)) {
        return "Phishing uses deceptive messages to trick people into revealing information or taking unsafe actions. Check the sender, destination, unexpected requests, and urgency. Report suspicious messages through your organization's approved process.";
      }

      if (/hash|encryption|cryptograph/.test(text)) {
        return "Encryption is designed to protect information by making it unreadable without the appropriate key. Hashing creates a fixed-length digest and is commonly used for integrity checks. Passwords should be stored with a suitable salted password-hashing algorithm.";
      }

      if (/sql injection|parameterized|database/.test(text)) {
        return "SQL injection occurs when untrusted input changes the meaning of a database query. Use parameterized queries, least-privilege database accounts, and safe error handling. Practise only with a fictional lab or a system you are authorized to test.";
      }

      if (/\bxss\b|cross.site|output encoding/.test(text)) {
        return "Cross-site scripting involves untrusted content being interpreted as executable browser code. Use context-appropriate output encoding, safe DOM APIs, and appropriate content security policies. Avoid inserting untrusted strings as raw HTML.";
      }

      if (/firewall|ids|network|packet|dns/.test(text)) {
        return "A firewall enforces traffic rules, while an intrusion-detection system identifies potentially suspicious activity. Analysts use timestamps, source and destination details, baselines, and related logs to investigate events.";
      }

      if (/incident|forensic|evidence|log/.test(text)) {
        return "A sound incident-response workflow includes preparation, detection and analysis, containment, eradication, recovery, and lessons learned. Follow your organization's procedures and preserve relevant evidence with documented handling.";
      }

      if (/password|mfa|multi.factor|authentication/.test(text)) {
        return "Use unique passwords stored in a reputable password manager, enable multi-factor authentication, and never share verification codes. Prefer phishing-resistant authentication where available.";
      }

      if (/start|beginner|learn|roadmap/.test(text)) {
        return "Start with computer fundamentals, networking, operating-system basics, and security principles. Then practise defensive analysis in safe simulations, document what you learn, and build projects that demonstrate your understanding.";
      }

      return "Good question. Break it into three parts: understand the concept, identify the risk it addresses, and practise the defensive approach in a safe simulation. Tell me which part you want to explore first.";
    };

    function addMessage(text, sender) {
      if (!messages) return;

      const bubble = document.createElement("div");
      bubble.className = `chat-bubble ${sender}`;
      bubble.textContent = text;
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    }

    function selectMentor(mentor) {
      activeMentor = mentor;

      grid.querySelectorAll(".mentor-card").forEach((card) => {
        card.classList.toggle("active", card.dataset.mentorId === mentor.id);
      });

      if (avatar) avatar.textContent = mentor.avatar;
      if (name) name.textContent = mentor.name;
      if (specialty) specialty.textContent = mentor.specialty;

      if (messages) {
        messages.replaceChildren();
        addMessage(
          `Hello! I'm ${mentor.name}. I can help you learn ${mentor.specialty.toLowerCase()} using safe, educational examples.`,
          "mentor"
        );
      }

      if (suggestions) {
        suggestions.innerHTML = mentor.suggestions.map((suggestion) => `
          <button type="button" class="chat-suggestion">
            ${escapeHTML(suggestion)}
          </button>
        `).join("");
      }

      panel.classList.add("active");
    }

    grid.innerHTML = MENTORS.map((mentor) => `
      <button type="button" class="mentor-card"
              data-mentor-id="${escapeHTML(mentor.id)}">
        <div class="mentor-avatar">${escapeHTML(mentor.avatar)}</div>
        <h3>${escapeHTML(mentor.name)}</h3>
        <p>${escapeHTML(mentor.specialty)}</p>
        <p style="margin-top:8px">${escapeHTML(mentor.description)}</p>
      </button>
    `).join("");

    grid.addEventListener("click", (event) => {
      const card = event.target.closest("[data-mentor-id]");
      if (!card) return;

      const mentor = MENTORS.find((item) => item.id === card.dataset.mentorId);
      if (mentor) selectMentor(mentor);
    });

    function sendMessage() {
      if (!activeMentor || !input) return;

      const message = input.value.trim();
      if (!message) return;

      addMessage(message, "user");
      input.value = "";

      // This is a local educational response system, not a live AI API.
      addMessage(mentorResponse(message), "mentor");
    }

    if (sendBtn) sendBtn.addEventListener("click", sendMessage);

    if (input) {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") sendMessage();
      });
    }

    if (suggestions) {
      suggestions.addEventListener("click", (event) => {
        const button = event.target.closest(".chat-suggestion");
        if (!button || !input) return;

        input.value = button.textContent.trim();
        sendMessage();
      });
    }
  }

  /* ---------------- SHARED HEADER ---------------- */

  function initProfileDropdown() {
    const avatarBtn = $("#avatarBtn");
    const dropdown = $("#dropdownMenu");

    if (!avatarBtn || !dropdown) return;

    avatarBtn.addEventListener("click", () => {
      const open = dropdown.classList.toggle("show");
      avatarBtn.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        dropdown.classList.remove("show");
        avatarBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initPage() {
    initCourseFilters();
    initLabs();
    initMentors();
    initProfileDropdown();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage, { once: true });
  } else {
    initPage();
  }
})();
