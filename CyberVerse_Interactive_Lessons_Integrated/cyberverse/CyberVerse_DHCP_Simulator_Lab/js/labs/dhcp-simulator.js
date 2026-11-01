(() => {
  const deviceName = document.getElementById("deviceName");
  const macAddress = document.getElementById("macAddress");
  const poolSelect = document.getElementById("pool");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const status = document.getElementById("status");
  const stages = [...document.querySelectorAll(".stage")];
  const processCaption = document.getElementById("processCaption");
  const leaseIp = document.getElementById("leaseIp");
  const subnet = document.getElementById("subnet");
  const gateway = document.getElementById("gateway");
  const dns = document.getElementById("dns");
  const duration = document.getElementById("duration");
  const leaseRows = document.getElementById("leaseRows");
  let timer = null;
  let leaseCreated = false;

  const messages = [
    "Discover: client broadcasts a request to locate DHCP servers.",
    "Offer: DHCP server offers an available address and network settings.",
    "Request: client requests the offered address.",
    "Acknowledge: server confirms the lease; the client can use the configuration."
  ];

  function clearAnimation() {
    if (timer) clearInterval(timer);
    timer = null;
    stages.forEach(stage => stage.classList.remove("active", "done"));
  }

  function reset() {
    clearAnimation();
    leaseCreated = false;
    status.textContent = "Waiting for a client to request configuration.";
    status.className = "status";
    processCaption.textContent = "Ready to start address assignment.";
    leaseIp.textContent = "— — — —";
    subnet.textContent = "—";
    gateway.textContent = "—";
    dns.textContent = "—";
    duration.textContent = "—";
    leaseRows.innerHTML = '<tr class="empty-row"><td colspan="4">No lease assigned yet. Run the simulation to create one.</td></tr>';
  }

  function start() {
    clearAnimation();
    const name = deviceName.value.trim();
    const mac = macAddress.value.trim();
    const macPattern = /^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i;
    if (!name) {
      status.textContent = "Enter a device name before starting.";
      status.className = "status error";
      deviceName.focus();
      return;
    }
    if (!macPattern.test(mac)) {
      status.textContent = "Enter a MAC address in the format 02:1A:2B:3C:4D:5E.";
      status.className = "status error";
      macAddress.focus();
      return;
    }

    const lab = poolSelect.value === "200";
    const ip = lab ? "10.0.0.100" : "192.168.1.100";
    const mask = "255.255.255.0";
    const gw = lab ? "10.0.0.1" : "192.168.1.1";
    const dnsServer = lab ? "10.0.0.53" : "192.168.1.53";

    status.className = "status";
    processCaption.textContent = "DHCP DORA exchange in progress.";
    let index = 0;
    const step = () => {
      stages.forEach(stage => stage.classList.remove("active"));
      if (index > 0) stages[index - 1].classList.add("done");
      if (index < stages.length) {
        stages[index].classList.add("active");
        status.textContent = messages[index];
        processCaption.textContent = messages[index];
        index++;
      } else {
        clearAnimation();
        stages.forEach(stage => stage.classList.add("done"));
        status.textContent = `Lease successfully assigned to ${name}.`;
        status.className = "status success";
        processCaption.textContent = "DORA complete — client has network settings.";
        leaseIp.textContent = ip;
        subnet.textContent = mask;
        gateway.textContent = gw;
        dns.textContent = dnsServer;
        duration.textContent = "24 hours";
        leaseRows.innerHTML = `<tr><td>${escapeHTML(name)}</td><td>${ip}</td><td><span class="lease-status">ACTIVE</span></td><td>24 hours</td></tr>`;
        leaseCreated = true;
      }
    };
    step();
    timer = setInterval(step, 850);
  }

  function escapeHTML(value) {
    return value.replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character]));
  }

  startBtn.addEventListener("click", start);
  resetBtn.addEventListener("click", reset);
  poolSelect.addEventListener("change", () => {
    if (leaseCreated) reset();
  });

  document.querySelectorAll(".quiz-option").forEach(option => {
    option.addEventListener("click", () => {
      document.querySelectorAll(".quiz-option").forEach(item => item.classList.remove("correct", "incorrect"));
      const feedback = document.getElementById("quizFeedback");
      if (option.dataset.answer === "right") {
        option.classList.add("correct");
        feedback.textContent = "Correct! DORA stands for Discover, Offer, Request, Acknowledge.";
        feedback.style.color = "var(--green)";
      } else {
        option.classList.add("incorrect");
        feedback.textContent = "Not quite. The final step confirms the address lease and configuration.";
        feedback.style.color = "var(--red)";
      }
    });
  });
})();
