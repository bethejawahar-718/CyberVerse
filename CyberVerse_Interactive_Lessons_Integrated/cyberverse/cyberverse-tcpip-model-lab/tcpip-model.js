(() => {
"use strict";
const $ = id => document.getElementById(id);
const tcpLayers = [
 {n:4,name:"Application",short:"Apps and data services",desc:"Provides network services used by applications, including web requests, name lookups, and email exchange.",examples:["HTTP / HTTPS","DNS","SMTP","SSH"],osi:"OSI Layers 7 Application, 6 Presentation, and 5 Session are usually grouped here in the four-layer TCP/IP model.",tip:"Think: what service does the application need?"},
 {n:3,name:"Transport",short:"Process-to-process delivery",desc:"Supports communication between application processes. Ports identify endpoints; TCP offers reliable ordered delivery, while UDP offers a lightweight datagram service.",examples:["TCP","UDP","Port numbers"],osi:"Closely maps to OSI Layer 4, Transport.",tip:"Think: which process, and what delivery behavior?"},
 {n:2,name:"Internet",short:"Addressing and routing",desc:"Uses IP addressing to move packets between networks. Routers use destination network information to forward traffic.",examples:["IPv4 / IPv6","ICMP","IP routing"],osi:"Closely maps to OSI Layer 3, Network.",tip:"Think: which destination network should the packet reach?"},
 {n:1,name:"Network Access",short:"Local link and signals",desc:"Covers access to the local network medium, including link framing, local addressing, and physical transmission.",examples:["Ethernet","Wi-Fi link functions","MAC addressing","Physical media"],osi:"Combines the main functions of OSI Layer 2, Data Link, and Layer 1, Physical.",tip:"Think: how does data cross this local link and medium?"}
];
const osiMap=[{n:7,name:"Application",answer:4},{n:6,name:"Presentation",answer:4},{n:5,name:"Session",answer:4},{n:4,name:"Transport",answer:3},{n:3,name:"Network",answer:2},{n:2,name:"Data Link",answer:1},{n:1,name:"Physical",answer:1}];
const protocols=[
 {label:"HTTP / HTTPS",answer:4,why:"HTTP and HTTPS are application-layer protocols in the TCP/IP model."},
 {label:"TCP",answer:3,why:"TCP provides transport-layer communication."},
 {label:"IP routing",answer:2,why:"IP addressing and routing belong to the Internet layer."},
 {label:"Ethernet framing",answer:1,why:"Ethernet framing is part of Network Access."},
 {label:"UDP",answer:3,why:"UDP is a transport-layer protocol."}
];
const scenarios=[
 {q:"A web browser uses HTTPS to request a web page. Which TCP/IP layer provides this application service?",a:4,why:"HTTPS is an application-layer protocol."},
 {q:"A device routes an IP packet toward another network. Which TCP/IP layer is most directly involved?",a:2,why:"IP routing belongs to the Internet layer."},
 {q:"A program uses TCP port 443 for a connection. Which TCP/IP layer provides ports and process-to-process transport?",a:3,why:"TCP and its port numbers are associated with the Transport layer."}
];
const quiz=[
 {q:"How many layers are in the common four-layer TCP/IP model?",o:["3","4","5","7"],a:1,e:"The common teaching model has Application, Transport, Internet, and Network Access."},
 {q:"Which TCP/IP layer includes IP addressing and routing?",o:["Application","Transport","Internet","Network Access"],a:2,e:"The Internet layer handles IP packets and routing between networks."},
 {q:"Which two OSI layers are grouped into TCP/IP Network Access in this model?",o:["Layers 1 and 2","Layers 3 and 4","Layers 5 and 6","Layers 6 and 7"],a:0,e:"OSI Physical and Data Link functions are grouped into Network Access."},
 {q:"Which protocol is typically classified in the TCP/IP Transport layer?",o:["HTTP","TCP","IP","Ethernet"],a:1,e:"TCP is a Transport-layer protocol; HTTP is Application, IP is Internet, and Ethernet is Network Access."},
 {q:"Which statement about this lab's packet journey is accurate?",o:["It sends real packets to a server","It scans the local network","It is a browser-based educational simulation","It decrypts live traffic"],a:2,e:"The activity is a visual simulation only and does not interact with live network traffic."}
];
let journeyStep=-1, score=0, scenarioIndex=0, choice=null, checked=false;const solved=new Set();
function renderLayers(){
 const root=$("tcpipLayers");
 tcpLayers.forEach(layer=>{const b=document.createElement("button");b.type="button";b.className="layer-button";b.innerHTML=`<span class="layer-number">L${layer.n}</span><span><span class="layer-name">${layer.name}</span><br><span class="layer-short">${layer.short}</span></span><span>›</span>`;b.addEventListener("click",()=>showLayer(layer.n));root.appendChild(b);});
 showLayer(4);
}
function showLayer(n){
 const layer=tcpLayers.find(x=>x.n===n);document.querySelectorAll(".layer-button").forEach(b=>{const active=b.querySelector(".layer-number").textContent===`L${n}`;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});
 $("layerNumber").textContent=`TCP/IP LAYER ${layer.n}`;$("layerTitle").textContent=layer.name;$("layerDescription").textContent=layer.desc;$("layerMapping").textContent=layer.osi;$("layerTip").textContent=layer.tip;
 const root=$("layerExamples");root.replaceChildren();layer.examples.forEach(x=>{const span=document.createElement("span");span.className="tag";span.textContent=x;root.appendChild(span);});
}
function renderMapping(){
 const root=$("mappingRows");
 osiMap.forEach((item,i)=>{const row=document.createElement("div");row.className="mapping-row";const label=document.createElement("label");label.htmlFor=`map${i}`;label.textContent=`OSI Layer ${item.n} — ${item.name}`;const select=document.createElement("select");select.id=`map${i}`;select.setAttribute("aria-label",`TCP/IP mapping for OSI Layer ${item.n} ${item.name}`);select.add(new Option("Choose TCP/IP layer…",""));tcpLayers.forEach(l=>select.add(new Option(`Layer ${l.n} — ${l.name}`,l.n)));row.append(label,select);root.appendChild(row);});
}
function renderProtocols(){
 const root=$("protocolRows");
 protocols.forEach((item,i)=>{const row=document.createElement("div");row.className="mapping-row";const label=document.createElement("label");label.htmlFor=`protocol${i}`;label.textContent=item.label;const select=document.createElement("select");select.id=`protocol${i}`;select.setAttribute("aria-label",`TCP/IP layer for ${item.label}`);select.add(new Option("Choose a layer…",""));tcpLayers.forEach(l=>select.add(new Option(`Layer ${l.n} — ${l.name}`,l.n)));row.append(label,select);root.appendChild(row);});
}
function gradeRows(items,prefix,feedbackId){
 let correct=0,answered=0;
 items.forEach((item,i)=>{const select=$(`${prefix}${i}`),row=select.closest(".mapping-row");row.classList.remove("correct","incorrect");if(select.value)answered++;const ok=Number(select.value)===item.answer;if(ok)correct++;row.classList.add(ok?"correct":"incorrect");select.title=ok?(item.why||"Correct mapping."):`Correct answer: Layer ${item.answer} — ${tcpLayers.find(l=>l.n===item.answer).name}. ${item.why||""}`;});
 const feedback=$(feedbackId);feedback.textContent=`Score: ${correct}/${items.length}. Answered ${answered}/${items.length}. Green rows are correct.`;feedback.classList.toggle("error",correct<items.length);
}
function resetRows(items,prefix,feedbackId){items.forEach((_,i)=>{const s=$(`${prefix}${i}`);s.value="";s.closest(".mapping-row").classList.remove("correct","incorrect");s.title="";});$(feedbackId).textContent="Complete the activity, then check your answers.";$(feedbackId).classList.remove("error");}
function renderJourney(){const root=$("journeyStack");root.replaceChildren();tcpLayers.forEach((layer,i)=>{const card=document.createElement("div");card.className="journey-layer";if(journeyStep>=i)card.classList.add("visited");if(journeyStep===i)card.classList.add("current");const a=document.createElement("strong");a.textContent=`L${layer.n}`;const b=document.createElement("span");b.textContent=layer.name;card.append(a,b);root.appendChild(card);});$("progressBar").style.width=`${journeyStep<0?0:(journeyStep+1)/4*100}%`;}
function startJourney(){const message=$("sampleMessage").value.trim();if(!message){$("journeyStatus").textContent="Enter a sample message first.";return;}journeyStep=-1;$("startJourney").disabled=true;$("nextJourney").disabled=false;$("journeyStatus").textContent="Journey started. Advance one layer at a time.";$("packetTitle").textContent="Application data ready";$("packetDescription").textContent=`Sample payload: “${message}”. This is a simulation; no real traffic is sent.`;renderJourney();}
function nextJourney(){if(journeyStep>=3)return;journeyStep++;const layer=tcpLayers[journeyStep];showLayer(layer.n);renderJourney();const desc=[
"The application creates the sample data. Examples include HTTP requests and DNS queries; this page does not send either.",
"The transport role represents process-to-process delivery. TCP/UDP headers and ports are not actually constructed here.",
"The Internet role represents IP addressing and routing. No real IP packet or route lookup is created.",
"Network Access represents local link framing and transmission media. No Ethernet frame, radio signal, or physical transmission is generated."
];$("packetTitle").textContent=`Layer ${layer.n}: ${layer.name}`;$("packetDescription").textContent=desc[journeyStep];$("journeyStatus").textContent=`Step ${journeyStep+1} of 4 · ${layer.name}`;if(journeyStep===3){$("nextJourney").disabled=true;$("journeyStatus").textContent="Simulation complete. You reviewed all four layers; no real network transmission occurred.";}}
function resetJourney(){journeyStep=-1;$("startJourney").disabled=false;$("nextJourney").disabled=true;$("journeyStatus").textContent="Ready to begin the simulated journey.";$("packetTitle").textContent="Waiting for the first layer";$("packetDescription").textContent="Start the journey to see how the TCP/IP model organizes communication.";renderJourney();}
function renderScenario(){const item=scenarios[scenarioIndex];$("scenarioNumber").textContent=`SCENARIO ${String(scenarioIndex+1).padStart(2,"0")} / 03`;$("scenarioQuestion").textContent=item.q;const root=$("scenarioOptions");root.replaceChildren();choice=null;checked=false;tcpLayers.forEach((layer,i)=>{const b=document.createElement("button");b.type="button";b.className="scenario-option";b.innerHTML=`<span class="option-letter">${String.fromCharCode(65+i)}</span><span>Layer ${layer.n} — ${layer.name}</span>`;b.addEventListener("click",()=>{if(checked)return;choice=layer.n;root.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");});root.appendChild(b);});$("checkScenario").disabled=false;$("nextScenario").disabled=true;$("nextScenario").textContent=scenarioIndex===2?"Finish challenge":"Next scenario →";$("scenarioFeedback").textContent="Choose a layer, then check your answer.";$("scenarioFeedback").classList.remove("error");}
function checkScenario(){if(checked)return;if(choice===null){$("scenarioFeedback").textContent="Select a layer first.";$("scenarioFeedback").classList.add("error");return;}checked=true;const item=scenarios[scenarioIndex];const ok=choice===item.a;[...$("scenarioOptions").children].forEach((b,i)=>{const n=tcpLayers[i].n;if(n===item.a)b.classList.add("correct");else if(n===choice)b.classList.add("incorrect");});if(ok){if(!solved.has(scenarioIndex)){score+=10;solved.add(scenarioIndex);$("score").textContent=score;}$("scenarioFeedback").textContent=`Correct! +10 points. ${item.why}`;$("scenarioFeedback").classList.remove("error");}else{$("scenarioFeedback").textContent=`Not quite. ${item.why}`;$("scenarioFeedback").classList.add("error");}$("checkScenario").disabled=true;$("nextScenario").disabled=false;}
function nextScenario(){if(!checked)return;if(scenarioIndex<2){scenarioIndex++;renderScenario();}else{$("scenarioFeedback").textContent=`Challenge complete: ${solved.size}/3 scenarios solved correctly. You earned ${solved.size*10} of 30 possible points.`;$("nextScenario").disabled=true;$("checkScenario").disabled=true;}}
function resetScenario(){scenarioIndex=0;score=0;solved.clear();$("score").textContent="0";renderScenario();}
function renderQuiz(){quiz.forEach((item,i)=>{const wrap=document.createElement("div");wrap.className="quiz-question";const fs=document.createElement("fieldset"),legend=document.createElement("legend");legend.textContent=`${i+1}. ${item.q}`;fs.appendChild(legend);item.o.forEach((text,j)=>{const label=document.createElement("label");label.className="quiz-option";const input=document.createElement("input");input.type="radio";input.name=`quiz${i}`;input.value=j;const span=document.createElement("span");span.textContent=text;label.append(input,span);fs.appendChild(label);});const explain=document.createElement("p");explain.id=`quizExplain${i}`;explain.className="muted small";explain.hidden=true;wrap.append(fs,explain);$("quizQuestions").appendChild(wrap);});}
function checkQuiz(){let correct=0,answered=0;quiz.forEach((item,i)=>{const answer=document.querySelector(`input[name="quiz${i}"]:checked`),wrap=document.querySelectorAll(".quiz-question")[i],explain=$(`quizExplain${i}`);wrap.classList.remove("correct","incorrect");const ok=!!answer&&Number(answer.value)===item.a;if(answer)answered++;if(ok)correct++;wrap.classList.add(ok?"correct":"incorrect");explain.textContent=`${ok?"Correct. ":answer?"Review: ":"Not answered. "}${item.e}`;explain.hidden=false;});$("quizFeedback").textContent=`Quiz score: ${correct}/5. Answered ${answered}/5. Review the explanations below each question.`;$("quizFeedback").classList.toggle("error",correct<5);}
$("checkMapping").addEventListener("click",()=>gradeRows(osiMap,"map","mappingFeedback"));$("resetMapping").addEventListener("click",()=>resetRows(osiMap,"map","mappingFeedback"));
$("checkProtocols").addEventListener("click",()=>gradeRows(protocols,"protocol","protocolFeedback"));$("resetProtocols").addEventListener("click",()=>resetRows(protocols,"protocol","protocolFeedback"));
$("startJourney").addEventListener("click",startJourney);$("nextJourney").addEventListener("click",nextJourney);$("resetJourney").addEventListener("click",resetJourney);
$("checkScenario").addEventListener("click",checkScenario);$("nextScenario").addEventListener("click",nextScenario);$("resetScenario").addEventListener("click",resetScenario);$("checkQuiz").addEventListener("click",checkQuiz);
renderLayers();renderMapping();renderProtocols();renderJourney();renderScenario();renderQuiz();
})();