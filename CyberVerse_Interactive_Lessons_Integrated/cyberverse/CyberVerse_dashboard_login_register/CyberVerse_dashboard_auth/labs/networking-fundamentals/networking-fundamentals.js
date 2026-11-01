(() => {
"use strict";
const $ = id => document.getElementById(id);
const nodes = new Map();
const links = [];
let nextId = 1, selected = [], score = 0, challengeAwarded = false, successfulTest = false;
const deviceMeta = {
  pc:{label:"PC / Host",icon:"▣"},
  switch:{label:"Switch",icon:"⇄"},
  router:{label:"Router",icon:"⌘"}
};
const quiz = [
 {q:"Which device commonly connects devices inside the same local area network?",options:["Router","Switch","Modem only","Firewall rule"],answer:1,explain:"A LAN switch forwards frames between connected devices."},
 {q:"What is the main job of a router?",options:["Store website passwords","Connect different IP networks","Replace every IP address with a MAC address","Create web pages"],answer:1,explain:"Routers forward packets between IP networks."},
 {q:"What does a network topology describe?",options:["The arrangement of network devices and links","A computer's wallpaper","A password format","Only the operating system"],answer:0,explain:"Topology describes how devices and connections are arranged."},
 {q:"In this lab, what does a successful connectivity test mean?",options:["A real ping was sent","The browser scanned your LAN","A path exists in the simulated links","The internet is guaranteed to work"],answer:2,explain:"This lab checks its own simulated graph; it does not send real packets."},
 {q:"Which is a sensible first step when two simulated PCs cannot communicate?",options:["Delete all devices","Check that a path of links connects them","Assume DNS is broken","Disable every security control"],answer:1,explain:"Check physical/logical connectivity first, then investigate addressing and other layers in later labs."}
];
function makeId(type){return `${type.toUpperCase()}-${nextId++}`;}
function addNode(type){
 const id=makeId(type);nodes.set(id,{id,type});
 selected=[];successfulTest=false;render();updateChallengeGoals();
}
function addLink(a,b){
 if(a===b||links.some(link=>(link.a===a&&link.b===b)||(link.a===b&&link.b===a)))return false;
 links.push({a,b});successfulTest=false;return true;
}
function removeNode(id){
 nodes.delete(id);
 for(let i=links.length-1;i>=0;i--)if(links[i].a===id||links[i].b===id)links.splice(i,1);
 selected=selected.filter(item=>item!==id);successfulTest=false;render();updateChallengeGoals();
}
function deviceLabel(id){const n=nodes.get(id);return n?`${deviceMeta[n.type].label} ${id.split("-")[1]}`:id;}
function connectedComponents(source,destination){
 const adjacency=new Map([...nodes.keys()].map(id=>[id,[]]));
 links.forEach(link=>{if(adjacency.has(link.a)&&adjacency.has(link.b)){adjacency.get(link.a).push(link.b);adjacency.get(link.b).push(link.a);}});
 const queue=[source],previous=new Map([[source,null]]);
 while(queue.length){
  const current=queue.shift();if(current===destination)break;
  for(const next of adjacency.get(current)||[])if(!previous.has(next)){previous.set(next,current);queue.push(next);}
 }
 if(!previous.has(destination))return null;
 const path=[];let current=destination;
 while(current!==null){path.unshift(current);current=previous.get(current);}
 return path;
}
function render(){
 const workspace=$("workspace");workspace.replaceChildren();
 if(nodes.size===0){const empty=document.createElement("div");empty.className="empty-state";empty.innerHTML="<span>⌁</span><strong>Your topology starts here</strong><p>Add a device or load the sample network.</p>";workspace.appendChild(empty);}
 else{
  nodes.forEach(node=>{
   const button=document.createElement("button");button.type="button";button.className=`node${selected.includes(node.id)?" selected":""}`;button.dataset.type=node.type;
   button.setAttribute("aria-pressed",String(selected.includes(node.id)));button.setAttribute("aria-label",`${deviceLabel(node.id)}, ${selected.includes(node.id)?"selected":"not selected"}`);
   const icon=document.createElement("span");icon.className="node-icon";icon.textContent=deviceMeta[node.type].icon;
   const name=document.createElement("strong");name.textContent=deviceLabel(node.id);
   const status=document.createElement("small");status.textContent=links.some(link=>link.a===node.id||link.b===node.id)?"● LINKED":"○ NO LINK";if(status.textContent==="● LINKED")status.className="connected";
   button.append(icon,name,status);button.addEventListener("click",()=>selectNode(node.id));workspace.appendChild(button);
  });
 }
 $("deviceCount").textContent=`${nodes.size} device${nodes.size===1?"":"s"} · ${links.length} link${links.length===1?"":"s"}`;
 $("connectBtn").disabled=selected.length!==2;
 $("removeBtn").disabled=selected.length!==1;
 if(selected.length===0)$("selectionInfo").textContent="Select a device to inspect it. Select two devices to create a link.";
 else if(selected.length===1)$("selectionInfo").textContent=`Selected ${deviceLabel(selected[0])}. Select one more device to connect them.`;
 else $("selectionInfo").textContent=`Selected ${deviceLabel(selected[0])} and ${deviceLabel(selected[1])}.`;
 populateHosts();
}
function selectNode(id){
 if(selected.includes(id)){selected=selected.filter(item=>item!==id);}
 else if(selected.length<2){selected.push(id);}
 else selected=[id];
 render();
}
function populateHosts(){
 const hosts=[...nodes.values()].filter(node=>node.type==="pc");
 ["sourceHost","destinationHost"].forEach((id,index)=>{
  const select=$(id),old=select.value;select.replaceChildren();
  hosts.forEach(host=>{const option=document.createElement("option");option.value=host.id;option.textContent=deviceLabel(host.id);select.appendChild(option);});
  if(hosts.some(host=>host.id===old))select.value=old;
  if(hosts.length===0){const option=document.createElement("option");option.value="";option.textContent="Add a PC first";select.appendChild(option);}
  if(index===1&&hosts.length>1&&select.value===$("sourceHost").value)select.value=hosts[1].id;
 });
 $("testBtn").disabled=hosts.length<2;
}
function showTestResult(kind,title,message,path=[]){
 const box=$("testResult");box.className=`test-result ${kind}`;
 $("testResult").querySelector(".result-symbol").textContent=kind==="success"?"✓":kind==="failure"?"×":"?";
 $("testResult").querySelector("strong").textContent=title;
 $("testResult").querySelector("p").textContent=message;
 const display=$("pathDisplay");display.hidden=path.length===0;display.textContent=path.length?`Simulated path: ${path.map(deviceLabel).join("  →  ")}`:"";
}
function loadSample(){
 nodes.clear();links.splice(0,links.length);nextId=1;selected=[];successfulTest=false;challengeAwarded=false;
 const pc1=makeId("pc"),sw=makeId("switch"),pc2=makeId("pc"),router=makeId("router");
 nodes.set(pc1,{id:pc1,type:"pc"});nodes.set(sw,{id:sw,type:"switch"});nodes.set(pc2,{id:pc2,type:"pc"});nodes.set(router,{id:router,type:"router"});
 addLink(pc1,sw);addLink(pc2,sw);addLink(sw,router);
 render();updateChallengeGoals();showTestResult("","Ready to test","Sample network loaded. Select two PCs and test the simulated path.");
}
function updateChallengeGoals(){
 const pc=[...nodes.values()].filter(n=>n.type==="pc"),switches=[...nodes.values()].filter(n=>n.type==="switch");
 const enough=pc.length>=2&&switches.length>=1;
 const both= enough&&pc.every(host=>links.some(l=>(l.a===host.id&&l.b===switches[0].id)||(l.b===host.id&&l.a===switches[0].id)));
 $("goalDevices").classList.toggle("done",enough);$("goalDevices").textContent=`${enough?"✓":"○"} Add at least 2 PCs and 1 switch`;
 $("goalLinks").classList.toggle("done",both);$("goalLinks").textContent=`${both?"✓":"○"} Connect both PCs to the switch`;
 $("goalTest").classList.toggle("done",successfulTest);$("goalTest").textContent=`${successfulTest?"✓":"○"} Successfully test PC-to-PC connectivity`;
 if(!challengeAwarded&&enough&&both&&successfulTest){
  challengeAwarded=true;score+=30;$("score").textContent=score;
  $("challengeFeedback").textContent="Challenge complete! +30 points. You built a connected simulated LAN.";
 }
}
function renderQuiz(){
 const root=$("quizQuestions");
 quiz.forEach((item,index)=>{
  const wrapper=document.createElement("div");wrapper.className="quiz-question";
  const fieldset=document.createElement("fieldset"),legend=document.createElement("legend");legend.textContent=`${index+1}. ${item.q}`;fieldset.appendChild(legend);
  item.options.forEach((option,i)=>{
   const label=document.createElement("label");label.className="quiz-option";
   const input=document.createElement("input");input.type="radio";input.name=`q${index}`;input.value=i;
   const span=document.createElement("span");span.textContent=option;label.append(input,span);fieldset.appendChild(label);
  });
  const explanation=document.createElement("p");explanation.className="muted small";explanation.id=`explain${index}`;explanation.hidden=true;
  wrapper.append(fieldset,explanation);root.appendChild(wrapper);
 });
}
$("addDeviceBtn").addEventListener("click",()=>addNode($("deviceType").value));
$("sampleBtn").addEventListener("click",loadSample);
$("clearBtn").addEventListener("click",()=>{nodes.clear();links.splice(0,links.length);selected=[];successfulTest=false;render();updateChallengeGoals();showTestResult("","Ready to test","Add at least two PCs to test a simulated path.");});
$("connectBtn").addEventListener("click",()=>{
 if(selected.length!==2)return;
 const [a,b]=selected;
 if(addLink(a,b)){showTestResult("","Link created",`Added simulated link between ${deviceLabel(a)} and ${deviceLabel(b)}.`);}
 else showTestResult("failure","Link already exists","These devices already have a direct simulated link.");
 selected=[];render();updateChallengeGoals();
});
$("removeBtn").addEventListener("click",()=>{if(selected.length===1)removeNode(selected[0]);});
$("testBtn").addEventListener("click",()=>{
 const source=$("sourceHost").value,destination=$("destinationHost").value;
 if(!source||!destination){showTestResult("failure","Cannot test","Add at least two PCs first.");return;}
 if(source===destination){showTestResult("failure","Choose two different PCs","Source and destination must be different hosts.");return;}
 const path=connectedComponents(source,destination);
 if(path){successfulTest=true;showTestResult("success","Simulated connectivity successful",`A path exists across ${path.length-1} link(s). This is not a real ping.`,path);}
 else{successfulTest=false;showTestResult("failure","No simulated path found","These hosts are not connected by a chain of links. Check the topology.");}
 updateChallengeGoals();
});
$("checkChallengeBtn").addEventListener("click",()=>{
 const pc=[...nodes.values()].filter(n=>n.type==="pc"),sw=[...nodes.values()].filter(n=>n.type==="switch");
 const enough=pc.length>=2&&sw.length>=1;
 const linked=enough&&pc.every(host=>links.some(l=>(l.a===host.id&&l.b===sw[0].id)||(l.b===host.id&&l.a===sw[0].id)));
 if(enough&&linked&&successfulTest){updateChallengeGoals();$("challengeFeedback").textContent=challengeAwarded?"Challenge already completed.":"Challenge requirements met!";feedbackClass(false);}
 else{$("challengeFeedback").textContent="Not complete yet. Check each goal above: device count, both PC-to-switch links, and a successful connectivity test.";feedbackClass(true);}
});
function feedbackClass(error){$("challengeFeedback").classList.toggle("error",error);}
$("resetChallengeBtn").addEventListener("click",()=>{score=0;challengeAwarded=false;$("score").textContent=score;$("challengeFeedback").textContent="Challenge score reset. Your topology was kept.";feedbackClass(false);});
$("quizSubmitBtn").addEventListener("click",()=>{
 let correct=0,answered=0;
 quiz.forEach((item,index)=>{
  const selectedAnswer=document.querySelector(`input[name="q${index}"]:checked`),wrapper=document.querySelectorAll(".quiz-question")[index],explanation=$(`explain${index}`);
  wrapper.classList.remove("correct","incorrect");
  const ok=!!selectedAnswer&&Number(selectedAnswer.value)===item.answer;
  if(selectedAnswer)answered++;if(ok)correct++;
  wrapper.classList.add(ok?"correct":"incorrect");
  explanation.textContent=`${ok?"Correct. ":selectedAnswer?"Review: ":"Not answered. "}${item.explain}`;explanation.hidden=false;
 });
 $("quizFeedback").textContent=`Quiz score: ${correct}/${quiz.length}. Answered ${answered}/${quiz.length}. Review the explanations above.`;
});
function feedbackInit(){renderQuiz();render();updateChallengeGoals();}
function feedbackClassInit(){return;}
feedbackInit();
})();