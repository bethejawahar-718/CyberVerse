
// ==========================================
// CYBERVERSE - DASHBOARD APPLICATION
// ==========================================

// LESSON MODULES
const modules = [
    {id:"digital",title:"Digital Electronics",desc:"Number systems, binary arithmetic, logic gates and digital circuits.",icon:"âŒ˜",href:"modules/digital-electronics.html",level:"Module 01",category:"foundation",tag:"Build your base"},
    {id:"networking",title:"Computer Networking",desc:"OSI, TCP/IP, IP addressing, DNS, DHCP, ports, protocols and firewalls.",icon:"âŒ",href:"modules/networking.html",level:"Module 02",category:"foundation",tag:"Connect the pieces"},
    {id:"cybersecurity",title:"Cybersecurity Fundamentals",desc:"Security principles, risks, authentication, malware and phishing awareness.",icon:"â¬¡",href:"modules/cybersecurity.html",level:"Module 03",category:"security",tag:"Think like a defender"},
    {id:"crypto",title:"Cryptography Basics",desc:"Encryption, hashing, keys, signatures and digital certificates.",icon:"âš¿",href:"modules/cryptography.html",level:"Module 04",category:"security",tag:"Protect information"},
    {id:"linux",title:"Linux Fundamentals",desc:"Files, permissions, processes and command-line foundations.",icon:"â€º_",href:"modules/linux.html",level:"Module 05",category:"foundation",tag:"Master the terminal"},
    {id:"python",title:"Python for Cybersecurity",desc:"Programming foundations and safe sample security-log exercises.",icon:"{}",href:"modules/python-security.html",level:"Module 06",category:"practice",tag:"Automate thoughtfully"},
    {id:"web",title:"Web Security",desc:"Input validation, access control and web security awareness.",icon:"â—Ž",href:"modules/web-security.html",level:"Module 07",category:"security",tag:"Secure the web"},
    {id:"defensive",title:"Defensive Security",desc:"Logs, threat detection, incident response and recovery.",icon:"â—ˆ",href:"modules/defensive-security.html",level:"Module 08",category:"practice",tag:"Detect and respond"},
    {id:"advanced",title:"Advanced Learning Labs",desc:"Permission-based practical learning in safe environments.",icon:"âŒ¬",href:"modules/advanced-labs.html",level:"Module 09",category:"practice",tag:"Put skills together"}
];


// ==========================================
// INTERACTIVE LABS
// ==========================================

const labs = [
    {title:"Logic Gates Lab",desc:"Explore AND, OR, NOT and other logic gates.",category:"Digital Electronics",icon:"âŒ",href:"labs/logic-gates/logic-gates.html"},

    // UPDATED: Binary Arithmetic Lab now uses the deployed frontend path.
    {title:"Binary Arithmetic Lab",desc:"Practice binary addition and subtraction.",category:"Digital Electronics",icon:"01",href:"labs/binary-arithmetic/binary-arithmetic.html"},

    {title:"Bit Playground",desc:"Explore bit values and binary operations.",category:"Digital Electronics",icon:"01",href:"labs/bit-playground/bit-playground.html"},
    {title:"Boolean Algebra Lab",desc:"Practice Boolean expressions and simplification.",category:"Digital Electronics",icon:"âˆ§",href:"labs/boolean-algebra/boolean-algebra.html"},
    {title:"Combinational Circuits Lab",desc:"Explore combinational digital circuits.",category:"Digital Electronics",icon:"â–¦",href:"labs/combinational-circuits/combinational-circuits.html"},
    {title:"Sequential Circuits Lab",desc:"Explore sequential circuit behaviour.",category:"Digital Electronics",icon:"â—«",href:"labs/sequential-circuits/sequential-circuits.html"},
    {title:"Number System Converter",desc:"Convert values between common number systems.",category:"Digital Electronics",icon:"â‡„",href:"labs/number-converter/index.html"},
    {title:"OSI Model Explorer",desc:"Explore the seven layers of the OSI model.",category:"Networking",icon:"â–¤",href:"labs/osi-model/osi-model.html"},
    {title:"TCP/IP Model Lab",desc:"Understand the TCP/IP model layers.",category:"Networking",icon:"â‡„",href:"labs/tcpip-model/tcpip-model.html"},
    {title:"Networking Fundamentals",desc:"Learn basic networking concepts and components.",category:"Networking",icon:"âŒ˜",href:"labs/networking-fundamentals/networking-fundamentals.html"},
    {title:"IP Subnetting Lab",desc:"Practice IP address and subnet calculations.",category:"Networking",icon:"âŒ—",href:"labs/ip-subnetting/ip-subnetting.html"},
    {title:"ARP Simulation",desc:"Follow a sample ARP address-resolution process.",category:"Networking",icon:"â†”",href:"labs/arp-simulation/arp-lab.html"},
    {title:"DHCP Simulator",desc:"Explore how a device receives network settings.",category:"Networking",icon:"â–£",href:"labs/dhcp-simulator/dhcp-simulator.html"},
    {title:"DHCP Simulation Lab",desc:"Learn the DHCP address assignment sequence.",category:"Networking",icon:"â–£",href:"labs/dhcp-simulation/index.html"},
    {title:"DNS Resolution Lab",desc:"Follow a sample domain-name lookup.",category:"Networking",icon:"âŒ•",href:"labs/dns-resolution/dns-resolution.html"},
    {title:"DNS Simulation Lab",desc:"Explore a simulated DNS lookup workflow.",category:"Networking",icon:"âŒ•",href:"labs/dns-simulation/index.html"},
    {title:"Ports & Protocols Lab",desc:"Match common services with their port numbers.",category:"Networking",icon:"â‡„",href:"labs/ports-protocols/index.html"},
    {title:"TCP vs UDP Simulator",desc:"Compare transport protocol behaviour.",category:"Networking",icon:"â‡†",href:"labs/tcp-udp-simulator/tcp-udp-simulator.html"},
    {title:"TCP/UDP Simulation Lab",desc:"Explore sample TCP and UDP communication.",category:"Networking",icon:"â‡†",href:"labs/tcp-udp-simulation/index.html"},
    {title:"Routing Fundamentals",desc:"Understand how packets move between networks.",category:"Networking",icon:"â†—",href:"labs/routing-fundamentals/routing-fundamentals.html"},
    {title:"VLAN Configuration Lab",desc:"Explore logical network segmentation.",category:"Networking",icon:"â–¥",href:"labs/vlan-configuration/vlan-configuration.html"},
    {title:"Network Troubleshooting",desc:"Practice a guided troubleshooting workflow.",category:"Networking",icon:"âš’",href:"labs/network-troubleshooting/network-troubleshooting.html"},
    {title:"Latency & Packet Loss Lab",desc:"Explore delay and packet-loss concepts.",category:"Networking",icon:"â—·",href:"labs/latency-packet-loss/latency-packet-loss.html"},
    {title:"OSI Packet Journey",desc:"Trace a sample packet through network layers.",category:"Networking",icon:"â‡¢",href:"labs/osi-packet-journey/osi-packet-journey.html"},
    {title:"Networking Devices Lab",desc:"Explore routers, switches and other devices.",category:"Networking",icon:"âŒ˜",href:"labs/networking-devices/index.html"},
    {title:"HTTP vs HTTPS Simulator",desc:"Compare sample HTTP and HTTPS requests.",category:"Networking",icon:"ðŸ”’",href:"labs/http-https-simulation/index.html"},
    {title:"HTTP/HTTPS Simulation",desc:"Explore web request and response concepts.",category:"Networking",icon:"ðŸŒ",href:"labs/http-https-simulation/index.html"},
    {title:"Phishing URL Detection",desc:"Inspect fictional URLs for suspicious indicators.",category:"Cybersecurity",icon:"âŒ•",href:"labs/phishing-url-detection/index.html"},
    {title:"Phishing Email Detector",desc:"Identify warning signs in fictional email samples.",category:"Cybersecurity",icon:"âœ‰",href:"labs/phishing-email-detector/index.html"},
    {title:"Malware Awareness Simulator",desc:"Classify fictional file cases using safety clues.",category:"Cybersecurity",icon:"âŒ‘",href:"labs/malware-awareness/index.html"},
    {title:"Password Security Simulator",desc:"Review password strength and safer password habits.",category:"Cybersecurity",icon:"âš¿",href:"labs/password-security/index.html"},
    {title:"Social Engineering Awareness",desc:"Make safer decisions in fictional social scenarios.",category:"Cybersecurity",icon:"â™§",href:"labs/social-engineering/index.html"},
    {title:"Security Hygiene Simulator",desc:"Practice everyday account and device safety.",category:"Defensive Security",icon:"âœ“",href:"labs/security-hygiene/index.html"},
    {title:"Firewall Rules Simulator",desc:"Create allow/block rules and test sample traffic.",category:"Defensive Security",icon:"â–£",href:"labs/firewall-rules/index.html"},
    {title:"Firewall Simulation Lab",desc:"Explore basic firewall filtering concepts.",category:"Defensive Security",icon:"â–£",href:"labs/firewall-simulation/firewall-simulator.html"}
];


// ==========================================
// LOCAL STORAGE
// ==========================================

const storeKeys = {
    saved: "cyberverse_saved_modules_v2",
    recent: "cyberverse_recent_items_v2"
};

const readList = key => {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
};

const writeList = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error("Storage error:", error);
    }
};

let saved = readList(storeKeys.saved);
let recent = readList(storeKeys.recent);
let moduleFilter = "all";
let labFilter = "all";

const el = id => document.getElementById(id);

const escapeHTML = value =>
    String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));


// ==========================================
// RECENTLY OPENED
// ==========================================

function remember(item) {
    recent = [
        item,
        ...recent.filter(x => x.href !== item.href)
    ].slice(0, 10);

    writeList(storeKeys.recent, recent);
    renderContinue();
    updateStats();
}


// ==========================================
// LESSON MODULE CARDS
// ==========================================

function renderModuleCards() {
    const query = (el("moduleSearch")?.value || "").trim().toLowerCase();
    const sort = el("moduleSort")?.value || "order";

    let list = modules.filter(module =>
        (moduleFilter === "all" || module.category === moduleFilter) &&
        `${module.title} ${module.desc} ${module.level} ${module.tag}`
            .toLowerCase().includes(query)
    );

    if (sort === "az") {
        list.sort((a, b) => a.title.localeCompare(b.title));
    }

    el("dashboardModules").innerHTML = list.map(module => {
        const isSaved = saved.includes(module.id);

        return `
            <article class="module-card cv-module-card">
                <div class="module-top">
                    <span class="module-icon">${module.icon}</span>

                    <button
                        class="save-module ${isSaved ? "saved" : ""}"
                        data-save="${module.id}"
                        aria-label="${isSaved ? "Unsave" : "Save"} ${escapeHTML(module.title)}"
                        aria-pressed="${isSaved}">
                        ${isSaved ? "â˜…" : "â˜†"}
                    </button>
                </div>

                <div class="module-meta">
                    <span>${module.level}</span>
                    <span class="module-tag">${module.tag}</span>
                </div>

                <h3>${module.title}</h3>
                <p>${module.desc}</p>

                <a class="card-link module-open"
                   data-module="${module.id}"
                   href="${module.href}">
                    Open lesson module <span>â†—</span>
                </a>
            </article>
        `;
    }).join("");

    el("moduleNoResults").classList.toggle("hidden", list.length > 0);

    el("dashboardModules").querySelectorAll("[data-save]").forEach(button => {
        button.addEventListener("click", () => {
            toggleSaved(button.dataset.save);
        });
    });

    el("dashboardModules").querySelectorAll(".module-open").forEach(link => {
        link.addEventListener("click", () => {
            const module = modules.find(m => m.id === link.dataset.module);

            if (module) {
                remember({
                    title: module.title,
                    href: module.href,
                    type: "lesson module"
                });
            }
        });
    });
}


// ==========================================
// SAVE / UNSAVE
// ==========================================

function toggleSaved(id) {
    saved = saved.includes(id)
        ? saved.filter(x => x !== id)
        : [...saved, id];

    writeList(storeKeys.saved, saved);

    renderModuleCards();
    renderSaved();
    updateStats();
}


// ==========================================
// INTERACTIVE LABS
// ==========================================

function renderLabs() {
    const list = labs.filter(lab =>
        labFilter === "all" || lab.category === labFilter
    );

    el("dashboardLabs").innerHTML = list.map(lab => `
        <article class="lab-card">
            <span class="lab-icon">${lab.icon}</span>

            <div class="lab-content">
                <span class="lab-category">${lab.category}</span>
                <h3>${lab.title}</h3>
                <p>${lab.desc}</p>

                <a data-lab="${labs.indexOf(lab)}" href="${lab.href}">
                    Open lab â†’
                </a>
            </div>
        </article>
    `).join("");

    el("labNoResults").classList.toggle("hidden", list.length > 0);

    el("dashboardLabs").querySelectorAll("[data-lab]").forEach(link => {
        link.addEventListener("click", () => {
            const lab = labs[Number(link.dataset.lab)];

            if (lab) {
                remember({
                    title: lab.title,
                    href: lab.href,
                    type: "interactive lab"
                });
            }
        });
    });

    el("labTotal").textContent = labs.length;
}


// ==========================================
// SAVED MODULES
// ==========================================

function renderSaved() {
    const list = modules.filter(module => saved.includes(module.id));

    el("savedModules").innerHTML = list.length
        ? list.map(module => `
            <a class="saved-item saved-open"
               data-module="${module.id}"
               href="${module.href}">
                <span>${module.icon}</span>
                <b>${module.title}</b>
                <small>${module.level}</small>
                <i>â†—</i>
            </a>
        `).join("")
        : '<p class="muted">No saved modules yet. Select â˜† on a lesson module card.</p>';

    el("savedModules").querySelectorAll(".saved-open").forEach(link => {
        link.addEventListener("click", () => {
            const module = modules.find(m => m.id === link.dataset.module);

            if (module) {
                remember({
                    title: module.title,
                    href: module.href,
                    type: "lesson module"
                });
            }
        });
    });
}


// ==========================================
// CONTINUE EXPLORING
// ==========================================

function renderContinue() {
    const last = recent[0];

    if (last) {
        el("continueTitle").textContent = last.title;

        el("continueText").textContent =
            `Recently opened ${last.type}. Continue exploring from where you left off.`;

        el("continueButton").href = last.href;
        el("continueButton").textContent = "Continue exploring â†’";
    }
}


// ==========================================
// DASHBOARD STATISTICS
// ==========================================

function updateStats() {
    el("savedTotal").textContent = saved.length;
    el("recentTotal").textContent = recent.length;
}


// ==========================================
// EVENT SETUP
// ==========================================

function setup() {

    el("moduleSearch").addEventListener("input", renderModuleCards);

    el("moduleSort").addEventListener("change", renderModuleCards);

    document.querySelectorAll("[data-filter]").forEach(button => {
        button.addEventListener("click", () => {
            moduleFilter = button.dataset.filter;

            document.querySelectorAll("[data-filter]").forEach(item => {
                item.classList.toggle("active", item === button);
            });

            renderModuleCards();
        });
    });

    document.querySelectorAll("[data-lab-filter]").forEach(button => {
        button.addEventListener("click", () => {
            labFilter = button.dataset.labFilter;

            document.querySelectorAll("[data-lab-filter]").forEach(item => {
                item.classList.toggle("active", item === button);
            });

            renderLabs();
        });
    });

    // Search keyboard shortcut
    document.addEventListener("keydown", event => {
        if (
            event.key === "/" &&
            !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)
        ) {
            event.preventDefault();
            el("moduleSearch").focus();
        }
    });
}


// ==========================================
// DASHBOARD INITIALIZATION
// ==========================================

if (el("dashboardModules")) {
    setup();
    renderModuleCards();
    renderLabs();
    renderSaved();
    renderContinue();
    updateStats();
}


// ==========================================
// HOME PAGE MODULES
// ==========================================

const home = el("homeModules");

if (home) {
    home.innerHTML = modules.slice(0, 4).map(module => `
        <article class="module-card">
            <div class="module-icon">${module.icon}</div>
            <div class="eyebrow">${module.level}</div>
            <h3>${module.title}</h3>
            <p>${module.desc}</p>
            <a class="card-link" href="${module.href}">
                Open module â†’
            </a>
        </article>
    `).join("");
}


// ==========================================
// ROADMAP MODULES - FETCH FROM MYSQL API
// ==========================================

const roadmap = el("roadmapList");

async function loadRoadmapLessons() {
    if (!roadmap) return;

    roadmap.innerHTML = "<p>Loading lessons...</p>";

    try {
        const response = await fetch(
            "https://cyberverse-bqt0.onrender.com/api/lessons"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch lessons");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.lessons)) {
            throw new Error("Invalid lessons response");
        }

        if (data.lessons.length === 0) {
            roadmap.innerHTML = "<p>No lessons available.</p>";
            return;
        }

        roadmap.innerHTML = data.lessons.map((lesson, index) => `
            <article class="roadmap-item">
                <div class="roadmap-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <div>
                    <h3>${lesson.title}</h3>
                    <p>${lesson.description || "Explore this lesson."}</p>
                </div>

                <a class="card-link"
                   href="lesson.html?id=${encodeURIComponent(lesson.id)}">
                    Explore â†’
                </a>
            </article>
        `).join("");

    } catch (error) {
        console.error("Roadmap Error:", error);
        roadmap.innerHTML =
            "<p>Unable to load lessons. Please try again.</p>";
    }
}

loadRoadmapLessons();




