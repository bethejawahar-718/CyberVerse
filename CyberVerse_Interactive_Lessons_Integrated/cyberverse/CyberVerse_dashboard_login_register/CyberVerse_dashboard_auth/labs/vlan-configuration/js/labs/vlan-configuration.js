(() => {
  const initial = {1:10, 2:10, 3:20, 4:20, 5:30, 6:30, 7:1, 8:1};
  const vlanInfo = {
    1: {name:"DEFAULT", className:"vlan-1"},
    10: {name:"ADMIN", className:"vlan-10"},
    20: {name:"STUDENTS", className:"vlan-20"},
    30: {name:"GUESTS", className:"vlan-30"}
  };
  let assignments = {...initial};
  const $ = (id) => document.getElementById(id);

  function deviceName(port) { return `PC-${String(port).padStart(2,"0")}`; }

  function renderTable() {
    const tbody = $("port-table");
    tbody.replaceChildren();
    for (let port = 1; port <= 8; port++) {
      const vlan = assignments[port];
      const info = vlanInfo[vlan];
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>Fa0/${port}</td><td>${deviceName(port)}</td><td><span class="vlan-pill ${info.className}">VLAN ${vlan}</span></td><td>${info.name}</td><td><span class="port-status">● Active</span></td>`;
      tbody.appendChild(tr);
    }
    $("assignment-count").textContent = `${Object.keys(assignments).length} ports configured`;
    document.querySelectorAll(".device[data-port]").forEach((device) => {
      const port = Number(device.dataset.port);
      const vlan = assignments[port];
      const info = vlanInfo[vlan];
      const pill = device.querySelector(".vlan-pill");
      pill.className = `vlan-pill ${info.className}`;
      pill.textContent = `VLAN ${vlan}`;
      device.style.opacity = "1";
    });
    updateCommand();
  }

  function updateCommand() {
    const vlan = Number($("vlan-select").value);
    $("command-text").textContent = `Switch(config-if)# switchport access vlan ${vlan}`;
  }

  $("vlan-select").addEventListener("change", updateCommand);
  $("assign-btn").addEventListener("click", () => {
    const port = Number($("port-select").value);
    const vlan = Number($("vlan-select").value);
    assignments[port] = vlan;
    renderTable();
    $("config-feedback").textContent = `Applied simulated configuration: Fa0/${port} is now an access port in VLAN ${vlan} (${vlanInfo[vlan].name}).`;
    const device = document.querySelector(`.device[data-port="${port}"]`);
    device.style.filter = "drop-shadow(0 0 9px #4df0ad45)";
    window.setTimeout(() => { device.style.filter = ""; }, 700);
  });

  $("reset-btn").addEventListener("click", () => {
    assignments = {...initial};
    renderTable();
    $("config-feedback").textContent = "Lab reset. The original port-to-VLAN assignments have been restored.";
    $("test-result").className = "test-result";
    $("test-result").innerHTML = '<span class="result-icon">?</span><div><strong>Ready to test</strong><p>Select two devices and run a simulated connectivity check.</p></div>';
  });

  $("test-btn").addEventListener("click", () => {
    const source = Number($("source-device").value);
    const destination = Number($("destination-device").value);
    const sameVlan = assignments[source] === assignments[destination];
    const result = $("test-result");
    if (source === destination) {
      result.className = "test-result success";
      result.innerHTML = `<span class="result-icon">✓</span><div><strong>Same endpoint selected</strong><p>${deviceName(source)} is testing itself. Choose another destination for a device-to-device test.</p></div>`;
      return;
    }
    if (sameVlan) {
      result.className = "test-result success";
      result.innerHTML = `<span class="result-icon">✓</span><div><strong>Simulated Layer 2 connectivity: possible</strong><p>${deviceName(source)} and ${deviceName(destination)} are both in VLAN ${assignments[source]}. This simplified lab assumes the ports are active and no other restrictions apply.</p></div>`;
    } else {
      result.className = "test-result blocked";
      result.innerHTML = `<span class="result-icon">!</span><div><strong>Different VLANs — Layer 2 traffic is separated</strong><p>${deviceName(source)} is in VLAN ${assignments[source]}, while ${deviceName(destination)} is in VLAN ${assignments[destination]}. Communication between VLANs normally requires a Layer 3 router or multilayer switch configured for inter-VLAN routing.</p></div>`;
    }
  });

  $("quiz-options").querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      $("quiz-options").querySelectorAll("button").forEach((item) => item.classList.remove("correct","incorrect"));
      const correct = button.dataset.answer === "no";
      button.classList.add(correct ? "correct" : "incorrect");
      $("quiz-feedback").textContent = correct
        ? "Correct! VLANs create separate Layer 2 broadcast domains. Inter-VLAN routing is needed for communication between them."
        : "Not quite. Separate VLANs are separate Layer 2 broadcast domains; communication between them requires inter-VLAN routing.";
    });
  });

  renderTable();
})();