(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const cases = [
    {
      title: "Case 01 — Can't reach the internet",
      description: "A laptop is connected to the office Wi-Fi, but no websites or internet services are reachable. Other users nearby report that their internet is working.",
      symptoms: ["Wi-Fi connected", "Websites fail to load", "Nearby users online"],
      checks: [
        ["ip", "Check IP configuration", "Inspect the sample address and gateway."],
        ["gateway", "Test default gateway", "Check whether the local router responds."],
        ["dns", "Check name resolution", "See whether domain names resolve."],
        ["service", "Check a sample website", "Test a fictional external service."]
      ],
      clues: {
        ip: "The sample laptop has an address of 169.254.18.7 and no default gateway. This often indicates that automatic address configuration failed.",
        gateway: "No gateway is configured, so the laptop has no listed next hop for off-network traffic.",
        dns: "The DNS test cannot proceed because the device has no usable network configuration.",
        service: "The sample website cannot be reached from this device."
      },
      diagnosis: [
        ["dhcp", "The laptop did not receive a valid IP configuration."],
        ["dns", "The DNS resolver is down for everyone."],
        ["website", "The website itself is offline."],
        ["wifi", "The Wi-Fi password is incorrect."]
      ],
      fix: [["renew", "Check the network connection and renew the IP configuration using approved device tools."],["dnsfix","Change the DNS server immediately."],["restart","Factory-reset the router."]],
      answer: "dhcp", correctFix: "renew",
      explanation: "The 169.254.x.x address and missing gateway are strong clues that the device did not receive its expected network configuration. Verify the connection and renew the configuration through approved tools."
    },
    {
      title: "Case 02 — Website won't load by name",
      description: "A workstation can reach a known test IP address, but entering a website's domain name fails. The rest of the local network appears normal.",
      symptoms: ["Local network works", "Known test IP responds", "Domain name fails"],
      checks: [
        ["ip", "Check IP configuration", "Inspect address and gateway."],
        ["gateway", "Test default gateway", "Check the local next hop."],
        ["dns", "Check name resolution", "Inspect the simulated DNS response."],
        ["service", "Check a sample website", "Compare access by name and test IP."]
      ],
      clues: {
        ip: "The device has a valid sample address, subnet, and default gateway.",
        gateway: "The default gateway responds normally in this simulation.",
        dns: "The DNS query times out. The domain name is not translated into an IP address.",
        service: "The sample service responds by test IP, but the domain-name request fails."
      },
      diagnosis: [
        ["dns", "Name resolution is failing at the DNS resolver or its configuration."],
        ["dhcp", "The device has no IP address."],
        ["route", "The default route is missing."],
        ["server", "The web server is definitely offline."]
      ],
      fix: [["dnsfix","Check the configured DNS resolver and its availability."],["renew","Replace the network adapter."],["reset","Disable all firewall protection."]],
      answer: "dns", correctFix: "dnsfix",
      explanation: "A successful test by IP but failed lookup by domain points toward DNS name resolution. Check the configured resolver and confirm the issue before making changes."
    },
    {
      title: "Case 03 — One service is unreachable",
      description: "A fictional internal application is reachable by other methods, but connections to its secure web service fail. Other network services still work.",
      symptoms: ["Only one service affected", "Other destinations work", "Secure web connection fails"],
      checks: [
        ["ip", "Check IP configuration", "Inspect local addressing."],
        ["gateway", "Test default gateway", "Check basic path to the router."],
        ["dns", "Check name resolution", "Confirm the service name resolves."],
        ["service", "Check service and port", "Inspect the fictional TCP/443 test."]
      ],
      clues: {
        ip: "The device's sample IP configuration looks valid.",
        gateway: "The gateway responds normally.",
        dns: "The service name resolves to the expected sample IP address.",
        service: "The service host responds, but the simulated TCP connection to port 443 is refused. The service may be stopped or a filtering rule may block that port."
      },
      diagnosis: [
        ["service", "The specific service may be stopped, or a rule may be blocking its port."],
        ["dns", "All DNS resolution is broken."],
        ["dhcp", "The device has no network address."],
        ["wifi", "The wireless signal is definitely too weak."]
      ],
      fix: [["servicefix","Check service status and the approved firewall rule for the required port."],["reset","Disable the firewall entirely."],["reboot","Reboot every device on the network."]],
      answer: "service", correctFix: "servicefix",
      explanation: "Valid addressing, a working gateway, and successful name resolution narrow the issue to the particular service or a rule affecting its port. Check service health and the relevant rule rather than disabling protection."
    },
    {
      title: "Case 04 — Slow and unstable connection",
      description: "A user reports delays during video meetings. Basic connectivity works, but the sample connection has variable response times and occasional packet loss.",
      symptoms: ["High variable latency", "Occasional packet loss", "Connectivity still works"],
      checks: [
        ["ip", "Check IP configuration", "Inspect whether the device has valid settings."],
        ["gateway", "Test default gateway", "Compare local response time."],
        ["dns", "Check name resolution", "See whether lookups complete."],
        ["service", "Check sample path quality", "Inspect fictional latency and loss values."]
      ],
      clues: {
        ip: "The device has a valid sample IP configuration.",
        gateway: "The local gateway responds consistently with low latency.",
        dns: "Name resolution completes quickly in the sample test.",
        service: "The simulated path reports 180–420 ms variable latency and 8% packet loss. Local gateway results remain stable, suggesting the issue may be farther along the path or due to congestion."
      },
      diagnosis: [
        ["quality", "The connection has variable latency and packet loss beyond the local gateway."],
        ["dns", "DNS is the only possible cause of all slow traffic."],
        ["dhcp", "The device did not receive an IP address."],
        ["service", "The application server is certainly powered off."]
      ],
      fix: [["qualityfix","Record times and affected services, compare another approved path, and report the evidence to the network administrator."],["reset","Factory-reset the router immediately."],["dnsfix","Change DNS settings without further checks."]],
      answer: "quality", correctFix: "qualityfix",
      explanation: "Stable local gateway results with variable delay and loss on the wider sample path suggest a path-quality or congestion issue. Gather timestamps and comparable test results before escalating."
    }
  ];

  let current = 0;
  let completed = new Set();
  let cluesShown = new Set();

  function renderCase() {
    const c = cases[current];
    $("caseTitle").textContent = c.title;
    $("caseCounter").textContent = `CASE ${current + 1} OF ${cases.length}`;
    $("caseDescription").textContent = c.description;
    $("symptoms").innerHTML = c.symptoms.map(s => `<span class="symptom">${s}</span>`).join("");
    $("checks").innerHTML = c.checks.map(([id,title,desc]) => `
      <div class="check-card"><div><h3>${title}</h3><p>${desc}</p></div>
      <button type="button" data-check="${id}" ${cluesShown.has(id) ? "disabled" : ""}>${cluesShown.has(id) ? "Checked ✓" : "Run check"}</button></div>`).join("");
    $("clues").innerHTML = cluesShown.size ? c.checks.filter(([id])=>cluesShown.has(id)).map(([id,title])=>`<div class="clue"><strong>${title}:</strong> ${c.clues[id]}</div>`).join("") : '<p class="empty">No checks run yet.</p>';
    $("options").innerHTML = c.diagnosis.map(([value,label],i)=>`<label class="option"><input type="radio" name="diagnosis" value="${value}"><span>${label}</span></label>`).join("");
    $("fixSelect").innerHTML = '<option value="">Choose a safe next step…</option>' + c.fix.map(([value,label])=>`<option value="${value}">${label}</option>`).join("");
    $("feedback").className = "feedback";
    $("feedback").innerHTML = "<strong>Ready when you are.</strong><p>Run at least one diagnostic check, then choose a cause and next step.</p>";
    $("caseSelect").value = String(current);
    $("resetCase").disabled = false;
    updateScore();
  }

  function updateScore() {
    $("score").textContent = `${completed.size} / ${cases.length}`;
    $("progressBar").style.width = `${completed.size / cases.length * 100}%`;
  }

  $("checks").addEventListener("click", event => {
    const button = event.target.closest("[data-check]");
    if (!button) return;
    const id = button.dataset.check;
    cluesShown.add(id);
    renderCase();
  });

  $("diagnosisForm").addEventListener("submit", event => {
    event.preventDefault();
    if (cluesShown.size === 0) {
      $("feedback").className = "feedback incorrect";
      $("feedback").innerHTML = "<strong>Run a diagnostic check first.</strong><p>Collect evidence before choosing a cause.</p>";
      return;
    }
    const selected = document.querySelector('input[name="diagnosis"]:checked');
    const fix = $("fixSelect").value;
    if (!selected || !fix) {
      $("feedback").className = "feedback incorrect";
      $("feedback").innerHTML = "<strong>Complete both choices.</strong><p>Select the likely cause and a safe next step.</p>";
      return;
    }
    const c = cases[current];
    const correct = selected.value === c.answer && fix === c.correctFix;
    if (correct) completed.add(current);
    $("feedback").className = `feedback ${correct ? "correct" : "incorrect"}`;
    $("feedback").innerHTML = correct
      ? `<strong>Correct diagnosis ✓</strong><p>${c.explanation}</p>`
      : `<strong>Not quite — review the evidence.</strong><p>${c.explanation} Try again using the clues and choose the matching next step.</p>`;
    updateScore();
  });

  $("caseSelect").addEventListener("change", () => { current = Number($("caseSelect").value); cluesShown = new Set(); renderCase(); });
  $("resetCase").addEventListener("click", () => { cluesShown = new Set(); renderCase(); });
  $("clearClues").addEventListener("click", () => { cluesShown = new Set(); renderCase(); });
  $("nextCase").addEventListener("click", () => { current = (current + 1) % cases.length; cluesShown = new Set(); renderCase(); });
  renderCase();
})(); 
