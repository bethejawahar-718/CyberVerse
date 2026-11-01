const services = [
  {name:"HTTP",port:80,transport:"TCP",purpose:"Unencrypted web traffic",detail:"HTTP is used to transfer web resources. Port 80 is the default port for HTTP, though services can be configured differently."},
  {name:"HTTPS",port:443,transport:"TCP",purpose:"Web traffic protected with TLS",detail:"HTTPS is HTTP protected by TLS. Port 443 is the standard default for HTTPS over TCP. HTTP/3 uses QUIC over UDP, commonly on port 443."},
  {name:"DNS",port:53,transport:"UDP / TCP",purpose:"Domain-name lookups",detail:"DNS commonly uses UDP port 53 for ordinary queries and TCP port 53 for cases such as zone transfers or responses requiring TCP."},
  {name:"SSH",port:22,transport:"TCP",purpose:"Secure remote login and administration",detail:"SSH provides encrypted remote access and is commonly used for secure command-line administration and file transfer."},
  {name:"DHCP server",port:67,transport:"UDP",purpose:"IPv4 address configuration (server)",detail:"A DHCPv4 server commonly listens on UDP port 67; clients commonly use UDP port 68."},
  {name:"DHCP client",port:68,transport:"UDP",purpose:"IPv4 address configuration (client)",detail:"A DHCPv4 client uses UDP port 68 to receive configuration from a DHCP server."},
  {name:"SMTP",port:25,transport:"TCP",purpose:"Mail transfer between servers",detail:"SMTP port 25 is commonly used for mail transfer between mail servers. Message submission often uses other ports, such as 587."},
  {name:"POP3",port:110,transport:"TCP",purpose:"Email retrieval",detail:"POP3 is a protocol for retrieving email from a server. Secure POP3 commonly uses port 995."},
  {name:"IMAP",port:143,transport:"TCP",purpose:"Email access and mailbox synchronization",detail:"IMAP supports accessing and managing mail on a server. IMAPS commonly uses port 993."},
  {name:"NTP",port:123,transport:"UDP",purpose:"Time synchronization",detail:"Network Time Protocol helps synchronize clocks across networked systems and commonly uses UDP port 123."},
  {name:"RDP",port:3389,transport:"TCP / UDP",purpose:"Remote Desktop services",detail:"Microsoft Remote Desktop commonly uses TCP and UDP port 3389. Exposing remote access services requires strong security controls."},
  {name:"FTP control",port:21,transport:"TCP",purpose:"File Transfer Protocol control channel",detail:"FTP commonly uses TCP port 21 for control. Traditional FTP does not encrypt credentials or data; prefer secure alternatives when appropriate."}
];
const challengePool = [
  {port:80,answer:"HTTP"},{port:443,answer:"HTTPS"},{port:53,answer:"DNS"},{port:22,answer:"SSH"},
  {port:25,answer:"SMTP"},{port:123,answer:"NTP"},{port:110,answer:"POP3"},{port:143,answer:"IMAP"},
  {port:3389,answer:"RDP"},{port:21,answer:"FTP control"},{port:67,answer:"DHCP server"},{port:68,answer:"DHCP client"}
];
let currentQuestions = [];
const questionRoot = document.querySelector("#matching-questions");
const feedback = document.querySelector("#quiz-feedback");
const tableRoot = document.querySelector("#service-table");
const search = document.querySelector("#service-search");
const detailRoot = document.querySelector("#service-details");

function shuffle(items){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
function newChallenge(){
  currentQuestions=shuffle(challengePool).slice(0,5);
  questionRoot.innerHTML="";
  currentQuestions.forEach((q,i)=>{
    const row=document.createElement("div");row.className="question";row.dataset.index=i;
    const port=document.createElement("div");port.className="port";port.textContent=q.port;
    const label=document.createElement("label");label.htmlFor=`answer-${i}`;label.textContent=`Port ${q.port} is commonly used by:`;
    const select=document.createElement("select");select.id=`answer-${i}`;select.setAttribute("aria-label",`Choose service for port ${q.port}`);
    select.innerHTML='<option value="">Choose a service…</option>';
    shuffle(challengePool.map(x=>x.answer)).forEach(name=>{const opt=document.createElement("option");opt.value=name;opt.textContent=name;select.appendChild(opt);});
    row.append(port,label,select);questionRoot.appendChild(row);
  });
  feedback.textContent="";feedback.className="feedback";
}
function checkAnswers(){
  let score=0;
  [...questionRoot.children].forEach((row,i)=>{
    const chosen=row.querySelector("select").value;
    row.classList.remove("correct","incorrect");
    if(chosen===currentQuestions[i].answer){score++;row.classList.add("correct");}
    else row.classList.add("incorrect");
  });
  feedback.textContent=`Score: ${score}/${currentQuestions.length}. ${score===currentQuestions.length?"Excellent — all correct!":"Review the highlighted rows and try again."}`;
  feedback.style.color=score===currentQuestions.length?"var(--green)":"var(--cyan)";
}
function renderTable(){
  const term=search.value.trim().toLowerCase();
  const filtered=services.filter(s=>[s.name,String(s.port),s.transport,s.purpose].some(v=>v.toLowerCase().includes(term)));
  tableRoot.innerHTML="";
  if(!filtered.length){const tr=document.createElement("tr");const td=document.createElement("td");td.colSpan=4;td.textContent="No matching services found.";tr.appendChild(td);tableRoot.appendChild(tr);return;}
  filtered.forEach(s=>{
    const tr=document.createElement("tr");tr.tabIndex=0;tr.setAttribute("aria-label",`View ${s.name} details`);
    [s.name,s.port,s.transport,s.purpose].forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.appendChild(td);});
    const selectRow=()=>{detailRoot.innerHTML="";const strong=document.createElement("strong");strong.textContent=`${s.name} — port ${s.port}`;const p=document.createElement("p");p.textContent=s.detail;detailRoot.append(strong,p);};
    tr.addEventListener("click",selectRow);tr.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectRow();}});
    tableRoot.appendChild(tr);
  });
}
document.querySelector("#check-answers").addEventListener("click",checkAnswers);
document.querySelector("#new-challenge").addEventListener("click",newChallenge);
document.querySelector("#reset").addEventListener("click",newChallenge);
search.addEventListener("input",renderTable);
newChallenge();renderTable();
