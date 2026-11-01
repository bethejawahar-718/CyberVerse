# CyberVerse DHCP Simulation Lab (NET-07)

A standalone DHCP DORA learning lab using HTML5, CSS3, and vanilla JavaScript.

## Run
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. Set a client name, network pool, and lease duration.
4. Click **Start DHCP process**.
5. Inspect the Discover, Offer, Request, and Acknowledgment stages and the assigned configuration.

## Features
- Interactive simulated DORA sequence.
- Configurable fictional network pool and lease duration.
- Displays assigned IP address, subnet mask, default gateway, and DNS server.
- Event log with explanatory messages.
- Input validation and reset controls.
- Responsive CyberVerse dark UI.

## Safety and scope
This is an educational simulation only. It does not send DHCP packets, contact a real server, or change the computer's network configuration. All IP assignments are illustrative.

## Integration
Copy `index.html`, `css/style.css`, and `js/dhcp-simulator.js` into your CyberVerse frontend structure and update asset paths if needed.
