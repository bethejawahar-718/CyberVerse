# CyberVerse — TCP vs UDP Protocol Simulator Lab

## Files
- `tcp-udp-simulator.html` — main page
- `css/tcp-udp-simulator.css` — responsive dark theme and layout
- `js/labs/tcp-udp-simulator.js` — simulation, event log, statistics, and quiz

## Run
1. Extract the ZIP.
2. Open `tcp-udp-simulator.html` in a modern browser such as Chrome.
3. Choose TCP or UDP, adjust packet count and simulated loss, and select **Run simulation**.
4. Review the packet lane, event log, statistics, and knowledge-check quiz.

## Learning goals
- Understand the TCP three-way handshake (SYN, SYN-ACK, ACK).
- Compare TCP acknowledgements and retransmissions with UDP datagrams.
- Observe how simulated packet loss affects delivery.
- Relate protocol behavior to common application scenarios.

## Safety and scope
This is a self-contained educational frontend. It does not open sockets, contact servers, or transmit real network traffic. Loss is simulated locally and randomly for demonstration. TCP behavior is simplified for teaching; real TCP includes additional congestion control, timers, flow control, and implementation details.
