(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const sliders = ["latency", "jitter", "loss", "bandwidth"];
  const defaults = {latency:60, jitter:10, loss:2, bandwidth:20};
  const profiles = {
    good: {latency:20,jitter:3,loss:0,bandwidth:80},
    busy: {latency:120,jitter:35,loss:8,bandwidth:12},
    poor: {latency:240,jitter:75,loss:22,bandwidth:3}
  };

  function settings() {
    return Object.fromEntries(sliders.map(id => [id, Number($(id).value)]));
  }
  function updateOutputs() {
    const s = settings();
    $("latencyOut").textContent = `${s.latency} ms`;
    $("jitterOut").textContent = `${s.jitter} ms`;
    $("lossOut").textContent = `${s.loss}%`;
    $("bandwidthOut").textContent = `${s.bandwidth} Mbps`;
  }
  function setProfile(values) {
    Object.entries(values).forEach(([id,value]) => $(id).value = value);
    updateOutputs();
  }
  sliders.forEach(id => $(id).addEventListener("input", updateOutputs));
  document.querySelectorAll("[data-preset]").forEach(button => button.addEventListener("click", () => setProfile(profiles[button.dataset.preset])));
  $("reset").addEventListener("click", () => setProfile(defaults));

  function runSimulation() {
    const s = settings();
    const samples = [];
    for (let i = 0; i < 20; i++) {
      const lost = Math.random() * 100 < s.loss;
      const variation = s.jitter === 0 ? 0 : (Math.random() * 2 - 1) * s.jitter;
      const bandwidthPenalty = (100 / s.bandwidth) * 0.3;
      const rtt = Math.max(1, Math.round(s.latency + variation + bandwidthPenalty));
      samples.push({id:i+1,lost,rtt});
    }
    const delivered = samples.filter(p => !p.lost);
    const lostCount = samples.length - delivered.length;
    const avg = delivered.length ? delivered.reduce((sum,p)=>sum+p.rtt,0) / delivered.length : null;
    const sorted = delivered.map(p=>p.rtt).sort((a,b)=>a-b);
    const observedJitter = sorted.length > 1
      ? delivered.slice(1).reduce((sum,p,i)=>sum+Math.abs(p.rtt-delivered[i].rtt),0)/(delivered.length-1)
      : 0;
    $("avgRtt").textContent = avg === null ? "—" : `${Math.round(avg)} ms`;
    $("observedJitter").textContent = delivered.length ? `${Math.round(observedJitter)} ms` : "—";
    $("lostCount").textContent = `${lostCount} / 20`;
    $("delivery").textContent = `${Math.round(delivered.length / 20 * 100)}%`;
    $("status").textContent = `Simulation complete: ${delivered.length} delivered, ${lostCount} lost. Run again to generate a new sample.`;
    $("packetGrid").innerHTML = samples.map(p=>`<div class="packet ${p.lost?'lost':''}" title="${p.lost?'Packet lost':`RTT ${p.rtt} ms`}">P${String(p.id).padStart(2,'0')}<br>${p.lost?'LOST':p.rtt+'ms'}</div>`).join("");
    const max = Math.max(1, ...samples.filter(p=>!p.lost).map(p=>p.rtt));
    $("bars").innerHTML = samples.map(p=>`<div class="bar-column" title="Packet ${p.id}: ${p.lost?'lost':p.rtt+' ms'}"><div class="bar ${p.lost?'lost':''}" style="height:${p.lost?3:Math.max(4,p.rtt/max*125)}px"></div><span class="bar-label">${p.id}</span></div>`).join("");
    const lines = [];
    if (s.latency >= 150) lines.push("High base latency is likely to make interactive actions feel delayed.");
    else if (s.latency <= 30) lines.push("Low base latency is generally favorable for responsive interactions.");
    else lines.push("The selected base latency represents a moderate delay in this simulation.");
    if (s.jitter >= 40) lines.push("High configured jitter can make arrival times inconsistent, which may affect real-time voice or video.");
    if (lostCount > 0) lines.push(`This sample lost ${lostCount} of 20 packets. A different run may produce a different count because loss is randomized.`);
    else lines.push("No packets were lost in this sample; that does not guarantee future delivery.");
    if (s.bandwidth <= 5) lines.push("Low bandwidth may limit throughput, especially for large transfers. Bandwidth and latency are different properties.");
    else lines.push("Remember: bandwidth is capacity; it is not the same as latency.");
    $("interpretation").innerHTML = lines.map(line=>`<p>${line}</p>`).join("");
  }
  $("run").addEventListener("click", runSimulation);
  updateOutputs();
})(); 
