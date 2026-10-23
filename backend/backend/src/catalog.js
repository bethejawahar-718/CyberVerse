// Course titles and levels mirror the supplied CyberVerse frontend.
const courses = [
  { id: 1, title: "Cybersecurity Fundamentals", level: "beginner", description: "Computers, networks, the CIA triad, and the threat landscape." },
  { id: 2, title: "Security Hygiene", level: "beginner", description: "Passwords, MFA, safe browsing, device hardening, and backups." },
  { id: 3, title: "Common Cyber Threats", level: "beginner", description: "Phishing, malware, ransomware, DoS, MITM, APTs, and zero-days." },
  { id: 4, title: "Network Security", level: "intermediate", description: "Firewalls, VPNs, IDS/IPS, wireless security, Zero Trust, and SIEM." },
  { id: 5, title: "Defense Basics", level: "intermediate", description: "Encryption, authentication, authorization, access control, PKI, and endpoint protection." },
  { id: 6, title: "Ethical Hacking & Pen Testing", level: "intermediate", description: "Authorized testing methodology, recon, scanning, validation, and reporting." },
  { id: 7, title: "Web Application Security", level: "advanced", description: "OWASP risks, injection, XSS, CSRF, sessions, and API security." },
  { id: 8, title: "Digital Forensics & Incident Response", level: "advanced", description: "Evidence handling, log analysis, incident triage, and response." },
  { id: 9, title: "Practical Security Labs", level: "advanced", description: "Guided, authorized practice in isolated lab environments." }
];

const levels = ["beginner", "intermediate", "advanced"];

const lessonsByCourse = {
  1: [
    ["Introduction to Cybersecurity", "Cybersecurity protects systems, networks, applications, and data from unauthorized access, disruption, or damage."],
    ["Confidentiality, Integrity, Availability", "Confidentiality limits data access, integrity preserves correctness, and availability keeps services usable."],
    ["Computer and Network Basics", "Endpoints communicate over networks using addressing, routing, protocols, and layered services."],
    ["Threats, Vulnerabilities, and Risk", "A threat may exploit a vulnerability; risk combines likelihood and impact."],
    ["Security Controls", "Administrative, technical, and physical controls reduce risk through prevention, detection, and recovery."],
    ["Responsible Security Practice", "Only test systems with explicit permission and a clearly defined scope."]
  ],
  2: [
    ["Password Security", "Use unique long passwords or passphrases and store them in a reputable password manager."],
    ["Multi-Factor Authentication", "MFA adds another proof of identity beyond a password."],
    ["Phishing Awareness", "Check sender identity, links, unexpected attachments, and urgent requests through a separate trusted channel."],
    ["Safe Browsing", "Keep browsers updated and avoid untrusted downloads and suspicious sites."],
    ["Device Hardening", "Apply updates, enable screen locks, remove unused software, and limit administrator privileges."],
    ["Backups and Recovery", "Maintain tested backups and protect at least one copy from ordinary account compromise."]
  ],
  3: [
    ["Threat Landscape", "Cyber threats include social engineering, malicious software, service disruption, and credential abuse."],
    ["Phishing and Social Engineering", "Attackers manipulate people into revealing information or taking unsafe actions."],
    ["Malware and Ransomware", "Malware performs unauthorized actions; ransomware may deny access to data or systems."],
    ["Denial of Service", "DoS attacks attempt to make a service unavailable to legitimate users."],
    ["Man-in-the-Middle", "Interception risks are reduced by authenticated encryption and careful certificate validation."],
    ["Zero-Days and APTs", "Prioritize patching, monitoring, least privilege, and layered defenses."]
  ],
  4: [
    ["Network Security Overview", "Network security protects traffic, devices, and services using layered controls."],
    ["Firewalls", "Firewalls allow or deny traffic based on policy and connection attributes."],
    ["VPNs and Secure Tunnels", "VPNs create protected tunnels, but endpoint security and identity still matter."],
    ["IDS and IPS", "IDS detects suspicious activity; IPS can actively block matching traffic."],
    ["Wireless Security", "Use modern Wi-Fi security, strong credentials, firmware updates, and guest network isolation."],
    ["Monitoring and Zero Trust", "Continuously verify identity and context; centralize and review useful security logs."]
  ],
  5: [
    ["Encryption Basics", "Encryption transforms readable data into ciphertext using keys."],
    ["Hashing and Integrity", "Cryptographic hashes help detect changes; password storage should use dedicated slow password hashing."],
    ["Authentication and Authorization", "Authentication verifies who a user is; authorization determines what they may do."],
    ["Access Control", "Least privilege grants only the permissions required for a task."],
    ["Public Key Infrastructure", "PKI uses certificates and trusted authorities to bind identities to public keys."],
    ["Endpoint Protection", "Patching, endpoint detection, configuration baselines, and least privilege reduce endpoint risk."]
  ],
  6: [
    ["Ethical Testing and Scope", "Get written authorization, define scope, and agree on timing, limits, and reporting."],
    ["Planning and Reconnaissance", "Gather only in-scope information using methods permitted by the engagement."],
    ["Scanning and Validation", "Validate findings carefully to reduce false positives and avoid disruption."],
    ["Safe Exploitation Concepts", "Use controlled proof-of-concept validation only in authorized environments."],
    ["Risk and Remediation", "Prioritize findings by impact, likelihood, exposure, and available mitigations."],
    ["Reporting and Retesting", "Explain evidence, impact, reproduction conditions, fixes, and retest results."]
  ],
  7: [
    ["Web Application Security", "Secure design considers browser, server, identity, data, and API boundaries."],
    ["Input Validation and Injection", "Use parameterized queries and context-aware output handling instead of trusting raw input."],
    ["Cross-Site Scripting", "Contextual output encoding and safe templating help prevent untrusted script execution."],
    ["CSRF and Session Security", "Use appropriate anti-CSRF defenses, secure cookies, and session rotation."],
    ["Access Control and APIs", "Enforce authorization on the server for every protected object and operation."],
    ["Secure Development", "Threat modeling, code review, dependency updates, and security testing support safer releases."]
  ],
  8: [
    ["Incident Response Lifecycle", "Prepare, detect, analyze, contain, eradicate, recover, and learn from incidents."],
    ["Evidence Preservation", "Record provenance and handling; preserve originals and work from verified copies where possible."],
    ["Logs and Timelines", "Normalize timestamps and correlate events across reliable log sources."],
    ["Triage and Containment", "Prioritize by impact and scope while preserving evidence and business continuity."],
    ["Recovery and Communication", "Restore from trusted sources, validate systems, and communicate through approved channels."],
    ["Lessons Learned", "Document root causes, improvements, owners, and follow-up dates."]
  ],
  9: [
    ["Safe Lab Setup", "Use intentionally vulnerable training targets in isolated, authorized environments."],
    ["Packet Analysis", "Inspect protocol metadata and traffic patterns using captures created in your own lab."],
    ["Vulnerability Assessment", "Identify and document weaknesses only within an explicitly authorized scope."],
    ["Web Security Practice", "Use training applications designed for security education, never unrelated live systems."],
    ["Detection Engineering", "Create simple detection hypotheses and validate them against controlled test events."],
    ["Capstone Report", "Summarize scope, method, findings, evidence, risk, and practical remediation."]
  ]
};

const lessons = [];
for (const course of courses) {
  for (const level of levels) {
    (lessonsByCourse[course.id] || []).forEach((lesson, index) => {
      lessons.push({
        id: `${course.id}-${levels.indexOf(level) + 1}-${index + 1}`,
        courseId: course.id,
        level,
        order: index + 1,
        title: lesson[0],
        content: lesson[1]
      });
    });
  }
}

const mentors = [
  { id: "fundamentals", name: "Nova", specialty: "Cybersecurity Fundamentals", suggestions: ["Explain the CIA triad", "What is a vulnerability?", "How do I start learning?"] },
  { id: "network", name: "Packet", specialty: "Network Security", suggestions: ["Explain firewalls", "IDS vs IPS", "What is a VPN?"] },
  { id: "web", name: "Byte", specialty: "Web Application Security", suggestions: ["How do parameterized queries help?", "Explain XSS safely", "What is the OWASP Top 10?"] },
  { id: "defense", name: "Shield", specialty: "Defensive Security and Incident Response", suggestions: ["How should I triage an alert?", "What logs are useful?", "Explain least privilege"] }
];

const labs = [
  { id: "lab1", title: "Build Your Virtual Pentest Lab", level: "beginner", duration: "45 min", description: "Set up an isolated practice environment using virtual machines.", steps: ["Use a virtualization platform and trusted training images.", "Create a host-only or internal network.", "Keep intentionally vulnerable targets isolated from the public internet.", "Document the lab scope and safety boundaries."] },
  { id: "lab2", title: "Packet Capture & Analysis", level: "beginner", duration: "30 min", description: "Inspect traffic generated by your own devices or lab.", steps: ["Open Wireshark and choose your own lab interface.", "Capture a short period of permitted traffic.", "Filter for DNS or TCP traffic.", "Record protocol, source, destination, and observations."] },
  { id: "lab3", title: "Password Storage Comparison", level: "intermediate", duration: "40 min", description: "Learn why password hashing algorithms differ.", steps: ["Use a local educational demo with synthetic passwords.", "Compare fast hashes with a password-specific hashing algorithm.", "Discuss salts and work factors.", "Recommend secure password storage practices."] },
  { id: "lab4", title: "SQL Injection Prevention", level: "intermediate", duration: "50 min", description: "Learn to recognize and prevent injection in a deliberately vulnerable training app.", steps: ["Run a purpose-built training application locally.", "Review how input reaches a database query.", "Replace string concatenation with parameterized queries.", "Add tests to verify inputs remain data, not query syntax."] },
  { id: "lab5", title: "Cross-Site Scripting Prevention", level: "intermediate", duration: "40 min", description: "Study safe rendering in a local training application.", steps: ["Use a local sandbox or intentionally vulnerable training app.", "Identify where untrusted content is rendered.", "Apply context-aware output encoding and safe templating.", "Retest with harmless test strings."] },
  { id: "lab6", title: "Firewall & IDS Configuration", level: "intermediate", duration: "60 min", description: "Configure defensive controls in a lab network.", steps: ["Create isolated network segments.", "Apply a default-deny rule where practical.", "Enable IDS logging on the lab segment.", "Generate benign test traffic and review alerts."] }
];

module.exports = { courses, lessons, mentors, labs };
