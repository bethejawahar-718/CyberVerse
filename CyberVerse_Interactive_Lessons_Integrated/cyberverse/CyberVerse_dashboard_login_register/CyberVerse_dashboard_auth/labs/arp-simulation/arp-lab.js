(() => {
"use strict";
const $ = id => document.getElementById(id);
const devices = {
 alpha:{name:"PC Alpha",ip:"192.168.1.10",mac:"02:AA:00:00:00:10",element:"device-pc-a"},
 bravo:{name:"PC Bravo",ip:"192.168.1.20",mac:"02:BB:00:00:00:20",element:"device-pc-b"},
 printer:{name:"Printer",ip:"192.168.1.30",mac:"02:CC:00:00:00:30",element:"device-printer"},
 charlie:{name:"PC Charlie",ip:"192.168.1.40",mac:"02:DD:00:00:00:40",element:"device-pc-c"}
};
let caches={alpha:new Map(),bravo:new Map(),printer:new Map(),charlie:new Map()};
let stats={hits:0,misses:0,sent:0};
let sequence=[],stepIndex=0,activeSource="alpha",activeDestination="bravo",challengeIndex=0,challengeScore=0,solved=new Set();
const challenges=[
 {topic:"ARP cache",q:"PC Alpha has no entry for 192.168.1.20. What happens first when it needs the destination MAC?",options:["It broadcasts an ARP request on the local network","It sends a DNS query for the MAC address","It guesses a MAC address","It sends an ARP reply"],a:0,explain:"With a cache miss, the host broadcasts an ARP request asking which local device owns the target IPv4 address."},
 {topic:"Cache hit",q:"PC Alpha already has a valid ARP entry for PC Bravo. What is the expected result?",options:["It must broadcast every time","It can use the cached MAC without a new ARP request","The IP address changes","The switch replies on behalf of the host"],a:1,explain:"A cache hit lets the sender use the known IP-to-MAC mapping, avoiding a new ARP exchange for that entry."},
 {topic:"ARP reply",q:"Which device normally sends the ARP reply when asked for its own IPv4 address?",options:["Every device on the internet","The matching destination device","The DNS server","Only the switch"],a:1,explain:"The device that owns the requested local IPv4 address responds with its MAC address."},
 {topic:"MAC address",q:"What kind of address does ARP resolve for an IPv4 local-link destination?",options:["A domain name","An IPv6 prefix","A link-layer MAC address","A TCP port"],a:2,explain:"ARP maps an IPv4 address to a link-layer address, usually an Ethernet MAC address, on the local network."}
];
const quiz=[
 {q:"What is the main purpose of ARP in an IPv4 local network?",o:["Resolve an IPv4 address to a link-layer address","Assign a DNS name","Encrypt Ethernet frames","Route packets between continents"],a:0,e:"ARP discovers the MAC address associated with a local IPv4 address."},
 {q:"What destination MAC address is used by a standard Ethernet ARP request?",o:["The requested device's unicast MAC","FF:FF:FF:FF:FF:FF broadcast","00:00:00:00:00:00 as a destination","The router's MAC in every case"],a:1,e:"An ARP request is broadcast on the local link so devices can inspect the target protocol address."},
 {q:"What does an ARP cache store?",o:["Passwords","Only web page contents","IP-to-MAC mappings","Wi-Fi encryption keys"],a:2,e:"An ARP cache keeps recently learned mappings between IPv4 addresses and link-layer addresses."},
 {q:"What is a cache miss in this lab?",o:["The destination is switched off for sure","No matching mapping is found in the source cache","The MAC address is a domain name","The sender has no IP address"],a:1,e:"A cache miss means the sender lacks the needed mapping and must resolve it in the simulated exchange."},
 {q:"Does this CyberVerse lab send real ARP packets on your network?",o:["Yes, it scans the LAN","Yes, but only broadcasts","No, it is a browser-based educational simulation","Only when the quiz is submitted"],a:2,e:"All frames and cache entries in this lab are simulated locally; no real packets or discovery are performed."}
];
function text(id,value){$(id).textContent=value;}
function setFeedback(id,message,error=false){text(id,message);$(id).classList.toggle("error",error);}
function clearHighlights(){Object.values(devices).forEach(d=>$(d.element).classList.remove("active"));}
function renderCache(){
 const map=caches[activeSource],body=$("arpTableBody");body.replaceChildren();
 text("cacheCount",`${map.size} ${map.size===1?"entry":"entries"}`);
 if(!map.size){const tr=document.createElement("tr"),td=document.createElement("td");td.colSpan=4;td.className="empty-cell";td.textContent="No entries yet. Send a simulated message to populate the cache.";tr.appendChild(td);body.appendChild(tr);return;}
 for(const [ip,entry] of map){const tr=document.createElement("tr");[ip,entry.mac].forEach((v,i)=>{const td=document.createElement("td");if(i===1){const code=document.createElement("code");code.textContent=v;td.appendChild(code);}else td.textContent=v;tr.appendChild(td);});const state=document.createElement("td"),pill=document.createElement("span");pill.className="state-pill";pill.textContent="RESOLVED";state.appendChild(pill);tr.appendChild(state);const learned=document.createElement("td");learned.textContent=entry.learnedBy;tr.appendChild(learned);body.appendChild(tr);}
}
function renderStats(){text("cacheHits",stats.hits);text("cacheMisses",stats.misses);text("messagesSent",stats.sent);}
function renderTimeline(){const root=$("timeline");root.replaceChildren();if(!sequence.length){const li=document.createElement("li");li.className="timeline-empty";li.textContent="Your simulated ARP exchange will appear here.";root.appendChild(li);text("sequenceStatus","No sequence started.");$("stepSequence").disabled=true;$("playAgain").disabled=true;return;}
 sequence.forEach((item,i)=>{if(i>stepIndex)return;const li=document.createElement("li");li.className="done";const no=document.createElement("span");no.className="step-no";no.textContent=String(i+1).padStart(2,"0");const content=document.createElement("div"),type=document.createElement("span");type.className="frame-type";type.textContent=item.type;const title=document.createElement("strong");title.textContent=item.title;const p=document.createElement("p");p.textContent=item.detail;content.append(type,title,p);li.append(no,content);root.appendChild(li);});
 const finished=stepIndex>=sequence.length-1;text("sequenceStatus",finished?"Sequence complete.":`Step ${stepIndex+1} of ${sequence.length}`);$("stepSequence").disabled=finished;$("playAgain").disabled=false;
}
function buildSequence(src,dst,hit,message){
 const payload=message.trim()||"(empty sample message)";
 if(hit)return [
  {type:"CACHE HIT",title:`${src.name} checks its ARP cache`,detail:`A cached entry maps ${dst.ip} to ${dst.mac}. No ARP request is needed in this simulated exchange.`},
  {type:"SIMULATED ETHERNET FRAME",title:`${src.name} sends the sample message`,detail:`Destination MAC: ${dst.mac}. Sample payload: “${payload}”. This frame is simulated and is not transmitted.`},
  {type:"SIMULATED DELIVERY",title:`${dst.name} receives the sample message`,detail:`The local simulation marks the message as delivered to ${dst.name} (${dst.ip}). No real host was contacted.`}
 ];
 return [
  {type:"CACHE MISS",title:`${src.name} looks up ${dst.ip}`,detail:"No matching IP-to-MAC entry exists in the selected source device's simulated ARP cache."},
  {type:"ARP REQUEST · BROADCAST",title:`${src.name} asks “Who has ${dst.ip}?”`,detail:`Simulated request: sender ${src.ip} / ${src.mac}; target protocol address ${dst.ip}. Ethernet destination: FF:FF:FF:FF:FF:FF.`},
  {type:"LOCAL-LINK CHECK",title:`Devices inspect the request`,detail:`The other simulated devices compare the target IPv4 address. ${dst.name} is the matching owner; the other devices do not reply in this scenario.`},
  {type:"ARP REPLY · UNICAST",title:`${dst.name} replies with its MAC address`,detail:`Simulated reply: ${dst.ip} is at ${dst.mac}. The reply is represented as a unicast response to ${src.name}.`},
  {type:"CACHE UPDATE",title:`${src.name} saves the mapping`,detail:`The simulated cache adds ${dst.ip} → ${dst.mac}, so a later message can use a cache hit.`},
  {type:"SIMULATED ETHERNET FRAME",title:`${src.name} sends the sample message`,detail:`Destination MAC: ${dst.mac}. Sample payload: “${payload}”. This frame is simulated and is not transmitted.`},
  {type:"SIMULATED DELIVERY",title:`${dst.name} receives the sample message`,detail:`The local simulation marks the message as delivered to ${dst.name} (${dst.ip}). No real host was contacted.`}
 ];
}
function sendMessage(){
 const source=$("sourceDevice").value,dest=$("destinationDevice").value;
 if(source===dest){setFeedback("topologyFeedback","Choose two different devices for a message.",true);return;}
 const src=devices[source],dst=devices[dest],map=caches[source],hit=map.has(dst.ip);
 activeSource=source;activeDestination=dest;
 if(hit)stats.hits++;else{stats.misses++;map.set(dst.ip,{mac:dst.mac,learnedBy:"Simulated ARP reply"});}
 stats.sent++;sequence=buildSequence(src,dst,hit,$("messageText").value);stepIndex=0;
 clearHighlights();$(src.element).classList.add("active");$(dst.element).classList.add("active");
 renderCache();renderStats();renderTimeline();
 setFeedback("topologyFeedback",hit?`Cache hit: ${src.name} already knows ${dst.name}'s MAC. The simulated message is ready.`:`Cache miss: simulated ARP request/reply completed. ${src.name} learned ${dst.ip} → ${dst.mac}.`);
}
function resetLab(){caches={alpha:new Map(),bravo:new Map(),printer:new Map(),charlie:new Map()};stats={hits:0,misses:0,sent:0};sequence=[];stepIndex=0;activeSource=$("sourceDevice").value;clearHighlights();renderCache();renderStats();renderTimeline();setFeedback("topologyFeedback","Lab reset. All simulated ARP caches are empty.");}
function renderChallenge(){const c=challenges[challengeIndex];text("challengeCounter",`CHALLENGE ${String(challengeIndex+1).padStart(2,"0")} / ${challenges.length}`);text("challengeTopic",c.topic);text("challengeQuestion",c.q);const root=$("challengeOptions");root.replaceChildren();c.options.forEach((opt,i)=>{const label=document.createElement("label");label.className="challenge-option";const input=document.createElement("input");input.type="radio";input.name="challengeAnswer";input.value=String(i);const span=document.createElement("span");span.textContent=opt;label.append(input,span);root.appendChild(label);});$("checkChallenge").disabled=false;$("nextChallenge").disabled=true;setFeedback("challengeFeedback","Choose an answer, then check it.");}
function checkChallenge(){const answer=document.querySelector('input[name="challengeAnswer"]:checked');if(!answer){setFeedback("challengeFeedback","Choose an answer before checking.",true);return;}const c=challenges[challengeIndex],ok=Number(answer.value)===c.a;if(ok){if(!solved.has(challengeIndex)){solved.add(challengeIndex);challengeScore+=10;text("challengeScore",challengeScore);}setFeedback("challengeFeedback",`Correct! ${c.explain}`);}else setFeedback("challengeFeedback",`Not quite. ${c.explain}`,true);$("checkChallenge").disabled=true;$("nextChallenge").disabled=false;}
function nextChallenge(){if(challengeIndex<challenges.length-1){challengeIndex++;renderChallenge();}else{setFeedback("challengeFeedback",`Challenge set complete: ${solved.size}/${challenges.length} correct. Score: ${challengeScore}/${challenges.length*10}.`);$("nextChallenge").disabled=true;}}
function resetChallenge(){challengeIndex=0;challengeScore=0;solved.clear();text("challengeScore","0");renderChallenge();}
function renderQuiz(){const root=$("quizQuestions");root.replaceChildren();quiz.forEach((item,i)=>{const wrap=document.createElement("div");wrap.className="quiz-question";const fs=document.createElement("fieldset"),legend=document.createElement("legend");legend.textContent=`${i+1}. ${item.q}`;fs.appendChild(legend);item.o.forEach((option,j)=>{const label=document.createElement("label");label.className="quiz-option";const input=document.createElement("input");input.type="radio";input.name=`quiz${i}`;input.value=String(j);const span=document.createElement("span");span.textContent=option;label.append(input,span);fs.appendChild(label);});const explanation=document.createElement("p");explanation.className="quiz-explanation";explanation.id=`quizExplanation${i}`;explanation.hidden=true;wrap.append(fs,explanation);root.appendChild(wrap);});}
function checkQuiz(){let correct=0,answered=0;quiz.forEach((item,i)=>{const answer=document.querySelector(`input[name="quiz${i}"]:checked`),wrap=document.querySelectorAll(".quiz-question")[i],explain=$(`quizExplanation${i}`);wrap.classList.remove("correct","incorrect");const ok=!!answer&&Number(answer.value)===item.a;if(answer)answered++;if(ok)correct++;wrap.classList.add(ok?"correct":"incorrect");explain.textContent=`${ok?"Correct. ":answer?"Review. ":"Not answered. "}${item.e}`;explain.hidden=false;});setFeedback("quizFeedback",`Quiz score: ${correct}/5. Answered ${answered}/5. Review the explanations below each question.`,correct<5);}
function resetQuiz(){renderQuiz();setFeedback("quizFeedback","Answer the questions, then check your work.");}
$("sendMessage").addEventListener("click",sendMessage);
$("sourceDevice").addEventListener("change",()=>{activeSource=$("sourceDevice").value;renderCache();});
$("clearCache").addEventListener("click",()=>{caches[$("sourceDevice").value].clear();activeSource=$("sourceDevice").value;renderCache();setFeedback("topologyFeedback",`Cleared ${devices[activeSource].name}'s simulated ARP cache. Send the message again to observe a cache miss.`);});
$("resetLab").addEventListener("click",resetLab);
$("stepSequence").addEventListener("click",()=>{if(stepIndex<sequence.length-1){stepIndex++;renderTimeline();}});
$("playAgain").addEventListener("click",()=>{if(sequence.length){stepIndex=0;renderTimeline();}});
$("checkChallenge").addEventListener("click",checkChallenge);$("nextChallenge").addEventListener("click",nextChallenge);$("resetChallenge").addEventListener("click",resetChallenge);
$("checkQuiz").addEventListener("click",checkQuiz);$("resetQuiz").addEventListener("click",resetQuiz);
renderCache();renderStats();renderTimeline();renderChallenge();renderQuiz();
})();