const $ = id => document.getElementById(id);
const packetCount = $("packetCount");
const lossRate = $("lossRate");
packetCount.addEventListener("input", () => $("packetCountValue").textContent = `${packetCount.value} packets`);
lossRate.addEventListener("input", () => $("lossRateValue").textContent = `${lossRate.value}%`);

function resetLab() {
  $("status").textContent = "READY";
  ["sent","received","lost","retries"].forEach(id => $(id).textContent = "—");
  $("summaryNote").textContent = "Run the simulation to compare protocol behavior.";
  $("packetGrid").innerHTML = '<p class="muted">Your packet results will appear here after running the simulation.</p>';
  $("eventLog").innerHTML = '<p class="muted">No transmission yet.</p>';
}
function runSimulation() {
  const protocol = $("protocol").value;
  const count = Number(packetCount.value);
  const loss = Number(lossRate.value);
  const reorder = $("reorder").checked;
  const isTcp = protocol === "tcp";
  // Deterministic pattern makes each setting reproducible rather than randomly changing on every click.
  const lostIds = new Set();
  for (let i=1; i<=count; i++) {
    if (loss > 0 && ((i * 37 + count * 11) % 100) < loss) lostIds.add(i);
  }
  const arrival = Array.from({length:count}, (_,i)=>i+1);
  if (reorder && count >= 3) {
    [arrival[0],arrival[1]] = [arrival[1],arrival[0]];
    if (count >= 5) [arrival[3],arrival[4]] = [arrival[4],arrival[3]];
  }
  const receivedIds = arrival.filter(id=>!lostIds.has(id));
  const retryIds = isTcp ? [...lostIds] : [];
  const deliveredCount = isTcp ? count : receivedIds.length;
  const totalLost = isTcp ? 0 : lostIds.size;
  $("sent").textContent = count;
  $("received").textContent = deliveredCount;
  $("lost").textContent = totalLost;
  $("retries").textContent = retryIds.length;
  $("status").textContent = "COMPLETE";
  $("summaryNote").textContent = isTcp
    ? `TCP model: ${lostIds.size} initial packet(s) needed retransmission. The simplified model delivers all ${count} packets in order after retries.`
    : `UDP model: ${receivedIds.length} of ${count} datagrams arrived in this simulation. UDP itself does not retransmit lost datagrams.`;
  $("packetGrid").innerHTML = Array.from({length:count},(_,i)=>{
    const id=i+1, wasLost=lostIds.has(id), isRetry=isTcp&&wasLost;
    const arrivedAt=arrival.indexOf(id);
    const outOfOrder=reorder&&arrivedAt!==id-1&&!wasLost;
    const classes = isRetry ? "delivered retried" : wasLost ? "lost" : outOfOrder ? "reordered" : "delivered";
    const label = isRetry ? "RETRIED ✓" : wasLost ? "LOST ✕" : outOfOrder ? `ARRIVED #${arrivedAt+1}` : "DELIVERED";
    return `<div class="packet ${classes}"><b>PKT ${String(id).padStart(2,"0")}</b><span>${label}</span></div>`;
  }).join("");
  const events=[];
  events.push(`<p><b>SEND</b><br>Sender transmitted ${count} simulated ${isTcp?"TCP segments":"UDP datagrams"}.</p>`);
  if (loss===0) events.push(`<p><b>NETWORK</b><br>No packet loss configured for this run.</p>`);
  else events.push(`<p><b>NETWORK</b><br>Loss model marked ${lostIds.size} packet(s) as initially lost.</p>`);
  if (reorder) events.push(`<p><b>ARRIVAL ORDER</b><br>Out-of-order arrival was enabled for this demonstration.</p>`);
  if (isTcp) {
    events.push(`<p><b>TCP RETRANSMISSION</b><br>${retryIds.length} lost packet(s) were retransmitted in the simplified model.</p>`);
    events.push(`<p><b>RECEIVER</b><br>All packets are shown as delivered in order after successful retransmission.</p>`);
  } else {
    events.push(`<p><b>UDP RECEIVER</b><br>${receivedIds.length} datagram(s) arrived; ${totalLost} were not delivered. No retransmissions were performed.</p>`);
  }
  $("eventLog").innerHTML=events.join("");
}
$("runBtn").addEventListener("click",runSimulation);
$("resetBtn").addEventListener("click",resetLab);
