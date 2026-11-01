(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  let score = 0;
  let challenge = null;
  let challengeDone = false;

  const quiz = [
    {q:"What are the two outputs of a half adder?",options:["Input and output","SUM and CARRY","A and B","SUM and borrow"],answer:1,explain:"A half adder produces SUM and CARRY."},
    {q:"Why does a full adder have a carry-in input?",options:["To reset the circuit","To accept carry from a previous bit position","To select a data input","To decode a binary address"],answer:1,explain:"Carry-in lets full adders be chained to add multi-bit numbers."},
    {q:"What does a 4-to-1 multiplexer do?",options:["Adds four bits","Routes one of four data inputs to the output","Turns four outputs on at once","Converts decimal to binary"],answer:1,explain:"The select lines choose which one of the four data inputs reaches the output."},
    {q:"For a 4-to-1 MUX, which select value chooses D2?",options:["00","01","10","11"],answer:2,explain:"S1S0 = 10 selects D2."},
    {q:"In an active-high 2-to-4 decoder, how many outputs are active for a valid input?",options:["None","One","Two","All four"],answer:1,explain:"Exactly one output line is set to 1 for each of the four input combinations."}
  ];

  function bit(id){return $(id).checked ? 1 : 0;}
  function setLabel(id, value){$(id).textContent = value;}
  function addRow(tbody, values, active){
    const tr=document.createElement("tr");
    if(active) tr.className="active-row";
    values.forEach(value=>{const td=document.createElement("td");td.textContent=value;tr.appendChild(td);});
    tbody.appendChild(tr);
  }
  function buildTruthTables(){
    $("haTable").replaceChildren();
    for(let a=0;a<=1;a++) for(let b=0;b<=1;b++){
      addRow($("haTable"),[a,b,a^b,a&b],a===bit("haA")&&b===bit("haB"));
    }
    $("faTable").replaceChildren();
    for(let a=0;a<=1;a++) for(let b=0;b<=1;b++) for(let c=0;c<=1;c++){
      const total=a+b+c;
      addRow($("faTable"),[a,b,c,total%2,total>=2?1:0],a===bit("faA")&&b===bit("faB")&&c===bit("faCin"));
    }
  }
  function updateHalfAdder(){
    const a=bit("haA"),b=bit("haB");
    setLabel("haALabel",a);setLabel("haBLabel",b);
    $("haSum").textContent=a^b;$("haCarry").textContent=a&b;
    buildTruthTables();
  }
  function updateFullAdder(){
    const a=bit("faA"),b=bit("faB"),c=bit("faCin"),total=a+b+c;
    setLabel("faALabel",a);setLabel("faBLabel",b);setLabel("faCinLabel",c);
    $("faSum").textContent=total%2;$("faCout").textContent=total>=2?1:0;
    buildTruthTables();
  }
  function updateMux(){
    const data=[bit("d0"),bit("d1"),bit("d2"),bit("d3")];
    const s1=bit("s1"),s0=bit("s0"),selected=s1*2+s0;
    ["d0","d1","d2","d3"].forEach((id,i)=>setLabel(`${id}Label`,data[i]));
    setLabel("s1Label",s1);setLabel("s0Label",s0);
    $("selectCode").textContent=`${s1}${s0}`;
    $("muxOutput").textContent=data[selected];
    $("muxSelected").textContent=`D${selected}`;
  }
  function updateDecoder(){
    const a=bit("decA"),b=bit("decB"),selected=a*2+b;
    setLabel("decALabel",a);setLabel("decBLabel",b);$("decodeCode").textContent=`${a}${b}`;
    const outputContainer=$("decoderOutputs");
    outputContainer.replaceChildren();
    for(let i=0;i<4;i++){
      const cell=document.createElement("div");
      cell.className=`decode-output${i===selected?" active":""}`;
      const label=document.createElement("span");label.textContent=`Y${i}`;
      const value=document.createElement("strong");value.textContent=i===selected?"1":"0";
      cell.append(label,value);outputContainer.appendChild(cell);
    }
  }
  function refreshAll(){updateHalfAdder();updateFullAdder();updateMux();updateDecoder();}
  function setFeedback(el,msg,error=false){el.textContent=msg;el.classList.toggle("error",error);}

  const challengePool=[
    {type:"HALF ADDER",prompt:"A = 1, B = 1",sub:"What are SUM and CARRY?",options:["SUM 0, CARRY 1","SUM 1, CARRY 0","SUM 1, CARRY 1","SUM 0, CARRY 0"],answer:0,explain:"1 + 1 = binary 10, so SUM = 0 and CARRY = 1."},
    {type:"FULL ADDER",prompt:"A = 1, B = 0, Cin = 1",sub:"What are SUM and CARRY OUT?",options:["SUM 0, Cout 1","SUM 1, Cout 0","SUM 1, Cout 1","SUM 0, Cout 0"],answer:0,explain:"1 + 0 + 1 = binary 10, so SUM = 0 and carry-out = 1."},
    {type:"4-TO-1 MUX",prompt:"S1 = 1, S0 = 0",sub:"Which input is selected?",options:["D0","D1","D2","D3"],answer:2,explain:"Select code 10 is decimal 2, so D2 is selected."},
    {type:"2-TO-4 DECODER",prompt:"Input A = 1, B = 1",sub:"Which output becomes active?",options:["Y0","Y1","Y2","Y3"],answer:3,explain:"Input 11 selects output Y3 in a 2-to-4 decoder."},
    {type:"HALF ADDER",prompt:"A = 1, B = 0",sub:"What are SUM and CARRY?",options:["SUM 0, CARRY 1","SUM 1, CARRY 0","SUM 1, CARRY 1","SUM 0, CARRY 0"],answer:1,explain:"1 + 0 = 1, so SUM = 1 and CARRY = 0."},
    {type:"FULL ADDER",prompt:"A = 1, B = 1, Cin = 1",sub:"What are SUM and CARRY OUT?",options:["SUM 0, Cout 1","SUM 1, Cout 0","SUM 1, Cout 1","SUM 0, Cout 0"],answer:2,explain:"1 + 1 + 1 = binary 11, so SUM = 1 and carry-out = 1."}
  ];
  function loadChallenge(){
    const old=challenge;
    do{challenge=challengePool[Math.floor(Math.random()*challengePool.length)];}while(challengePool.length>1&&challenge===old);
    challengeDone=false;
    $("challengeType").textContent=challenge.type;
    $("challengePrompt").textContent=challenge.prompt;
    $("challengeSubprompt").textContent=challenge.sub;
    const box=$("challengeOptions");box.replaceChildren();
    challenge.options.forEach((option,index)=>{
      const button=document.createElement("button");button.type="button";button.className="answer-btn";button.textContent=option;
      button.addEventListener("click",()=>answerChallenge(index,button));box.appendChild(button);
    });
    setFeedback($("challengeFeedback"),"Choose an answer to check your understanding.");
  }
  function answerChallenge(index,button){
    if(challengeDone)return;
    challengeDone=true;
    const correct=index===challenge.answer;
    if(correct){score+=10;$("score").textContent=score;}
    [...$("challengeOptions").children].forEach((btn,i)=>{btn.disabled=true;if(i===challenge.answer)btn.classList.add("correct-answer");});
    setFeedback($("challengeFeedback"),`${correct?"Correct! +10 points. ":"Not quite. "}${challenge.explain}`,!correct);
  }
  function renderQuiz(){
    const root=$("quizQuestions");
    quiz.forEach((item,index)=>{
      const wrapper=document.createElement("div");wrapper.className="quiz-question";
      const fieldset=document.createElement("fieldset");
      const legend=document.createElement("legend");legend.textContent=`${index+1}. ${item.q}`;fieldset.appendChild(legend);
      item.options.forEach((option,optionIndex)=>{
        const label=document.createElement("label");label.className="quiz-option";
        const input=document.createElement("input");input.type="radio";input.name=`quiz-${index}`;input.value=optionIndex;
        const span=document.createElement("span");span.textContent=option;label.append(input,span);fieldset.appendChild(label);
      });
      const explain=document.createElement("p");explain.className="muted small";explain.id=`quiz-explain-${index}`;explain.hidden=true;
      wrapper.append(fieldset,explain);root.appendChild(wrapper);
    });
  }

  ["haA","haB","faA","faB","faCin","d0","d1","d2","d3","s1","s0","decA","decB"].forEach(id=>$(id).addEventListener("change",refreshAll));
  $("newChallengeBtn").addEventListener("click",loadChallenge);
  $("quizSubmitBtn").addEventListener("click",()=>{
    let correct=0,answered=0;
    quiz.forEach((item,index)=>{
      const selected=document.querySelector(`input[name="quiz-${index}"]:checked`);
      const wrapper=document.querySelectorAll(".quiz-question")[index];
      const explanation=$(`quiz-explain-${index}`);
      wrapper.classList.remove("correct","incorrect");
      if(selected){answered++;const ok=Number(selected.value)===item.answer;if(ok)correct++;wrapper.classList.add(ok?"correct":"incorrect");explanation.textContent=`${ok?"Correct. ":"Review: "}${item.explain}`;}
      else{wrapper.classList.add("incorrect");explanation.textContent=`Not answered. ${item.explain}`;}
      explanation.hidden=false;
    });
    setFeedback($("quizFeedback"),`Score: ${correct}/${quiz.length}. Answered: ${answered}/${quiz.length}. Review the explanations above.`);
  });

  renderQuiz();refreshAll();loadChallenge();
})();