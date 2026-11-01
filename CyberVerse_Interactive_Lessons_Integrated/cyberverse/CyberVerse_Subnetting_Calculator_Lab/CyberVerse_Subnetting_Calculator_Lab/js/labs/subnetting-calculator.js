(() => {
  const $ = (id) => document.getElementById(id);
  const form = $("subnet-form");
  const ipInput = $("ip-input");
  const prefixInput = $("prefix-input");
  const errorBox = $("error-message");

  function parseIPv4(value) {
    const parts = value.trim().split(".");
    if (parts.length !== 4) return null;
    const octets = parts.map((part) => {
      if (!/^\d{1,3}$/.test(part)) return NaN;
      return Number(part);
    });
    if (octets.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
    return octets;
  }

  function toNumber(octets) {
    return octets.reduce((value, octet) => value * 256 + octet, 0);
  }

  function toIPv4(number) {
    const n = BigInt(number);
    return [24n, 16n, 8n, 0n].map((shift) => Number((n >> shift) & 255n)).join(".");
  }

  function maskFor(prefix) {
    if (prefix === 0) return 0n;
    return (0xffffffffn << BigInt(32 - prefix)) & 0xffffffffn;
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function calculate() {
    errorBox.hidden = true;
    const octets = parseIPv4(ipInput.value);
    if (!octets) {
      showError("Enter a valid IPv4 address, for example 192.168.1.10.");
      ipInput.focus();
      return;
    }

    const prefix = Number(prefixInput.value);
    if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
      showError("CIDR prefix must be between /0 and /32.");
      return;
    }

    const ip = BigInt(toNumber(octets));
    const mask = maskFor(prefix);
    const all = 0xffffffffn;
    const wildcard = all ^ mask;
    const network = ip & mask;
    const broadcast = network | wildcard;
    const total = 2 ** (32 - prefix);
    let first = network;
    let last = broadcast;
    let usable;
    let firstNote = "First typical host address";
    let lastNote = "Last typical host address";
    let usableNote = "Traditional IPv4 subnet calculation";

    if (prefix <= 30) {
      first = network + 1n;
      last = broadcast - 1n;
      usable = Math.max(total - 2, 0);
    } else if (prefix === 31) {
      // RFC 3021 point-to-point links use both addresses.
      usable = 2;
      firstNote = "Point-to-point endpoint";
      lastNote = "Point-to-point endpoint";
      usableNote = "Both addresses can be used on a /31 point-to-point link";
    } else {
      usable = 1;
      firstNote = "Single address in this /32";
      lastNote = "Single address in this /32";
      usableNote = "A /32 represents one IPv4 address";
    }

    $("network-address").textContent = toIPv4(network);
    $("broadcast-address").textContent = toIPv4(broadcast);
    $("subnet-mask").textContent = toIPv4(mask);
    $("wildcard-mask").textContent = toIPv4(wildcard);
    $("first-host").textContent = toIPv4(first);
    $("last-host").textContent = toIPv4(last);
    $("first-note").textContent = firstNote;
    $("last-note").textContent = lastNote;
    $("total-addresses").textContent = total.toLocaleString("en-US");
    $("usable-hosts").textContent = usable.toLocaleString("en-US");
    $("usable-note").textContent = usableNote;
    $("cidr-chip").textContent = `${ipInput.value.trim()}/${prefix}`;
    $("bit-split").textContent = `${prefix} network bits / ${32 - prefix} host bits`;
    renderBinary(octets, prefix);
  }

  function renderBinary(octets, prefix) {
    const target = $("binary-view");
    target.replaceChildren();
    let bitIndex = 0;
    octets.forEach((octet, octetIndex) => {
      const group = document.createElement("div");
      group.className = "octet";
      for (let shift = 7; shift >= 0; shift--) {
        const bit = document.createElement("span");
        bit.className = `bit ${bitIndex < prefix ? "network" : "host"}`;
        bit.textContent = (octet >> shift) & 1;
        group.appendChild(bit);
        bitIndex++;
      }
      target.appendChild(group);
      if (octetIndex < 3) {
        const dot = document.createElement("span");
        dot.className = "octet-dot";
        dot.textContent = ".";
        target.appendChild(dot);
      }
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculate();
  });

  document.querySelectorAll("[data-ip]").forEach((button) => {
    button.addEventListener("click", () => {
      ipInput.value = button.dataset.ip;
      prefixInput.value = button.dataset.prefix;
      calculate();
    });
  });

  $("quiz-options").querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      $("quiz-options").querySelectorAll("button").forEach((item) => {
        item.classList.remove("correct", "incorrect");
      });
      if (button.dataset.answer === "64") {
        button.classList.add("correct");
        $("quiz-feedback").textContent = "Correct! A /26 leaves 6 host bits, so 2⁶ = 64 total addresses (62 traditionally usable hosts).";
      } else {
        button.classList.add("incorrect");
        $("quiz-feedback").textContent = "Not quite. A /26 leaves 6 host bits. Calculate 2⁶ to find the total addresses.";
      }
    });
  });

  calculate();
})();