(() => {
"use strict";
const $ = id => document.getElementById(id);
const layers = [
 {n:7,name:"Application",short:"User services",desc:"Provides network services that applications use. It is the layer closest to the user's network-facing software.",examples:["HTTP","HTTPS","DNS","SMTP"],pdu:"Data",tip:"Think: what network service does the app need?"},
 {n:6,name:"Presentation",short:"Data format",desc:"Represents, formats, encodes, compresses, or transforms data so communicating systems can interpret it.",examples:["Character encoding","JPEG","Data serialization","TLS*"],pdu:"Data",tip:"Think: how is the information represented? *TLS is commonly associated with this function, though real stacks do not map perfectly to OSI."},
 {n:5,name:"Session",short:"Dialog control",desc:"Describes establishing, managing, and ending communication sessions or dialogs between applications.",examples:["Session control","Dialog checkpoints","RPC session concepts"],pdu:"Data",tip:"Think: how is the conversation managed? Real protocols may combine session functions with other layers."},
 {n:4,name:"Transport",short:"End-to-end delivery",desc:"Supports communication between application processes. Depending on the protocol, it may provide ports, segmentation, reliability, ordering, and flow control.",examples:["TCP","UDP"],pdu:"Segment (TCP) / Datagram (UDP)",tip:"Think: which application process, and what delivery behavior?"},
 {n:3,name:"Network",short:"Logical addressing",desc:"Moves packets between networks using logical addressing and routing decisions.",examples:["IP","ICMP","Routers (routing function)"],pdu:"Packet",tip:"Think: which network should the packet travel to?"},
 {n:2,name:"Data Link",short:"Local delivery",desc:"Transfers frames across a local link and uses link-layer addressing and error detection. Switches commonly forward Ethernet frames.",examples:["Ethernet","Wi-Fi MAC","ARP*"],pdu:"Frame",tip:"Think: how does data cross this local link? *ARP is often taught between Layers 2 and 3 because it connects IP and link-layer addressing."},
 {n:1,name:"Physical",short:"Signals and media",desc:"Carries raw bits as electrical, optical, or radio signals through a transmission medium.",examples:["Copper cable","Fiber optics","Radio signals","Ethernet PHY"],pdu:"Bits",tip:"Think: what signal or medium carries the bits?"}
];
const layerList=$("layerList");
let activeLayer=7, journeyStep=-1, message="Hello, CyberVerse!", score=0, scenarioIndex=0, scenarioChoice=null, scenarioChecked=false, scenarioDone=new Set();
const matchingItems=[
 {label:"HTTP",answer:7,why:"HTTP is an application-layer protocol."},
 {label:"TCP",answer:4,why:"TCP provides transport-layer communication with reliability and ordering."},
 {label:"IP routing",answer:3,why:"IP addressing and routing are network-layer functions."},
 {label:"Ethernet framing",answer:2,why:"Ethernet frames and MAC addressing belong to the data-link layer."},
 {label:"Optical fiber signal",answer:1,why:"Optical pulses carry bits at the physical layer."}
];
const scenarios=[
 {q:"A router examines an IP destination address to choose the next network hop. Which OSI layer is most directly involved?",answer:3,why:"Routing based on IP addresses is a Network (Layer 3) function."},
 {q:"A switch forwards an Ethernet frame using its MAC address table. Which layer is most directly involved?",answer:2,why:"Ethernet frames and MAC-based forwarding are Data Link (Layer 2) functions."},
 {q:"A web browser requests a page using HTTP. Which OSI layer is the best introductory match for HTTP?",answer:7,why:"HTTP is normally classified as an Application (Layer 7) protocol."}
];
const quiz=[
 {q:"Which OSI layer is closest to user-facing network applications?",opts:["Physical","Application","Network","Data Link"],a:1,e:"Application is Layer 7 and provides services used by network applications."},
 {q:"Which layer is responsible for routing packets between networks?",opts:["Session","Presentation","Network","Physical"],a:2,e:"The Network layer is Layer 3 and handles logical addressing and routing."},
 {q:"Which is a Transport-layer protocol?",opts:["TCP","Ethernet","IP","HTTP"],a:0,e:"TCP and UDP are common Transport-layer protocols."},
 {q:"What is the simplified protocol data unit at the Data Link layer?",opts:["Bit","Frame","Packet","Segment"],a:1,e:"A frame is the common simplified name for a Layer 2 protocol data unit."},
 {q:"In the sending direction, which order best represents OSI encapsulation?",opts:["Layer 1 to Layer 7","Layer 4 to Layer 2 only","Layer 7 down to Layer 1","The order never matters"],a:2,e:"A conceptual sender passes data from higher layers down toward the Physical layer."}
];
function renderLayers(){
 layers.forEach(layer=>{
  const b=document.createElement("button");b.type="button";b.className="layer-button";b.dataset.layer=layer.n;
  b.innerHTML=`<span class="layer-number">L${layer.n}</span><span><span class="layer-name">${layer.name}</span><br><span class="layer-short">${layer.short}</span></span><span aria-hidden="true">›</span>`;
  b.addEventListener("click",()=>showLayer(layer.n));layerList.appendChild(b);
 });
 showLayer(7);
}
function showLayer(n){
 activeLayer=n;const layer=layers.find(x=>x.n===n);
 document.querySelectorAll(".layer-button").forEach(b=>{const active=Number(b.dataset.layer)===n;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});
 $("detailNumber").textContent=`LAYER ${layer.n}`;$("detailTitle").textContent=layer.name;$("detailDescription").textContent=layer.desc;$("detailPdu").textContent=layer.pdu;$("detailTip").textContent=layer.tip;
 const examples=$("detailExamples");examples.replaceChildren();layer.examples.forEach(value=>{const tag=document.createElement("span");tag.className="tag";tag.textContent=value;examples.appendChild(tag);});
}
function renderStack(){
 const root=$("journeyStack");root.replaceChildren();
 layers.forEach(layer=>{
  const card=document.createElement("div");card.className="journey-layer";if(journeyStep>=7-layer.n)card.classList.add("visited");if(journeyStep===7-layer.n)card.classList.add("current");
  const title=document.createElement("strong");title.textContent=`L${layer.n}`;
  const name=document.createElement("span");name.textContent=layer.name;
  card.append(title,name);root.appendChild(card);
 });
 const percent=journeyStep<0?0:Math.round((journeyStep+1)/7*100);$("progressBar").style.width=`${percent}%`;
}
function startJourney(){
 const value=$("messageInput").value.trim();
 if(!value){$("progressCaption").textContent="Enter a sample message before starting.";return;}
 message=value;journeyStep=-1;$("startJourneyBtn").disabled=true;$("nextLayerBtn").disabled=false;
 $("progressCaption").textContent="Journey started. Advance one layer at a time.";
 $("encapsulationCard").querySelector("strong").textContent="Application data ready";
 $("encapsulationCard").querySelector("p").textContent=`Sample payload: “${message}”. No real traffic is being sent.`;
 renderStack();
}
function nextJourney(){
 if(journeyStep>=6)return;
 journeyStep++;
 const layer=layers[6-journeyStep];showLayer(layer.n);renderStack();
 $("progressCaption").textContent=`Step ${journeyStep+1} of 7 · Layer ${layer.n}: ${layer.name}`;
 const descriptions={
  7:`The application creates the sample message: “${message}”.`,
  6:"The presentation role represents data formatting or transformation. This demonstration keeps the sample text readable.",
  5:"The session role represents managing the dialog. This simplified demo adds no real session protocol.",
  4:"The transport role represents process-to-process delivery. Real TCP or UDP headers are not constructed here.",
  3:"The network role represents logical addressing and routing. No real IP packet is created.",
  2:"The data-link role represents local framing and link addressing. No real Ethernet frame is created.",
  1:"The physical role represents the bits being carried as signals over a medium. No electrical, optical, or radio signal is generated."
 };
 $("encapsulationCard").querySelector("strong").textContent=`Layer ${layer.n}: ${layer.name}`;
 $("encapsulationCard").querySelector("p").textContent=descriptions[layer.n];
 if(journeyStep===6){$("nextLayerBtn").disabled=true;$("progressCaption").textContent="Simulation complete · You reviewed all seven layers. This was a visual model, not a real transmission.";}
}
function resetJourney(){
 journeyStep=-1;$("startJourneyBtn").disabled=false;$("nextLayerBtn").disabled=true;$("progressBar").style.width="0%";
 $("progressCaption").textContent="Ready — start to begin the simulated journey.";
 $("encapsulationCard").querySelector("strong").textContent="Waiting for the first layer";
 $("encapsulationCard").querySelector("p").textContent="Start the journey to see the sample message move through the OSI stack.";
 renderStack();
}
function renderMatching(){
 const root=$("matchingList");
 matchingItems.forEach((item,i)=>{
  const row=document.createElement("div");row.className="match-row";row.dataset.index=i;
  const label=document.createElement("label");label.htmlFor=`match${i}`;label.textContent=item.label;
  const select=document.createElement("select");select.id=`match${i}`;select.setAttribute("aria-label",`Choose OSI layer for ${item.label}`);
  const blank=document.createElement("option");blank.value="";blank.textContent="Choose a layer…";select.appendChild(blank);
  layers.forEach(layer=>{const opt=document.createElement("option");opt.value=layer.n;opt.textContent=`Layer ${layer.n} — ${layer.name}`;select.appendChild(opt);});
  row.append(label,select);root.appendChild(row);
 });
}
function checkMatching(){
 let correct=0,answered=0;
 matchingItems.forEach((item,i)=>{
  const select=$(`match${i}`),row=select.closest(".match-row");row.classList.remove("correct","incorrect");
  if(select.value)answered++;
  const ok=Number(select.value)===item.answer;if(ok)correct++;
  row.classList.add(ok?"correct":"incorrect");
  select.title=ok?item.why:`Best match: Layer ${item.answer} — ${layers.find(l=>l.n===item.answer).name}. ${item.why}`;
 });
 $("matchingFeedback").textContent=`Score: ${correct}/${matchingItems.length}. Answered ${answered}/${matchingItems.length}. Green rows are correct; review the layer guide for the others.`;
 $("matchingFeedback").classList.toggle("error",correct<matchingItems.length);
}
function resetMatching(){matchingItems.forEach((_,i)=>{$(`match${i}`).value="";const row=$(`match${i}`).closest(".match-row");row.classList.remove("correct","incorrect");});$("matchingFeedback").textContent="Match all five items to see your score.";$("matchingFeedback").classList.remove("error");}
function renderScenario(){
 const item=scenarios[scenarioIndex];$("scenarioNumber").textContent=`SCENARIO ${String(scenarioIndex+1).padStart(2,"0")} / ${String(scenarios.length).padStart(2,"0")}`;$("scenarioQuestion").textContent=item.q;
 const root=$("scenarioOptions");root.replaceChildren();scenarioChoice=null;scenarioChecked=false;
 layers.filter(l=>[1,2,3,4,5,6,7].includes(l.n)).forEach((layer,i)=>{
  const button=document.createElement("button");button.type="button";button.className="scenario-option";button.innerHTML=`<span class="option-letter">${String.fromCharCode(65+i)}</span><span>Layer ${layer.n} — ${layer.name}</span>`;
  button.addEventListener("click",()=>{if(scenarioChecked)return;scenarioChoice=layer.n;root.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));button.classList.add("selected");});root.appendChild(button);
 });
 $("checkScenarioBtn").disabled=false;$("nextScenarioBtn").disabled=true;$("scenarioFeedback").textContent="Choose an answer, then check it.";$("scenarioFeedback").classList.remove("error");
}
function checkScenario(){
 if(scenarioChecked)return;if(scenarioChoice===null){$("scenarioFeedback").textContent="Select a layer first.";$("scenarioFeedback").classList.add("error");return;}
 scenarioChecked=true;const item=scenarios[scenarioIndex],ok=scenarioChoice===item.answer;
 const buttons=[...$("scenarioOptions").querySelectorAll("button")];buttons.forEach((button,i)=>{const n=layers[i].n;if(n===item.answer)button.classList.add("correct");else if(n===scenarioChoice)button.classList.add("incorrect");});
 if(ok){if(!scenarioDone.has(scenarioIndex)){score+=10;scenarioDone.add(scenarioIndex);$("score").textContent=score;}$("scenarioFeedback").textContent=`Correct! +10 points. ${item.why}`;$("scenarioFeedback").classList.remove("error");}
 else{$("scenarioFeedback").textContent=`Not quite. ${item.why}`;$("scenarioFeedback").classList.add("error");}
 $("checkScenarioBtn").disabled=true;$("nextScenarioBtn").disabled=false;
 if(scenarioIndex===scenarios.length-1)$("nextScenarioBtn").textContent="Finish challenge";
}
function nextScenario(){
 if(!scenarioChecked)return;
 if(scenarioIndex<scenarios.length-1){scenarioIndex++;renderScenario();}
 else{$("scenarioFeedback").textContent=`Challenge finished. You earned ${scenarioDone.size*10} of 30 possible points this round.`;$("nextScenarioBtn").disabled=true;$("checkScenarioBtn").disabled=true;}
}
function resetScenario(){scenarioIndex=0;scenarioDone.clear();score=0;$("score").textContent=score;$("nextScenarioBtn").textContent="Next scenario →";renderScenario();}
function renderQuiz(){
 quiz.forEach((item,i)=>{
  const wrapper=document.createElement("div");wrapper.className="quiz-question";
  const fieldset=document.createElement("fieldset"),legend=document.createElement("legend");legend.textContent=`${i+1}. ${item.q}`;fieldset.appendChild(legend);
  item.opts.forEach((option,j)=>{const label=document.createElement("label");label.className="quiz-option";const input=document.createElement("input");input.type="radio";input.name=`quiz${i}`;input.value=j;const span=document.createElement("span");span.textContent=option;label.append(input,span);fieldset.appendChild(label);});
  const explanation=document.createElement("p");explanation.className="muted small";explanation.id=`quizExplain${i}`;explanation.hidden=true;wrapper.append(fieldset,explanation);$("quizQuestions").appendChild(wrapper);
 });
}
function checkQuiz(){
 let correct=0,answered=0;
 quiz.forEach((item,i)=>{
  const answer=document.querySelector(`input[name="quiz${i}"]:checked`),wrapper=document.querySelectorAll(".quiz-question")[i],explanation=$(`quizExplain${i}`);
  wrapper.classList.remove("correct","incorrect");const ok=!!answer&&Number(answer.value)===item.a;
  if(answer)answered++;if(ok)correct++;wrapper.classList.add(ok?"correct":"incorrect");
  explanation.textContent=`${ok?"Correct. ":answer?"Review: ":"Not answered. "}${item.e}`;explanation.hidden=false;
 });
 $("quizFeedback").textContent=`Quiz score: ${correct}/${quiz.length}. Answered ${answered}/${quiz.length}. Review the explanations.`;
 $("quizFeedback").classList.toggle("error",correct<quiz.length);
}
$("startJourneyBtn").addEventListener("click",startJourney);$("nextLayerBtn").addEventListener("click",nextJourney);$("resetJourneyBtn").addEventListener("click",resetJourney);
$("checkMatchingBtn").addEventListener("click",checkMatching);$("resetMatchingBtn").addEventListener("click",resetMatching);
$("checkScenarioBtn").addEventListener("click",checkScenario);$("nextScenarioBtn").addEventListener("click",nextScenario);$("resetScenarioBtn").addEventListener("click",resetScenario);
$("quizSubmitBtn").addEventListener("click",checkQuiz);
renderLayers();renderStack();renderMatching();renderScenario();renderQuiz();
})();