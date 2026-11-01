const samples={
 get:{request:"GET /products HTTP/1.1\nHost: shop.example.test\nAccept: application/json\nUser-Agent: CyberVerse-Lab/1.0",response:"HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"items\": [\"notebook\", \"pen\"]\n}",explanation:"GET requests are commonly used to retrieve a resource. The sample server returns 200 OK and a small JSON response. This is fictional training data."},
 post:{request:"POST /login HTTP/1.1\nHost: account.example.test\nContent-Type: application/json\n\n{ \"username\": \"learner\" }",response:"HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"message\": \"Demo login accepted\"\n}",explanation:"POST commonly sends data for the server to process. This example deliberately includes no password or real credential. A real login should use HTTPS and secure server-side authentication."},
 notfound:{request:"GET /missing-page HTTP/1.1\nHost: docs.example.test\nAccept: text/html",response:"HTTP/1.1 404 Not Found\nContent-Type: text/plain\n\nThe requested sample page was not found.",explanation:"404 Not Found means the server could not find a current representation of the requested resource."},
 forbidden:{request:"GET /admin HTTP/1.1\nHost: portal.example.test\nAccept: text/html",response:"HTTP/1.1 403 Forbidden\nContent-Type: text/plain\n\nAccess to this sample resource is denied.",explanation:"403 Forbidden means the server understood the request but refuses to fulfill it. Authentication and authorization are related but distinct concepts."}
};
const statuses=[
 {code:200,title:"OK",group:"2xx · Success",desc:"The request succeeded."},
 {code:201,title:"Created",group:"2xx · Success",desc:"The request succeeded and created a resource."},
 {code:301,title:"Moved Permanently",group:"3xx · Redirection",desc:"The resource has a permanent new URL; clients may follow a Location header."},
 {code:302,title:"Found",group:"3xx · Redirection",desc:"A temporary redirection response."},
 {code:400,title:"Bad Request",group:"4xx · Client error",desc:"The server cannot or will not process the request due to a perceived client error."},
 {code:401,title:"Unauthorized",group:"4xx · Client error",desc:"Valid authentication credentials are missing or not accepted."},
 {code:403,title:"Forbidden",group:"4xx · Client error",desc:"The server refuses to fulfill the request."},
 {code:404,title:"Not Found",group:"4xx · Client error",desc:"The requested resource was not found."},
 {code:429,title:"Too Many Requests",group:"4xx · Client error",desc:"The client sent too many requests in a given amount of time."},
 {code:500,title:"Internal Server Error",group:"5xx · Server error",desc:"The server encountered an unexpected condition."},
 {code:502,title:"Bad Gateway",group:"5xx · Server error",desc:"A gateway or proxy received an invalid response from an upstream server."},
 {code:503,title:"Service Unavailable",group:"5xx · Server error",desc:"The server is temporarily unable to handle the request, often due to overload or maintenance."}
];
const requestSelect=document.querySelector("#sample-request");
function renderRequest(){
 const s=samples[requestSelect.value];
 document.querySelector("#request-view").textContent=s.request;
 document.querySelector("#response-view").textContent=s.response;
 document.querySelector("#request-explanation").textContent=s.explanation;
}
function renderStatuses(){
 const term=document.querySelector("#status-search").value.trim().toLowerCase();
 const root=document.querySelector("#status-grid");root.innerHTML="";
 const found=statuses.filter(s=>[String(s.code),s.title,s.group,s.desc].some(v=>v.toLowerCase().includes(term)));
 if(!found.length){root.textContent="No matching status codes.";return;}
 found.forEach(s=>{
  const card=document.createElement("article");card.className="status-card";
  const code=document.createElement("strong");code.textContent=s.code;
  const h=document.createElement("h3");h.textContent=s.title;
  const group=document.createElement("p");group.textContent=s.group;
  const desc=document.createElement("p");desc.textContent=s.desc;desc.style.marginTop="7px";
  card.append(code,h,group,desc);root.appendChild(card);
 });
}
const plainText="username=learner&message=hello";
function renderComparison(mode){
 const root=document.querySelector("#comparison-view");root.className="comparison "+(mode==="https"?"secure":"insecure");root.innerHTML="";
 const h=document.createElement("h3");h.textContent=mode==="https"?"HTTPS concept: protected in transit":"HTTP concept: readable demonstration data";
 const p=document.createElement("p");p.textContent=mode==="https"?"HTTPS uses TLS to protect HTTP data in transit when correctly configured. The block below is a placeholder, not real ciphertext.":"Without transport encryption, data may be readable to parties able to observe the traffic.";
 const pre=document.createElement("pre");pre.textContent=mode==="https"?"[Illustrative protected-data placeholder — not actual encryption]":"POST /demo HTTP/1.1\n\n"+plainText;
 root.append(h,p,pre);
 document.querySelector("#http-mode").setAttribute("aria-pressed",String(mode==="http"));
 document.querySelector("#https-mode").setAttribute("aria-pressed",String(mode==="https"));
 document.querySelector("#http-mode").className=mode==="http"?"secondary":"ghost";
 document.querySelector("#https-mode").className=mode==="https"?"secondary":"ghost";
}
const quiz=[
 {q:"What is HTTP mainly used for?",o:["Transferring web resources","Assigning MAC addresses","Routing packets between networks"],a:0,e:"HTTP is an application-layer protocol used for web communication."},
 {q:"What does HTTPS add to HTTP?",o:["TLS protection for data in transit","Guaranteed that a website is honest","Automatic removal of malware"],a:0,e:"HTTPS uses TLS to help provide confidentiality, integrity, and server authentication when properly configured."},
 {q:"What does status code 404 mean?",o:["OK","Not Found","Internal Server Error"],a:1,e:"404 means the requested resource was not found."},
 {q:"Which method is commonly used to retrieve a resource?",o:["GET","POST only","DELETE only"],a:0,e:"GET is commonly used to retrieve a representation of a resource."},
 {q:"What does status code 500 indicate?",o:["Permanent redirect","Client authentication missing","Internal Server Error"],a:2,e:"500 is a generic server-side error response."}
];
function renderQuiz(){
 const root=document.querySelector("#quiz");root.innerHTML="";
 quiz.forEach((item,i)=>{
  const wrap=document.createElement("div");wrap.className="quiz-question";
  const q=document.createElement("p");q.textContent=`${i+1}. ${item.q}`;wrap.appendChild(q);
  item.o.forEach((option,j)=>{const label=document.createElement("label"),input=document.createElement("input");input.type="radio";input.name="q"+i;input.value=j;label.append(input,document.createTextNode(option));wrap.appendChild(label);});
  root.appendChild(wrap);
 });
}
function checkQuiz(){
 let score=0;const root=document.querySelector("#quiz");
 quiz.forEach((item,i)=>{
  const chosen=root.querySelector(`input[name="q${i}"]:checked`);const wrap=root.children[i];
  const old=wrap.querySelector(".explanation");if(old)old.remove();
  const exp=document.createElement("p");exp.className="explanation muted";
  if(chosen&&Number(chosen.value)===item.a){score++;exp.textContent="Correct. "+item.e;exp.style.color="var(--green)";}
  else{exp.textContent="Explanation: "+item.e;exp.style.color="var(--cyan)";}
  wrap.appendChild(exp);
 });
 document.querySelector("#quiz-feedback").textContent=`Your score: ${score}/${quiz.length}. ${score===quiz.length?"Excellent work!":"Review the explanations and try again."}`;
}
requestSelect.addEventListener("change",renderRequest);
document.querySelector("#status-search").addEventListener("input",renderStatuses);
document.querySelector("#http-mode").addEventListener("click",()=>renderComparison("http"));
document.querySelector("#https-mode").addEventListener("click",()=>renderComparison("https"));
document.querySelector("#check-quiz").addEventListener("click",checkQuiz);
document.querySelector("#retry-quiz").addEventListener("click",()=>{renderQuiz();document.querySelector("#quiz-feedback").textContent="Quiz reset. Try again.";});
renderRequest();renderStatuses();renderComparison("http");renderQuiz();
