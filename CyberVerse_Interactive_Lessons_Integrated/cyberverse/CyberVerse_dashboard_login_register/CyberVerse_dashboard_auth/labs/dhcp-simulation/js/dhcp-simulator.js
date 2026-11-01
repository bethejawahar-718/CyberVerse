const $ = id => document.getElementById(id);
const flowItems = [...document.querySelectorAll(".flow-step")];
let running = false;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function resetLab() {
  running = false;
  flowItems.forEach(item => item.classList.remove("done", "current"));
  flowItems.forEach(item => item.querySelector(".state").textContent = "WAITING");
  $("flowStatus").textContent = "READY";
  $("message").textContent = "Choose your network settings, then start the process.";
  $("assignedIp").textContent = "— — — —";
  $("leaseBadge").textContent = "NOT ASSIGNED";
  ["subnet","gateway","dns","duration"].forEach(id => $(id).textContent = "—");
  $("eventLog").innerHTML = '<p class="muted">No events yet. Run the simulation to inspect messages.</p>';
  updateServerAddress();
}
function updateServerAddress() {
  $("serverAddress").textContent = $("pool").value + ".1";
}
function startSimulation() {
  if (running) return;
  const client = $("clientName").value.trim();
  if (!client || !/^[a-zA-Z0-9-]{1,24}$/.test(client)) {
    $("message").innerHTML = '<span style="color:var(--red)">Enter a device name using letters, numbers, or hyphens (1–24 characters).</span>';
    $("clientName").focus();
    return;
  }
  running = true;
  flowItems.forEach(item => item.classList.remove("done", "current"));
  const prefix = $("pool").value;
  const hours = Number($("lease").value);
  const offeredIP = `${prefix}.101`;
  const gateway = `${prefix}.1`;
  const dns = `${prefix}.10`;
  const stages = [
    {title:"DHCPDISCOVER",name:"Discover",text:`${client} broadcasts a request to find available DHCP servers.`},
    {title:"DHCPOFFER",name:"Offer",text:`The simulated server offers ${offeredIP} with a ${hours}-hour lease.`},
    {title:"DHCPREQUEST",name:"Request",text:`${client} requests the offered address ${offeredIP}.`},
    {title:"DHCPACK",name:"Acknowledgment",text:`The server confirms the lease and provides gateway and DNS settings.`}
  ];
  $("eventLog").innerHTML = "";
  $("flowStatus").textContent = "RUNNING";
  stages.forEach((stage,index) => {
    const item = flowItems[index];
    item.classList.add("done");
    item.querySelector(".state").textContent = "SENT";
    $("message").textContent = `${index+1}/4 · ${stage.name}: ${stage.text}`;
    const p = document.createElement("p");
    p.innerHTML = `<b>${stage.title}</b><br>${escapeHTML(stage.text)}`;
    $("eventLog").appendChild(p);
  });
  $("assignedIp").textContent = offeredIP;
  $("leaseBadge").textContent = "LEASE ACTIVE";
  $("subnet").textContent = "255.255.255.0";
  $("gateway").textContent = gateway;
  $("dns").textContent = dns;
  $("duration").textContent = `${hours} hours`;
  $("flowStatus").textContent = "COMPLETE";
  $("message").textContent = `Success: ${client} received a simulated IP lease. The four DORA steps are complete.`;
  running = false;
}
$("startBtn").addEventListener("click", startSimulation);
$("resetBtn").addEventListener("click", resetLab);
$("pool").addEventListener("change", updateServerAddress);
$("clientName").addEventListener("keydown", e => { if (e.key === "Enter") startSimulation(); });
updateServerAddress();
