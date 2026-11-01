const dnsData = [
  {domain:"cyberverse.test",type:"A",value:"192.0.2.25",ttl:3600},
  {domain:"cyberverse.test",type:"AAAA",value:"2001:db8::25",ttl:3600},
  {domain:"learn.test",type:"A",value:"192.0.2.40",ttl:1800},
  {domain:"learn.test",type:"AAAA",value:"2001:db8::40",ttl:1800},
  {domain:"alias.test",type:"CNAME",value:"cyberverse.test",ttl:900},
  {domain:"mail.test",type:"MX",value:"10 mailhost.test",ttl:7200},
  {domain:"mailhost.test",type:"A",value:"192.0.2.60",ttl:7200}
];
const descriptions = {
  A:"An A record maps a domain name to an IPv4 address.",
  AAAA:"An AAAA record maps a domain name to an IPv6 address.",
  CNAME:"A CNAME record points one domain name to another domain name.",
  MX:"An MX record identifies a mail server for a domain."
};
const $ = id => document.getElementById(id);
const recordsBody = $("recordsBody");
function renderRecords(){
  recordsBody.innerHTML = dnsData.map(r=>`<tr><td>${r.domain}</td><td>${r.type}</td><td>${r.value}</td><td>${r.ttl}s</td></tr>`).join("");
}
function setPath(activeIndex, completed=false){
  const nodes = [...document.querySelectorAll(".node")];
  nodes.forEach((node,i)=>{
    node.classList.toggle("active",i===activeIndex);
    node.classList.toggle("done",i<activeIndex || (completed && i===activeIndex));
  });
}
function safeText(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function simulate(){
  const domain = $("domain").value.trim().toLowerCase().replace(/\.$/,"");
  const type = $("recordType").value;
  $("recordTitle").textContent = `Record type: ${type}`;
  $("recordDescription").textContent = descriptions[type];
  $("pathStatus").textContent = "RUNNING";
  setPath(0);
  const steps = [
    ["Client query",`Your device requests the <b>${type}</b> record for <b>${safeText(domain || "(empty domain)")}</b>.`],
    ["Recursive resolver","The resolver checks its simulated dataset for a matching record."],
    ["Authoritative DNS", "The simulated authoritative server returns the matching record, if one exists."]
  ];
  $("timeline").innerHTML = steps.map((s,i)=>`<p><b>${i+1}. ${s[0]}:</b> ${s[1]}</p>`).join("");
  setPath(2,true);
  $("pathStatus").textContent = "COMPLETE";
  const validDomain = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(\.([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?))*$/.test(domain);
  if(!validDomain){
    $("result").className = "result";
    $("result").innerHTML = `<span style="color:var(--red)">Invalid domain name</span><div class="sub">Enter a domain such as cyberverse.test.</div>`;
    $("pathStatus").textContent = "INVALID INPUT";
    return;
  }
  let record = dnsData.find(r=>r.domain===domain && r.type===type);
  if(type==="A" && domain==="alias.test"){
    const cname=dnsData.find(r=>r.domain===domain && r.type==="CNAME");
    const target=cname && dnsData.find(r=>r.domain===cname.value && r.type==="A");
    if(target) record={...target,domain,ttl:cname.ttl};
  }
  $("result").className = "result";
  if(record){
    $("result").innerHTML = `<div>NAME&nbsp;&nbsp; ${safeText(domain)}</div><div>TYPE&nbsp;&nbsp; ${type}</div><div>VALUE&nbsp; <span class="answer">${safeText(record.value)}</span></div><div class="sub">TTL: ${record.ttl} seconds · Simulated response</div>`;
  } else {
    $("result").innerHTML = `<span style="color:var(--red)">No matching ${type} record found</span><div class="sub">This predefined dataset has no ${type} record for ${safeText(domain)}. This does not mean the domain is absent from the live internet.</div>`;
  }
}
function reset(){
  $("domain").value="cyberverse.test";$("recordType").value="A";
  $("pathStatus").textContent="READY";setPath(0);
  $("timeline").innerHTML='<p class="empty">Run a simulation to see each step.</p>';
  $("result").className="result empty-result";$("result").textContent="Your simulated DNS answer will appear here.";
  $("recordTitle").textContent="Record type: A";$("recordDescription").textContent=descriptions.A;
}
$("runBtn").addEventListener("click",simulate);
$("resetBtn").addEventListener("click",reset);
$("domain").addEventListener("keydown",e=>{if(e.key==="Enter")simulate();});
renderRecords();
