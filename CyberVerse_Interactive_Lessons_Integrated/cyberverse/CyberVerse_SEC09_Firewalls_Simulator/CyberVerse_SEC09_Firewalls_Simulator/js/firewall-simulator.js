const $ = (id) => document.getElementById(id);

const initialRules = [
  {direction:"Inbound", protocol:"TCP", port:"443", action:"ALLOW"},
  {direction:"Outbound", protocol:"Any", port:"Any", action:"ALLOW"},
  {direction:"Inbound", protocol:"Any", port:"3389", action:"BLOCK"}
];
let rules = initialRules.map(r => ({...r}));
const traffic = [
  {id:1,name:"Secure website request",direction:"Outbound",protocol:"TCP",port:"443",ip:"192.0.2.10"},
  {id:2,name:"Unrequested remote desktop",direction:"Inbound",protocol:"TCP",port:"3389",ip:"198.51.100.24"},
  {id:3,name:"DNS lookup",direction:"Outbound",protocol:"UDP",port:"53",ip:"192.0.2.10"},
  {id:4,name:"Incoming secure web connection",direction:"Inbound",protocol:"TCP",port:"443",ip:"203.0.113.8"},
  {id:5,name:"Unapproved SSH connection",direction:"Inbound",protocol:"TCP",port:"22",ip:"198.51.100.77"},
  {id:6,name:"Outgoing web service request",direction:"Outbound",protocol:"TCP",port:"8080",ip:"192.0.2.10"}
];
let tested = new Map();

function matches(rule, packet){
  return (rule.direction==="Any" || rule.direction===packet.direction) &&
    (rule.protocol==="Any" || rule.protocol===packet.protocol) &&
    (rule.port==="Any" || rule.port===packet.port);
}
function decide(packet){
  const index = rules.findIndex(rule => matches(rule,packet));
  return {action:index===-1 ? "BLOCK" : rules[index].action, reason:index===-1 ? "No rule matched — default deny" : `Matched rule ${index+1}`};
}
function renderRules(){
  $("rulesList").innerHTML = rules.length ? rules.map((r,i)=>`
    <div class="rule-row"><span class="rule-detail"><b>#${i+1}</b> · ${r.direction} · ${r.protocol} · Port ${r.port}</span>
    <span class="rule-action ${r.action==="ALLOW"?"allow":"block"}">${r.action}</span></div>`).join("") : '<div class="empty-state">No custom rules. Default action will block all traffic.</div>';
}
function renderTraffic(){
  $("trafficList").innerHTML = traffic.map(p=>`
    <div class="traffic-row"><div class="traffic-detail"><strong>${p.name}</strong><small>${p.direction} · ${p.protocol} · Port ${p.port} · Source ${p.ip}</small></div>
    <button data-test="${p.id}" ${tested.has(p.id)?"disabled":""}>${tested.has(p.id)?"TESTED":"TEST"}</button></div>`).join("");
  $("testCount").textContent = `${tested.size} / ${traffic.length} tested`;
  document.querySelectorAll("[data-test]").forEach(btn=>btn.addEventListener("click",()=>testOne(Number(btn.dataset.test))));
}
function renderResults(){
  if(!tested.size){$("results").className="empty-state";$("results").textContent="Run the traffic tests to see which connections are allowed or blocked.";return;}
  $("results").className="";
  $("results").innerHTML = traffic.filter(p=>tested.has(p.id)).map(p=>{
    const r=tested.get(p.id);
    return `<div class="result-row"><div><b>${p.name}</b><small>${p.direction} / ${p.protocol} / Port ${p.port} — ${r.reason}</small></div><span class="result-pill ${r.action==="ALLOW"?"allow":"block"}">${r.action}</span></div>`;
  }).join("");
}
function testOne(id){const p=traffic.find(x=>x.id===id);tested.set(id,decide(p));renderTraffic();renderResults();}
$("addRule").addEventListener("click",()=>{
  rules.push({direction:$("direction").value,protocol:$("protocol").value,port:$("port").value,action:$("action").value});
  tested.clear();renderRules();renderTraffic();renderResults();
});
$("resetRules").addEventListener("click",()=>{rules=initialRules.map(r=>({...r}));tested.clear();renderRules();renderTraffic();renderResults();});
$("testAll").addEventListener("click",()=>{traffic.forEach(p=>tested.set(p.id,decide(p)));renderTraffic();renderResults();});
$("clearResults").addEventListener("click",()=>{tested.clear();renderTraffic();renderResults();});

document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t===tab));
  document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id===tab.dataset.tab));
}));

const questions=[
 {q:"What is the main purpose of a firewall?",o:["Increase internet speed","Monitor and filter network traffic using rules","Create user passwords","Store website files"],a:1,e:"A firewall applies security rules to decide which network traffic is allowed or blocked."},
 {q:"What does inbound traffic mean?",o:["Data leaving a device","Data entering a device or network","A file saved offline","A type of password"],a:1,e:"Inbound traffic is traffic coming into a device or network."},
 {q:"What happens with a default-deny policy when no rule matches?",o:["Traffic is allowed","Traffic is encrypted","Traffic is blocked","The device shuts down"],a:2,e:"Default deny blocks traffic unless a rule explicitly allows it."},
 {q:"Which item commonly identifies a service endpoint?",o:["Port number","Screen brightness","File extension","Monitor size"],a:0,e:"Port numbers help identify application or service endpoints, such as TCP 443 for HTTPS."},
 {q:"Why are firewall logs useful?",o:["They replace all security controls","They help review allowed and blocked traffic events","They automatically repair hardware","They increase storage capacity"],a:1,e:"Logs provide records that administrators can review when monitoring and troubleshooting network activity."}
];
let qIndex=0, answers=Array(questions.length).fill(null), submitted=false;
function renderQuiz(){
 const q=questions[qIndex];
 $("quizProgressText").textContent=`Question ${qIndex+1} of ${questions.length}`;
 $("quizScore").textContent=`Score: ${answers.filter((a,i)=>a===questions[i].a).length}`;
 $("quizProgress").style.width=`${((qIndex+1)/questions.length)*100}%`;
 $("quizArea").innerHTML=`<div class="question-card"><div class="question-number">QUESTION ${String(qIndex+1).padStart(2,"0")}</div><h3>${q.q}</h3>${q.o.map((opt,i)=>`<label class="option ${answers[qIndex]===i?"selected":""}"><input type="radio" name="answer" value="${i}" ${answers[qIndex]===i?"checked":""} ${submitted?"disabled":""}>${opt}</label>`).join("")}</div>`;
 document.querySelectorAll('input[name="answer"]').forEach(input=>input.addEventListener("change",()=>{answers[qIndex]=Number(input.value);renderQuiz();}));
 $("prevQuestion").disabled=qIndex===0;
 $("nextQuestion").textContent=qIndex===questions.length-1?"Submit quiz":"Next question";
 $("quizFeedback").textContent="";
}
$("prevQuestion").addEventListener("click",()=>{if(qIndex>0){qIndex--;renderQuiz();}});
$("nextQuestion").addEventListener("click",()=>{
 if(!submitted && answers[qIndex]===null){$("quizFeedback").textContent="Please select an answer before continuing.";return;}
 if(qIndex<questions.length-1){qIndex++;renderQuiz();return;}
 if(!submitted){submitted=true;const score=answers.filter((a,i)=>a===questions[i].a).length;
 $("quizArea").innerHTML=`<div class="question-card"><div class="eyebrow">QUIZ COMPLETE</div><h3>You scored ${score} out of ${questions.length}</h3><p class="muted">${score>=4?"Great work! You understand the key firewall concepts.":"Review the explanations and try again to strengthen your understanding."}</p>${questions.map((q,i)=>`<p><b>${i+1}. ${q.o[q.a]}</b><br><span class="muted">${q.e}</span></p>`).join("")}</div>`;
 $("quizFeedback").textContent="Your result is shown above.";
 $("quizProgress").style.width="100%";$("quizProgressText").textContent="Completed";
 $("quizScore").textContent=`Score: ${score}/${questions.length}`;
 $("prevQuestion").classList.add("hidden");$("nextQuestion").classList.add("hidden");$("restartQuiz").classList.remove("hidden");
 }
});
$("restartQuiz").addEventListener("click",()=>{qIndex=0;answers=Array(questions.length).fill(null);submitted=false;$("prevQuestion").classList.remove("hidden");$("nextQuestion").classList.remove("hidden");$("restartQuiz").classList.add("hidden");renderQuiz();});
renderRules();renderTraffic();renderResults();renderQuiz();
