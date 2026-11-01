# CyberVerse — Firewall Simulation Lab (NET-12)

## Contents
- `firewall-simulator.html` — standalone lab page
- `css/firewall-simulator.css` — responsive dark cybersecurity styling
- `js/labs/firewall-simulator.js` — firewall rule logic and packet simulation

## Run it
1. Extract the ZIP.
2. Open `firewall-simulator.html` in a modern browser, or open the containing folder in VS Code and use Live Server.
3. Add, delete, or reorder rules. Test packets and review the reason for each decision.

## Simulation behavior
- Rules are evaluated from top to bottom; the first matching rule wins.
- A blank rule port means any port.
- Protocol `ANY` matches TCP, UDP, or ICMP.
- Direction `both` matches inbound and outbound packets.
- If no rule matches, the simulator denies the packet using an implicit default-deny policy.

## Integrating into an existing CyberVerse project
Copy the HTML page into your frontend root (or adapt its `<main>` section into your existing lab page). Copy the CSS file into your CSS folder and the JavaScript file into `frontend/js/labs/`. Update the relative paths in the HTML if your folder layout differs.

This is a local educational simulation. It does not configure an operating-system firewall, capture traffic, or send packets over a network.
