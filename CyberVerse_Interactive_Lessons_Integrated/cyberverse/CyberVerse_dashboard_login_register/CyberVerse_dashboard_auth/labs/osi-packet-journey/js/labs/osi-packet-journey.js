(() => {
  const $ = (id) => document.getElementById(id);
  const layers = [
    {n:7,name:"Application",color:"#4df0ad",unit:"Data",examples:"HTTP, DNS, SMTP",summary:"Provides network services directly to user-facing applications.",role:"The application creates or requests the information that needs to be sent across the network.",sender:"The application creates a request or message, such as an HTTPS request.",receiver:"The received data is handed to the application that understands the protocol."},
    {n:6,name:"Presentation",color:"#59c8ff",unit:"Data",examples:"TLS, JPEG, UTF-8",summary:"Represents, encodes, compresses, or encrypts data for applications.",role:"Data may be encoded into a suitable format or protected with encryption.",sender:"Data representation and encryption may be handled here conceptually.",receiver:"The receiver interprets the representation and decrypts data when applicable."},
    {n:5,name:"Session",color:"#bd9aff",unit:"Data",examples:"Session control, RPC",summary:"Coordinates sessions and dialog between communicating applications.",role:"This layer conceptually manages the start, coordination, and end of conversations.",sender:"Session state or dialog-control information is associated with the exchange.",receiver:"The receiver uses session context to coordinate the conversation."},
    {n:4,name:"Transport",color:"#ffbd70",unit:"Segment / Datagram",examples:"TCP, UDP",summary:"Provides end-to-end transport, ports, and (with TCP) reliability and ordering.",role:"Transport divides application data as needed and uses port numbers to identify services.",sender:"A transport header may add source and destination port numbers and other control fields.",receiver:"Transport processes ports and, for TCP, reassembles and orders data as required."},
    {n:3,name:"Network",color:"#ff8fa3",unit:"Packet",examples:"IPv4, IPv6, ICMP",summary:"Provides logical addressing and routing between networks.",role:"The network layer uses logical addresses to move packets toward a destination network.",sender:"An IP header adds source and destination IP addresses.",receiver:"The network layer examines the destination IP and processes the packet at the receiving host."},
    {n:2,name:"Data Link",color:"#f4d35e",unit:"Frame",examples:"Ethernet, Wi-Fi MAC",summary:"Moves frames across a local link using link-layer addressing.",role:"Frames carry local-link information, often including MAC addresses and error-detection data.",sender:"A link-layer header and trailer may wrap the packet for the local link.",receiver:"The link layer checks the frame and passes its payload to the network layer."},
    {n:1,name:"Physical",color:"#a8b7c7",unit:"Bits",examples:"Ethernet PHY, radio",summary:"Transmits raw bits as electrical, optical, or radio signals.",role:"The physical layer carries bit patterns over a physical medium.",sender:"Frames are represented as signals on copper, fiber, or a wireless channel.",receiver:"The receiving interface recovers bits from signals and passes them upward."}
  ];
  const appData = {
    web:{label:"Web request (HTTPS)",payload:"HTTPS request",note:"A browser request is prepared for delivery to a web service."},
    email:{label:"Email message",payload:"Email message",note:"An email client prepares a message for transfer using mail protocols."},
    file:{label:"File transfer",payload:"File data",note:"File content is prepared for transport to another system."},
    dns:{label:"DNS query",payload:"DNS question",note:"A client asks a DNS resolver to look up a domain name."}
  };
  let currentLayer = 7;
  let visited = new Set();
  let started = false;

  function activeOrder() {
    return $("direction-select").value === "down" ? [7,6,5,4,3,2,1] : [1,2,3,4,5,6,7];
  }
  function layerByNumber(n) { return layers.find((layer) => layer.n === n); }

  function renderLayers() {
    const list = $("layer-list");
    list.replaceChildren();
    const order = activeOrder();
    order.forEach((n) => {
      const layer = layerByNumber(n);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `layer-button${currentLayer === n ? " active" : ""}${visited.has(n) ? " visited" : ""}`;
      button.style.setProperty("--layer-color", layer.color);
      button.innerHTML = `<span class="layer-badge">L${n}</span><span><strong>${layer.name}</strong><small>${layer.unit}</small></span><span class="layer-state">${visited.has(n) ? "✓" : "○"}</span>`;
      button.addEventListener("click", () => { currentLayer = n; visited.add(n); renderAll(); });
      list.appendChild(button);
    });
  }

  function renderDetail() {
    const layer = layerByNumber(currentLayer);
    const target = $("layer-detail");
    target.style.borderColor = layer.color + "80";
    target.style.background = `linear-gradient(150deg,${layer.color}12,#101923 65%)`;
    target.innerHTML = `<div class="detail-top"><span class="layer-number" style="color:${layer.color};background:${layer.color}20">L${layer.n}</span><span class="detail-tag" style="color:${layer.color}">${layer.name.toUpperCase()}</span></div>
      <h2>${layer.name}</h2><p class="detail-summary">${layer.summary}</p>
      <div class="detail-metrics"><div><span>DATA UNIT</span><strong>${layer.unit}</strong></div><div><span>EXAMPLES</span><strong>${layer.examples}</strong></div></div>
      <div class="detail-note" style="border-color:${layer.color}50"><strong style="color:${layer.color}">What happens here?</strong><p>${$("direction-select").value === "down" ? layer.sender : layer.receiver}</p></div>`;
  }

  function renderPacket() {
    const target = $("packet-stack");
    target.replaceChildren();
    const order = activeOrder();
    const index = order.indexOf(currentLayer);
    const app = appData[$("app-select").value];
    const down = $("direction-select").value === "down";
    const visibleLayers = down ? order.slice(0, index + 1) : order.slice(index);
    const parts = [];
    parts.push({type:"payload", label:"PAYLOAD", title:app.payload});
    if (down) {
      if (currentLayer <= 4) parts.unshift({type:"header",label:"L4 HEADER",title:"Ports / transport"});
      if (currentLayer <= 3) parts.unshift({type:"header",label:"L3 HEADER",title:"Source + destination IP"});
      if (currentLayer <= 2) parts.unshift({type:"header",label:"L2 HEADER",title:"Local-link addressing"});
      if (currentLayer <= 2) parts.push({type:"trailer",label:"L2 TRAILER",title:"Error check (e.g. FCS)"});
      if (currentLayer === 1) parts.unshift({type:"header",label:"PHYSICAL",title:"Signal / bits"});
    } else {
      if (currentLayer <= 2) parts.unshift({type:"header",label:"L2 FRAME",title:"Frame received"});
      if (currentLayer <= 3) parts.push({type:"header",label:"L3 PROCESS",title:"IP packet processed"});
      if (currentLayer <= 4) parts.push({type:"header",label:"L4 PROCESS",title:"Transport processed"});
      if (currentLayer >= 5) parts.push({type:"header",label:"UP THE STACK",title:"Data passed upward"});
    }
    parts.forEach((part) => {
      const el = document.createElement("div");
      el.className = `packet-part ${part.type === "header" ? "header" : part.type === "trailer" ? "trailer" : "payload"}`;
      el.innerHTML = `<span>${part.label}</span><strong>${part.title}</strong>`;
      target.appendChild(el);
    });
    const current = layerByNumber(currentLayer);
    const verb = down ? "Encapsulation view" : "Decapsulation view";
    $("packet-caption").textContent = `${verb} · Layer ${currentLayer} (${current.name}). ${down ? "Conceptually, lower layers add their control information as data moves toward the medium." : "The receiver processes link, network, and transport information as data moves up toward the application."} This is a simplified teaching diagram; real protocol stacks do not map every function perfectly to one OSI layer.`;
  }

  function renderProgress() {
    const order = activeOrder();
    const done = visited.size;
    $("progress-fill").style.width = `${(done / 7) * 100}%`;
    $("progress-count").textContent = `${done} / 7`;
    $("progress-text").textContent = done === 7 ? "Journey complete" : started ? `Current layer: ${currentLayer} — ${layerByNumber(currentLayer).name}` : "Ready to begin";
    const index = order.indexOf(currentLayer);
    $("prev-btn").disabled = !started || index <= 0;
    $("next-btn").disabled = !started || index >= 6;
  }

  function renderAll() {
    renderLayers();
    renderDetail();
    renderPacket();
    renderProgress();
  }

  function start() {
    started = true;
    visited = new Set([currentLayer]);
    renderAll();
  }
  function move(delta) {
    if (!started) start();
    const order = activeOrder();
    const index = order.indexOf(currentLayer);
    const next = order[Math.max(0, Math.min(6, index + delta))];
    currentLayer = next;
    visited.add(next);
    renderAll();
  }

  $("start-btn").addEventListener("click", () => {
    currentLayer = activeOrder()[0];
    start();
  });
  $("next-btn").addEventListener("click", () => move(1));
  $("prev-btn").addEventListener("click", () => move(-1));
  $("reset-btn").addEventListener("click", () => {
    started = false;
    visited = new Set();
    currentLayer = activeOrder()[0];
    renderAll();
  });
  $("direction-select").addEventListener("change", () => {
    currentLayer = activeOrder()[0];
    visited = new Set();
    started = false;
    renderAll();
  });
  $("app-select").addEventListener("change", renderPacket);

  $("quiz-options").querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      $("quiz-options").querySelectorAll("button").forEach((item) => item.classList.remove("correct","incorrect"));
      const correct = button.dataset.answer === "3";
      button.classList.add(correct ? "correct" : "incorrect");
      $("quiz-feedback").textContent = correct
        ? "Correct! Layer 3 (Network) handles logical addressing and routing packets between networks."
        : "Not quite. Routing between networks is a Layer 3 (Network layer) function.";
    });
  });

  currentLayer = activeOrder()[0];
  renderAll();
})();