const $ = (id) => document.getElementById(id);
const protocolEl = $("protocol"), packetCountEl = $("packetCount"), lossRateEl = $("lossRate"), scenarioEl = $("scenario");
const quizData = [
  {q:"Which protocol includes a three-way handshake before data transfer?", a:["UDP","TCP","Both always"], correct:1},
  {q:"What does UDP do by default when a datagram is lost?", a:["Retransmits it automatically","Waits for an ACK","Does not provide built-in retransmission"], correct:2},
  {q:"Which is usually a sensible fit for a time-sensitive live stream?", a:["UDP","TCP only","ARP"], correct:0}
];
const scenarioLabels = {file:"File transfer",video:"Live video stream",game:"Online game update",dns:"DNS lookup"};
let events = [], packetMarks = [], stats = {sent:0,delivered:0,lost:0,retries:0};
function addEvent(message, tag="INFO", type="") { events.push({message,tag,type}); }
function renderLog() {
  const log = $("eventLog");
  $("logCount").textContent = `${events.length} event${events.length===1?"":"s"}`;
  if (!events.length) { log.innerHTML = '<div class="empty-state">Run the simulation to inspect the packet events.</div>'; return; }
  log.innerHTML = events.map((e,i)=>`<div class="event ${e.type}"><span class="time">EVT-${String(i+1).padStart(2,"0")}</span><span class="msg">${e.message}</span><span class="tag">${e.tag}</span></div>`).join("");
}
function renderStats() {
  $("sentStat").textContent = stats.sent;
  $("deliveredStat").textContent = stats.delivered;
  $("lostStat").textContent = stats.lost;
  $("retryStat").textContent = stats.retries;
  const pct = stats.sent ? Math.round(stats.delivered / Math.max(1, Number(packetCountEl.value)) * 100) : 0;
  $("deliveryPct").textContent = `${Math.min(100,pct)}%`;
  $("progressBar").style.width = `${Math.min(100,pct)}%`;
  $("packetTrack").innerHTML = packetMarks.map(p=>`<span class="packet ${p.type}" title="${p.title}">${p.label}</span>`).join("");
}
function renderProtocol() {
  const tcp = protocolEl.value === "tcp";
  const chip = $("protocolChip");
  chip.textContent = tcp ? "TCP" : "UDP";
  chip.className = `pill ${tcp ? "reliable" : "fast"}`;
  $("journeyTitle").textContent = tcp ? "Connection-oriented transfer" : "Connectionless datagrams";
  $("laneMiddle").textContent = tcp ? "Segments + ACKs" : "Datagrams";
}
function reset() {
  events=[]; packetMarks=[]; stats={sent:0,delivered:0,lost:0,retries:0};
  renderProtocol(); renderLog(); renderStats();
  $("runStatus").textContent="Ready to simulate";
}
function runSimulation() {
  reset();
  const tcp = protocolEl.value === "tcp";
  const count = Number(packetCountEl.value);
  const loss = Number(lossRateEl.value) / 100;
  const scenario = scenarioLabels[scenarioEl.value];
  $("runStatus").textContent = "Simulation complete";
  addEvent(`Scenario: ${scenario}. Configured packet loss: ${Math.round(loss*100)}%.`, "SETUP");
  if (tcp) {
    addEvent("Client sends SYN to request a connection.", "SYN", "handshake");
    addEvent("Server responds with SYN-ACK.", "SYN-ACK", "handshake");
    addEvent("Client sends ACK. Connection is established.", "ACK", "handshake");
  } else {
    addEvent("No connection handshake is performed; sender can begin sending datagrams.", "NO HANDSHAKE", "handshake");
  }
  for (let i=1; i<=count; i++) {
    const isLost = Math.random() < loss;
    stats.sent++;
    if (tcp) {
      addEvent(`Client sends segment ${i} with sequence number ${i}.`, `SEQ ${i}`);
      if (isLost) {
        stats.lost++;
        addEvent(`Segment ${i} is lost. Receiver does not acknowledge it; sender detects a missing ACK.`, "LOSS", "loss");
        stats.sent++;
        stats.retries++;
        stats.delivered++;
        packetMarks.push({label:`R${i}`,type:"retry",title:`Segment ${i} retransmitted and delivered`});
        addEvent(`TCP retransmits segment ${i}; receiver acknowledges it.`, "RETRY + ACK", "retry-event");
      } else {
        stats.delivered++;
        packetMarks.push({label:String(i),type:"",title:`Segment ${i} delivered`});
        addEvent(`Receiver gets segment ${i} and returns an ACK.`, "ACK");
      }
    } else if (isLost) {
      stats.lost++;
      packetMarks.push({label:`×${i}`,type:"lost",title:`Datagram ${i} lost`});
      addEvent(`Datagram ${i} is dropped. UDP does not automatically retry or request an ACK.`, "DROPPED", "loss");
    } else {
      stats.delivered++;
      packetMarks.push({label:String(i),type:"",title:`Datagram ${i} delivered`});
      addEvent(`Datagram ${i} arrives. No built-in delivery acknowledgement is sent.`, "ARRIVED");
    }
  }
  if (tcp) addEvent("TCP provides an ordered reliable byte stream; this simplified model focuses on loss and retransmission.", "SUMMARY");
  else addEvent("UDP keeps overhead low, but this simulation does not add application-level recovery.", "SUMMARY");
  renderLog(); renderStats();
}
function renderQuiz() {
  $("quiz").innerHTML = quizData.map((item,i)=>`<article class="question"><p>${i+1}. ${item.q}</p>${item.a.map((answer,j)=>`<label class="answer"><input type="radio" name="q${i}" value="${j}"><span>${answer}</span></label>`).join("")}</article>`).join("");
}
$("runBtn").addEventListener("click", runSimulation);
$("resetBtn").addEventListener("click", reset);
protocolEl.addEventListener("change", ()=>{renderProtocol();});
packetCountEl.addEventListener("input", ()=>{$("packetCountOut").textContent=packetCountEl.value;});
lossRateEl.addEventListener("input", ()=>{$("lossOut").textContent=`${lossRateEl.value}%`;});
$("checkQuiz").addEventListener("click", ()=>{
  let score=0, answered=0;
  quizData.forEach((q,i)=>{const chosen=document.querySelector(`input[name="q${i}"]:checked`); if(chosen){answered++;if(Number(chosen.value)===q.correct)score++;}});
  $("quizResult").textContent = answered < quizData.length ? `Answered ${answered}/${quizData.length}. Complete all questions to check your score.` : `Score: ${score}/${quizData.length} ${score===quizData.length?"— excellent!": "— review the protocol cards and try again."}`;
});
renderQuiz(); reset();
