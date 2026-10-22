// CyberVerse — Shared logic for Roadmaps, Courses, Labs & AI Mentors pages

// ---------- LABS DATA ----------
const LABS = [
    {
        id: "lab1", num: "01", level: "beginner", duration: "45 min",
        title: "Build Your Virtual Pentest Lab",
        desc: "Set up an isolated practice environment using VirtualBox, Kali Linux and a vulnerable target VM.",
        steps: [
            "Install VirtualBox (or VMware) and download the Kali Linux VM image.",
            "Download Metasploitable2 as your vulnerable target VM.",
            "Create a host-only/internal network so both VMs can talk to each other but not the internet.",
            "Boot both VMs and confirm you can ping the target from Kali.",
            "Run <code>nmap -sV &lt;target-ip&gt;</code> to confirm your lab network is live."
        ]
    },
    {
        id: "lab2", num: "02", level: "beginner", duration: "30 min",
        title: "Packet Capture & Analysis",
        desc: "Capture live traffic with Wireshark and identify protocols, hosts and suspicious patterns.",
        steps: [
            "Open Wireshark and select your active network interface.",
            "Start a capture and generate some traffic (browse a site, ping a host).",
            "Apply a display filter like <code>http</code> or <code>dns</code> to isolate traffic types.",
            "Follow a TCP stream to read a full HTTP request/response.",
            "Identify the source IP, destination IP, and protocol for three different packets."
        ]
    },
    {
        id: "lab3", num: "03", level: "intermediate", duration: "40 min",
        title: "Password Cracking Basics",
        desc: "Use John the Ripper and Hashcat to crack sample password hashes and understand hash strength.",
        steps: [
            "Generate a set of sample password hashes (MD5, SHA1) from a wordlist.",
            "Install John the Ripper or Hashcat in your lab environment.",
            "Run a dictionary attack using the rockyou.txt wordlist.",
            "Compare how long MD5 vs. bcrypt-style hashes take to crack.",
            "Document which hashing algorithm resisted cracking best, and why."
        ]
    },
    {
        id: "lab4", num: "04", level: "intermediate", duration: "50 min",
        title: "SQL Injection Playground",
        desc: "Exploit a vulnerable login form in OWASP Juice Shop using classic SQL injection payloads.",
        steps: [
            "Deploy OWASP Juice Shop locally (Docker is the easiest route).",
            "Locate the login form and inspect how credentials are submitted.",
            "Try the classic payload <code>' OR 1=1--</code> in the email field.",
            "Confirm whether you were logged in without valid credentials.",
            "Note which input fields were NOT vulnerable, and why."
        ]
    },
    {
        id: "lab5", num: "05", level: "intermediate", duration: "40 min",
        title: "Cross-Site Scripting Challenge",
        desc: "Find and exploit a reflected XSS vulnerability in a sandboxed practice application.",
        steps: [
            "Find Juice Shop's search or comment field that reflects user input.",
            "Submit a payload like <code>&lt;script&gt;alert('xss')&lt;/script&gt;</code>.",
            "Confirm the script executes in your browser.",
            "Identify what sanitization would have prevented it.",
            "Try the same payload against a React/Vue field and compare results."
        ]
    },
    {
        id: "lab6", num: "06", level: "intermediate", duration: "60 min",
        title: "Firewall & IDS Configuration",
        desc: "Configure pfSense firewall rules and Snort IDS alerts to detect and block simulated attacks.",
        steps: [
            "Install pfSense in a virtual router role between two network segments.",
            "Create a firewall rule blocking all traffic from 'guest' to 'internal'.",
            "Install Snort or Suricata as an IDS on the internal segment.",
            "Trigger a known signature (e.g. an Nmap port scan) and confirm an alert fires.",
            "Review the alert log and note the source IP, timestamp and rule matched."
        ]
    },
    {
        id: "lab7", num: "07", level: "advanced", duration: "70 min",
        title: "Linux Privilege Escalation",
        desc: "Escalate from a low-privilege shell to root on a deliberately vulnerable Linux VM.",
        steps: [
            "Gain an initial low-privilege shell via a known vulnerable service.",
            "Run basic enumeration (<code>sudo -l</code>, SUID binaries, kernel version).",
            "Identify a misconfiguration or unpatched exploit path to escalate.",
            "Gain root access and confirm with <code>whoami</code>.",
            "Document the full chain from initial access to root."
        ]
    },
    {
        id: "lab8", num: "08", level: "advanced", duration: "60 min",
        title: "Memory Forensics with Volatility",
        desc: "Analyze a memory dump to uncover a hidden process and reconstruct an attacker's actions.",
        steps: [
            "Obtain a sample memory dump (a provided .vmem or .raw file).",
            "Load it into Volatility and identify the OS profile.",
            "List running processes and look for anything unusual or unnamed.",
            "Dump network connections active at capture time.",
            "Identify the malicious process and the indicator of compromise it left behind."
        ]
    },
    {
        id: "lab9", num: "09", level: "advanced", duration: "90+ min",
        title: "Capstone CTF Challenge",
        desc: "A multi-stage Capture The Flag combining recon, exploitation, privilege escalation and forensics.",
        steps: [
            "Start with recon: scan the target range for live hosts and open ports.",
            "Identify and exploit an initial vulnerability to gain a foothold.",
            "Escalate privileges to reach the next segment or user.",
            "Locate and capture the hidden flag file(s).",
            "Write a short report summarizing your attack path end-to-end."
        ]
    }
];

// ---------- AI MENTORS DATA ----------
const MENTORS = [
    {
        id: "nova", name: "Nova", avatar: "🛰️", specialty: "Network Security Mentor",
        description: "Ask about firewalls, VPNs, segmentation and network monitoring.",
        greeting: "Hey, I'm Nova — your network security mentor. Ask me about firewalls, VPNs, segmentation, or anything on the wire.",
        suggestions: ["What is a firewall?", "Explain VPNs", "What is network segmentation?"],
        answers: [
            { keywords: ["firewall"], response: "A firewall filters traffic by rule — IP, port or protocol. Next-gen firewalls also inspect packet content. Pair it with network segmentation so a breach in one zone can't spread everywhere." },
            { keywords: ["vpn"], response: "A VPN encrypts a tunnel between two points so traffic crossing an untrusted network can't be read or altered in transit. WireGuard and OpenVPN are common protocols behind it." },
            { keywords: ["segment", "segmentation"], response: "Segmentation splits a network into isolated zones — guest Wi-Fi separate from internal servers, for example — so one compromised zone can't freely reach the rest." },
            { keywords: ["ids", "ips", "intrusion"], response: "An IDS monitors traffic and alerts on suspicious patterns; an IPS goes further and blocks it in real time. Both work best paired with a SIEM for correlation." },
            { keywords: ["zero trust"], response: "Zero Trust assumes no device or user is trusted by default, even inside the network — every request is re-verified. It limits how far an attacker can move after one foothold." }
        ]
    },
    {
        id: "cipher", name: "Cipher", avatar: "🔐", specialty: "Web & Crypto Mentor",
        description: "Ask about encryption, OWASP Top 10, SQL injection and XSS.",
        greeting: "I'm Cipher — I live in encryption and web app security. Throw an OWASP topic at me.",
        suggestions: ["What is SQL injection?", "Explain encryption types", "What is XSS?"],
        answers: [
            { keywords: ["sql injection", "sqli"], response: "SQL injection happens when untrusted input is concatenated straight into a query, letting an attacker alter its logic. Parameterized queries / prepared statements are the real fix." },
            { keywords: ["xss", "cross-site scripting"], response: "XSS injects attacker JavaScript that runs in another user's browser, usually via unsanitized rendered input. Output encoding and a strict Content-Security-Policy are the main defenses." },
            { keywords: ["encrypt", "encryption", "aes", "rsa"], response: "Symmetric encryption (AES) uses one shared key — fast, but the key must be exchanged securely. Asymmetric (RSA/ECC) uses a public/private pair. HTTPS actually uses both together." },
            { keywords: ["owasp"], response: "The OWASP Top 10 is the industry-standard list of the most critical web app risks — Broken Access Control, Injection, Cryptographic Failures and more — refreshed from real breach data." },
            { keywords: ["csrf"], response: "CSRF tricks a logged-in user's browser into submitting a request they never intended, riding on their session cookie. CSRF tokens and the SameSite cookie attribute are the standard fixes." }
        ]
    },
    {
        id: "ghost", name: "Ghost", avatar: "🕶️", specialty: "Penetration Testing Mentor",
        description: "Ask about recon, exploitation, CTFs and the pen test methodology.",
        greeting: "Ghost here. I focus on offense — recon, exploitation, privilege escalation, CTFs. What are we breaking today?",
        suggestions: ["What is the pen testing methodology?", "What is privilege escalation?", "How do I start CTFs?"],
        answers: [
            { keywords: ["methodology", "pen test", "pentest"], response: "The standard flow: Reconnaissance → Scanning → Exploitation → Post-Exploitation → Reporting. Always under a signed scope of engagement — no exceptions." },
            { keywords: ["privilege escalation", "escalat"], response: "Privilege escalation moves you from a low-privilege foothold toward admin/root — usually via misconfigured permissions, unpatched kernel exploits, or credentials left in config files." },
            { keywords: ["recon", "reconnaissance", "footprint"], response: "Recon gathers public info before any active testing — WHOIS records, subdomains, exposed services via Shodan, employee OSINT. It's passive and often finds the easiest way in." },
            { keywords: ["ctf", "capture the flag"], response: "Start with picoCTF or TryHackMe for beginner-friendly challenges. Pick one category (Web is a good first choice) and build depth before spreading across Crypto, Pwn and Forensics." },
            { keywords: ["nmap", "scanning", "enumeration"], response: "Nmap maps live hosts and open ports, fingerprinting exactly what's listening. Enumeration then digs deeper — usernames, shares, configs — turning that map into attackable targets." }
        ]
    },
    {
        id: "recon", name: "Recon", avatar: "🧬", specialty: "Forensics & IR Mentor",
        description: "Ask about incident response, evidence handling and log analysis.",
        greeting: "I'm Recon — forensics and incident response. Ask me about evidence, logs, or what to do when something's already gone wrong.",
        suggestions: ["What is the IR lifecycle?", "What is chain of custody?", "How do I start log analysis?"],
        answers: [
            { keywords: ["ir lifecycle", "incident response"], response: "The IR lifecycle: Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned. Having it rehearsed beforehand is what keeps a real incident from becoming chaos." },
            { keywords: ["chain of custody", "evidence"], response: "Chain of custody is the documented trail of who collected, handled and stored each piece of evidence. Always work from a forensic image, never the live original." },
            { keywords: ["log", "siem"], response: "Look for anomalies: logins at odd hours, impossible travel, repeated failed auth followed by success, unexpected outbound traffic. A SIEM correlates logs across systems into one timeline." },
            { keywords: ["memory", "volatility", "ram"], response: "RAM holds data that disappears the moment a machine powers off, so it's captured first. Tools like Volatility reconstruct running processes and connections from a memory dump." },
            { keywords: ["malware analysis"], response: "Static analysis examines a sample without running it; dynamic analysis runs it in an isolated sandbox and watches its behavior. Both produce IOCs you can hunt for elsewhere." }
        ]
    }
];

document.addEventListener("DOMContentLoaded", () => {
    // ---------- Shared header: auth guard + avatar dropdown ----------
    const avatarBtn = document.getElementById("avatarBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (avatarBtn && dropdownMenu) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            window.location.href = "login.html";
            return;
        }
        avatarBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle("show");
        });
        document.addEventListener("click", () => dropdownMenu.classList.remove("show"));
    }

    initCourseFilters();
    initLabs();
    initMentors();
});

function labsKey() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const email = currentUser ? currentUser.email : "guest";
    return `cyberverse_labs_${email}`;
}

function getCompletedLabs() {
    return JSON.parse(localStorage.getItem(labsKey())) || [];
}

// ---------- COURSES: filter by level ----------
function initCourseFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn[data-filter]");
    const courseCards = document.querySelectorAll(".course-card[data-level]");
    if (!filterBtns.length || !courseCards.length) return;

    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.dataset.filter;
            courseCards.forEach((card) => {
                card.style.display = (filter === "all" || card.dataset.level === filter) ? "flex" : "none";
            });
        });
    });
}

// ---------- LABS: render grid + modal ----------
function initLabs() {
    const labGrid = document.getElementById("labGrid");
    if (!labGrid) return;

    const completed = getCompletedLabs();

    labGrid.innerHTML = LABS.map((lab) => `
        <div class="lab-card ${completed.includes(lab.id) ? "is-complete" : ""}" data-lab="${lab.id}">
            <div class="lab-card-top">
                <span class="lab-card-num">${lab.num}</span>
                <span class="lab-complete-badge">✔ Completed</span>
            </div>
            <h3>${lab.title}</h3>
            <p>${lab.desc}</p>
            <div class="module-meta">
                <span class="tag tag-${lab.level}">${lab.level}</span>
                <span class="module-lessons lab-duration">${lab.duration}</span>
            </div>
            <button class="btn btn-outline lab-launch-btn" data-lab-btn="${lab.id}">Launch Lab</button>
        </div>
    `).join("");

    const labModal = document.getElementById("labModal");
    if (!labModal) return;

    const labModalTitle = document.getElementById("labModalTitle");
    const labModalMeta = document.getElementById("labModalMeta");
    const labModalDesc = document.getElementById("labModalDesc");
    const labModalSteps = document.getElementById("labModalSteps");
    const labModalCloseBtn = document.getElementById("labModalCloseBtn");
    const labModalCompleteBtn = document.getElementById("labModalCompleteBtn");

    let currentLabId = null;

    function openLab(labId) {
        const lab = LABS.find((l) => l.id === labId);
        if (!lab) return;
        currentLabId = labId;
        labModalTitle.textContent = lab.title;
        labModalMeta.innerHTML = `<span class="tag tag-${lab.level}">${lab.level}</span><span class="module-lessons lab-duration">${lab.duration}</span>`;
        labModalDesc.textContent = lab.desc;
        labModalSteps.innerHTML = lab.steps.map((s) => `<li>${s}</li>`).join("");
        refreshCompleteBtn();
        labModal.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function refreshCompleteBtn() {
        const done = getCompletedLabs().includes(currentLabId);
        labModalCompleteBtn.textContent = done ? "✔ Lab Completed" : "Mark Lab as Complete";
        labModalCompleteBtn.classList.toggle("is-complete", done);
    }

    function closeLab() {
        labModal.classList.remove("show");
        document.body.style.overflow = "";
    }

    labGrid.querySelectorAll("[data-lab-btn]").forEach((btn) => {
        btn.addEventListener("click", () => openLab(btn.dataset.labBtn));
    });

    labModalCloseBtn.addEventListener("click", closeLab);
    labModal.addEventListener("click", (e) => { if (e.target === labModal) closeLab(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLab(); });

    labModalCompleteBtn.addEventListener("click", () => {
        const done = getCompletedLabs();
        if (!done.includes(currentLabId)) {
            done.push(currentLabId);
            localStorage.setItem(labsKey(), JSON.stringify(done));
            const card = labGrid.querySelector(`.lab-card[data-lab="${currentLabId}"]`);
            if (card) card.classList.add("is-complete");
        }
        refreshCompleteBtn();
    });
}

// ---------- AI MENTORS: cards + simulated chat ----------
function initMentors() {
    const mentorGrid = document.getElementById("mentorGrid");
    if (!mentorGrid) return;

    mentorGrid.innerHTML = MENTORS.map((m) => `
        <div class="mentor-card" data-mentor="${m.id}">
            <div class="mentor-avatar">${m.avatar}</div>
            <h3>${m.name}</h3>
            <p><b>${m.specialty}</b><br>${m.description}</p>
        </div>
    `).join("");

    const chatPanel = document.getElementById("chatPanel");
    const chatAvatar = document.getElementById("chatAvatar");
    const chatName = document.getElementById("chatName");
    const chatSpecialty = document.getElementById("chatSpecialty");
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const chatSendBtn = document.getElementById("chatSendBtn");
    const chatSuggestions = document.getElementById("chatSuggestions");

    let activeMentor = null;

    function addBubble(text, who) {
        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${who}`;
        bubble.textContent = text;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function respond(mentor, message) {
        const lower = message.toLowerCase();
        const match = mentor.answers.find((a) => a.keywords.some((k) => lower.includes(k)));
        const text = match
            ? match.response
            : `Good question. As the ${mentor.specialty.toLowerCase()}, I'd point you to the related module on the dashboard for the full walkthrough — try asking me about one of the topics below.`;
        setTimeout(() => addBubble(text, "mentor"), 400);
    }

    function openChat(mentorId) {
        activeMentor = MENTORS.find((m) => m.id === mentorId);
        if (!activeMentor) return;

        document.querySelectorAll(".mentor-card").forEach((c) => c.classList.toggle("active", c.dataset.mentor === mentorId));

        chatAvatar.textContent = activeMentor.avatar;
        chatName.textContent = activeMentor.name;
        chatSpecialty.textContent = activeMentor.specialty;
        chatMessages.innerHTML = "";
        addBubble(activeMentor.greeting, "mentor");
        chatSuggestions.innerHTML = activeMentor.suggestions.map((s) => `<button class="chat-suggestion">${s}</button>`).join("");
        chatSuggestions.querySelectorAll(".chat-suggestion").forEach((btn) => {
            btn.addEventListener("click", () => sendMessage(btn.textContent));
        });

        chatPanel.classList.add("active");
        chatPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function sendMessage(text) {
        const message = (text || chatInput.value).trim();
        if (!message || !activeMentor) return;
        addBubble(message, "user");
        chatInput.value = "";
        respond(activeMentor, message);
    }

    mentorGrid.querySelectorAll(".mentor-card").forEach((card) => {
        card.addEventListener("click", () => openChat(card.dataset.mentor));
    });

    if (chatSendBtn) {
        chatSendBtn.addEventListener("click", () => sendMessage());
        chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") sendMessage();
        });
    }
}
