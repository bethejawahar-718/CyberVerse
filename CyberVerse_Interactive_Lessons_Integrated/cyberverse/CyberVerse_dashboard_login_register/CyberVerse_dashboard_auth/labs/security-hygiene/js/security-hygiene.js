const habits = [
  ["Use strong, unique passwords","Create a different strong password for every important account. A password manager can help you manage them.","ACCOUNT"],
  ["Enable multi-factor authentication","Turn on MFA where available. Never approve an unexpected sign-in request or share an OTP.","ACCOUNT"],
  ["Install trusted software updates","Update your operating system, browser, and apps using official settings or trusted sources.","DEVICE"],
  ["Lock devices when unattended","Use a screen lock and lock your computer or phone whenever you step away.","DEVICE"],
  ["Back up important information","Keep regular backups in a separate, trusted location and check that you can restore them.","DATA"],
  ["Use secure networks carefully","Avoid sensitive activity on untrusted public Wi-Fi. Use approved secure access when needed.","NETWORK"],
  ["Check links and downloads","Verify website addresses and download software only from official or trusted sources.","BROWSING"],
  ["Protect personal information","Share only what is necessary. Review app permissions and privacy settings regularly.","PRIVACY"]
];

const questions = [
  {
    title:"A device update is available",
    text:"Your laptop shows an update notification. A separate pop-up on an unfamiliar website also offers a download labelled “urgent security patch.”",
    options:[
      ["Download the patch from the pop-up because it says urgent.","An unfamiliar website is not a trusted update source."],
      ["Close the pop-up and check for updates through the device's official settings.","Official update settings are the safer route."],
      ["Ignore all updates permanently to avoid problems.","Updates often fix known security weaknesses."]
    ], correct:1,
    noteTitle:"Keep software current",
    note:"Updates often include fixes for security weaknesses. Use the device's official update settings.",
    explanation:"Correct. Close the unexpected pop-up and use the operating system or application's built-in update feature. Avoid downloading patches from unfamiliar advertisements or messages."
  },
  {
    title:"You need to step away from your desk",
    text:"You are working in a shared computer lab. You need to leave your workstation for a few minutes while your account is still signed in.",
    options:[
      ["Leave the computer open because you will return shortly.","An unattended unlocked session can be misused."],
      ["Ask a nearby person to watch your screen.","A bystander is not a replacement for a screen lock."],
      ["Lock the screen before leaving the workstation.","Locking protects the active session while you are away."]
    ], correct:2,
    noteTitle:"Lock before you leave",
    note:"Use your device's screen-lock shortcut or lock option whenever you step away, even briefly.",
    explanation:"Correct. Lock the screen whenever you leave a device unattended. This helps prevent unauthorized access to your open session."
  },
  {
    title:"An unexpected file arrives",
    text:"You receive an unexpected message with an attachment named “Exam_Results_Viewer.exe.” You were not expecting a file from this sender.",
    options:[
      ["Open it quickly to see whether it contains your results.","Unexpected executable files can be unsafe."],
      ["Verify the sender through a trusted channel and do not open the file unless it is confirmed and approved.","Independent verification is safer than opening an unexpected file."],
      ["Forward it to classmates to ask whether they recognize it.","Forwarding can spread a potentially harmful file."]
    ], correct:1,
    noteTitle:"Think before opening",
    note:"Unexpected attachments should be treated cautiously. Confirm the sender and purpose through a trusted channel.",
    explanation:"Correct. Do not open or forward unexpected attachments. Verify the message independently and follow your institution's reporting process if it appears suspicious."
  },
  {
    title:"Your important files are not backed up",
    text:"Your project files are saved only on your laptop. You are preparing for an important practical exam and realize there is no backup.",
    options:[
      ["Create a backup in a trusted location and check that files can be restored.","A tested backup helps recover from loss or device failure."],
      ["Wait until the laptop shows signs of failure.","Backups should be made before something goes wrong."],
      ["Send all files to an unknown online storage link.","Unknown storage services may expose your information."]
    ], correct:0,
    noteTitle:"Back up and test",
    note:"Keep regular backups in a separate, trusted location. A backup is useful only if your files can be restored.",
    explanation:"Correct. Make a backup using a trusted storage method and periodically check that important files can be restored."
  }
];

let checkedHabits = new Set();
let currentQuestion = 0;
let selectedOption = null;
let answers = {};
const $ = id => document.getElementById(id);

function renderHabits(){
  $("habitList").innerHTML = "";
  habits.forEach((habit,i) => {
    const label = document.createElement("label");
    label.className = "habit" + (checkedHabits.has(i) ? " checked" : "");
    label.innerHTML = `<input type="checkbox" ${checkedHabits.has(i) ? "checked" : ""}><span class="habit-text"><strong>${habit[0]}</strong><small>${habit[1]}</small></span><span class="habit-tag">${checkedHabits.has(i) ? "DONE" : habit[2]}</span>`;
    label.querySelector("input").addEventListener("change", e => {
      if(e.target.checked) checkedHabits.add(i); else checkedHabits.delete(i);
      renderHabits();
      updateStats();
    });
    $("habitList").appendChild(label);
  });
}

function renderQuestion(){
  const q = questions[currentQuestion];
  selectedOption = null;
  $("questionCount").textContent = `SITUATION 0${currentQuestion+1} / 04`;
  $("questionTitle").textContent = q.title;
  $("questionText").textContent = q.text;
  $("fieldNoteTitle").textContent = q.noteTitle;
  $("fieldNote").textContent = q.note;
  $("answerOptions").innerHTML = "";
  q.options.forEach((option,i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "option";
    b.innerHTML = `<span class="letter">${String.fromCharCode(65+i)}</span><span><strong>${option[0]}</strong><small>${option[1]}</small></span>`;
    b.addEventListener("click", () => chooseOption(i));
    $("answerOptions").appendChild(b);
  });
  $("answerFeedback").classList.add("hidden");
  $("answerFeedback").classList.remove("bad");
  $("checkAnswer").disabled = true;
  $("previousQuestion").disabled = currentQuestion === 0;
  $("nextQuestion").disabled = !answers[currentQuestion] || currentQuestion === questions.length-1;
  if(answers[currentQuestion]){
    document.querySelectorAll(".option").forEach((b,i) => {
      b.disabled = true;
      if(i === answers[currentQuestion].choice) b.classList.add("selected");
    });
    showFeedback(q,answers[currentQuestion].choice,answers[currentQuestion].correct,true);
  }
  updateQuizProgress();
}

function chooseOption(index){
  if(answers[currentQuestion]) return;
  selectedOption = index;
  document.querySelectorAll(".option").forEach((b,i) => b.classList.toggle("selected",i===index));
  $("checkAnswer").disabled = false;
}

$("checkAnswer").addEventListener("click", () => {
  if(selectedOption === null || answers[currentQuestion]) return;
  const q = questions[currentQuestion];
  const correct = selectedOption === q.correct;
  answers[currentQuestion] = {choice:selectedOption,correct};
  document.querySelectorAll(".option").forEach(b => b.disabled = true);
  $("checkAnswer").disabled = true;
  showFeedback(q,selectedOption,correct,false);
  updateStats();
  updateQuizProgress();
});

function showFeedback(q,choice,correct,review){
  const box = $("answerFeedback");
  box.classList.remove("hidden");
  box.classList.toggle("bad",!correct);
  box.innerHTML = `<strong>${review ? "Your saved answer" : (correct ? "✓ Correct — safe practice" : "✕ Not the safest choice")}</strong>${q.explanation}`;
}

function updateQuizProgress(){
  const done = Object.keys(answers).length;
  $("quizProgress").style.width = (done / questions.length * 100) + "%";
  $("quizProgressText").textContent = `${done} OF 4 ANSWERED`;
  $("nextQuestion").disabled = !answers[currentQuestion] || currentQuestion === questions.length-1;
}

function updateStats(){
  const habitCount = checkedHabits.size;
  const pct = Math.round(habitCount / habits.length * 100);
  $("checksDone").innerHTML = `${habitCount} <sup>/ 8</sup>`;
  $("habitsDone").textContent = habitCount;
  $("progressValue").textContent = pct + "%";
  $("progressFill").style.width = pct + "%";
  const score = Object.values(answers).filter(a => a.correct).length;
  const answered = Object.keys(answers).length;
  $("finalScore").innerHTML = `${score} <sup>/ 4</sup>`;
  $("resultText").textContent = answered === 4
    ? (score === 4 ? "Excellent! You chose safe actions in every situation." : score >= 3 ? "Good work. Review the feedback to strengthen your habits." : "Keep practising. Review each explanation and build safer routines.")
    : `Answer the four situations to see your result. ${answered} of 4 completed.`;
}

$("previousQuestion").addEventListener("click", () => {
  if(currentQuestion > 0){ currentQuestion--; renderQuestion(); }
});
$("nextQuestion").addEventListener("click", () => {
  if(currentQuestion < questions.length-1 && answers[currentQuestion]){ currentQuestion++; renderQuestion(); }
});
$("resetChecks").addEventListener("click", () => {
  checkedHabits.clear();
  renderHabits();
  updateStats();
});
$("restartModule").addEventListener("click", () => {
  checkedHabits.clear();
  currentQuestion = 0;
  selectedOption = null;
  answers = {};
  renderHabits();
  renderQuestion();
  updateStats();
});

renderHabits();
renderQuestion();
updateStats();
