# CyberVerse — DHCP Simulator Lab

A standalone frontend simulation that demonstrates the DHCP DORA address-assignment process.

## Files
- `dhcp-simulator.html` — lab interface
- `css/dhcp-simulator.css` — responsive CyberVerse styling
- `js/labs/dhcp-simulator.js` — simulated DORA flow, lease output and quiz

## Run it
1. Extract the ZIP.
2. Open `dhcp-simulator.html` in a modern browser.
3. Set the client name and MAC address.
4. Choose an example address pool and click **Start DHCP DORA**.
5. Watch Discover, Offer, Request and Acknowledge, then inspect the sample lease.

## Learning goals
- Understand DHCP's DORA sequence.
- Recognize common network settings supplied by DHCP.
- Understand the idea of a temporary IP address lease.
- Learn the purpose of DHCP relay agents.

## Notes
- This is a local educational simulation. It does not contact a DHCP server or change your device's network settings.
- The assigned addresses and lease duration are illustrative.
- Google Fonts are optional; system fonts are used as fallbacks.
