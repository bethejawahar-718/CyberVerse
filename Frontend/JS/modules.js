
(() => {
  "use strict";

  // ==========================================
  // CYBERVERSE — MODULES & LESSON PROGRESSION
  // ==========================================

  const LESSON_STORAGE_PREFIX = "cyberverse_progress_";

  const LEVEL_INFO = {
    1: {
      name: "Beginner",
      description: "Learn the fundamentals and build a strong foundation.",
      color: "#39ff8e"
    },
    2: {
      name: "Intermediate",
      description: "Explore practical techniques and defensive strategies.",
      color: "#4dd8ff"
    },
    3: {
      name: "Advanced",
      description: "Apply your knowledge to realistic security scenarios.",
      color: "#b28dff"
    }
  };

  // Every lesson contains an overview, concepts, and practical importance.
  function lesson(title, overview, concepts, whyItMatters, activity) {
    return { title, overview, concepts, whyItMatters, activity };
  }

  function buildBody(item) {
    const concepts = item.concepts
      .map(
        (concept) => `
          <li>
            <strong>${escapeHTML(concept.title)}</strong>
            <p>${escapeHTML(concept.description)}</p>
          </li>
        `
      )
      .join("");

    return `
      <article class="cv-lesson-content">
        <section class="cv-lesson-section">
          <h3>Overview</h3>
          <p>${escapeHTML(item.overview)}</p>
        </section>

        <section class="cv-lesson-section">
          <h3>Key Concepts</h3>
          <ul class="cv-concept-list">${concepts}</ul>
        </section>

        <section class="cv-lesson-section">
          <h3>Why It Matters</h3>
          <p>${escapeHTML(item.whyItMatters)}</p>
        </section>

        <section class="cv-lesson-section">
          <h3>Knowledge Check</h3>
          <p>${escapeHTML(item.activity)}</p>
          <p class="cv-lesson-tip">
            Tip: Explain the main idea in your own words before marking
            this lesson complete.
          </p>
        </section>
      </article>
    `;
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  // ------------------------------------------
  // LESSON CONTENT
  // 9 modules × 3 levels × 2 lessons
  // ------------------------------------------

  const MODULE_CONTENT = {
    1: {
      title: "Cybersecurity Fundamentals",
      description: "Understand cybersecurity, digital assets, and security principles.",
      levels: {
        1: [
          lesson(
            "Introduction to Cybersecurity",
            "Cybersecurity is the practice of protecting computers, networks, applications, and data from unauthorized access, damage, and disruption.",
            [
              { title: "Confidentiality", description: "Information should only be accessible to authorized people." },
              { title: "Integrity", description: "Information should remain accurate and protected from unauthorized changes." },
              { title: "Availability", description: "Systems and information should be accessible when authorized users need them." }
            ],
            "These three principles form the CIA triad, a foundation for security planning and risk management.",
            "Give one example of confidentiality, integrity, and availability in a school or business."
          ),
          lesson(
            "Digital Assets and Security Risks",
            "Digital assets include accounts, files, devices, applications, databases, and online services that have value to a person or organization.",
            [
              { title: "Threat", description: "Something capable of causing harm, such as a malicious program or dishonest actor." },
              { title: "Vulnerability", description: "A weakness that could be exploited, such as outdated software." },
              { title: "Risk", description: "The possibility and impact of a threat taking advantage of a vulnerability." }
            ],
            "Identifying assets and risks helps organizations decide which systems need protection first.",
            "Identify three digital assets and one possible risk for each."
          )
        ],
        2: [
          lesson(
            "Security Governance and Policies",
            "Security governance defines how an organization manages security responsibilities, decisions, and risks.",
            [
              { title: "Security policy", description: "A formal statement of security rules and expectations." },
              { title: "Standards and procedures", description: "Standards specify required controls; procedures explain how to carry them out." },
              { title: "Least privilege", description: "Users should receive only the access needed for their assigned tasks." }
            ],
            "Clear policies reduce confusion and help employees respond consistently to security problems.",
            "Describe a suitable access-control policy for a school computer laboratory."
          ),
          lesson(
            "Risk Assessment and Management",
            "Risk assessment identifies threats, vulnerabilities, potential impacts, and appropriate safeguards.",
            [
              { title: "Identify", description: "List assets, threats, weaknesses, and possible consequences." },
              { title: "Evaluate", description: "Estimate likelihood and impact to prioritize important risks." },
              { title: "Treat", description: "Reduce, transfer, avoid, or consciously accept a risk." }
            ],
            "Risk management helps teams use limited time and resources where they provide the greatest protection.",
            "Explain how you would prioritize an outdated public-facing server."
          )
        ],
        3: [
          lesson(
            "Security Architecture",
            "Security architecture organizes controls and technologies so that systems are protected as a whole rather than through isolated fixes.",
            [
              { title: "Defense in depth", description: "Use multiple complementary security controls instead of depending on a single barrier." },
              { title: "Zero Trust", description: "Verify access explicitly and continuously according to identity, device, and context." },
              { title: "Segmentation", description: "Separate systems into controlled zones to limit unnecessary communication." }
            ],
            "A well-designed architecture can reduce the impact of a compromised account or device.",
            "Design a layered security approach for a small online learning platform."
          ),
          lesson(
            "Security Metrics and Continuous Improvement",
            "Security programs should be reviewed regularly to determine whether their controls are effective.",
            [
              { title: "Security metrics", description: "Measurements such as patching time, incident response time, and training completion." },
              { title: "Audits", description: "Structured reviews of security controls, records, and compliance." },
              { title: "Improvement cycle", description: "Measure results, identify gaps, make changes, and evaluate the results again." }
            ],
            "Regular measurement reveals weaknesses that may not be obvious from policies alone.",
            "Choose two useful metrics for measuring an organization's security readiness."
          )
        ]
      }
    },

    2: {
      title: "Security Hygiene",
      description: "Develop safe habits for accounts, devices, and everyday browsing.",
      levels: {
        1: [
          lesson(
            "Password Security",
            "Passwords help establish that a person is authorized to access an account. Weak or reused passwords increase the risk of account compromise.",
            [
              { title: "Unique passwords", description: "Use a different password for every important account." },
              { title: "Password managers", description: "Use a trusted password manager to generate and store strong passwords." },
              { title: "Multi-factor authentication", description: "Add another verification factor beyond the password." }
            ],
            "A unique password limits the damage when a different website experiences a data breach.",
            "Explain why reusing one password across several websites is risky."
          ),
          lesson(
            "Safe Browsing and Phishing",
            "Phishing attempts to trick people into revealing information, opening harmful files, or approving fraudulent requests.",
            [
              { title: "Suspicious links", description: "Check the actual destination and be cautious of unexpected messages." },
              { title: "Sender verification", description: "Verify unusual requests through a separate, trusted communication channel." },
              { title: "Reporting", description: "Report suspicious messages using your organization's approved process." }
            ],
            "Recognizing deception can prevent account theft, fraud, and malware infections.",
            "List three warning signs of a suspicious email."
          )
        ],
        2: [
          lesson(
            "Device Security and Updates",
            "Computers and phones need secure configurations, current software, and appropriate protection.",
            [
              { title: "Patching", description: "Install trusted security updates to address known weaknesses." },
              { title: "Screen locking", description: "Lock unattended devices and use appropriate authentication." },
              { title: "Application sources", description: "Install software from trusted sources and remove unnecessary applications." }
            ],
            "Routine maintenance reduces the number of weaknesses available to attackers.",
            "Create a short monthly security-maintenance checklist for a laptop."
          ),
          lesson(
            "Backups and Data Protection",
            "Backups provide recoverable copies of important information after accidental deletion, device failure, or certain cyber incidents.",
            [
              { title: "Multiple copies", description: "Keep more than one copy of important data." },
              { title: "Separate storage", description: "Keep a backup isolated from ordinary access when practical." },
              { title: "Restore testing", description: "Periodically confirm that backups can actually be recovered." }
            ],
            "A backup is only useful if it is available and can be restored successfully.",
            "Explain why testing a backup is as important as creating it."
          )
        ],
        3: [
          lesson(
            "Privacy and Data Minimization",
            "Personal information should be collected, shared, and retained only for legitimate purposes and for appropriate periods.",
            [
              { title: "Data minimization", description: "Collect and disclose only the information that is necessary." },
              { title: "Privacy settings", description: "Review account visibility, permissions, and connected applications." },
              { title: "Secure disposal", description: "Use appropriate procedures when deleting or retiring devices and records." }
            ],
            "Reducing unnecessary data exposure limits the potential consequences of a breach.",
            "Review what information a hypothetical social application actually needs."
          ),
          lesson(
            "Personal Security Response Plan",
            "A personal security plan explains what to do if an account, device, or piece of information may be compromised.",
            [
              { title: "Containment", description: "Use a trusted device to secure accounts and limit further access." },
              { title: "Recovery", description: "Reset affected credentials, review sessions, and restore clean data when necessary." },
              { title: "Documentation", description: "Record what happened and contact the appropriate service or support team." }
            ],
            "Preparing in advance makes it easier to respond calmly and systematically to security incidents.",
            "Write down the first three steps you would take after discovering an account compromise."
          )
        ]
      }
    },

    3: {
      title: "Common Cyber Threats",
      description: "Recognize malware, social engineering, and common attack patterns.",
      levels: {
        1: [
          lesson(
            "Malware Fundamentals",
            "Malware is software designed to perform unwanted or harmful actions on a device or network.",
            [
              { title: "Virus", description: "Malicious code that attaches to a host and may spread when the host is executed." },
              { title: "Worm", description: "Malware capable of spreading between systems without the same host-file behavior as a virus." },
              { title: "Trojan", description: "Software that appears legitimate but performs hidden malicious actions." }
            ],
            "Understanding malware categories helps users recognize suspicious behavior and choose appropriate defenses.",
            "Explain one difference between a worm and a Trojan."
          ),
          lesson(
            "Social Engineering",
            "Social engineering manipulates people into disclosing information, granting access, or taking unsafe actions.",
            [
              { title: "Pretexting", description: "Using a fabricated story or identity to gain trust." },
              { title: "Urgency", description: "Pressuring someone to act quickly without checking the request." },
              { title: "Verification", description: "Confirm requests independently before sharing information or approving access." }
            ],
            "Technical security controls can be undermined when people are tricked into bypassing normal procedures.",
            "Describe how you would verify an unexpected request for confidential information."
          )
        ],
        2: [
          lesson(
            "Ransomware and Recovery",
            "Ransomware is a type of malware that may encrypt or otherwise deny access to information and demand payment.",
            [
              { title: "Prevention", description: "Keep systems updated, restrict access, and train users to recognize suspicious activity." },
              { title: "Resilience", description: "Maintain protected backups and documented recovery procedures." },
              { title: "Response", description: "Report the incident and follow the organization's containment and recovery plan." }
            ],
            "Preparation can reduce disruption and improve recovery after a serious incident.",
            "Explain how protected backups help an organization recover from ransomware."
          ),
          lesson(
            "Denial-of-Service Threats",
            "Denial-of-service attacks attempt to make a service unavailable by overwhelming it or exploiting weaknesses.",
            [
              { title: "Availability impact", description: "Legitimate users may be unable to access a service." },
              { title: "Distributed attacks", description: "Traffic may originate from many compromised devices." },
              { title: "Mitigation", description: "Filtering, traffic analysis, capacity planning, and specialized protection can help." }
            ],
            "Availability is a core security objective, especially for online services that people depend on.",
            "Name two defensive measures that may help keep a public service available."
          )
        ],
        3: [
          lesson(
            "Threat Intelligence",
            "Threat intelligence turns information about malicious activity into useful context for security decisions.",
            [
              { title: "Indicators", description: "Observable clues may include suspicious domains, file hashes, or network patterns." },
              { title: "Context", description: "A clue should be evaluated with its source, age, reliability, and environment." },
              { title: "Defensive use", description: "Validated intelligence can support detection, investigation, and prevention." }
            ],
            "Context helps teams avoid treating every unusual event as a confirmed attack.",
            "Explain why an indicator should be validated before a security team blocks it."
          ),
          lesson(
            "Threat Modeling",
            "Threat modeling systematically considers what can go wrong in a system and how to reduce the resulting risks.",
            [
              { title: "Assets and boundaries", description: "Identify valuable data, users, components, and trust boundaries." },
              { title: "Attack scenarios", description: "Consider realistic ways security properties might be violated." },
              { title: "Mitigations", description: "Prioritize safeguards according to likelihood, impact, and cost." }
            ],
            "Threat modeling helps teams identify security gaps before a system is deployed.",
            "Identify one threat and one mitigation for a student login portal."
          )
        ]
      }
    },

    4: {
      title: "Network Security",
      description: "Learn network components, protocols, traffic, and defensive controls.",
      levels: {
        1: [
          lesson(
            "Networking Fundamentals",
            "A computer network connects devices so they can communicate and share resources.",
            [
              { title: "IP address", description: "An address used to identify an interface on an IP network." },
              { title: "Router", description: "Forwards packets between networks according to routing information." },
              { title: "DNS", description: "Translates domain names into records used to locate network services." }
            ],
            "Understanding networking makes it easier to interpret logs and recognize unusual communications.",
            "Describe the roles of an IP address, router, and DNS."
          ),
          lesson(
            "Network Protocols and Ports",
            "Protocols define how systems exchange information. Ports help identify the destination application or service.",
            [
              { title: "TCP", description: "Provides a reliable, ordered byte stream between communicating endpoints." },
              { title: "UDP", description: "Provides datagrams without TCP's built-in delivery and ordering guarantees." },
              { title: "HTTPS", description: "Uses TLS to protect HTTP communications in transit when configured correctly." }
            ],
            "Protocol knowledge helps defenders understand traffic and identify services that need protection.",
            "Explain why HTTPS is preferred over unencrypted HTTP for sensitive web sessions."
          )
        ],
        2: [
          lesson(
            "Firewalls and Network Segmentation",
            "Firewalls enforce traffic rules, while segmentation separates systems into zones with different trust levels.",
            [
              { title: "Allow rules", description: "Permit only traffic that is required for a defined purpose." },
              { title: "Default deny", description: "Block traffic unless it is explicitly allowed by policy." },
              { title: "Segmentation", description: "Limit unnecessary communication between users, servers, and sensitive systems." }
            ],
            "Restricting traffic reduces exposure and can limit an attacker's movement between systems.",
            "Propose a simple separation between public web servers and a private database."
          ),
          lesson(
            "Secure Wireless Networks",
            "Wireless networks need strong authentication, modern encryption, and careful management of connected devices.",
            [
              { title: "Encryption", description: "Use modern supported Wi-Fi security settings, such as WPA3 where available." },
              { title: "Guest network", description: "Separate visitors and untrusted devices from sensitive internal systems." },
              { title: "Administration", description: "Change default administrator credentials and update router firmware." }
            ],
            "Wireless security protects traffic and reduces unauthorized access to local networks.",
            "List three settings you would review when securing a home router."
          )
        ],
        3: [
          lesson(
            "Network Monitoring",
            "Network monitoring collects and analyzes traffic and device information to understand activity and detect possible incidents.",
            [
              { title: "Logs and flows", description: "Records can reveal communication patterns, volume, and timing." },
              { title: "Baselines", description: "Normal behavior provides a reference for identifying meaningful deviations." },
              { title: "Alert validation", description: "Investigate alerts using context rather than assuming every alert is malicious." }
            ],
            "Monitoring helps teams discover suspicious activity that preventive controls may not stop.",
            "Give an example of a network behavior that could justify further investigation."
          ),
          lesson(
            "Network Defense Architecture",
            "A network defense architecture combines prevention, monitoring, access control, and response.",
            [
              { title: "IDS", description: "An intrusion detection system identifies activity that may violate security expectations." },
              { title: "IPS", description: "An intrusion prevention system can block selected suspicious traffic." },
              { title: "Secure remote access", description: "Use approved encrypted access methods and strong authentication." }
            ],
            "Combining complementary controls improves visibility and reduces reliance on a single tool.",
            "Explain how a firewall and an intrusion detection system serve different purposes."
          )
        ]
      }
    },

    5: {
      title: "Defense Basics",
      description: "Explore access control, endpoint protection, logging, and secure configuration.",
      levels: {
        1: [
          lesson(
            "Access Control",
            "Access control determines which users or systems may perform particular actions on resources.",
            [
              { title: "Authentication", description: "Verifies a claimed identity." },
              { title: "Authorization", description: "Determines which actions an authenticated identity is allowed to perform." },
              { title: "Least privilege", description: "Restricts permissions to what is needed for the task." }
            ],
            "Correct access controls help protect confidential data and reduce accidental or unauthorized changes.",
            "Explain the difference between authentication and authorization."
          ),
          lesson(
            "Endpoint Protection",
            "Endpoint protection safeguards laptops, desktops, phones, and servers against threats and unsafe configurations.",
            [
              { title: "Antimalware", description: "Detects or blocks known and suspicious malicious activity." },
              { title: "Hardening", description: "Disable unnecessary services and apply secure configurations." },
              { title: "Updates", description: "Keep operating systems and applications patched." }
            ],
            "Endpoints are common entry points into organizational systems and need ongoing maintenance.",
            "Create a checklist for securing a new computer before use."
          )
        ],
        2: [
          lesson(
            "Security Logs and Alerts",
            "Logs record system and application events. Alerts highlight events that may need investigation.",
            [
              { title: "Useful records", description: "Authentication failures, privilege changes, and system errors may provide valuable context." },
              { title: "Time synchronization", description: "Consistent timestamps help investigators correlate events." },
              { title: "Log protection", description: "Restrict access and preserve records according to retention policy." }
            ],
            "Good logging supports investigation, accountability, and early detection.",
            "Explain why several failed logins should be examined alongside other evidence."
          ),
          lesson(
            "Vulnerability and Patch Management",
            "Vulnerability management identifies, prioritizes, and addresses weaknesses in systems and applications.",
            [
              { title: "Inventory", description: "Maintain a current list of devices, applications, and versions." },
              { title: "Prioritization", description: "Consider severity, exposure, exploitability, and business impact." },
              { title: "Verification", description: "Confirm that updates or mitigations worked and did not cause unexpected problems." }
            ],
            "A repeatable process reduces exposure to known weaknesses.",
            "Why might an internet-facing critical vulnerability need faster attention than a low-impact issue?"
          )
        ],
        3: [
          lesson(
            "Security Operations",
            "Security operations combine monitoring, investigation, incident handling, and ongoing improvement.",
            [
              { title: "Triage", description: "Determine which alerts require urgent attention." },
              { title: "Correlation", description: "Compare events across identities, endpoints, applications, and networks." },
              { title: "Escalation", description: "Refer incidents to the appropriate responders using defined procedures." }
            ],
            "Structured operations help teams focus on meaningful risks and respond consistently.",
            "Outline a basic triage process for a suspicious login alert."
          ),
          lesson(
            "Defense-in-Depth Design",
            "Defense in depth layers different controls so one control's failure does not automatically defeat the entire security design.",
            [
              { title: "Preventive controls", description: "Reduce the chance of an incident, for example through strong access controls." },
              { title: "Detective controls", description: "Help identify suspicious events, such as monitoring and alerts." },
              { title: "Recovery controls", description: "Support restoration, such as protected backups and tested recovery plans." }
            ],
            "Multiple layers help limit both the likelihood and consequences of security incidents.",
            "Design a three-layer defense for an online student records system."
          )
        ]
      }
    },

    6: {
      title: "Ethical Hacking & Pen Testing",
      description: "Understand authorized security testing, scope, evidence, and reporting.",
      levels: {
        1: [
          lesson(
            "Introduction to Ethical Hacking",
            "Ethical hacking is authorized security assessment performed to discover weaknesses and help owners improve defenses.",
            [
              { title: "Permission", description: "Testing requires explicit authorization from the owner or authorized representative." },
              { title: "Scope", description: "The scope defines which systems, activities, and time periods are approved." },
              { title: "Responsible conduct", description: "Avoid unnecessary disruption and protect any information encountered." }
            ],
            "Authorization and clear boundaries distinguish legitimate testing from unauthorized access.",
            "Explain why public availability of a website does not grant permission to test it."
          ),
          lesson(
            "Testing Methodology and Safety",
            "A testing methodology organizes authorized work into repeatable phases and establishes safeguards.",
            [
              { title: "Planning", description: "Agree on targets, permitted methods, exclusions, contacts, and stop conditions." },
              { title: "Assessment", description: "Use approved techniques and record observations carefully." },
              { title: "Validation", description: "Confirm findings safely without unnecessary access or disruption." }
            ],
            "Planning helps ensure security tests produce useful evidence without causing avoidable harm.",
            "List four details that should be included in a testing authorization."
          )
        ],
        2: [
          lesson(
            "Vulnerability Assessment",
            "A vulnerability assessment identifies and prioritizes weaknesses using approved tools, reviews, and verification.",
            [
              { title: "Discovery", description: "Identify approved assets and their exposed services." },
              { title: "Validation", description: "Review evidence to reduce false positives." },
              { title: "Remediation", description: "Recommend practical fixes and verify them after implementation." }
            ],
            "Reliable assessments help system owners focus on real, relevant security weaknesses.",
            "Explain why a scanner finding should be reviewed before being reported as confirmed."
          ),
          lesson(
            "Security Findings and Reporting",
            "A security report communicates what was found, why it matters, and how the owner can address it.",
            [
              { title: "Evidence", description: "Record enough detail to support a finding without exposing unnecessary sensitive information." },
              { title: "Impact", description: "Explain realistic consequences in the system's actual context." },
              { title: "Remediation", description: "Provide clear, actionable recommendations and verification criteria." }
            ],
            "A clear report turns technical observations into improvements that owners can implement.",
            "Draft the headings you would include in a responsible vulnerability report."
          )
        ],
        3: [
          lesson(
            "Security Assessment Planning",
            "A mature assessment plan aligns test activities with business needs, safety requirements, and defined objectives.",
            [
              { title: "Rules of engagement", description: "Document scope, allowed techniques, contacts, and emergency stop procedures." },
              { title: "Operational safety", description: "Avoid unapproved production changes and protect customer information." },
              { title: "Communication", description: "Agree on how urgent findings and unexpected events will be reported." }
            ],
            "Careful planning makes assessments safer, more repeatable, and more useful to stakeholders.",
            "Create a short rules-of-engagement checklist for an authorized lab assessment."
          ),
          lesson(
            "Remediation and Retesting",
            "Retesting verifies whether a security issue was addressed and whether the correction introduced other problems.",
            [
              { title: "Root cause", description: "Identify why the weakness existed rather than treating only its visible symptom." },
              { title: "Retest", description: "Repeat an approved validation procedure after the fix." },
              { title: "Closure", description: "Record evidence, remaining risk, and any follow-up actions." }
            ],
            "Verification closes the loop between identifying a weakness and actually improving security.",
            "Explain why a finding should not be closed solely because a developer says it was fixed."
          )
        ]
      }
    },

    7: {
      title: "Web Application Security",
      description: "Learn secure web design, common vulnerabilities, and protective coding practices.",
      levels: {
        1: [
          lesson(
            "How Web Applications Work",
            "A web application usually involves a browser, a server, application logic, and sometimes a database or external service.",
            [
              { title: "Client", description: "The browser displays the interface and sends requests." },
              { title: "Server", description: "The server processes requests and enforces security rules." },
              { title: "Database", description: "Stores application information and should only be accessed through controlled operations." }
            ],
            "Understanding component responsibilities helps developers place security controls in the correct locations.",
            "Explain why hiding a button in the browser is not sufficient authorization."
          ),
          lesson(
            "Input Validation and Output Encoding",
            "Web applications must treat external input as untrusted and handle it according to its intended use.",
            [
              { title: "Validation", description: "Check that input matches the expected format, range, and business rules." },
              { title: "Output encoding", description: "Encode data for the context in which it will be displayed." },
              { title: "Parameterized queries", description: "Separate SQL query structure from supplied values." }
            ],
            "Correct input handling helps prevent injection flaws and unexpected application behavior.",
            "Explain the difference between validating input and encoding output."
          )
        ],
        2: [
          lesson(
            "SQL Injection Awareness",
            "SQL injection can occur when an application improperly combines untrusted input with database query instructions.",
            [
              { title: "Root cause", description: "Building queries through unsafe string concatenation can mix data with executable query structure." },
              { title: "Primary defense", description: "Use parameterized queries or prepared statements." },
              { title: "Additional controls", description: "Apply least-privilege database permissions and handle errors safely." }
            ],
            "Secure query construction protects data and helps prevent unauthorized database operations.",
            "Explain why a parameterized query is safer than building SQL from raw user input."
          ),
          lesson(
            "Cross-Site Scripting Awareness",
            "Cross-site scripting, or XSS, involves untrusted content being interpreted as executable script in another user's browser.",
            [
              { title: "Contextual encoding", description: "Encode untrusted content for the HTML, attribute, URL, or script context where it is used." },
              { title: "Safe APIs", description: "Prefer APIs that treat content as text instead of parsing it as HTML." },
              { title: "Content Security Policy", description: "A correctly designed CSP can provide an additional defensive layer." }
            ],
            "Preventing XSS protects users from browser-based abuse and unauthorized actions within their sessions.",
            "Explain why inserting untrusted input with innerHTML can be dangerous."
          )
        ],
        3: [
          lesson(
            "Sessions and Authentication Security",
            "Sessions allow an application to maintain authenticated state across multiple requests.",
            [
              { title: "Secure cookies", description: "Use appropriate Secure, HttpOnly, and SameSite cookie settings." },
              { title: "Session renewal", description: "Regenerate session identifiers after important authentication changes." },
              { title: "Logout and expiry", description: "Invalidate sessions appropriately and use sensible expiration rules." }
            ],
            "Secure session handling reduces the risk of unauthorized account access.",
            "Explain the purpose of the HttpOnly cookie attribute."
          ),
          lesson(
            "Secure Development Lifecycle",
            "A secure development lifecycle integrates security throughout planning, implementation, testing, deployment, and maintenance.",
            [
              { title: "Design review", description: "Identify trust boundaries and threats before implementation." },
              { title: "Code review and testing", description: "Use peer review, dependency checks, and security testing." },
              { title: "Secrets management", description: "Keep credentials and private keys out of source code and public repositories." }
            ],
            "Security practices introduced early are easier to maintain than emergency fixes after release.",
            "Create a security checklist for publishing a web application."
          )
        ]
      }
    },

    8: {
      title: "Digital Forensics & Incident Response",
      description: "Learn evidence preservation, incident handling, and recovery fundamentals.",
      levels: {
        1: [
          lesson(
            "Digital Forensics Fundamentals",
            "Digital forensics examines digital information using documented, repeatable methods to support an investigation.",
            [
              { title: "Evidence integrity", description: "Preserve evidence and record actions taken during collection and examination." },
              { title: "Documentation", description: "Record who handled evidence, when it was handled, and how it was stored." },
              { title: "Authorized collection", description: "Collect only within approved legal and organizational boundaries." }
            ],
            "Careful evidence handling helps investigators explain and defend their conclusions.",
            "Explain why an investigator should document how a file or device was collected."
          ),
          lesson(
            "Incident Response Basics",
            "Incident response is a coordinated process for identifying, managing, and recovering from security incidents.",
            [
              { title: "Preparation", description: "Define roles, contacts, tools, and response procedures before an incident." },
              { title: "Detection and analysis", description: "Review reports and evidence to determine the nature and scope of an incident." },
              { title: "Containment and recovery", description: "Limit harm, remove the cause, restore systems, and verify recovery." }
            ],
            "A prepared response reduces confusion and supports a faster, more controlled recovery.",
            "List the main phases of an incident response process."
          )
        ],
        2: [
          lesson(
            "Logs and Timeline Analysis",
            "Investigators use logs and other records to reconstruct events and understand what happened.",
            [
              { title: "Time sources", description: "Consider time zones, clock drift, and differences between systems." },
              { title: "Correlation", description: "Compare records from identity systems, endpoints, applications, and networks." },
              { title: "Evidence limits", description: "Distinguish verified observations from assumptions and missing information." }
            ],
            "A carefully built timeline can help establish sequence, scope, and likely causes.",
            "Why is it important to consider time zones when combining logs from multiple systems?"
          ),
          lesson(
            "Evidence Preservation",
            "Evidence preservation aims to prevent accidental changes and maintain reliable records during an investigation.",
            [
              { title: "Read-only handling", description: "Use appropriate safeguards to avoid modifying original evidence." },
              { title: "Hashes", description: "Cryptographic hashes can help verify that a digital copy has not changed." },
              { title: "Chain of custody", description: "Maintain a record of evidence possession and transfer." }
            ],
            "Preservation practices improve the reliability and reproducibility of forensic findings.",
            "Explain what a cryptographic hash can tell an investigator about a file."
          )
        ],
        3: [
          lesson(
            "Incident Coordination",
            "Serious incidents may require coordination between technical responders, management, legal advisers, and communications teams.",
            [
              { title: "Roles", description: "Assign responsibility for technical investigation, decisions, and external communication." },
              { title: "Escalation", description: "Use severity criteria and defined contacts to escalate significant incidents." },
              { title: "Documentation", description: "Maintain a record of decisions, evidence, and response actions." }
            ],
            "Coordination helps organizations make consistent decisions during complex incidents.",
            "Explain why incident communication should follow an agreed process."
          ),
          lesson(
            "Post-Incident Review",
            "A post-incident review examines what happened, how the response worked, and what should change.",
            [
              { title: "Root-cause analysis", description: "Identify contributing technical and organizational factors." },
              { title: "Corrective actions", description: "Assign owners and deadlines to practical improvements." },
              { title: "Lessons learned", description: "Update procedures, controls, and training based on evidence." }
            ],
            "Learning from incidents helps reduce repeat problems and improve readiness.",
            "Give two useful questions for a post-incident review."
          )
        ]
      }
    },

    9: {
      title: "Practical Security Labs",
      description: "Apply cybersecurity knowledge in safe, controlled learning activities.",
      levels: {
        1: [
          lesson(
            "Lab Safety and Scope",
            "A cybersecurity lab provides a controlled environment for learning security concepts without affecting real systems.",
            [
              { title: "Authorized environment", description: "Use only systems and accounts explicitly provided for the exercise." },
              { title: "Isolation", description: "Keep lab activities separate from sensitive devices and production networks." },
              { title: "Learning objectives", description: "Understand what the exercise demonstrates and which actions are out of scope." }
            ],
            "Safe lab practices let learners explore security concepts while protecting other people and systems.",
            "List three rules you would follow before starting a security lab."
          ),
          lesson(
            "Documenting Lab Results",
            "Lab documentation records objectives, steps, observations, conclusions, and recommendations.",
            [
              { title: "Objective", description: "State the question or security concept the lab is designed to explore." },
              { title: "Observations", description: "Record what happened and distinguish facts from interpretations." },
              { title: "Conclusion", description: "Explain what the result demonstrates and what remains uncertain." }
            ],
            "Clear documentation makes learning repeatable and supports effective security reporting.",
            "Write a short report outline for a completed security lab."
          )
        ],
        2: [
          lesson(
            "Analyzing Simulated Security Events",
            "A simulated event lets learners practice investigating suspicious activity using fictional records and controlled examples.",
            [
              { title: "Baseline", description: "Understand expected behavior before deciding that an event is suspicious." },
              { title: "Evidence", description: "Use relevant timestamps, account activity, and event details." },
              { title: "Decision", description: "Document whether the evidence supports escalation or further investigation." }
            ],
            "Practicing with simulations builds investigative skills without accessing real users' data.",
            "Explain what additional evidence you would seek after an unusual login alert."
          ),
          lesson(
            "Security Control Evaluation",
            "Control evaluation checks whether a safeguard meets its intended security objective.",
            [
              { title: "Objective", description: "Define what the control should prevent, detect, or support." },
              { title: "Test criteria", description: "Use an approved test with clear expected results." },
              { title: "Improvement", description: "Record gaps and recommend proportionate corrective actions." }
            ],
            "Testing controls provides evidence of effectiveness instead of relying on assumptions.",
            "Describe how you could evaluate whether a password policy is being applied consistently."
          )
        ],
        3: [
          lesson(
            "Security Lab Capstone",
            "A capstone brings together risk assessment, defensive design, monitoring, and reporting in one structured exercise.",
            [
              { title: "Plan", description: "Define the fictional environment, scope, objectives, and rules." },
              { title: "Analyze", description: "Identify risks and evaluate available evidence in the simulated environment." },
              { title: "Report", description: "Present findings, priorities, and measurable recommendations." }
            ],
            "A capstone demonstrates how individual security concepts fit into a practical workflow.",
            "Outline a safe capstone that assesses a fictional learning website."
          ),
          lesson(
            "Continuous Security Improvement",
            "Security improvement is an ongoing process of measuring results, addressing weaknesses, and adapting to changing risks.",
            [
              { title: "Review", description: "Evaluate findings, control effectiveness, and feedback." },
              { title: "Prioritize", description: "Select improvements based on risk and available resources." },
              { title: "Verify", description: "Check whether changes achieved their intended outcomes." }
            ],
            "Continuous improvement helps security programs remain useful as systems and threats change.",
            "Choose one security metric and explain how it could guide future improvements."
          )
        ]
      }
    }
  };

  // ------------------------------------------
  // USER AND PROGRESS STORAGE
  // ------------------------------------------

  function getUserEmail() {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      return user?.email?.trim().toLowerCase() || null;
    } catch {
      return null;
    }
  }

  function getCompletedLessons() {
    const email = getUserEmail();
    if (!email) return [];

    try {
      const data = JSON.parse(
        localStorage.getItem(LESSON_STORAGE_PREFIX + email) || "[]"
      );
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function saveCompletedLesson(lessonId) {
    const email = getUserEmail();

    if (!email) {
      alert("Please log in before saving your lesson progress.");
      return false;
    }

    const key = LESSON_STORAGE_PREFIX + email;
    const completed = getCompletedLessons();

    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      localStorage.setItem(key, JSON.stringify(completed));
    }

    // Notify the Labs page and any dashboard progress listeners.
    window.dispatchEvent(new Event("cyberverse:progress-updated"));
    window.dispatchEvent(new Event("storage"));

    return true;
  }

  function isLessonComplete(moduleId, level, lessonIndex) {
    const id = `${moduleId}-${level}-${lessonIndex}`;
    return getCompletedLessons().includes(id);
  }

  // ------------------------------------------
  // MODAL ELEMENTS
  // ------------------------------------------

  const modal = document.getElementById("moduleModal");

  if (!modal) {
    // Pages without the lesson modal can still load this file safely.
    window.CyberVerseModules = Object.freeze({
      MODULE_CONTENT,
      LEVEL_INFO,
      isLessonComplete,
      getCompletedLessons
    });
    return;
  }

  const closeBtn = document.getElementById("modalCloseBtn");
  const levelPickerView = document.getElementById("levelPickerView");
  const lessonView = document.getElementById("lessonView");
  const modalModuleTitle = document.getElementById("modalModuleTitle");
  const levelCards = document.getElementById("levelCards");
  const backToLevelsBtn = document.getElementById("backToLevelsBtn");
  const activeLevelLabel = document.getElementById("activeLevelLabel");
  const modalLessonList = document.getElementById("modalLessonList");
  const modalLessonIndex = document.getElementById("modalLessonIndex");
  const modalLessonTitle = document.getElementById("modalLessonTitle");
  const modalLessonBody = document.getElementById("modalLessonBody");
  const modalPrevBtn = document.getElementById("modalPrevBtn");
  const modalCompleteBtn = document.getElementById("modalCompleteBtn");
  const modalNextBtn = document.getElementById("modalNextBtn");

  let activeModuleId = null;
  let activeLevel = 1;
  let activeLessonIndex = 0;

  function showElement(element, visible) {
    if (!element) return;
    element.hidden = !visible;
  }

  function openModal(moduleId) {
    const module = MODULE_CONTENT[moduleId];

    if (!module) {
      console.warn("CyberVerse: unknown module ID:", moduleId);
      return;
    }

    activeModuleId = Number(moduleId);
    activeLevel = 1;
    activeLessonIndex = 0;

    if (modalModuleTitle) {
      modalModuleTitle.textContent = module.title;
    }

    renderLevelPicker();

    showElement(levelPickerView, true);
    showElement(lessonView, false);
    showElement(modal, true);

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("cv-modal-open");

    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cv-modal-open");
    showElement(modal, false);
    activeModuleId = null;
  }

  function renderLevelPicker() {
    if (!levelCards || !activeModuleId) return;

    const module = MODULE_CONTENT[activeModuleId];
    const completed = getCompletedLessons();

    levelCards.innerHTML = [1, 2, 3].map((level) => {
      const info = LEVEL_INFO[level];
      const lessons = module.levels[level] || [];
      const finished = lessons.filter((_, index) =>
        completed.includes(`${activeModuleId}-${level}-${index}`)
      ).length;

      return `
        <button
          type="button"
          class="level-card"
          data-level="${level}"
          style="--level-accent:${info.color}"
          aria-label="${info.name}: ${finished} of ${lessons.length} lessons completed"
        >
          <span class="level-card-number">LEVEL 0${level}</span>
          <strong>${info.name}</strong>
          <span>${escapeHTML(info.description)}</span>
          <span class="level-card-progress">
            ${finished}/${lessons.length} lessons complete
          </span>
        </button>
      `;
    }).join("");

    levelCards.querySelectorAll("[data-level]").forEach((button) => {
      button.addEventListener("click", () => {
        const level = Number(button.dataset.level);
        openLevel(level);
      });
    });
  }

  function openLevel(level) {
    if (!activeModuleId || !MODULE_CONTENT[activeModuleId].levels[level]) {
      return;
    }

    activeLevel = level;
    activeLessonIndex = 0;

    if (activeLevelLabel) {
      activeLevelLabel.textContent = LEVEL_INFO[level].name;
    }

    showElement(levelPickerView, false);
    showElement(lessonView, true);

    renderLessonList();
    renderLesson();
  }

  function renderLessonList() {
    if (!modalLessonList || !activeModuleId) return;

    const lessons = MODULE_CONTENT[activeModuleId].levels[activeLevel];
    const completed = getCompletedLessons();

    modalLessonList.innerHTML = lessons.map((item, index) => {
      const id = `${activeModuleId}-${activeLevel}-${index}`;
      const done = completed.includes(id);
      const current = index === activeLessonIndex;

      return `
        <button
          type="button"
          class="modal-lesson-item${current ? " active" : ""}${done ? " completed" : ""}"
          data-lesson-index="${index}"
          aria-current="${current ? "step" : "false"}"
        >
          <span class="modal-lesson-status">${done ? "✓" : String(index + 1).padStart(2, "0")}</span>
          <span>${escapeHTML(item.title)}</span>
        </button>
      `;
    }).join("");

    modalLessonList.querySelectorAll("[data-lesson-index]").forEach((button) => {
      button.addEventListener("click", () => {
        activeLessonIndex = Number(button.dataset.lessonIndex);
        renderLessonList();
        renderLesson();
      });
    });
  }

  function renderLesson() {
    if (!activeModuleId) return;

    const lessons = MODULE_CONTENT[activeModuleId].levels[activeLevel];
    const item = lessons[activeLessonIndex];

    if (!item) return;

    const lessonId = `${activeModuleId}-${activeLevel}-${activeLessonIndex}`;
    const completed = getCompletedLessons().includes(lessonId);

    if (modalLessonIndex) {
      modalLessonIndex.textContent =
        `Lesson ${activeLessonIndex + 1} of ${lessons.length}`;
    }

    if (modalLessonTitle) {
      modalLessonTitle.textContent = item.title;
    }

    if (modalLessonBody) {
      modalLessonBody.innerHTML = buildBody(item);
    }

    if (modalPrevBtn) {
      modalPrevBtn.disabled = activeLessonIndex === 0;
    }

    if (modalNextBtn) {
      modalNextBtn.disabled = activeLessonIndex === lessons.length - 1;
      modalNextBtn.textContent =
        activeLessonIndex === lessons.length - 1
          ? "Last lesson"
          : "Next lesson →";
    }

    if (modalCompleteBtn) {
      modalCompleteBtn.disabled = completed;
      modalCompleteBtn.textContent = completed
        ? "✓ Lesson completed"
        : "Mark lesson complete";
      modalCompleteBtn.classList.toggle("completed", completed);
    }
  }

  // ------------------------------------------
  // EVENTS
  // ------------------------------------------

  document.querySelectorAll(".module-btn[data-module]").forEach((button) => {
    button.addEventListener("click", () => {
      openModal(button.dataset.module);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (backToLevelsBtn) {
    backToLevelsBtn.addEventListener("click", () => {
      renderLevelPicker();
      showElement(lessonView, false);
      showElement(levelPickerView, true);
    });
  }

  if (modalPrevBtn) {
    modalPrevBtn.addEventListener("click", () => {
      if (activeLessonIndex > 0) {
        activeLessonIndex--;
        renderLessonList();
        renderLesson();
      }
    });
  }

  if (modalNextBtn) {
    modalNextBtn.addEventListener("click", () => {
      const lessons = MODULE_CONTENT[activeModuleId]?.levels[activeLevel] || [];

      if (activeLessonIndex < lessons.length - 1) {
        activeLessonIndex++;
        renderLessonList();
        renderLesson();
      }
    });
  }

  if (modalCompleteBtn) {
    modalCompleteBtn.addEventListener("click", () => {
      if (!activeModuleId) return;

      const lessonId =
        `${activeModuleId}-${activeLevel}-${activeLessonIndex}`;

      if (saveCompletedLesson(lessonId)) {
        renderLevelPicker();
        renderLessonList();
        renderLesson();
      }
    });
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modal.classList.contains("active")
    ) {
      closeModal();
    }
  });

  window.addEventListener("cyberverse:progress-updated", () => {
    if (!activeModuleId) return;
    renderLevelPicker();
    renderLessonList();
    renderLesson();
  });

  // Expose a small API for the Labs page and dashboard.
  window.CyberVerseModules = Object.freeze({
    MODULE_CONTENT,
    LEVEL_INFO,
    isLessonComplete,
    getCompletedLessons,
    openModule: openModal
  });

  // Ensure the modal starts hidden.
  showElement(modal, false);
})();
