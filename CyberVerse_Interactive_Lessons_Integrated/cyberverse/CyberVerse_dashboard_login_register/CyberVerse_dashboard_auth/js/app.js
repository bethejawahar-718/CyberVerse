
// ==========================================
// CYBERVERSE - DASHBOARD APPLICATION
// ==========================================

// LESSON MODULES
const modules = [
    {id:"digital",title:"Digital Electronics",desc:"Number systems, binary arithmetic, logic gates and digital circuits.",icon:"⌘",href:"modules/digital-electronics.html",level:"Module 01",category:"foundation",tag:"Build your base"},
    {id:"networking",title:"Computer Networking",desc:"OSI, TCP/IP, IP addressing, DNS, DHCP, ports, protocols and firewalls.",icon:"⌁",href:"modules/networking.html",level:"Module 02",category:"foundation",tag:"Connect the pieces"},
    {id:"cybersecurity",title:"Cybersecurity Fundamentals",desc:"Security principles, risks, authentication, malware and phishing awareness.",icon:"⬡",href:"modules/cybersecurity.html",level:"Module 03",category:"security",tag:"Think like a defender"},
    {id:"crypto",title:"Cryptography Basics",desc:"Encryption, hashing, keys, signatures and digital certificates.",icon:"⚿",href:"modules/cryptography.html",level:"Module 04",category:"security",tag:"Protect information"},
    {id:"linux",title:"Linux Fundamentals",desc:"Files, permissions, processes and command-line foundations.",icon:"›_",href:"modules/linux.html",level:"Module 05",category:"foundation",tag:"Master the terminal"},
    {id:"python",title:"Python for Cybersecurity",desc:"Programming foundations and safe sample security-log exercises.",icon:"{}",href:"modules/python-security.html",level:"Module 06",category:"practice",tag:"Automate thoughtfully"},
    {id:"web",title:"Web Security",desc:"Input validation, access control and web security awareness.",icon:"◎",href:"modules/web-security.html",level:"Module 07",category:"security",tag:"Secure the web"},
    {id:"defensive",title:"Defensive Security",desc:"Logs, threat detection, incident response and recovery.",icon:"◈",href:"modules/defensive-security.html",level:"Module 08",category:"practice",tag:"Detect and respond"},
    {id:"advanced",title:"Advanced Learning Labs",desc:"Permission-based practical learning in safe environments.",icon:"⌬",href:"modules/advanced-labs.html",level:"Module 09",category:"practice",tag:"Put skills together"}
];


// INTERACTIVE LABS
const labs = [
    {title:"Logic Gates Lab",desc:"Explore AND, OR, NOT and other logic gates.",category:"Digital Electronics",icon:"⌁",href:"../../cyberverse-logic-gates-lab/cyberverse-logic-gates-lab/logic-gates.html"},
    {title:"Binary Arithmetic Lab",desc:"Practice binary addition and subtraction.",category:"Digital Electronics",icon:"01",href:"../../cyberverse-binary-arithmetic-lab/cyberverse-binary-arithmetic-lab/binary-arithmetic.html"},
    {title:"Bit Playground",desc:"Explore bit values and binary operations.",category:"Digital Electronics",icon:"01",href:"../../cyberverse-bit-playground/bit-playground.html"},
    {title:"Boolean Algebra Lab",desc:"Practice Boolean expressions and simplification.",category:"Digital Electronics",icon:"∧",href:"../../cyberverse-boolean-algebra-lab/boolean-algebra.html"},
    {title:"Combinational Circuits Lab",desc:"Explore combinational digital circuits.",category:"Digital Electronics",icon:"▦",href:"../../cyberverse-combinational-circuits-lab/combinational-circuits.html"},
    {title:"Sequential Circuits Lab",desc:"Explore sequential circuit behaviour.",category:"Digital Electronics",icon:"◫",href:"../../cyberverse-sequential-circuits-lab/sequential-circuits.html"},
    {title:"Number System Converter",desc:"Convert values between common number systems.",category:"Digital Electronics",icon:"⇄",href:"../../cyberverse-converter-lab/index.html"},
    {title:"OSI Model Explorer",desc:"Explore the seven layers of the OSI model.",category:"Networking",icon:"▤",href:"../../cyberverse-osi-model-lab/osi-model.html"},
    {title:"TCP/IP Model Lab",desc:"Understand the TCP/IP model layers.",category:"Networking",icon:"⇄",href:"../../cyberverse-tcpip-model-lab/tcpip-model.html"},
    {title:"Networking Fundamentals",desc:"Learn basic networking concepts and components.",category:"Networking",icon:"⌘",href:"../../cyberverse-networking-fundamentals-lab/networking-fundamentals.html"},
    {title:"IP Subnetting Lab",desc:"Practice IP address and subnet calculations.",category:"Networking",icon:"⌗",href:"../../cyberverse-ip-subnetting-lab/ip-subnetting.html"},
    {title:"ARP Simulation",desc:"Follow a sample ARP address-resolution process.",category:"Networking",icon:"↔",href:"../../cyberverse-arp-simulation-lab/arp-lab.html"},
    {title:"DHCP Simulator",desc:"Explore how a device receives network settings.",category:"Networking",icon:"▣",href:"../../CyberVerse_DHCP_Simulator_Lab/dhcp-simulator.html"},
    {title:"DHCP Simulation Lab",desc:"Learn the DHCP address assignment sequence.",category:"Networking",icon:"▣",href:"../../CyberVerse_DHCP_Simulation_Lab/CyberVerse_DHCP_Simulation_Lab/index.html"},
    {title:"DNS Resolution Lab",desc:"Follow a sample domain-name lookup.",category:"Networking",icon:"⌕",href:"../../CyberVerse_DNS_Resolution_Lab/dns-resolution.html"},
    {title:"DNS Simulation Lab",desc:"Explore a simulated DNS lookup workflow.",category:"Networking",icon:"⌕",href:"../../CyberVerse_DNS_Simulation_Lab/CyberVerse_DNS_Simulation_Lab/index.html"},
    {title:"Ports & Protocols Lab",desc:"Match common services with their port numbers.",category:"Networking",icon:"⇄",href:"../../CyberVerse_Ports_Protocols_Simulation_Lab/index.html"},
    {title:"TCP vs UDP Simulator",desc:"Compare transport protocol behaviour.",category:"Networking",icon:"⇆",href:"../../CyberVerse_TCP_UDP_Protocol_Simulator_Lab/tcp-udp-simulator.html"},
    {title:"TCP/UDP Simulation Lab",desc:"Explore sample TCP and UDP communication.",category:"Networking",icon:"⇆",href:"../../CyberVerse_TCP_UDP_Simulation_Lab/CyberVerse_TCP_UDP_Simulation_Lab/index.html"},
    {title:"Routing Fundamentals",desc:"Understand how packets move between networks.",category:"Networking",icon:"↗",href:"../../CyberVerse_Routing_Fundamentals_Lab/routing-fundamentals.html"},
    {title:"VLAN Configuration Lab",desc:"Explore logical network segmentation.",category:"Networking",icon:"▥",href:"../../CyberVerse_VLAN_Configuration_Lab/CyberVerse_VLAN_Configuration_Lab/vlan-configuration.html"},
    {title:"Network Troubleshooting",desc:"Practice a guided troubleshooting workflow.",category:"Networking",icon:"⚒",href:"../../CyberVerse_Network_Troubleshooting_Lab/CyberVerse_Network_Troubleshooting_Lab/network-troubleshooting.html"},
    {title:"Latency & Packet Loss Lab",desc:"Explore delay and packet-loss concepts.",category:"Networking",icon:"◷",href:"../../CyberVerse_Latency_Packet_Loss_Lab/CyberVerse_Latency_Packet_Loss_Lab/latency-packet-loss.html"},
    {title:"OSI Packet Journey",desc:"Trace a sample packet through network layers.",category:"Networking",icon:"⇢",href:"../../CyberVerse_OSI_Packet_Journey_Lab/CyberVerse_OSI_Packet_Journey_Lab/osi-packet-journey.html"},
    {title:"Networking Devices Lab",desc:"Explore routers, switches and other devices.",category:"Networking",icon:"⌘",href:"../../CyberVerse_NET10_Networking_Devices_Lab/index.html"},
    {title:"HTTP vs HTTPS Simulator",desc:"Compare sample HTTP and HTTPS requests.",category:"Networking",icon:"🔒",href:"../../CyberVerse_HTTP_HTTPS_Simulator/CyberVerse_HTTP_HTTPS_Simulator/modules/http-https-simulator.html"},
    {title:"HTTP/HTTPS Simulation",desc:"Explore web request and response concepts.",category:"Networking",icon:"🌐",href:"../../CyberVerse_NET11_HTTP_HTTPS_Simulation_Lab/index.html"},
    {title:"Phishing URL Detection",desc:"Inspect fictional URLs for suspicious indicators.",category:"Cybersecurity",icon:"⌕",href:"../../CyberVerse_Phishing_URL_Detection_Simulator/CyberVerse_Phishing_URL_Detection_Simulator/index.html"},
    {title:"Phishing Email Detector",desc:"Identify warning signs in fictional email samples.",category:"Cybersecurity",icon:"✉",href:"../../CyberVerse_SEC06_Phishing_Email_Detector/CyberVerse_SEC06_Phishing_Email_Detector/index.html"},
    {title:"Malware Awareness Simulator",desc:"Classify fictional file cases using safety clues.",category:"Cybersecurity",icon:"⌑",href:"../../CyberVerse_SEC05_Malware_Simulator/cyberverse-sec05-malware-simulator/index.html"},
    {title:"Password Security Simulator",desc:"Review password strength and safer password habits.",category:"Cybersecurity",icon:"⚿",href:"../../Password_Security_Simulator_CyberVerse/password-security-simulator/index.html"},
    {title:"Social Engineering Awareness",desc:"Make safer decisions in fictional social scenarios.",category:"Cybersecurity",icon:"♧",href:"../../CyberVerse_SEC07_Social_Engineering_Awareness/CyberVerse_SEC07_Social_Engineering_Awareness/index.html"},
    {title:"Security Hygiene Simulator",desc:"Practice everyday account and device safety.",category:"Defensive Security",icon:"✓",href:"../../CyberVerse_SEC08_Security_Hygiene_Simulator/CyberVerse_SEC08_Security_Hygiene_Simulator/index.html"},
    {title:"Firewall Rules Simulator",desc:"Create allow/block rules and test sample traffic.",category:"Defensive Security",icon:"▣",href:"../../CyberVerse_SEC09_Firewalls_Simulator/CyberVerse_SEC09_Firewalls_Simulator/index.html"},
    {title:"Firewall Simulation Lab",desc:"Explore basic firewall filtering concepts.",category:"Defensive Security",icon:"▣",href:"../../CyberVerse_Firewall_Simulation_Lab/CyberVerse_Firewall_Simulation_Lab/firewall-simulator.html"}
];


// LOCAL STORAGE
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


// RECENTLY OPENED
function remember(item) {
    recent = [
        item,
        ...recent.filter(x => x.href !== item.href)
    ].slice(0, 10);

    writeList(storeKeys.recent, recent);
    renderContinue();
    updateStats();
}


// LESSON MODULE CARDS
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
                        ${isSaved ? "★" : "☆"}
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
                    Open lesson module <span>↗</span>
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


// SAVE / UNSAVE
function toggleSaved(id) {
    saved = saved.includes(id)
        ? saved.filter(x => x !== id)
        : [...saved, id];

    writeList(storeKeys.saved, saved);

    renderModuleCards();
    renderSaved();
    updateStats();
}


// INTERACTIVE LABS
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
                    Open lab →
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


// SAVED MODULES
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
                <i>↗</i>
            </a>
        `).join("")
        : '<p class="muted">No saved modules yet. Select ☆ on a lesson module card.</p>';

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


// CONTINUE EXPLORING
function renderContinue() {
    const last = recent[0];

    if (last) {
        el("continueTitle").textContent = last.title;

        el("continueText").textContent =
            `Recently opened ${last.type}. Continue exploring from where you left off.`;

        el("continueButton").href = last.href;
        el("continueButton").textContent = "Continue exploring →";
    }
}


// DASHBOARD STATISTICS
function updateStats() {
    el("savedTotal").textContent = saved.length;
    el("recentTotal").textContent = recent.length;
}


// EVENT SETUP
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


// DASHBOARD INITIALIZATION
if (el("dashboardModules")) {
    setup();
    renderModuleCards();
    renderLabs();
    renderSaved();
    renderContinue();
    updateStats();
}


// HOME PAGE MODULES
const home = el("homeModules");

if (home) {
    home.innerHTML = modules.slice(0, 4).map(module => `
        <article class="module-card">
            <div class="module-icon">${module.icon}</div>
            <div class="eyebrow">${module.level}</div>
            <h3>${module.title}</h3>
            <p>${module.desc}</p>
            <a class="card-link" href="${module.href}">
                Open module →
            </a>
        </article>
    `).join("");
}




// ROADMAP MODULES - FETCH FROM MYSQL API
const roadmap = el("roadmapList");

async function loadRoadmapLessons() {
    if (!roadmap) return;

    roadmap.innerHTML = "<p>Loading lessons...</p>";

    try {
        const response = await fetch("https://cyberverse-bqt0.onrender.com/api/lessons");

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
                    Explore →
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
