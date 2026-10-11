// CyberVerse — Learning Module Content & Progress Tracking

const LEVEL_INFO = {
    1: { label: "Level 1 · Foundations", short: "Foundations", description: "The core ideas every learner needs before going further." },
    2: { label: "Level 2 · Core Skills", short: "Core Skills", description: "Practical skills and techniques used on the job every day." },
    3: { label: "Level 3 · Advanced", short: "Advanced", description: "Deeper, real-world and career-oriented topics." }
};

function buildBody(overview, concepts, whyItMatters) {
    const conceptItems = concepts.map(c => `<li>${c}</li>`).join("");
    return `${overview}<br><br><b>Key Concepts</b><ul class="lesson-concepts">${conceptItems}</ul><b>Why It Matters:</b> ${whyItMatters}`;
}

const MODULE_CONTENT = {
    1: {
        title: "Cybersecurity Fundamentals",
        levels: {
            1: [
                {
                    title: "What Is Cybersecurity?",
                    body: buildBody(
                        "Cybersecurity is the practice of protecting systems, networks and data from unauthorized access, damage or disruption. Nearly every defensive decision maps back to the CIA Triad: Confidentiality, Integrity and Availability.",
                        [
                            "<b>Confidentiality</b> — only authorized people can view data (encryption, access control).",
                            "<b>Integrity</b> — data stays accurate and unaltered (hashing, checksums).",
                            "<b>Availability</b> — systems stay up and usable when needed (backups, redundancy).",
                            "Attacks are classified by which of these three properties they break."
                        ],
                        "Every vulnerability, control and policy you'll study in this course exists to protect one of these three properties — it's the mental model behind the whole field."
                    )
                },
                {
                    title: "How Networks Communicate",
                    body: buildBody(
                        "Devices talk to each other using the TCP/IP model. Data is addressed with an IP address (which machine) and a port number (which application — e.g. 443 for HTTPS, 22 for SSH), broken into packets, routed, and reassembled at the destination.",
                        [
                            "<b>IP address</b> identifies a device on a network.",
                            "<b>Port number</b> identifies which application/service on that device.",
                            "Packets travel independently and are reassembled on arrival.",
                            "Tools like Wireshark capture and inspect this traffic directly."
                        ],
                        "Most attacks — sniffing, spoofing, man-in-the-middle — exploit how trusting these protocols are by default, so understanding the normal flow is what lets you spot the abnormal one."
                    )
                }
            ],
            2: [
                {
                    title: "The Threat Landscape",
                    body: buildBody(
                        "A threat actor is anyone trying to compromise a system: script kiddies, organized cybercriminals, hacktivists, insider threats, and nation-state groups, each with different motives and resources.",
                        [
                            "<b>Attack surface</b> — every point an attacker could target: ports, forms, employees, APIs, physical access.",
                            "Different actors use different tactics — opportunistic malware vs. targeted intrusion.",
                            "Motive shapes method: financial gain, espionage, ideology, or disruption.",
                            "Reducing attack surface is one of the cheapest, highest-impact defenses available."
                        ],
                        "Knowing who might attack you and why shapes every other decision — a bank defends differently than a hobbyist blog, because the threat actors targeting each are completely different."
                    )
                },
                {
                    title: "Security Policies & Frameworks",
                    body: buildBody(
                        "Organizations don't invent security practice from scratch — they follow established frameworks that give structure to an otherwise overwhelming problem.",
                        [
                            "<b>NIST Cybersecurity Framework</b> — five functions: Identify, Protect, Detect, Respond, Recover.",
                            "<b>ISO/IEC 27001</b> — certifies an organization's information security management system.",
                            "Frameworks provide a shared vocabulary across teams and auditors.",
                            "They turn 'are we secure?' into a measurable maturity checklist."
                        ],
                        "Frameworks let teams prioritize systematically instead of reacting to whatever threat is loudest this week — this is how security work scales beyond one person's intuition."
                    )
                }
            ],
            3: [
                {
                    title: "Risk Management Basics",
                    body: buildBody(
                        "Risk is commonly modeled as Risk = Likelihood × Impact. A risk assessment identifies assets, the threats facing them, existing vulnerabilities, and the potential business impact if each were exploited.",
                        [
                            "<b>Mitigate</b> — add controls to reduce likelihood or impact.",
                            "<b>Transfer</b> — insurance or outsourcing shifts the risk elsewhere.",
                            "<b>Accept</b> — when the cost of fixing exceeds the risk itself.",
                            "<b>Avoid</b> — discontinue the activity that creates the risk."
                        ],
                        "Security budgets are finite, so this prioritization model is how real organizations decide what to fix first instead of trying to fix everything at once."
                    )
                },
                {
                    title: "Careers in Cybersecurity",
                    body: buildBody(
                        "The field branches into many specializations, and picking a direction early helps you focus your learning path through this course and beyond.",
                        [
                            "<b>SOC Analyst</b> — monitoring and triage of alerts.",
                            "<b>Penetration Tester</b> — offensive, authorized testing of systems.",
                            "<b>Security Engineer</b> — building and maintaining defenses.",
                            "<b>Incident Responder</b> — handling active breaches; <b>GRC Analyst</b> — governance, risk & compliance."
                        ],
                        "CompTIA Security+ validates fundamentals for any path; OSCP and GIAC credentials demonstrate hands-on depth once you've chosen offense, defense, or governance."
                    )
                }
            ]
        }
    },
    2: {
        title: "Security Hygiene",
        levels: {
            1: [
                {
                    title: "Building Strong Passwords",
                    body: buildBody(
                        "A strong password resists both guessing and brute-force cracking. Length beats complexity: a 16-character passphrase like <code>correct-horse-battery-staple</code> is harder to crack than <code>P@ssw0rd!</code>, and far easier to remember.",
                        [
                            "Length matters more than symbol complexity for crack-resistance.",
                            "Never reuse a password across more than one site.",
                            "A breach at one service should never compromise the rest of your accounts.",
                            "Password managers (Bitwarden, 1Password) generate and store unique passwords for you."
                        ],
                        "Credential reuse is one of the single biggest causes of account takeover — a leak from a site you barely use can cascade into your email, bank, or work accounts."
                    )
                },
                {
                    title: "Multi-Factor Authentication (MFA)",
                    body: buildBody(
                        "MFA requires a second proof of identity beyond your password — something you have (an authenticator app, a hardware key) or something you are (a fingerprint).",
                        [
                            "Even a leaked password can't be used alone if MFA is enabled.",
                            "App-based or hardware-key MFA (TOTP, YubiKeys) beats SMS codes.",
                            "SMS can be hijacked via SIM-swapping attacks.",
                            "Enable MFA first on email — it's the recovery path for everything else."
                        ],
                        "MFA is the single highest-leverage control an individual can enable — it stops the vast majority of automated account-takeover attempts outright."
                    )
                }
            ],
            2: [
                {
                    title: "Safe Browsing Habits",
                    body: buildBody(
                        "Before clicking a link, hover to preview the real destination URL — attackers disguise malicious links behind legitimate-looking text. Check for HTTPS and a valid certificate on any site handling sensitive data.",
                        [
                            "Hover links before clicking to preview the real destination.",
                            "Confirm HTTPS and a valid certificate on sensitive sites.",
                            "Keep browser and OS patched — most drive-by malware exploits known, fixed bugs.",
                            "Treat urgency ('your account will be suspended!') as a red flag."
                        ],
                        "Most compromises start with a single careless click — these habits turn a routine moment of browsing into an automatic checkpoint against social engineering."
                    )
                },
                {
                    title: "Device & OS Hardening",
                    body: buildBody(
                        "Hardening means reducing a device's attack surface before it's ever attacked: enable full-disk encryption, automatic updates, and disable unused services.",
                        [
                            "Enable full-disk encryption on laptops and phones.",
                            "Turn on automatic OS and app updates.",
                            "Run a non-admin account for everyday use.",
                            "Review app permissions regularly — a flashlight app needing your contacts is a red flag."
                        ],
                        "A hardened device survives attacks that a default-configuration device wouldn't — this is cheap, one-time setup work that pays off continuously."
                    )
                }
            ],
            3: [
                {
                    title: "Securing Your Home Network",
                    body: buildBody(
                        "Change your router's default admin password immediately, use WPA3 (or WPA2 at minimum) encryption, and give guests a separate, isolated Wi-Fi network.",
                        [
                            "Change the router's default admin credentials on day one.",
                            "Use WPA3, or WPA2 as a minimum.",
                            "Put guests and IoT devices on an isolated network.",
                            "Disable WPS and remote management from the internet; keep firmware updated."
                        ],
                        "Routers are rarely patched manually and sit directly on the network perimeter — they're an overlooked but frequent entry point attackers scan for at scale."
                    )
                },
                {
                    title: "Backup Strategies & Recovery",
                    body: buildBody(
                        "The 3-2-1 rule is the gold standard: keep at least 3 copies of important data, on 2 different storage media, with 1 copy stored off-site or offline.",
                        [
                            "3 copies of data, on 2 different media, 1 off-site/offline.",
                            "Offline/air-gapped copies defeat ransomware that hunts connected backups.",
                            "Automate backups so they don't depend on remembering.",
                            "Test the restore process — an untested backup is a guess, not a plan."
                        ],
                        "Backups are the one control that makes ransomware a non-event instead of a catastrophe — this single habit undoes an attacker's entire business model."
                    )
                }
            ]
        }
    },
    3: {
        title: "Common Cyber Threats",
        levels: {
            1: [
                {
                    title: "Phishing & Social Engineering",
                    body: buildBody(
                        "Phishing tricks people into giving up credentials or installing malware, usually via email impersonating a trusted sender.",
                        [
                            "<b>Spear phishing</b> — targeted at one specific person.",
                            "<b>Whaling</b> — targeting executives specifically.",
                            "<b>Vishing</b> — voice-call phishing.",
                            "Social engineering exploits psychology (authority, urgency, fear) rather than technical flaws."
                        ],
                        "The best defense is a deliberate pause: verify unexpected requests through a second channel before acting — attackers rely on you moving faster than you think."
                    )
                },
                {
                    title: "Malware: Viruses, Worms & Ransomware",
                    body: buildBody(
                        "Malware comes in several distinct families, each spreading and behaving differently.",
                        [
                            "<b>Virus</b> — attaches to a host file, spreads when that file runs.",
                            "<b>Worm</b> — self-replicates across a network with no user action.",
                            "<b>Trojan</b> — disguises itself as legitimate software.",
                            "<b>Ransomware</b> — encrypts files and demands payment for the key."
                        ],
                        "Knowing the category tells you the defense: EDR for behavior-based detection, offline backups against ransomware, and least-privilege access to limit how far any single infection spreads."
                    )
                }
            ],
            2: [
                {
                    title: "Denial of Service (DoS/DDoS)",
                    body: buildBody(
                        "A Denial of Service attack floods a target with traffic or requests until it can no longer serve legitimate users. A Distributed DoS (DDoS) uses many compromised machines (a botnet) at once.",
                        [
                            "DoS overwhelms with volume from one source; DDoS from many.",
                            "A botnet is a network of compromised devices used for the flood.",
                            "Rate limiting and traffic scrubbing (Cloudflare, AWS Shield) absorb the load.",
                            "Horizontal scaling removes any single point of failure."
                        ],
                        "Availability is one third of the CIA triad — DoS attacks target it directly, and they don't need to breach anything to cause real business damage."
                    )
                },
                {
                    title: "Man-in-the-Middle Attacks",
                    body: buildBody(
                        "A Man-in-the-Middle (MitM) attack secretly intercepts communication between two parties — over unsecured public Wi-Fi, DNS spoofing, or a compromised router — reading or altering traffic in transit.",
                        [
                            "Public Wi-Fi is a common interception point.",
                            "DNS spoofing redirects victims to attacker-controlled destinations.",
                            "TLS/HTTPS makes intercepted traffic unreadable even if captured.",
                            "VPNs add a second layer of protection on untrusted networks."
                        ],
                        "MitM attacks are invisible to the victim by design — encryption is the only practical defense, since you often can't tell the interception is even happening."
                    )
                }
            ],
            3: [
                {
                    title: "Advanced Persistent Threats (APTs)",
                    body: buildBody(
                        "An APT is a prolonged, targeted intrusion — usually by a well-resourced group — aiming to stay hidden inside a network for months, rather than cause immediate, visible damage.",
                        [
                            "Initial access often via spear phishing.",
                            "Custom malware built specifically to evade known detection.",
                            "Lateral movement techniques to reach high-value targets over time.",
                            "Goal is long-term access or data theft, not quick disruption."
                        ],
                        "APTs are far harder to detect than opportunistic attacks because they're patient and quiet — this is why continuous monitoring matters more than one-time scans."
                    )
                },
                {
                    title: "Zero-Day Exploits",
                    body: buildBody(
                        "A zero-day is a vulnerability unknown to the vendor, meaning there's no patch available yet — 'zero days' of warning before it's exploited.",
                        [
                            "No patch exists at the time of exploitation.",
                            "Highly valuable — sometimes bought and sold on gray/black markets.",
                            "Can't be defended against by patching alone.",
                            "Layered controls (segmentation, behavior detection, least privilege) limit the damage."
                        ],
                        "Since you can't patch what you don't know about, defense-in-depth is what keeps a single unknown exploit from compromising an entire environment."
                    )
                }
            ]
        }
    },
    4: {
        title: "Network Security",
        levels: {
            1: [
                {
                    title: "Firewalls & Segmentation",
                    body: buildBody(
                        "A firewall filters traffic based on rules — allowing or blocking by IP, port or protocol. Network segmentation splits a network into isolated zones so a breach in one can't freely spread.",
                        [
                            "Next-gen firewalls inspect packet content, not just headers.",
                            "Segmentation isolates zones (guest Wi-Fi vs. internal servers).",
                            "This is the core of 'defense in depth.'",
                            "A breach in one segment shouldn't mean a breach of everything."
                        ],
                        "Segmentation turns one catastrophic breach into one contained incident — it's one of the most effective architectural decisions a network can make."
                    )
                },
                {
                    title: "VPNs & Secure Tunnels",
                    body: buildBody(
                        "A VPN creates an encrypted tunnel between two points, so traffic traveling across an untrusted network (like public Wi-Fi) can't be read or tampered with in transit.",
                        [
                            "WireGuard and OpenVPN handle encryption and key exchange.",
                            "Site-to-site VPNs connect offices securely.",
                            "Remote-access VPNs let employees reach internal resources from anywhere.",
                            "A VPN protects data in transit, not the endpoint itself."
                        ],
                        "VPNs extend a trusted network boundary across untrusted infrastructure — essential for remote work and for protecting traffic on networks you don't control."
                    )
                }
            ],
            2: [
                {
                    title: "Intrusion Detection & Prevention (IDS/IPS)",
                    body: buildBody(
                        "An IDS monitors network traffic and alerts on suspicious patterns. An IPS goes further and actively blocks the traffic in real time.",
                        [
                            "IDS = detect and alert; IPS = detect and block.",
                            "Both rely on signatures, anomaly detection, or both.",
                            "Pair with a SIEM to correlate alerts across the network.",
                            "False positives are a real operational cost to tune for."
                        ],
                        "Without IDS/IPS, an attacker inside the network can operate undetected indefinitely — these systems are what turn an intrusion into a noticed, actionable event."
                    )
                },
                {
                    title: "Wireless Network Security",
                    body: buildBody(
                        "Wireless traffic travels through open air, so encryption is critical: use WPA3 where possible, and treat WEP and open networks as untrusted.",
                        [
                            "WPA3 is the current standard; avoid WEP entirely.",
                            "Enterprise networks use 802.1X for per-user/device credentials.",
                            "Rogue access points mimic legitimate network names to lure victims.",
                            "Regularly scan for unauthorized devices broadcasting lookalike SSIDs."
                        ],
                        "Wireless removes the physical barrier wired networks have — anyone in range can attempt to connect, so wireless-specific controls aren't optional, they're foundational."
                    )
                }
            ],
            3: [
                {
                    title: "Zero Trust Architecture",
                    body: buildBody(
                        "Zero Trust flips the old 'trusted internal network' model: no user or device is trusted by default, even if already inside the perimeter. Every request is authenticated, authorized, and encrypted.",
                        [
                            "'Never trust, always verify' — for every request, every time.",
                            "No implicit trust just because a device is 'inside' the network.",
                            "Limits how far an attacker can move after one foothold.",
                            "Requires strong identity, device posture checks, and micro-segmentation."
                        ],
                        "Perimeter-only defense fails the moment an attacker gets a single foothold inside — Zero Trust is designed around that assumption instead of hoping it never happens."
                    )
                },
                {
                    title: "Network Monitoring & SIEM",
                    body: buildBody(
                        "A SIEM aggregates logs from firewalls, servers, endpoints and applications into one place, correlating them to surface attacks that no single log would reveal alone.",
                        [
                            "Centralizes logs from every layer of the environment.",
                            "Correlation reveals multi-step attacks a single log misses.",
                            "Baselining 'normal' traffic is what makes anomalies visible.",
                            "Examples: Splunk, Elastic Stack, Microsoft Sentinel."
                        ],
                        "Without a baseline of normal, you can't recognize abnormal — monitoring is only as good as the context you've built around it ahead of time."
                    )
                }
            ]
        }
    },
    5: {
        title: "Defense Basics",
        levels: {
            1: [
                {
                    title: "Encryption Fundamentals",
                    body: buildBody(
                        "Symmetric encryption (AES) uses one shared key to both encrypt and decrypt — fast, but the key must be exchanged securely. Asymmetric encryption (RSA, ECC) uses a public/private key pair.",
                        [
                            "Symmetric: one shared key, fast, key-exchange is the hard part.",
                            "Asymmetric: public key encrypts, only the private key decrypts.",
                            "HTTPS uses asymmetric encryption to exchange a session key.",
                            "Then fast symmetric encryption handles the actual data transfer."
                        ],
                        "Nearly every secure communication you use daily — HTTPS, messaging apps, VPNs — combines both types to get speed and secure key exchange at the same time."
                    )
                },
                {
                    title: "Authentication vs. Authorization",
                    body: buildBody(
                        "Authentication answers 'who are you?' Authorization answers 'what are you allowed to do?' — the permissions tied to that identity once verified.",
                        [
                            "Authentication = proving identity (password, biometric, token).",
                            "Authorization = permissions granted to that verified identity.",
                            "A system can authenticate correctly but still authorize wrongly.",
                            "That gap is known as Broken Access Control."
                        ],
                        "Confusing these two concepts is one of the most common root causes of real vulnerabilities — knowing which one is actually failing is the first step to fixing it."
                    )
                }
            ],
            2: [
                {
                    title: "Access Control & Least Privilege",
                    body: buildBody(
                        "Role-Based Access Control (RBAC) assigns permissions to roles rather than individuals, making access easy to audit and manage at scale.",
                        [
                            "RBAC: permissions tied to roles (admin, editor, viewer).",
                            "Principle of Least Privilege: minimum access needed, nothing more.",
                            "Easier to audit 'who has what role' than per-person grants.",
                            "Limits blast radius if any single credential is compromised."
                        ],
                        "Least privilege is one of the cheapest controls to implement and one of the most effective — it doesn't stop a breach, but it caps how bad one can get."
                    )
                },
                {
                    title: "Public Key Infrastructure (PKI)",
                    body: buildBody(
                        "PKI is the system of certificates, certificate authorities (CAs) and keys that lets you trust an asymmetric public key actually belongs to who it claims to.",
                        [
                            "Certificate Authorities (CAs) sign and vouch for certificates.",
                            "A browser's padlock icon means the cert chain validated.",
                            "Underlies HTTPS, code signing, and encrypted email (S/MIME).",
                            "Expired or self-signed certs break this chain of trust."
                        ],
                        "PKI is how two parties who've never met establish trust online — without it, there'd be no reliable way to know a website is who it claims to be."
                    )
                }
            ],
            3: [
                {
                    title: "Endpoint Protection",
                    body: buildBody(
                        "Endpoint protection has evolved from simple signature-based antivirus into EDR (Endpoint Detection and Response), which watches process behavior in real time.",
                        [
                            "Signature-based AV only catches known, previously-seen threats.",
                            "EDR watches behavior — catches malware with no known signature.",
                            "Examples: encrypting files quietly, exfiltrating data in the background.",
                            "Responders can remotely isolate an infected machine in seconds."
                        ],
                        "Behavior-based detection is what catches the attacks signature-based tools miss entirely — it's the difference between reacting to yesterday's threats and today's."
                    )
                },
                {
                    title: "Security Hardening Checklists",
                    body: buildBody(
                        "Hardening standards like the CIS Benchmarks give step-by-step configuration guides for operating systems, databases and cloud services.",
                        [
                            "CIS Benchmarks cover OS, database and cloud configurations.",
                            "Disable unneeded services and enforce strong defaults.",
                            "Automate with config-management tools (Ansible, Chef).",
                            "Consistency across every new server, not manual one-off checklists."
                        ],
                        "Manual hardening doesn't scale and relies on memory — automation is what makes 'secure by default' actually true across an entire fleet of systems."
                    )
                }
            ]
        }
    },
    6: {
        title: "Ethical Hacking & Pen Testing",
        levels: {
            1: [
                {
                    title: "The Penetration Testing Methodology",
                    body: buildBody(
                        "Professional pen tests follow a structured process: Reconnaissance, Scanning, Exploitation, Post-Exploitation, and Reporting.",
                        [
                            "<b>1. Reconnaissance</b> — gather information about the target.",
                            "<b>2. Scanning</b> — map live hosts and services.",
                            "<b>3. Exploitation</b> — attempt to gain access.",
                            "<b>4. Post-Exploitation</b> and <b>5. Reporting</b> — assess impact, document findings."
                        ],
                        "Ethical hackers always work under a signed scope of engagement and written authorization — testing systems without permission is illegal, regardless of intent."
                    )
                },
                {
                    title: "Reconnaissance & Footprinting",
                    body: buildBody(
                        "Recon gathers public information about a target before any active testing begins: domain records, subdomains, exposed services, and employee details.",
                        [
                            "WHOIS records reveal domain ownership information.",
                            "Shodan finds exposed, internet-facing services.",
                            "OSINT gathers employee names/emails from public sources.",
                            "This passive phase often reveals the easiest entry points."
                        ],
                        "Forgotten subdomains, exposed admin panels, and leaked old credentials are frequently found here — before a single active exploit attempt is ever made."
                    )
                }
            ],
            2: [
                {
                    title: "Scanning & Enumeration",
                    body: buildBody(
                        "Scanning actively probes a target to find live hosts, open ports and running services. Enumeration extracts usernames, shares, and configuration details from those services.",
                        [
                            "Nmap fingerprints exactly which software version is listening.",
                            "Enumeration digs deeper into what scanning discovers.",
                            "Produces a map of the environment to test against.",
                            "This map tells you which known vulnerabilities are worth attempting."
                        ],
                        "You can't exploit what you haven't mapped — scanning and enumeration turn an unknown target into a concrete, actionable list of possibilities."
                    )
                },
                {
                    title: "Exploitation & Privilege Escalation",
                    body: buildBody(
                        "Once a vulnerability is found, exploitation attempts to turn it into actual access. Privilege escalation then tries to move from a low-privilege foothold to admin/root.",
                        [
                            "Exploitation turns a found flaw into real access.",
                            "Privilege escalation climbs from low-privilege to admin/root.",
                            "Common vectors: misconfigured permissions, unpatched kernel exploits.",
                            "Exposed credentials in config files are a frequent escalation path."
                        ],
                        "Initial access is rarely the end goal — escalation is what turns a minor foothold into full control, which is why both halves matter equally."
                    )
                }
            ],
            3: [
                {
                    title: "Post-Exploitation & Reporting",
                    body: buildBody(
                        "After gaining access, a tester assesses real business impact — what data could actually be reached, and how far an attacker could pivot — without causing unnecessary damage.",
                        [
                            "Assess real impact: what data, what systems, how far it spreads.",
                            "Every action taken is logged for the final report.",
                            "Findings get severity ratings, often via CVSS scores.",
                            "The report includes reproduction steps and remediation guidance."
                        ],
                        "The report is the actual deliverable of a pen test — a finding no one can act on has no value, however impressive the exploit was."
                    )
                },
                {
                    title: "Legal & Ethical Boundaries",
                    body: buildBody(
                        "A signed scope of engagement defines exactly which systems may be tested, which techniques are off-limits, and the testing window.",
                        [
                            "Acting outside scope is unauthorized access — a crime regardless of intent.",
                            "Responsible disclosure applies to flaws found outside scope.",
                            "Report privately and give the owner reasonable time to fix it.",
                            "Public disclosure before a fix can cause real harm."
                        ],
                        "Technical skill without a clear ethical and legal boundary isn't ethical hacking — the authorization and the discipline around it are what make the 'ethical' part real."
                    )
                }
            ]
        }
    },
    7: {
        title: "Web Application Security",
        levels: {
            1: [
                {
                    title: "The OWASP Top 10",
                    body: buildBody(
                        "The OWASP Top 10 is the industry-standard list of the most critical web application risks, revised periodically based on real-world breach data.",
                        [
                            "Includes Broken Access Control, Cryptographic Failures, Injection.",
                            "Also Insecure Design and Security Misconfiguration.",
                            "Based on real-world breach data, not theory.",
                            "The baseline checklist most security teams test against."
                        ],
                        "If you only memorize one list in web security, this is it — it's the shared vocabulary developers, testers and auditors all use."
                    )
                },
                {
                    title: "SQL Injection",
                    body: buildBody(
                        "SQL Injection happens when untrusted user input is concatenated directly into a database query, letting an attacker alter the query's logic — e.g. entering <code>' OR '1'='1</code> to bypass a login.",
                        [
                            "Untrusted input mixed directly into a SQL query is the root cause.",
                            "Parameterized queries / prepared statements are the fix.",
                            "They keep user input separate from query structure entirely.",
                            "Least-privilege database accounts limit damage as defense in depth."
                        ],
                        "SQLi has been on the Top 10 for over a decade because the fix is simple but easy to skip — it remains one of the most damaging, most preventable bugs."
                    )
                }
            ],
            2: [
                {
                    title: "Cross-Site Scripting (XSS)",
                    body: buildBody(
                        "XSS occurs when an application renders untrusted input as part of a web page without proper sanitization, letting an attacker inject JavaScript that runs in other users' browsers.",
                        [
                            "Injected script runs in the victim's browser, not the attacker's.",
                            "Can steal session cookies or perform actions as the victim.",
                            "Output encoding escapes HTML special characters before rendering.",
                            "A strict Content-Security-Policy header blocks unauthorized script execution."
                        ],
                        "Frameworks like React and Vue auto-escape by default, which is why modern apps see far less XSS than hand-rolled HTML templating did."
                    )
                },
                {
                    title: "Cross-Site Request Forgery (CSRF)",
                    body: buildBody(
                        "CSRF tricks a logged-in user's browser into submitting an unwanted request to a site they're authenticated on — using their existing session cookie without their knowledge.",
                        [
                            "Exploits the browser automatically attaching session cookies.",
                            "A hidden form on a malicious page can trigger it.",
                            "CSRF tokens — unique, unguessable, server-verified — are the primary fix.",
                            "The <code>SameSite</code> cookie attribute adds another layer."
                        ],
                        "CSRF doesn't need to steal credentials at all — it just needs the victim's browser to make one unintended request, which is what makes it so sneaky."
                    )
                }
            ],
            3: [
                {
                    title: "Authentication Flaws & Session Hijacking",
                    body: buildBody(
                        "Weak session management — predictable session IDs, sessions that never expire, tokens sent over plain HTTP — lets an attacker steal or guess a valid session.",
                        [
                            "Predictable or long-lived session IDs are easy to guess or steal.",
                            "Use long, random session tokens.",
                            "Set the <code>Secure</code> and <code>HttpOnly</code> cookie flags.",
                            "Invalidate sessions immediately on logout or password change."
                        ],
                        "Stealing a session often requires zero knowledge of the victim's actual password — it's a direct shortcut around authentication entirely."
                    )
                },
                {
                    title: "API Security Basics",
                    body: buildBody(
                        "APIs expand the attack surface beyond the traditional web page: every endpoint needs its own authentication, authorization and input validation.",
                        [
                            "Attackers can call API endpoints directly, bypassing the UI.",
                            "<b>Broken Object Level Authorization</b> — accessing another user's resource via a changed ID.",
                            "Excessive data exposure returns more fields than the client needs.",
                            "Every endpoint needs independent authorization checks, not just the UI."
                        ],
                        "A UI that hides a button doesn't protect the underlying endpoint — real API security has to happen on the server, for every request, every time."
                    )
                }
            ]
        }
    },
    8: {
        title: "Digital Forensics & Incident Response",
        levels: {
            1: [
                {
                    title: "The Incident Response Lifecycle",
                    body: buildBody(
                        "IR follows a repeatable cycle: Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned.",
                        [
                            "<b>Preparation</b> — plans, tooling and training before anything happens.",
                            "<b>Identification → Containment → Eradication → Recovery</b> — the active response.",
                            "<b>Lessons Learned</b> — the post-incident review that closes the loop.",
                            "Each phase has clear owners and defined exit criteria."
                        ],
                        "Having this playbook written and rehearsed before an incident is what separates an organized response from chaos under real pressure."
                    )
                },
                {
                    title: "Evidence Collection & Chain of Custody",
                    body: buildBody(
                        "Digital evidence must be collected without altering it — working from a forensic disk image rather than the live system.",
                        [
                            "Work from forensic images, never the live original.",
                            "Chain of custody documents who handled evidence, and when.",
                            "Essential if findings are ever needed for legal proceedings.",
                            "Volatile data (RAM, live connections) is captured first — it disappears on power-off."
                        ],
                        "Mishandled evidence can be thrown out entirely in a legal proceeding — the process matters as much as what's actually found."
                    )
                }
            ],
            2: [
                {
                    title: "Log Analysis Basics",
                    body: buildBody(
                        "Logs from firewalls, servers, authentication systems and applications are the raw material of an investigation.",
                        [
                            "Look for logins at unusual hours or impossible travel.",
                            "Repeated failed authentication followed by a success is a red flag.",
                            "Unexpected outbound traffic can indicate data exfiltration.",
                            "A SIEM correlates events across systems into one timeline."
                        ],
                        "Raw logs are overwhelming in volume — knowing what anomalies to look for is what turns noise into an actual investigative lead."
                    )
                },
                {
                    title: "Memory & Disk Forensics",
                    body: buildBody(
                        "Memory (RAM) forensics captures running processes, open connections and decrypted data that only exist while a machine is powered on. Disk forensics examines file systems for deleted files and hidden artifacts.",
                        [
                            "RAM holds data that disappears the instant power is lost.",
                            "Tools like Volatility reconstruct activity from a memory dump.",
                            "Disk forensics recovers deleted files and timestamps.",
                            "Together they reconstruct not just what existed, but what was happening."
                        ],
                        "Memory capture has to happen fast and first — it's the one piece of evidence that can never be recovered once the machine is shut down."
                    )
                }
            ],
            3: [
                {
                    title: "Malware Analysis Basics",
                    body: buildBody(
                        "Static analysis examines a malware sample without running it. Dynamic analysis runs the sample in an isolated sandbox and observes its behavior.",
                        [
                            "<b>Static</b> — strings, file structure, known signatures, no execution.",
                            "<b>Dynamic</b> — run in an isolated sandbox, observe live behavior.",
                            "Watch what files it touches and what it tries to persist.",
                            "Produces IOCs: file hashes, IPs, registry keys."
                        ],
                        "IOCs from this analysis let defenders hunt for the same malware elsewhere in the environment — turning one found sample into a broader detection."
                    )
                },
                {
                    title: "Writing the Incident Report",
                    body: buildBody(
                        "A good incident report documents the timeline, root cause, systems affected, data impact, actions taken, and recommendations to prevent recurrence.",
                        [
                            "Clear timeline from detection through resolution.",
                            "Root cause, not just symptoms.",
                            "Written for both technical and non-technical readers.",
                            "The 'lessons learned' section drives concrete future improvements."
                        ],
                        "A costly incident with no written report is a wasted lesson — the report is what turns a bad day into lasting improvement for the whole organization."
                    )
                }
            ]
        }
    },
    9: {
        title: "Practical Security Labs",
        levels: {
            1: [
                {
                    title: "Setting Up a Home Lab",
                    body: buildBody(
                        "A safe practice environment uses virtualization (VirtualBox, VMware, Proxmox) to run isolated vulnerable targets on a host-only network that can't touch the internet or your real devices.",
                        [
                            "Virtualize targets like Metasploitable or OWASP Juice Shop.",
                            "Use a host-only network — isolated from the internet and real devices.",
                            "Kali Linux is the standard attacker toolkit.",
                            "This isolation is what keeps practice safe and legal."
                        ],
                        "This is where every earlier module stops being theory and becomes hands-on muscle memory — a home lab is non-negotiable for real skill-building."
                    )
                },
                {
                    title: "Capture The Flag (CTF) Basics",
                    body: buildBody(
                        "CTFs are gamified security challenges where you find hidden 'flags' by exploiting intentionally vulnerable systems.",
                        [
                            "<b>Web</b> — application exploitation.",
                            "<b>Crypto</b> — breaking weak encryption schemes.",
                            "<b>Pwn</b> — binary exploitation; <b>Forensics</b> — files/memory dump analysis; <b>OSINT</b>.",
                            "picoCTF, HackTheBox and TryHackMe suit beginners."
                        ],
                        "CTFs turn every concept in this course into a concrete, practiced skill — they're the fastest way to find out what you actually understand versus just recognize."
                    )
                }
            ],
            2: [
                {
                    title: "Building Your Security Portfolio",
                    body: buildBody(
                        "Document what you build and break: write up lab walkthroughs, CTF solutions, or small tools on a blog or GitHub.",
                        [
                            "Write-ups prove hands-on capability beyond a certificate.",
                            "GitHub and a blog are both effective, low-cost platforms.",
                            "Pair documented work with recognized certifications.",
                            "CompTIA Security+, eJPT and OSCP are common pairings."
                        ],
                        "This portfolio is what employers and clients actually evaluate — it's concrete proof of skill in a field where credentials alone rarely tell the whole story."
                    )
                },
                {
                    title: "Bug Bounty Basics",
                    body: buildBody(
                        "Bug bounty programs (HackerOne, Bugcrowd) let you legally test real, in-scope company assets for a monetary reward when you find a valid vulnerability.",
                        [
                            "Always read a program's scope and rules before testing.",
                            "Testing outside scope can get you banned or in legal trouble.",
                            "Start with wide-scope programs and clear guidelines.",
                            "High-quality, reproducible reports earn bounties — vague ones get ignored."
                        ],
                        "Bug bounties are real-world practice with real stakes and real financial reward — the discipline of staying in-scope is itself a valuable professional skill."
                    )
                }
            ],
            3: [
                {
                    title: "Preparing for Certifications",
                    body: buildBody(
                        "Certifications validate your skills to employers at each career stage, and each one signals something different.",
                        [
                            "<b>CompTIA Security+</b> — foundational, vendor-neutral.",
                            "<b>eJPT/PJPT</b> — practical, entry-level pen testing.",
                            "<b>OSCP</b> — hands-on, exam-based offensive security, widely respected.",
                            "<b>CISSP</b> — management/governance, for senior roles."
                        ],
                        "Pick the certification that matches the role you want next, not just the most famous name — a hands-on hacker role values OSCP far more than a management credential, and vice versa."
                    )
                },
                {
                    title: "Staying Current in Cybersecurity",
                    body: buildBody(
                        "The field changes fast — new CVEs, new attack techniques, new tooling every week. Treat this course as a starting point, not a finish line.",
                        [
                            "Follow security advisories (CISA, vendor bulletins).",
                            "Read post-incident write-ups from real breaches.",
                            "Practice regularly, not just once at the end of a course.",
                            "Join communities — local groups, CTF teams, security forums."
                        ],
                        "Communities keep you sharp and connect you with people who'll point you toward what actually matters next — learning here never really finishes."
                    )
                }
            ]
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("moduleModal");
    if (!modal) return; // only run on dashboard

    const levelPickerView = document.getElementById("levelPickerView");
    const lessonView = document.getElementById("lessonView");
    const levelCardsEl = document.getElementById("levelCards");
    const backToLevelsBtn = document.getElementById("backToLevelsBtn");
    const activeLevelLabel = document.getElementById("activeLevelLabel");

    const modalModuleTitle = document.getElementById("modalModuleTitle");
    const modalLessonList = document.getElementById("modalLessonList");
    const modalLessonIndex = document.getElementById("modalLessonIndex");
    const modalLessonTitle = document.getElementById("modalLessonTitle");
    const modalLessonBody = document.getElementById("modalLessonBody");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const modalPrevBtn = document.getElementById("modalPrevBtn");
    const modalNextBtn = document.getElementById("modalNextBtn");
    const modalCompleteBtn = document.getElementById("modalCompleteBtn");

    let currentModuleId = null;
    let currentLevel = null;
    let currentLessonIdx = 0;

    function progressKey() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const email = currentUser ? currentUser.email : "guest";
        return `cyberverse_progress_${email}`;
    }

    function getCompleted() {
        return JSON.parse(localStorage.getItem(progressKey())) || [];
    }

    function setCompleted(list) {
        localStorage.setItem(progressKey(), JSON.stringify(list));
    }

    function lessonId(moduleId, level, lessonIdx) {
        return `${moduleId}-${level}-${lessonIdx}`;
    }

    function isComplete(moduleId, level, lessonIdx) {
        return getCompleted().includes(lessonId(moduleId, level, lessonIdx));
    }

    function levelCompletedCount(moduleId, level) {
        const lessons = MODULE_CONTENT[moduleId].levels[level];
        return lessons.filter((_, idx) => isComplete(moduleId, level, idx)).length;
    }

    function openModule(moduleId) {
        currentModuleId = moduleId;
        currentLevel = null;
        const mod = MODULE_CONTENT[moduleId];
        modalModuleTitle.textContent = mod.title;
        showLevelPicker();
        modal.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function closeModule() {
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }

    function showLevelPicker() {
        lessonView.classList.remove("active");
        levelPickerView.style.display = "block";
        renderLevelCards();
    }

    function renderLevelCards() {
        const mod = MODULE_CONTENT[currentModuleId];
        levelCardsEl.innerHTML = "";
        [1, 2, 3].forEach((level) => {
            const lessons = mod.levels[level];
            const completed = levelCompletedCount(currentModuleId, level);
            const card = document.createElement("div");
            card.className = "level-card";
            card.innerHTML = `
                <div class="level-card-num">${level}</div>
                <h4>${LEVEL_INFO[level].short}</h4>
                <p>${LEVEL_INFO[level].description}</p>
                <div class="level-progress">${completed}/${lessons.length} lessons${completed === lessons.length ? " · ✔ complete" : ""}</div>
            `;
            card.addEventListener("click", () => selectLevel(level));
            levelCardsEl.appendChild(card);
        });
    }

    function selectLevel(level) {
        currentLevel = level;
        currentLessonIdx = 0;
        levelPickerView.style.display = "none";
        lessonView.classList.add("active");
        activeLevelLabel.textContent = LEVEL_INFO[level].label;
        renderLessonList();
        renderLesson();
    }

    backToLevelsBtn.addEventListener("click", showLevelPicker);

    function renderLessonList() {
        const lessons = MODULE_CONTENT[currentModuleId].levels[currentLevel];
        modalLessonList.innerHTML = "";
        lessons.forEach((lesson, idx) => {
            const li = document.createElement("li");
            li.className = "lesson-item" + (idx === currentLessonIdx ? " active" : "");
            li.innerHTML = `<span class="lesson-check">${isComplete(currentModuleId, currentLevel, idx) ? "✔" : idx + 1}</span> ${lesson.title}`;
            li.addEventListener("click", () => {
                currentLessonIdx = idx;
                renderLesson();
            });
            modalLessonList.appendChild(li);
        });
    }

    function renderLesson() {
        const lessons = MODULE_CONTENT[currentModuleId].levels[currentLevel];
        const lesson = lessons[currentLessonIdx];
        modalLessonIndex.textContent = `${LEVEL_INFO[currentLevel].label} · Lesson ${currentLessonIdx + 1} of ${lessons.length}`;
        modalLessonTitle.textContent = lesson.title;
        modalLessonBody.innerHTML = lesson.body;
        modalCompleteBtn.textContent = isComplete(currentModuleId, currentLevel, currentLessonIdx) ? "✔ Completed" : "Mark as Complete";
        modalCompleteBtn.classList.toggle("is-complete", isComplete(currentModuleId, currentLevel, currentLessonIdx));
        modalPrevBtn.disabled = currentLessonIdx === 0;
        modalNextBtn.textContent = currentLessonIdx === lessons.length - 1 ? "Finish Level" : "Next →";
        renderLessonList();
        updateDashboardStats();
    }

    modalCloseBtn.addEventListener("click", closeModule);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModule();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) closeModule();
    });

    modalPrevBtn.addEventListener("click", () => {
        if (currentLessonIdx > 0) {
            currentLessonIdx--;
            renderLesson();
        }
    });

    modalNextBtn.addEventListener("click", () => {
        const lessons = MODULE_CONTENT[currentModuleId].levels[currentLevel];
        if (currentLessonIdx < lessons.length - 1) {
            currentLessonIdx++;
            renderLesson();
        } else {
            showLevelPicker();
        }
    });

    modalCompleteBtn.addEventListener("click", () => {
        const completed = getCompleted();
        const id = lessonId(currentModuleId, currentLevel, currentLessonIdx);
        if (!completed.includes(id)) {
            completed.push(id);
            setCompleted(completed);
        }
        renderLesson();
    });

    document.querySelectorAll(".module-btn[data-module]").forEach((btn) => {
        btn.addEventListener("click", () => {
            openModule(parseInt(btn.dataset.module, 10));
        });
    });

    function updateDashboardStats() {
        let totalLessons = 0;
        Object.values(MODULE_CONTENT).forEach((mod) => {
            Object.values(mod.levels).forEach((lessons) => {
                totalLessons += lessons.length;
            });
        });
        const completedCount = getCompleted().length;
        const pct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

        const completedLessonsEl = document.getElementById("completedLessons");
        const progressFillEl = document.getElementById("progressFill");
        const progressTextEl = document.getElementById("progressText");

        if (completedLessonsEl) completedLessonsEl.textContent = completedCount;
        if (progressFillEl) progressFillEl.style.width = pct + "%";
        if (progressTextEl) progressTextEl.textContent = `${pct}% completed`;
    }

    updateDashboardStats();
});
