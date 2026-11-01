(() => {
"use strict";
const $ = id => document.getElementById(id);
const U32 = (1n << 32n) - 1n;
const pow2 = n => 1n << BigInt(n);
function parseIPv4(value) {
  const parts = value.trim().split(".");
  if (parts.length !== 4 || parts.some(p => !/^(0|[1-9]\d{0,2})$/.test(p))) return null;
  const octets = parts.map(Number);
  if (octets.some(n => n < 0 || n > 255)) return null;
  return {octets, value: octets.reduce((acc, n) => (acc << 8n) | BigInt(n), 0n)};
}
function toIPv4(value) {
  return [24n,16n,8n,0n].map(shift => Number((value >> shift) & 255n)).join(".");
}
function maskFor(prefix) { return prefix === 0 ? 0n : (U32 ^ (pow2(32-prefix)-1n)); }
function bits32(value) { return value.toString(2).padStart(32,"0"); }
function calculate(ipText, prefixText) {
  const parsed = parseIPv4(ipText);
  if (!parsed) throw new Error("Enter a valid IPv4 address with four decimal octets from 0 to 255, such as 192.168.1.75.");
  if (prefixText.trim() === "" || !/^\d+$/.test(prefixText.trim())) throw new Error("CIDR prefix must be a whole number from 0 to 32.");
  const prefix = Number(prefixText);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) throw new Error("CIDR prefix must be between /0 and /32.");
  const mask = maskFor(prefix), wildcard = U32 ^ mask, network = parsed.value & mask, broadcast = network | wildcard;
  const total = pow2(32-prefix);
  let range, hostNote, broadcastText, broadcastNote, usableText, capacity;
  if (prefix <= 30) {
    const first = network + 1n, last = broadcast - 1n;
    range = `${toIPv4(first)} – ${toIPv4(last)}`;
    capacity = total - 2n;
    hostNote = `${capacity.toString()} traditionally usable host addresses`;
    broadcastText = toIPv4(broadcast);
    broadcastNote = "Traditional directed broadcast address";
    usableText = capacity.toString();
  } else if (prefix === 31) {
    range = `${toIPv4(network)} – ${toIPv4(broadcast)}`;
    capacity = 2n;
    hostNote = "2 usable endpoints for point-to-point links (RFC 3021)";
    broadcastText = "N/A for /31";
    broadcastNote = "Both addresses are endpoints; no directed broadcast";
    usableText = "2";
  } else {
    range = toIPv4(network);
    capacity = 1n;
    hostNote = "One address: the /32 host route";
    broadcastText = "N/A for /32";
    broadcastNote = "Single-host route; no subnet broadcast";
    usableText = "1";
  }
  return {parsed,prefix,mask,wildcard,network,broadcast,total,range,hostNote,broadcastText,broadcastNote,usableText,capacity};
}
let current=null, challengeIndex=0, challengeScore=0, solved=new Set();
const challenges=[
 {type:"Network address",question:"For 192.168.10.77/26, enter the network address.",answer:"192.168.10.64",hint:"A /26 mask has 255.255.255.192. Find the 64-address block containing .77.",explain:"A /26 has blocks of 64 addresses in the final octet: 0–63, 64–127, and so on. .77 is in 64–127."},
 {type:"Broadcast address",question:"For 10.20.30.9/29, enter the broadcast address.",answer:"10.20.30.15",hint:"A /29 subnet contains 8 total addresses. Find the block of eight containing .9.",explain:"The block containing .9 is 10.20.30.8 through 10.20.30.15, so the final address is the broadcast."},
 {type:"Host capacity",question:"How many traditionally usable host addresses are in a 192.168.5.0/27 subnet? Enter a number.",answer:"30",hint:"A /27 leaves 5 host bits. Find total addresses, then apply the traditional network/broadcast reservation.",explain:"Five host bits provide 2⁵ = 32 addresses. For /27, the traditional usable host count is 32 − 2 = 30."},
 {type:"Special prefix",question:"For 198.51.100.8/31 on a point-to-point link, how many endpoint addresses are usable under RFC 3021?",answer:"2",hint:"A /31 contains exactly two addresses. Point-to-point links can use both as endpoints.",explain:"RFC 3021 allows both addresses in a /31 point-to-point subnet to be used as endpoints."}
];
const quiz=[
 {q:"What does the /24 in 192.168.1.10/24 specify?",o:["24 host bits","24 network-prefix bits","24 total addresses","24 octets"],a:1,e:"/24 means the first 24 of the 32 IPv4 bits form the network prefix."},
 {q:"What is the dotted-decimal subnet mask for /26?",o:["255.255.255.0","255.255.255.128","255.255.255.192","255.255.255.224"],a:2,e:"A /26 mask has 26 leading one-bits: 255.255.255.192."},
 {q:"For a traditional IPv4 /27 subnet, how many usable host addresses are available?",o:["16","30","32","34"],a:1,e:"A /27 has 5 host bits, giving 32 total addresses. The traditional usable count is 32 − 2 = 30."},
 {q:"How should a /31 subnet be treated for a point-to-point link under RFC 3021?",o:["Zero endpoints are usable","One endpoint is usable","Both addresses are usable endpoints","It always has 30 usable hosts"],a:2,e:"RFC 3021 allows both /31 addresses to be used as endpoints on point-to-point links."},
 {q:"What is the most accurate description of an IPv4 /32 prefix?",o:["A network with 32 usable hosts","A single-address host route","A subnet with 32 network octets","A default route"],a:1,e:"A /32 prefix identifies one IPv4 address and is commonly used as a host route."}
];
function setText(id,text){$(id).textContent=text;}
function renderBinary(result){
 const root=$("binaryRows");root.replaceChildren();
 const addressBits=bits32(result.parsed.value), maskBits=bits32(result.mask);
 for(let octet=0;octet<4;octet++){
  const row=document.createElement("div");row.className="binary-row";
  const label=document.createElement("span");label.className="octet-label";label.textContent=`Octet ${octet+1}`;row.appendChild(label);
  const group=document.createElement("div");group.className="bit-octet";
  for(let bit=0;bit<8;bit++){
   const idx=octet*8+bit, el=document.createElement("span");el.className="bit"+(maskBits[idx]==="1"?" network":"");el.textContent=addressBits[idx];el.title=`Address bit ${idx+1}; ${maskBits[idx]==="1"?"network bit":"host bit"}`;group.appendChild(el);
  }
  row.appendChild(group);
  const maskGroup=document.createElement("div");maskGroup.className="bit-octet";
  for(let bit=0;bit<8;bit++){const idx=octet*8+bit,el=document.createElement("span");el.className="bit"+(maskBits[idx]==="1"?" network":"");el.textContent=maskBits[idx];el.title=`Subnet mask bit ${idx+1}`;maskGroup.appendChild(el);}
  row.appendChild(maskGroup);
  const addressLabel=document.createElement("span");addressLabel.className="sr-only";addressLabel.textContent="Address and mask bits shown above";row.appendChild(addressLabel);
  root.appendChild(row);
 }
 // Add a clear column header row for the bit groups.
 const header=document.createElement("div");header.className="binary-row";
 header.innerHTML='<span class="octet-label">BIT VIEW</span><span class="binary-col-label">Address bits</span><span class="binary-col-label">Mask bits</span>';
 root.prepend(header);
 setText("networkBits",String(result.prefix));setText("hostBits",String(32-result.prefix));setText("maskBinary",bits32(result.mask).match(/.{8}/g).join("."));
 setText("binaryExplanation",`Address ${toIPv4(result.parsed.value)} has ${result.prefix} network-prefix bit(s) and ${32-result.prefix} host bit(s). In the mask view, 1 means network and 0 means host. The network address is ${toIPv4(result.network)}.`);
}
function updateResults(r){
 current=r;
 setText("networkAddress",toIPv4(r.network));setText("broadcastAddress",r.broadcastText);setText("broadcastNote",r.broadcastNote);setText("hostRange",r.range);setText("hostNote",r.hostNote);setText("subnetMask",toIPv4(r.mask));setText("wildcardMask",`Wildcard: ${toIPv4(r.wildcard)}`);setText("totalAddresses",r.total.toString());setText("hostCapacity",r.hostNote);setText("addressClass",toIPv4(r.parsed.value));setText("prefixSummary",`${r.prefix} network bits · ${32-r.prefix} host bits`);renderBinary(r);
}
function runCalculator(event){if(event)event.preventDefault();$("inputError").hidden=true;try{const r=calculate($("ipAddress").value,$("prefix").value);updateResults(r);}catch(err){$("inputError").textContent=err.message;$("inputError").hidden=false;}}
function renderChallenge(){const c=challenges[challengeIndex];setText("challengeCounter",`CHALLENGE ${String(challengeIndex+1).padStart(2,"0")} / ${challenges.length}`);setText("challengeType",c.type);setText("challengeQuestion",c.question);$("challengeAnswer").value="";$("challengeAnswer").disabled=false;$("checkChallenge").disabled=false;$("nextChallenge").disabled=true;$("challengeHint").hidden=true;$("challengeHint").textContent=c.hint;setText("challengeFeedback","Type your answer and check it.");$("challengeFeedback").classList.remove("error");$("showHint").disabled=false;}
function normalizeAnswer(value){return value.trim().replace(/\s+/g,"").replace(/\/$/,"").toLowerCase();}
function checkChallenge(){const answer=$("challengeAnswer").value;if(!answer.trim()){setText("challengeFeedback","Enter an answer before checking.");$("challengeFeedback").classList.add("error");return;}const c=challenges[challengeIndex],ok=normalizeAnswer(answer)===normalizeAnswer(c.answer);if(ok){if(!solved.has(challengeIndex)){solved.add(challengeIndex);challengeScore+=10;setText("challengeScore",challengeScore);}setText("challengeFeedback",`Correct! +10 points. ${c.explain}`);$("challengeFeedback").classList.remove("error");}else{setText("challengeFeedback",`Not quite. ${c.explain}`);$("challengeFeedback").classList.add("error");} $("challengeAnswer").disabled=true;$("checkChallenge").disabled=true;$("nextChallenge").disabled=false;$("showHint").disabled=true;}
function nextChallenge(){if(challengeIndex<challenges.length-1){challengeIndex++;renderChallenge();}else{setText("challengeFeedback",`Challenge set complete: ${solved.size}/${challenges.length} solved correctly. Score: ${challengeScore}/${challenges.length*10}.`);$("nextChallenge").disabled=true;}}
function resetChallenge(){challengeIndex=0;challengeScore=0;solved.clear();setText("challengeScore","0");renderChallenge();}
function renderQuiz(){const root=$("quizQuestions");root.replaceChildren();quiz.forEach((item,i)=>{const wrap=document.createElement("div");wrap.className="quiz-question";const fs=document.createElement("fieldset"),legend=document.createElement("legend");legend.textContent=`${i+1}. ${item.q}`;fs.appendChild(legend);item.o.forEach((option,j)=>{const label=document.createElement("label");label.className="quiz-option";const input=document.createElement("input");input.type="radio";input.name=`quiz${i}`;input.value=String(j);const span=document.createElement("span");span.textContent=option;label.append(input,span);fs.appendChild(label);});const explanation=document.createElement("p");explanation.className="quiz-explanation";explanation.id=`quizExplanation${i}`;explanation.hidden=true;wrap.append(fs,explanation);root.appendChild(wrap);});}
function checkQuiz(){let correct=0,answered=0;quiz.forEach((item,i)=>{const answer=document.querySelector(`input[name="quiz${i}"]:checked`),wrap=document.querySelectorAll(".quiz-question")[i],explain=$(`quizExplanation${i}`);wrap.classList.remove("correct","incorrect");const ok=!!answer&&Number(answer.value)===item.a;if(answer)answered++;if(ok)correct++;wrap.classList.add(ok?"correct":"incorrect");explain.textContent=`${ok?"Correct. ":answer?"Review. ":"Not answered. "}${item.e}`;explain.hidden=false;});setText("quizFeedback",`Quiz score: ${correct}/5. Answered ${answered}/5. Review the explanations below each question.`);$("quizFeedback").classList.toggle("error",correct<5);}
function resetQuiz(){renderQuiz();setText("quizFeedback","Answer the questions, then check your work.");$("quizFeedback").classList.remove("error");}
$("calculatorForm").addEventListener("submit",runCalculator);
$("ipAddress").addEventListener("input",()=>{$("inputError").hidden=true;});
$("prefix").addEventListener("input",()=>{$("inputError").hidden=true;});
$("useExample").addEventListener("click",()=>{$("ipAddress").value="192.168.1.75";$("prefix").value="26";runCalculator();});
$("copySummary").addEventListener("click",async()=>{if(!current)return;const r=current;const text=`IPv4: ${toIPv4(r.parsed.value)}/${r.prefix}\nNetwork: ${toIPv4(r.network)}\nBroadcast: ${r.broadcastText}\nUsable range: ${r.range}\nSubnet mask: ${toIPv4(r.mask)}\nWildcard mask: ${toIPv4(r.wildcard)}\nTotal addresses: ${r.total}\nHost note: ${r.hostNote}\nEducational calculation only; no live network activity.`;try{await navigator.clipboard.writeText(text);setText("copyFeedback","Summary copied.");}catch{setText("copyFeedback","Clipboard access unavailable. You can select and copy the displayed results.");}});
$("checkChallenge").addEventListener("click",checkChallenge);$("nextChallenge").addEventListener("click",nextChallenge);$("resetChallenge").addEventListener("click",resetChallenge);$("showHint").addEventListener("click",()=>{$("challengeHint").hidden=false;});
$("checkQuiz").addEventListener("click",checkQuiz);$("resetQuiz").addEventListener("click",resetQuiz);
runCalculator();renderChallenge();renderQuiz();
})();