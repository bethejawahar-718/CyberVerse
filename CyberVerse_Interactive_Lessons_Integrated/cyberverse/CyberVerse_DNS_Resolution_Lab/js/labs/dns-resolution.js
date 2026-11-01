(() => {
  const domainInput = document.getElementById("domain");
  const recordType = document.getElementById("recordType");
  const resolveBtn = document.getElementById("resolveBtn");
  const resetBtn = document.getElementById("resetBtn");
  const status = document.getElementById("status");
  const resultValue = document.getElementById("resultValue");
  const resultMeta = document.getElementById("resultMeta");
  const flowCaption = document.getElementById("flowCaption");
  const flowMap = document.getElementById("flowMap");
  const flowNodes = [...document.querySelectorAll(".flow-node")];
  let timer = null;

  const sampleAnswers = {
    A: "93.184.216.34",
    AAAA: "2001:db8::34",
    MX: "mail.example.com (priority 10)",
    CNAME: "example.com"
  };
  const stageMessages = [
    "Client asks the recursive resolver for the selected record.",
    "Resolver checks its cache. This example continues with a full lookup.",
    "Root DNS directs the resolver toward the appropriate top-level domain servers.",
    "TLD DNS identifies the authoritative name server for the domain.",
    "Authoritative DNS returns the requested record.",
    "The resolver returns the answer to the client."
  ];

  function clearTrace() {
    if (timer) clearInterval(timer);
    timer = null;
    flowNodes.forEach(node => node.classList.remove("active", "done"));
    flowMap.classList.remove("running");
  }

  function reset() {
    clearTrace();
    status.textContent = "Ready. Enter a domain and begin.";
    status.className = "status";
    resultValue.textContent = "Waiting for query…";
    resultMeta.textContent = "The simulated response will appear here.";
    flowCaption.textContent = "Ready to resolve a domain name.";
  }

  function resolve() {
    clearTrace();
    const domain = domainInput.value.trim().toLowerCase();
    if (!domain || !/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$/.test(domain)) {
      status.textContent = "Enter a valid domain such as example.com.";
      status.className = "status";
      domainInput.focus();
      return;
    }

    const type = recordType.value;
    const answer = domain === "example.com" || domain === "www.example.com"
      ? sampleAnswers[type]
      : type === "A" ? "198.51.100.42"
      : type === "AAAA" ? "2001:db8::42"
      : type === "MX" ? `mail.${domain} (priority 10)`
      : `origin.${domain}`;

    flowMap.classList.add("running");
    status.textContent = "Starting DNS lookup…";
    resultValue.textContent = "Query in progress…";
    resultMeta.textContent = `${type} record for ${domain}`;
    let step = 0;
    const advance = () => {
      flowNodes.forEach(node => node.classList.remove("active"));
      if (step > 0) flowNodes[step - 1].classList.add("done");
      if (step < flowNodes.length) {
        flowNodes[step].classList.add("active");
        status.textContent = `Stage ${step + 1} of ${flowNodes.length}: ${stageMessages[step]}`;
        flowCaption.textContent = stageMessages[step];
        step++;
      } else {
        clearTrace();
        flowNodes.forEach(node => node.classList.add("done"));
        status.textContent = "Lookup complete. Simulated DNS answer returned.";
        status.className = "status success";
        resultValue.textContent = answer;
        resultMeta.textContent = `${type} record · ${domain} · Example data only`;
        flowCaption.textContent = `Resolved ${domain} in this educational simulation.`;
      }
    };
    advance();
    timer = setInterval(advance, 850);
  }

  resolveBtn.addEventListener("click", resolve);
  resetBtn.addEventListener("click", reset);
  domainInput.addEventListener("keydown", event => {
    if (event.key === "Enter") resolve();
  });

  document.querySelectorAll(".quiz-option").forEach(option => {
    option.addEventListener("click", () => {
      document.querySelectorAll(".quiz-option").forEach(item => item.classList.remove("correct", "incorrect"));
      const feedback = document.getElementById("quizFeedback");
      if (option.dataset.answer === "right") {
        option.classList.add("correct");
        feedback.textContent = "Correct! DNS helps clients find records for human-readable domain names.";
        feedback.style.color = "var(--green)";
      } else {
        option.classList.add("incorrect");
        feedback.textContent = "Not quite. DNS is the naming system used to look up records for domain names.";
        feedback.style.color = "var(--red)";
      }
    });
  });
})();
