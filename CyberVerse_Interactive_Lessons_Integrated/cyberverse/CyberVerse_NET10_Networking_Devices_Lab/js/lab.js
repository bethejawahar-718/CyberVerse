const deviceInfo = {
  pc:{name:"Computer",icon:"💻",tag:"End device",desc:"A computer sends and receives data over a network. It usually connects through a network interface using Ethernet or Wi-Fi.",example:"A laptop accessing a website."},
  switch:{name:"Switch",icon:"🔀",tag:"LAN device",desc:"A switch forwards Ethernet frames within a local area network, commonly using MAC addresses to decide which port should receive a frame.",example:"Connecting computers and printers in an office LAN."},
  router:{name:"Router",icon:"🧭",tag:"Layer 3 device",desc:"A router forwards packets between different IP networks and chooses a next hop using routing information.",example:"Connecting a home network to an internet service provider."},
  hub:{name:"Hub",icon:"🔗",tag:"Legacy LAN device",desc:"A hub repeats incoming bits to all other ports. It does not learn MAC addresses and is less efficient than a switch.",example:"An older shared Ethernet segment."},
  modem:{name:"Modem",icon:"📡",tag:"Access device",desc:"A modem adapts signals for a particular access technology so a customer network can communicate over an ISP link.",example:"A cable modem or DSL modem."},
  ap:{name:"Access point",icon:"📶",tag:"Wireless access",desc:"A wireless access point lets Wi-Fi devices join a local network, typically bridging wireless clients to a wired LAN.",example:"Phones joining office Wi-Fi."},
  firewall:{name:"Firewall",icon:"🛡️",tag:"Security device",desc:"A firewall applies configured rules to allow or block network traffic. Capabilities depend on the firewall type and configuration.",example:"Blocking unsolicited inbound connections."}
};
const typeOptions=Object.keys(deviceInfo);
let devices=[],links=[],nextId=1;
const grid=document.querySelector("#device-grid"),detail=document.querySelector("#device-details");
const listRoot=document.querySelector("#device-list"),svg=document.querySelector("#network-svg");
const sourceSelect=document.querySelector("#source-device"),targetSelect=document.querySelector("#target-device");
const workspaceFeedback=document.querySelector("#workspace-feedback");
function renderExplorer(){
  grid.innerHTML="";
  typeOptions.forEach(type=>{
    const d=deviceInfo[type],button=document.createElement("button");button.className="device-card";button.type="button";
    const icon=document.createElement("div");icon.className="device-icon";icon.textContent=d.icon;
    const name=document.createElement("strong");name.textContent=d.name;
    const tag=document.createElement("span");tag.textContent=d.tag;
    button.append(icon,name,tag);button.addEventListener("click",()=>{
      detail.innerHTML="";const strong=document.createElement("strong");strong.textContent=d.name;
      const p=document.createElement("p");p.textContent=d.desc;const ex=document.createElement("p");ex.textContent="Example: "+d.example;detail.append(strong,p,ex);
    });grid.appendChild(button);
  });
}
function addDevice(type){
  const d={id:nextId++,type,name:deviceInfo[type].name+" "+(devices.filter(x=>x.type===type).length+1)};
  devices.push(d);renderWorkspace();workspaceFeedback.textContent=d.name+" added to the simulated network.";
}
function renderWorkspace(){
  listRoot.innerHTML="";
  if(!devices.length){listRoot.textContent="No devices added yet.";}
  devices.forEach(d=>{const el=document.createElement("div");el.className="device-entry";const a=document.createElement("span");a.textContent=deviceInfo[d.type].icon+" "+d.name;const b=document.createElement("span");b.textContent="#"+d.id;el.append(a,b);listRoot.appendChild(el);});
  [sourceSelect,targetSelect].forEach(select=>{
    const old=select.value;select.innerHTML="";
    devices.forEach(d=>{const opt=document.createElement("option");opt.value=d.id;opt.textContent=d.name;select.appendChild(opt);});
    if(devices.some(d=>String(d.id)===old))select.value=old;
  });
  drawNetwork();
}
function drawNetwork(){
  svg.innerHTML="";
  if(!devices.length){const t=document.createElementNS("http://www.w3.org/2000/svg","text");t.setAttribute("x","300");t.setAttribute("y","150");t.setAttribute("text-anchor","middle");t.setAttribute("fill","#91a7bd");t.textContent="Add devices to begin";svg.appendChild(t);return;}
  const positions=devices.map((d,i)=>({d,x:70+(i%4)*150,y:55+Math.floor(i/4)*105}));
  const posById=Object.fromEntries(positions.map(p=>[p.d.id,p]));
  links.forEach(l=>{const a=posById[l.a],b=posById[l.b];if(!a||!b)return;const line=document.createElementNS("http://www.w3.org/2000/svg","line");line.setAttribute("x1",a.x);line.setAttribute("y1",a.y);line.setAttribute("x2",b.x);line.setAttribute("y2",b.y);line.setAttribute("stroke","#62d9ff");line.setAttribute("stroke-width","2");svg.appendChild(line);});
  positions.forEach(p=>{
    const g=document.createElementNS("http://www.w3.org/2000/svg","g");
    const rect=document.createElementNS("http://www.w3.org/2000/svg","rect");rect.setAttribute("x",p.x-48);rect.setAttribute("y",p.y-25);rect.setAttribute("width","96");rect.setAttribute("height","50");rect.setAttribute("rx","10");rect.setAttribute("fill","#122238");rect.setAttribute("stroke",p.d.type==="router"?"#8cf59a":"#36516e");g.appendChild(rect);
    const icon=document.createElementNS("http://www.w3.org/2000/svg","text");icon.setAttribute("x",p.x);icon.setAttribute("y",p.y-2);icon.setAttribute("text-anchor","middle");icon.setAttribute("font-size","17");icon.textContent=deviceInfo[p.d.type].icon;g.appendChild(icon);
    const label=document.createElementNS("http://www.w3.org/2000/svg","text");label.setAttribute("x",p.x);label.setAttribute("y",p.y+15);label.setAttribute("text-anchor","middle");label.setAttribute("font-size","9");label.setAttribute("fill","#e9f1fa");label.textContent=p.d.name;g.appendChild(label);svg.appendChild(g);
  });
}
function connect(){
  const a=Number(sourceSelect.value),b=Number(targetSelect.value);
  if(!a||!b||a===b){workspaceFeedback.textContent="Choose two different devices to connect.";return;}
  if(links.some(l=>(l.a===a&&l.b===b)||(l.a===b&&l.b===a))){workspaceFeedback.textContent="Those devices are already connected.";return;}
  links.push({a,b});renderWorkspace();workspaceFeedback.textContent="Connection added to the simulation.";
}
function testPath(){
  const start=Number(sourceSelect.value),goal=Number(targetSelect.value);
  if(!start||!goal||start===goal){workspaceFeedback.textContent="Choose two different devices to test.";return;}
  const adjacency={};devices.forEach(d=>adjacency[d.id]=[]);links.forEach(l=>{adjacency[l.a].push(l.b);adjacency[l.b].push(l.a);});
  const queue=[[start,[start]]],seen=new Set([start]);let path=null;
  while(queue.length){const [node,p]=queue.shift();if(node===goal){path=p;break;}for(const n of adjacency[node]||[]){if(!seen.has(n)){seen.add(n);queue.push([n,[...p,n]]);}}}
  if(!path){workspaceFeedback.textContent="No path found. Add a connection between the selected devices.";return;}
  const names=path.map(id=>devices.find(d=>d.id===id).name);
  workspaceFeedback.textContent="Simulated path found: "+names.join(" → ")+". This checks diagram connectivity only, not real network reachability.";
}
const quizItems=[
 {q:"Which device commonly forwards Ethernet frames using MAC addresses?",opts:["Router","Switch","Modem"],a:1,why:"A switch commonly uses MAC address information to forward Ethernet frames within a LAN."},
 {q:"Which device forwards packets between IP networks?",opts:["Router","Hub","Access point only"],a:0,why:"Routers forward IP packets between networks."},
 {q:"What does a traditional Ethernet hub do with incoming bits?",opts:["Sends only to the learned destination port","Repeats them to other ports","Encrypts the traffic"],a:1,why:"A hub repeats incoming bits to the other ports and does not learn MAC addresses."},
 {q:"What is a main purpose of a wireless access point?",opts:["Provide Wi-Fi access to a network","Assign every website a domain name","Replace all routing"],a:0,why:"An access point lets wireless clients join a local network."},
 {q:"What does a firewall do?",opts:["Always makes all traffic safe","Applies rules to allow or block traffic","Converts domain names into IP addresses"],a:1,why:"Firewalls enforce traffic policies according to configured rules."}
];
function renderQuiz(){
  const root=document.querySelector("#quiz");root.innerHTML="";
  quizItems.forEach((item,i)=>{
    const wrap=document.createElement("div");wrap.className="quiz-question";
    const q=document.createElement("p");q.textContent=(i+1)+". "+item.q;wrap.appendChild(q);
    item.opts.forEach((opt,j)=>{const label=document.createElement("label"),input=document.createElement("input");input.type="radio";input.name="q"+i;input.value=j;label.append(input,document.createTextNode(opt));wrap.appendChild(label);});
    root.appendChild(wrap);
  });
}
function checkQuiz(){
  let score=0;const root=document.querySelector("#quiz");
  quizItems.forEach((item,i)=>{
    const selected=root.querySelector(`input[name="q${i}"]:checked`);
    const wrap=root.children[i];let old=wrap.querySelector(".explanation");if(old)old.remove();
    const p=document.createElement("div");p.className="explanation muted";
    if(selected&&Number(selected.value)===item.a){score++;p.textContent="Correct. "+item.why;p.style.color="var(--green)";}
    else{p.textContent="Review: "+item.why;p.style.color="var(--cyan)";}
    wrap.appendChild(p);
  });
  const fb=document.querySelector("#quiz-feedback");fb.textContent=`Your score: ${score}/${quizItems.length}. ${score===quizItems.length?"Great work!":"Review the explanations and try again."}`;
}
document.querySelector("#add-device").addEventListener("click",()=>addDevice(document.querySelector("#device-type").value));
document.querySelector("#connect-devices").addEventListener("click",connect);
document.querySelector("#test-path").addEventListener("click",testPath);
document.querySelector("#reset-workspace").addEventListener("click",()=>{devices=[];links=[];nextId=1;renderWorkspace();workspaceFeedback.textContent="Workspace reset.";});
document.querySelector("#submit-quiz").addEventListener("click",checkQuiz);
document.querySelector("#retry-quiz").addEventListener("click",()=>{renderQuiz();document.querySelector("#quiz-feedback").textContent="Quiz reset. Try again.";});
renderExplorer();renderWorkspace();renderQuiz();
