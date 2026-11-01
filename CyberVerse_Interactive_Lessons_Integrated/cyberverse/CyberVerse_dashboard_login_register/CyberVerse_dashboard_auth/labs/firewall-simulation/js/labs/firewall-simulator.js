(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const exampleRules = [
    { direction: "inbound", protocol: "TCP", port: 443, action: "ALLOW", purpose: "Allow secure web traffic" },
    { direction: "inbound", protocol: "TCP", port: 22, action: "DENY", purpose: "Block demo SSH access" },
    { direction: "outbound", protocol: "ANY", port: null, action: "ALLOW", purpose: "Allow outbound demo traffic" },
    { direction: "both", protocol: "ANY", port: null, action: "DENY", purpose: "Default deny if no earlier rule matches" }
  ];
  let rules = exampleRules.map(r => ({...r}));
  let history = [];
  let packetCount = 0;

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const portLabel = (port) => port == null ? "Any" : String(port);

  function renderRules() {
    $("rulesBody").innerHTML = rules.map((r, i) => `
      <tr>
        <td><span class="pill">${String(i + 1).padStart(2, "0")}</span></td>
        <td>${escapeHTML(r.direction)}</td><td>${escapeHTML(r.protocol)}</td><td>${portLabel(r.port)}</td>
        <td><span class="pill ${r.action === "ALLOW" ? "allow" : "deny"}">${r.action}</span></td>
        <td>${escapeHTML(r.purpose)}</td>
        <td><div class="row-actions">
          <button class="mini" type="button" data-move="${i}" data-dir="-1" aria-label="Move rule up" ${i===0?'disabled':''}>↑</button>
          <button class="mini" type="button" data-move="${i}" data-dir="1" aria-label="Move rule down" ${i===rules.length-1?'disabled':''}>↓</button>
          <button class="mini" type="button" data-delete="${i}" aria-label="Delete rule">×</button>
        </div></td>
      </tr>`).join("");
  }

  function renderHistory() {
    if (!history.length) {
      $("historyBody").innerHTML = '<tr><td colspan="6" class="empty">No packets tested yet.</td></tr>';
      return;
    }
    $("historyBody").innerHTML = history.map(p => `
      <tr><td>#${p.id} · ${escapeHTML(p.source)}</td><td>${p.direction}</td><td>${p.protocol}</td><td>${p.port}</td>
      <td><span class="pill ${p.action === "ALLOW" ? "allow" : "deny"}">${p.action}</span></td><td>${escapeHTML(p.reason)}</td></tr>`).join("");
  }

  function decide(packet) {
    for (let i = 0; i < rules.length; i++) {
      const r = rules[i];
      const directionMatch = r.direction === "both" || r.direction === packet.direction;
      const protocolMatch = r.protocol === "ANY" || r.protocol === packet.protocol;
      const portMatch = r.port == null || r.port === packet.port;
      if (directionMatch && protocolMatch && portMatch) {
        return { action: r.action, rule: r, index: i, reason: `Matched rule ${i + 1}: “${r.purpose}”.` };
      }
    }
    return { action: "DENY", rule: null, index: -1, reason: "No rule matched. The simulator applies its implicit default-deny policy." };
  }

  $("ruleForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const portText = $("rulePort").value.trim();
    const port = portText === "" ? null : Number(portText);
    if (port !== null && (!Number.isInteger(port) || port < 1 || port > 65535)) {
      alert("Port must be blank (any port) or an integer from 1 to 65535."); return;
    }
    const purpose = $("rulePurpose").value.trim();
    if (!purpose) { alert("Enter a short purpose for this rule."); return; }
    rules.push({
      direction: $("ruleDirection").value,
      protocol: $("ruleProtocol").value,
      port,
      action: $("ruleAction").value,
      purpose
    });
    $("rulePurpose").value = "";
    $("rulePort").value = "";
    renderRules();
  });

  $("rulesBody").addEventListener("click", (event) => {
    const moveButton = event.target.closest("[data-move]");
    const deleteButton = event.target.closest("[data-delete]");
    if (moveButton) {
      const i = Number(moveButton.dataset.move), next = i + Number(moveButton.dataset.dir);
      if (next >= 0 && next < rules.length) {
        [rules[i], rules[next]] = [rules[next], rules[i]];
        renderRules();
      }
    }
    if (deleteButton) {
      rules.splice(Number(deleteButton.dataset.delete), 1);
      renderRules();
    }
  });

  $("packetForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const port = Number($("packetPort").value);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      alert("Destination port must be an integer from 1 to 65535."); return;
    }
    const packet = {
      id: ++packetCount,
      direction: $("packetDirection").value,
      protocol: $("packetProtocol").value,
      port,
      source: $("packetSource").value.trim() || "Unlabelled demo source"
    };
    const decision = decide(packet);
    const result = $("result");
    result.className = `result ${decision.action === "ALLOW" ? "good" : "bad"}`;
    result.innerHTML = `<span class="result-icon">${decision.action === "ALLOW" ? "✓" : "⊘"}</span>
      <div><strong>Packet ${decision.action === "ALLOW" ? "allowed" : "denied"}</strong>
      <p>${escapeHTML(packet.source)} · ${packet.direction} · ${packet.protocol} · destination port ${packet.port}</p>
      <p>${escapeHTML(decision.reason)}</p></div>`;
    history.unshift({...packet, action: decision.action, reason: decision.reason});
    renderHistory();
  });

  $("resetRules").addEventListener("click", () => {
    rules = exampleRules.map(r => ({...r}));
    renderRules();
  });
  $("clearHistory").addEventListener("click", () => { history = []; renderHistory(); });
  renderRules();
  renderHistory();
})(); 
