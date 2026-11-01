const $ = (id) => document.getElementById(id);
const initial = {method:"GET",host:"learn.example.test",path:"/account/profile",data:"user=student&theme=dark"};
function safePath(path){return path.startsWith("/") ? path : "/"+path;}
function buildSimulation(){
  const method=$("method").value;
  const host=$("host").value;
  const path=safePath($("path").value.trim());
  const data=$("sampleData").value.trim();
  if(!path || path.length>80 || /[\s\r\n]/.test(path) || !/^\/[A-Za-z0-9._~!$&'()*+,;=:@%/-]*$/.test(path)){
    $("validationMessage").className="form-message error";
    $("validationMessage").textContent="Enter a valid path beginning with / and use only URL path characters.";
    return;
  }
  if(data.length>120 || /[\r\n]/.test(data)){
    $("validationMessage").className="form-message error";
    $("validationMessage").textContent="Sample data must be one line and no longer than 120 characters.";
    return;
  }
  $("validationMessage").className="form-message";
  $("validationMessage").textContent="Comparison updated. This is a local illustration, not a real network request.";
  const plain=`${method} ${path} HTTP/1.1\nHost: ${host}\nContent-Type: text/plain\n\n${data || "(no sample body)"}`;
  $("httpPacket").textContent=plain;
  // Deliberately not encryption: use a clear placeholder to avoid implying a real TLS implementation.
  $("httpsPacket").textContent=`TLS-protected application data\n\n[encrypted payload placeholder]\n\nDestination: ${host}\nVisible metadata may include connection IP, timing, and size.\n\nNote: this is a conceptual display, not actual TLS ciphertext.`;
  $("httpObserver").innerHTML="<li>In this simplified example, the method, host, path, and sample data are readable.</li><li>Real network visibility depends on the network path and configuration.</li>";
  $("httpsObserver").innerHTML="<li>HTTP content is protected by TLS in transit when HTTPS is correctly configured.</li><li>Some metadata, such as destination IP, timing, and traffic size, may still be observable.</li><li>The destination server can read the request after TLS termination.</li>";
}
$("runBoth").addEventListener("click",buildSimulation);
$("reset").addEventListener("click",()=>{
  $("method").value=initial.method;$("host").value=initial.host;$("path").value=initial.path;$("sampleData").value=initial.data;
  $("httpPacket").textContent="Choose “Compare HTTP and HTTPS” to build the example packet.";
  $("httpsPacket").textContent="Choose “Compare HTTP and HTTPS” to build the example packet.";
  $("httpObserver").innerHTML="<li>Request path and sample data are shown as readable text.</li>";
  $("httpsObserver").innerHTML="<li>In a typical TLS connection, payload contents are encrypted; some connection metadata may remain visible.</li>";
  $("validationMessage").textContent=""; $("validationMessage").className="form-message";
});
const questions=[
 {q:"Which protocol protects HTTP content in transit using TLS?",opts:[["http","HTTP only"],["https","HTTPS"],["both","Neither"]],answer:"https",why:"HTTPS is HTTP carried over TLS, which protects content in transit when configured correctly."},
 {q:"Does HTTPS guarantee that a website is honest?",opts:[["yes","Yes, always"],["no","No"],["only","Only on mobile"]],answer:"no",why:"HTTPS protects the connection, but phishing or dishonest sites can also use HTTPS."},
 {q:"Can the destination server read data sent through HTTPS?",opts:[["no","No, never"],["yes","Yes, after TLS is terminated"],["only-http","Only if HTTP is used"]],answer:"yes",why:"TLS protects data in transit; the intended server processes the request after the encrypted connection is terminated."},
 {q:"What is TLS primarily used for in HTTPS?",opts:[["colors","Changing page colors"],["protection","Protecting data in transit"],["dns","Replacing DNS"]],answer:"protection",why:"TLS provides protections such as confidentiality and integrity for data in transit, with server authentication based on certificate validation."}
];
let qIndex=0, answered=false;
function renderQuestion(){
 const q=questions[qIndex]; answered=false;$("quizQuestion").textContent=q.q;$("quizFeedback").textContent="";$("quizFeedback").className="form-message";
 $("quizOptions").innerHTML=q.opts.map(([value,label])=>`<button class="quiz-option" data-answer="${value}">${label}</button>`).join("");
 $("quizOptions").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
   if(answered)return;answered=true;const correct=btn.dataset.answer===q.answer;
   btn.classList.add(correct?"correct":"incorrect");
   $("quizOptions").querySelectorAll("button").forEach(b=>{b.disabled=true;if(b.dataset.answer===q.answer)b.classList.add("correct")});
   $("quizFeedback").className="form-message"+(correct?"":" error");
   $("quizFeedback").textContent=(correct?"Correct. ":"Not quite. ")+q.why;
 }));
}
$("nextQuestion").addEventListener("click",()=>{qIndex=(qIndex+1)%questions.length;renderQuestion()});
renderQuestion();
