const scenarios = [
  {
    id:1, short:"Account security alert", sender:"Account Protection Team", address:"security-alert@secure-mail.example", recipient:"student@example.test", subject:"Unusual sign-in attempt detected", received:"Today, 08:42 AM", greeting:"Hello,",
    message:"We noticed a sign-in attempt that may not have been made by you. The message asks you to confirm your account immediately using the button below. It also threatens temporary account restriction if you do not act within 30 minutes.",
    link:"http://secure-mail.example.verify-user.invalid/login", attachment:"",
    clues:["Urgent 30-minute deadline","Threat of account restriction","Link uses an unrelated, deceptive domain","Unexpected request to confirm account details"],
    classification:"phishing", explanation:"This is phishing. The message uses urgency and a threat to pressure the reader, while the displayed address contains a deceptive domain that is not a trustworthy official sign-in address.",
    advice:"Do not click the link or enter credentials. Open the service's official app or type its known website address yourself, then check account alerts."
  },
  {
    id:2, short:"Campus event invitation", sender:"Student Activities Office", address:"activities@campus.example.edu", recipient:"student@example.test", subject:"Invitation: Student Technology Showcase", received:"Yesterday, 02:15 PM", greeting:"Hi students,",
    message:"The Student Activities Office invites you to the Technology Showcase on Friday at 10:00 AM in the main auditorium. The event details are available on the campus notice board and student portal. No sign-in or payment is requested in this message.",
    link:"", attachment:"",
    clues:["Expected campus-related announcement","Sender domain matches the fictional campus domain","No pressure to disclose private information","Details can be confirmed through the student portal"],
    classification:"legitimate", explanation:"This training example appears legitimate. The message gives ordinary event information, does not pressure the reader, and points to known campus channels rather than asking for sensitive details.",
    advice:"Even for routine messages, confirm event details through the official student portal or notice board if anything seems unusual."
  },
  {
    id:3, short:"Parcel delivery fee", sender:"Delivery Support", address:"updates@parcel-fees.example.net", recipient:"student@example.test", subject:"Delivery on hold — small fee required", received:"Today, 11:06 AM", greeting:"Dear customer,",
    message:"A parcel could not be delivered because of an address issue. Pay a small redelivery fee today to avoid return to sender. You may not be expecting a parcel, and the message does not identify a tracking number or the delivery company.",
    link:"https://parcel-fees.example.net/pay-now", attachment:"",
    clues:["Unexpected payment request","No tracking number or clear courier identity","Deadline creates pressure","Sender identity is difficult to verify"],
    classification:"phishing", explanation:"This is a phishing-style delivery scam. It asks for payment unexpectedly, gives no useful parcel reference, and creates urgency to make the recipient act without checking.",
    advice:"Do not pay through the message. If you are expecting a parcel, check the order in the retailer's official app or contact the courier using its published contact details."
  },
  {
    id:4, short:"Password reset notice", sender:"IT Help Desk", address:"helpdesk@support-campus.example", recipient:"student@example.test", subject:"Password reset request received", received:"Today, 09:18 AM", greeting:"Hello,",
    message:"A password reset request was received for your training account. If you made this request, continue through the official portal as usual. If you did not request a reset, contact the IT Help Desk using the phone number published on the campus website. This email does not contain a reset link.",
    link:"", attachment:"",
    clues:["No embedded reset link","Provides an independent contact route","No request to reply with a password or OTP","Still verify the sender domain independently"],
    classification:"suspicious", explanation:"Classify this as suspicious until verified. The content includes safer practices, but the sender domain is not an obvious match for the campus domain. A familiar display name alone does not prove who sent an email.",
    advice:"Do not reply or use contact details supplied only in the message. Visit the known campus website and use its published IT support contact."
  },
  {
    id:5, short:"Unexpected invoice file", sender:"Accounts Department", address:"accounts-team@billing-docs.example.org", recipient:"student@example.test", subject:"Invoice overdue — open attached document", received:"Today, 07:53 AM", greeting:"Good morning,",
    message:"Please review the attached invoice immediately. Payment is overdue and additional charges may apply. You do not recognize the sender or expect an invoice, and the message provides no account or purchase details.",
    link:"", attachment:"Invoice_Overdue_Review.html",
    clues:["Unexpected attachment","Unrecognized sender address","Threat of additional charges","No matching purchase or account details"],
    classification:"phishing", explanation:"This is a phishing example. An unexpected attachment combined with pressure about overdue payment is a strong warning sign. The fictional HTML attachment should not be opened.",
    advice:"Do not open the attachment. Verify invoices through the organization's known finance portal or a contact already on file."
  },
  {
    id:6, short:"Library opening hours", sender:"College Library", address:"library@campus.example.edu", recipient:"student@example.test", subject:"Library hours during study week", received:"Monday, 04:30 PM", greeting:"Dear students,",
    message:"During study week, the library will remain open from 8:00 AM to 8:00 PM on weekdays. The updated schedule is posted on the library notice board. Please contact the library desk in person if you need assistance.",
    link:"", attachment:"",
    clues:["Routine information relevant to students","No unexpected link or attachment","No demand for money or confidential information","Can be checked on the physical notice board"],
    classification:"legitimate", explanation:"This is a normal informational announcement in the training scenario. It does not ask the recipient to click a link, pay money, or share private information.",
    advice:"Continue to use trusted channels to confirm important announcements. A familiar name is not enough on its own—check the sender when in doubt."
  }
];

let currentId = null;
let selectedChoice = null;
let completed = {};
let score = 0;

const $ = id => document.getElementById(id);
const scenarioList = $("scenarioList");

function renderQueue(){
  scenarioList.innerHTML = "";
  scenarios.forEach(item => {
    const button = document.createElement("button");
    button.className = "scenario-item" + (item.id === currentId ? " active" : "");
    button.type = "button";
    button.innerHTML = `<span class="mail-symbol">✉</span><span class="scenario-info"><strong>${item.short}</strong><small>Training message ${String(item.id).padStart(2,"0")}</small></span><span class="item-state ${completed[item.id] ? "done" : ""}">${completed[item.id] ? "✓ DONE" : "NEW"}</span>`;
    button.addEventListener("click", () => openScenario(item.id));
    scenarioList.appendChild(button);
  });
}

function openScenario(id){
  currentId = id;
  selectedChoice = null;
  const item = scenarios.find(s => s.id === id);
  $("emptyState").classList.add("hidden");
  $("emailContent").classList.remove("hidden");
  $("emailSubjectHeading").textContent = item.short;
  $("mailBadge").textContent = completed[id] ? "REVIEWED" : "UNREAD";
  $("senderName").textContent = item.sender;
  $("senderAddress").textContent = `<${item.address}>`;
  $("recipient").textContent = item.recipient;
  $("subject").textContent = item.subject;
  $("received").textContent = item.received;
  $("emailGreeting").textContent = item.greeting;
  $("emailMessage").textContent = item.message;
  $("emailSignoff").textContent = "Regards,\\n" + item.sender;
  $("linkArea").classList.toggle("hidden", !item.link);
  $("linkText").textContent = item.link || "";
  $("attachmentArea").classList.toggle("hidden", !item.attachment);
  $("attachmentText").textContent = item.attachment ? "▧  " + item.attachment : "";
  $("clueGrid").innerHTML = item.clues.map((clue,i) => `<div class="clue"><b>0${i+1}</b><span>${clue}</span></div>`).join("");
  $("feedback").classList.add("hidden");
  $("feedback").classList.remove("incorrect");
  document.querySelectorAll(".choice").forEach(btn => {
    btn.disabled = !!completed[id];
    btn.classList.remove("selected");
  });
  $("submitBtn").disabled = true;
  if(completed[id]){
    const result = completed[id];
    showFeedback(item, result.choice, result.correct, true);
  }
  renderQueue();
}

document.querySelectorAll(".choice").forEach(button => {
  button.addEventListener("click", () => {
    if(!currentId || completed[currentId]) return;
    selectedChoice = button.dataset.choice;
    document.querySelectorAll(".choice").forEach(b => b.classList.toggle("selected", b === button));
    $("submitBtn").disabled = false;
  });
});

$("submitBtn").addEventListener("click", () => {
  if(!currentId || !selectedChoice || completed[currentId]) return;
  const item = scenarios.find(s => s.id === currentId);
  const correct = selectedChoice === item.classification;
  completed[currentId] = {choice:selectedChoice, correct};
  if(correct) score++;
  document.querySelectorAll(".choice").forEach(b => b.disabled = true);
  $("submitBtn").disabled = true;
  showFeedback(item, selectedChoice, correct, false);
  updateStats();
  renderQueue();
});

function showFeedback(item, choice, correct, alreadyDone){
  const box = $("feedback");
  box.classList.remove("hidden");
  box.classList.toggle("incorrect", !correct);
  const labels = {phishing:"Phishing", suspicious:"Suspicious", legitimate:"Legitimate"};
  box.innerHTML = `<strong>${alreadyDone ? "Your previous result: " : (correct ? "✓ Correct classification" : "✕ Not quite — review the clues")} · ${labels[choice]}</strong><span class="explain">${item.explanation}</span><br><br><b>Safer action:</b> ${item.advice}`;
  $("mailBadge").textContent = "REVIEWED";
}

function updateStats(){
  const reviewed = Object.keys(completed).length;
  const percent = Math.round(reviewed / scenarios.length * 100);
  $("reviewed").innerHTML = `${reviewed} <small>/ ${scenarios.length}</small>`;
  $("correct").textContent = score;
  $("progressText").textContent = percent + "%";
  $("progressBar").style.width = percent + "%";
  $("scoreDisplay").innerHTML = `${score} <small>/ ${scenarios.length}</small>`;
  $("scoreMessage").textContent = reviewed === scenarios.length
    ? (score >= 5 ? "Excellent work — you spotted the warning signs." : score >= 3 ? "Good effort. Review the explanations to improve." : "Keep practising. Slow down and verify each message.")
    : `${reviewed} of ${scenarios.length} scenarios completed.`;
  $("queueCount").textContent = `${scenarios.length - reviewed} LEFT`;
}

$("resetBtn").addEventListener("click", () => {
  currentId = null;
  selectedChoice = null;
  completed = {};
  score = 0;
  $("emailContent").classList.add("hidden");
  $("emptyState").classList.remove("hidden");
  $("emailSubjectHeading").textContent = "Select a message";
  $("mailBadge").textContent = "NOT OPENED";
  $("feedback").classList.add("hidden");
  document.querySelectorAll(".choice").forEach(b => { b.disabled = true; b.classList.remove("selected"); });
  $("submitBtn").disabled = true;
  updateStats();
  renderQueue();
});

updateStats();
renderQueue();
