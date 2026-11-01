(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  let srQ = 0, dQ = 0, lastSampled = null, clock = 0, counter = 0, pulseCount = 0, score = 0;
  let challenge = null, challengeDone = false;
  const quiz = [
    {q:"What is the main difference between combinational and sequential circuits?",options:["Sequential circuits store state","Combinational circuits always use a clock","Sequential circuits cannot have outputs","There is no difference"],answer:0,explain:"Sequential circuits have state or memory; combinational outputs depend only on current inputs."},
    {q:"For this active-high SR latch model, what does S = 1 and R = 0 do?",options:["Reset Q to 0","Set Q to 1","Hold Q","Create a clock pulse"],answer:1,explain:"S=1 sets Q to 1 when R=0."},
    {q:"When does this D flip-flop sample D?",options:["Whenever D changes","On the simulated rising clock edge","Only when D is 0","On every falling edge"],answer:1,explain:"This lab models a positive-edge-triggered D flip-flop."},
    {q:"What is the maximum unsigned value of a 4-bit counter?",options:["4","8","15","16"],answer:2,explain:"Four bits represent 16 states, from 0 through 15."},
    {q:"What happens to this 4-bit counter after 1111 receives another pulse?",options:["It stays at 1111","It becomes 0000","It becomes 10000","It resets the browser"],answer:1,explain:"A 4-bit modulo-16 counter wraps from 15 to 0."}
  ];
  function bit(id){return $(id).checked?1:0;}
  function label(id,value){$(id).textContent=value;}
  function feedback(el,msg,error=false){el.textContent=msg;el.classList.toggle("error",error);}
  function addLog(message){
    const log=$("eventLog"),li=document.createElement("li");
    li.textContent=message;log.prepend(li);
    while(log.children.length>8)log.lastElementChild.remove();
  }
  function updateSR(){
    const s=bit("srS"),r=bit("srR");
    label("srSLabel",s);label("srRLabel",r);
    const rows=["srRow00","srRow10","srRow01","srRow11"];
    rows.forEach(id=>$(id).classList.remove("active-row"));
    $(s===0&&r===0?"srRow00":s===1&&r===0?"srRow10":s===0&&r===1?"srRow01":"srRow11").classList.add("active-row");
    if(s===1&&r===1){
      feedback($("srFeedback"),"Invalid SR latch input: S and R are both 1. Output is not defined for this simplified model.",true);
      $("srQ").textContent="!";$("srQbar").textContent="!";
      return;
    }
    if(s===1)srQ=1;else if(r===1)srQ=0;
    $("srQ").textContent=srQ;$("srQbar").textContent=1-srQ;
    feedback($("srFeedback"),s===1?"SET: Q is stored as 1.":r===1?"RESET: Q is stored as 0.":"HOLD: both inputs are 0, so the previous state is retained.");
  }
  function updateDLabel(){label("dInputLabel",bit("dInput"));}
  function pulseClock(){
    const data=bit("dInput");
    clock=1;$("clockValue").textContent="1";$("clockEdge").textContent="Rising edge detected";
    dQ=data;lastSampled=data;$("dQ").textContent=dQ;$("lastD").textContent=lastSampled;
    addLog(`Rising edge: D=${data} sampled, Q becomes ${dQ}.`);
    // A simulated pulse returns the clock to low immediately after sampling.
    clock=0;$("clockValue").textContent="0";$("clockEdge").textContent="Pulse complete · ready";
  }
  function updateCounter(){
    const bits=counter.toString(2).padStart(4,"0");
    const root=$("counterBits");root.replaceChildren();
    [...bits].forEach((value,index)=>{
      const cell=document.createElement("div");cell.className=`counter-bit${value==="1"?" on":""}`;
      const span=document.createElement("span");span.textContent=`BIT ${3-index}`;
      const strong=document.createElement("strong");strong.textContent=value;
      cell.append(span,strong);root.appendChild(cell);
    });
    $("counterDecimal").textContent=counter;$("counterHex").textContent=`0x${counter.toString(16).toUpperCase()}`;
    $("counterPulses").textContent=pulseCount;$("counterProgress").style.width=`${counter/15*100}%`;
  }
  function countPulse(){
    const previous=counter;counter=(counter+1)%16;pulseCount++;
    updateCounter();
    $("counterMessage").textContent=previous===15?"Overflow: 1111 + one pulse wraps to 0000.":`Clock pulse ${pulseCount}: counter is now ${counter.toString(2).padStart(4,"0")} (${counter}).`;
  }
  const challengePool=[
    {type:"SR LATCH",prompt:"Current Q = 0; S = 1, R = 0",sub:"What is the next stored Q?",options:["0","1","Undefined"],answer:1,explain:"S=1 and R=0 sets Q to 1."},
    {type:"SR LATCH",prompt:"Current Q = 1; S = 0, R = 0",sub:"What happens to Q?",options:["Changes to 0","Changes to 1","Holds at 1"],answer:2,explain:"With S=R=0, the latch holds its previous state."},
    {type:"D FLIP-FLOP",prompt:"D = 1 at a rising clock edge",sub:"What does Q become?",options:["0","1","It always toggles"],answer:1,explain:"A D flip-flop copies D into Q on the active rising edge."},
    {type:"D FLIP-FLOP",prompt:"Q = 0; D changes to 1 but no clock edge occurs",sub:"What is Q before the next rising edge?",options:["0","1","Undefined"],answer:0,explain:"The stored output remains 0 until the next rising edge samples D."},
    {type:"4-BIT COUNTER",prompt:"Current count = 1111; one pulse arrives",sub:"What is the new count?",options:["1111","0000","10000"],answer:1,explain:"The 4-bit modulo-16 counter wraps from 15 to 0."},
    {type:"4-BIT COUNTER",prompt:"Current count = 0101; one pulse arrives",sub:"What is the new count?",options:["0100","0110","1010"],answer:1,explain:"0101 is decimal 5; after one pulse it becomes 0110, decimal 6."}
  ];
  function loadChallenge(){
    const old=challenge;do{challenge=challengePool[Math.floor(Math.random()*challengePool.length)];}while(challengePool.length>1&&challenge===old);
    challengeDone=false;$("challengeType").textContent=challenge.type;$("challengePrompt").textContent=challenge.prompt;$("challengeSubprompt").textContent=challenge.sub;
    const root=$("challengeOptions");root.replaceChildren();
    challenge.options.forEach((option,index)=>{const button=document.createElement("button");button.type="button";button.className="answer-btn";button.textContent=option;button.addEventListener("click",()=>answerChallenge(index));root.appendChild(button);});
    feedback($("challengeFeedback"),"Choose an answer to check your understanding.");
  }
  function answerChallenge(index){
    if(challengeDone)return;challengeDone=true;const correct=index===challenge.answer;
    if(correct){score+=10;$("score").textContent=score;}
    [...$("challengeOptions").children].forEach((button,i)=>{button.disabled=true;if(i===challenge.answer)button.style.borderColor="var(--green)";});
    feedback($("challengeFeedback"),`${correct?"Correct! +10 points. ":"Not quite. "}${challenge.explain}`,!correct);
  }
  function renderQuiz(){
    const root=$("quizQuestions");
    quiz.forEach((item,index)=>{
      const wrapper=document.createElement("div");wrapper.className="quiz-question";
      const fieldset=document.createElement("fieldset"),legend=document.createElement("legend");
      legend.textContent=`${index+1}. ${item.q}`;fieldset.appendChild(legend);
      item.options.forEach((option,optionIndex)=>{
        const labelEl=document.createElement("label");labelEl.className="quiz-option";
        const input=document.createElement("input");input.type="radio";input.name=`quiz-${index}`;input.value=optionIndex;
        const span=document.createElement("span");span.textContent=option;labelEl.append(input,span);fieldset.appendChild(labelEl);
      });
      const explain=document.createElement("p");explain.className="muted small";explain.id=`quiz-explain-${index}`;explain.hidden=true;
      wrapper.append(fieldset,explain);root.appendChild(wrapper);
    });
  }
  ["srS","srR"].forEach(id=>$(id).addEventListener("change",updateSR));
  $("srReset").addEventListener("click",()=>{srQ=0;$("srS").checked=false;$("srR").checked=false;updateSR();});
  $("dInput").addEventListener("change",updateDLabel);
  $("clockPulseBtn").addEventListener("click",pulseClock);
  $("dResetBtn").addEventListener("click",()=>{dQ=0;lastSampled=null;$("dQ").textContent="0";$("lastD").textContent="—";addLog("Manual reset: Q cleared to 0.");});
  $("clearLogBtn").addEventListener("click",()=>{$("eventLog").replaceChildren();addLog("Event log cleared.");});
  $("countPulseBtn").addEventListener("click",countPulse);
  $("countFiveBtn").addEventListener("click",()=>{for(let i=0;i<5;i++)countPulse();});
  $("countResetBtn").addEventListener("click",()=>{counter=0;pulseCount=0;updateCounter();$("counterMessage").textContent="Counter reset to 0000.";});
  $("newChallengeBtn").addEventListener("click",loadChallenge);
  $("quizSubmitBtn").addEventListener("click",()=>{
    let correct=0,answered=0;
    quiz.forEach((item,index)=>{
      const selected=document.querySelector(`input[name="quiz-${index}"]:checked`);
      const wrapper=document.querySelectorAll(".quiz-question")[index],explanation=$(`quiz-explain-${index}`);
      wrapper.classList.remove("correct","incorrect");
      if(selected){answered++;const ok=Number(selected.value)===item.answer;if(ok)correct++;wrapper.classList.add(ok?"correct":"incorrect");explanation.textContent=`${ok?"Correct. ":"Review: "}${item.explain}`;}
      else{wrapper.classList.add("incorrect");explanation.textContent=`Not answered. ${item.explain}`;}
      explanation.hidden=false;
    });
    feedback($("quizFeedback"),`Score: ${correct}/${quiz.length}. Answered: ${answered}/${quiz.length}. Review the explanations above.`);
  });
  updateSR();updateDLabel();updateCounter();renderQuiz();loadChallenge();
})();