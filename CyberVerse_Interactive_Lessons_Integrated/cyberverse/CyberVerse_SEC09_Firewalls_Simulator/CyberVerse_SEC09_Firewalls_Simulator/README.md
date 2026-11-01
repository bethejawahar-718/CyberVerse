# CyberVerse SEC-09 – Firewalls Simulator

A standalone, browser-based learning module for understanding firewall fundamentals.

## Files
- `index.html` – module structure
- `css/firewall-simulator.css` – dark CyberVerse interface
- `js/firewall-simulator.js` – rule simulator, traffic tests and quiz

## Run in VS Code
1. Extract the ZIP file.
2. Open the extracted `CyberVerse_SEC09_Firewalls_Simulator` folder in Visual Studio Code.
3. If you have the Live Server extension, right-click `index.html` and select **Open with Live Server**.
4. Otherwise, open `index.html` directly in a modern web browser.

## Learning activities
- Learn firewall concepts, inbound/outbound traffic, ports, protocols, host/network firewalls, default deny and logs.
- Create simulated allow/block rules.
- Test six fictional network traffic examples.
- Complete the five-question knowledge check.

## Safety and limitations
This is a front-end educational simulation only. It does not send or receive network packets, scan devices, inspect local traffic, access files, change operating-system firewall settings, or connect to external systems. Rule and quiz activity runs locally in the browser page. The Google Fonts import is optional; the page uses fallback fonts if unavailable.

## Important concept
Rules are checked from top to bottom. The first matching rule decides the action. If no custom rule matches, the simulated default action is **BLOCK**.
