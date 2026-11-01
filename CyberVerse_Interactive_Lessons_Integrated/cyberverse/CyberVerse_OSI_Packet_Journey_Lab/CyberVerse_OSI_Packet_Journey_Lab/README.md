# CyberVerse — OSI Model Packet Journey Lab

A browser-based educational simulation that walks through the seven OSI layers and demonstrates simplified encapsulation and decapsulation.

## Features
- Explore all seven OSI layers
- Read layer responsibilities, example protocols, and data units
- Choose web, email, file-transfer, or DNS data examples
- Step through sender-side encapsulation or receiver-side decapsulation
- Inspect a simplified packet-stack diagram and progress indicator
- Answer a knowledge-check quiz

## Run
1. Extract the ZIP archive.
2. Open `CyberVerse_OSI_Packet_Journey_Lab/osi-packet-journey.html` in Chrome or another modern browser.
3. Choose an application type and direction, then click **Start journey**.
4. Use **Next layer** and **Previous layer**, or select a layer directly.

No installation or backend is needed. The CSS uses Google Fonts when internet access is available and falls back to system fonts otherwise.

## Note
This is a conceptual teaching simulation. The OSI model is a reference model; real protocol stacks can combine functions across layers. No packets are transmitted.

## Files
- `osi-packet-journey.html` — page structure
- `css/osi-packet-journey.css` — responsive CyberVerse styling
- `js/labs/osi-packet-journey.js` — layer data, navigation, packet view, and quiz
