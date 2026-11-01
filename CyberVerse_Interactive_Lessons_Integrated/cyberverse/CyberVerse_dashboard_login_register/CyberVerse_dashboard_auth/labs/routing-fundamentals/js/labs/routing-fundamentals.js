(() => {
  const sourceSelect = document.getElementById("source");
  const destinationSelect = document.getElementById("destination");
  const traceBtn = document.getElementById("traceBtn");
  const resetBtn = document.getElementById("resetBtn");
  const traceStatus = document.getElementById("traceStatus");
  const routeSummary = document.getElementById("routeSummary");
  const hopSummary = document.getElementById("hopSummary");
  const topology = document.getElementById("topology");
  const nodes = [...document.querySelectorAll(".node")];

  const devices = {
    hostA: { name: "Client A", ip: "192.168.1.10", router: "r1" },
    hostB: { name: "Client B", ip: "192.168.3.20", router: "r3" },
    hostC: { name: "Server C", ip: "192.168.2.50", router: "r2" }
  };
  const routes = {
    "hostA-hostB": ["hostA", "r1", "r2", "r3", "hostB"],
    "hostA-hostC": ["hostA", "r1", "r2", "hostC"],
    "hostB-hostA": ["hostB", "r3", "r2", "r1", "hostA"],
    "hostB-hostC": ["hostB", "r3", "r2", "hostC"],
    "hostC-hostA": ["hostC", "r2", "r1", "hostA"],
    "hostC-hostB": ["hostC", "r2", "r3", "hostB"]
  };
  const labels = {
    hostA: "Client A", hostB: "Client B", hostC: "Server C",
    r1: "Router 1", r2: "Router 2", r3: "Router 3"
  };
  let traceTimer = null;

  function clearPath() {
    nodes.forEach(node => node.classList.remove("active", "visited"));
    topology.classList.remove("tracing");
    if (traceTimer) {
      clearInterval(traceTimer);
      traceTimer = null;
    }
  }

  function traceRoute() {
    clearPath();
    const source = sourceSelect.value;
    const destination = destinationSelect.value;
    if (source === destination) {
      traceStatus.textContent = "Choose two different devices to trace a route.";
      traceStatus.className = "trace-status";
      routeSummary.textContent = "No route selected";
      hopSummary.textContent = "Source and destination must be different.";
      return;
    }

    const path = routes[`${source}-${destination}`];
    const routers = path.filter(item => item.startsWith("r"));
    routeSummary.textContent = path.map(item => labels[item]).join(" → ");
    hopSummary.textContent = `${routers.length} router hop${routers.length === 1 ? "" : "s"} · Destination ${devices[destination].ip}`;
    traceStatus.textContent = "Tracing packet through the simulated network…";
    traceStatus.className = "trace-status";
    topology.classList.add("tracing");

    let index = 0;
    const step = () => {
      nodes.forEach(node => node.classList.remove("active"));
      if (index > 0) {
        const previous = document.querySelector(`[data-node="${path[index - 1]}"]`);
        if (previous) previous.classList.add("visited");
      }
      if (index < path.length) {
        const current = document.querySelector(`[data-node="${path[index]}"]`);
        if (current) current.classList.add("active");
        traceStatus.textContent = `Hop ${index + 1} of ${path.length}: ${labels[path[index]]}`;
        index++;
      } else {
        clearInterval(traceTimer);
        traceTimer = null;
        topology.classList.remove("tracing");
        nodes.forEach(node => node.classList.remove("active"));
        traceStatus.textContent = `Packet delivered to ${devices[destination].name} (${devices[destination].ip}).`;
        traceStatus.className = "trace-status success";
      }
    };
    step();
    traceTimer = setInterval(step, 750);
  }

  function reset() {
    clearPath();
    traceStatus.textContent = "Ready to trace. Select endpoints and start.";
    traceStatus.className = "trace-status";
    routeSummary.textContent = "No route selected";
    hopSummary.textContent = "Hops will appear here after tracing.";
  }

  traceBtn.addEventListener("click", traceRoute);
  resetBtn.addEventListener("click", reset);
  sourceSelect.addEventListener("change", reset);
  destinationSelect.addEventListener("change", reset);

  document.querySelectorAll(".quiz-option").forEach(option => {
    option.addEventListener("click", () => {
      document.querySelectorAll(".quiz-option").forEach(item => item.classList.remove("correct", "incorrect"));
      const feedback = document.getElementById("quizFeedback");
      if (option.dataset.answer === "ip") {
        option.classList.add("correct");
        feedback.textContent = "Correct! Routers check the destination IP against their routing table to select a next hop.";
        feedback.style.color = "var(--green)";
      } else {
        option.classList.add("incorrect");
        feedback.textContent = "Not quite. Think about the destination network and the router's forwarding information.";
        feedback.style.color = "var(--red)";
      }
    });
  });
})();
