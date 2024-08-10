// src/worker.js
import { connect } from "cloudflare:sockets";

let sha224Password = '799999fdbedf6bc53de04fe91e23b9a0b01956bcbe519adebf19ab34';
let proxyIP = "194.58.56.241";

if (!isValidSHA224(sha224Password)) {
    throw new Error('sha224Password is not valid');
}

const worker_default = {
    async fetch(request, env, ctx) {
        try {
            proxyIP = env.PROXYIP || proxyIP;
            sha224Password = env.SHA224PASS || sha224Password;
            const upgradeHeader = request.headers.get("Upgrade");

            if (!upgradeHeader || upgradeHeader !== "websocket") {
                const url = new URL(request.url);
                const host = request.headers.get('Host');

                switch (url.pathname) {
                    case "/fadztech":
                        const response = await fetch(`https://ipapi.co/${request.headers.get('CF-Connecting-IP')}/json/`);
                        const data = await response.json();
                        const isp = data.org || "Unknown ISP";

                        return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>fadzvpnProject</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f0f5;
            color: #333;
            transition: background-color 0.3s, color 0.3s;
        }
        body.dark-mode {
            background-color: #121212; /* Latar belakang gelap */
            color: #e0e0e0; /* Teks terang */
        }
        .container {
            background: #ffffff;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
            text-align: center;
            transition: background-color 0.3s;
        }
        body.dark-mode .container {
            background: #1e1e1e; /* Latar belakang kontainer gelap */
        }
        .header-image {
            width: 100%;
            border-radius: 10px;
            margin-bottom: 20px;
            object-fit: cover;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #9b1b30;
            font-size: 2.5em;
            margin-bottom: 10px;
            font-family: 'Playfair Display', serif;
            text-transform: uppercase;
            border-bottom: 3px solid #9b1b30;
            padding-bottom: 5px;
        }
        h2 {
            color: #b03a2e;
            font-size: 1.8em;
            margin: 20px 0;
            border-bottom: 2px solid #b03a2e;
            padding-bottom: 5px;
        }
        .info-section {
            text-align: left;
            margin: 20px 0;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            background-color: #e0e0e0; /* Latar belakang item informasi */
            transition: background-color 0.3s, box-shadow 0.3s;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        body.dark-mode .info-section {
            background-color: #2c2c2c; /* Latar belakang item informasi di tema gelap */
            border: 1px solid #555; /* Border lebih gelap di tema gelap */
        }
        .info-section ul {
            list-style-type: none;
            padding: 0;
        }
        .info-section li {
            margin: 10px 0;
            position: relative;
            padding-left: 20px; /* Memberikan ruang untuk titik bulat */
        }
        .info-section li::before {
            content: '•'; /* Titik bulat */
            position: absolute;
            left: 0;
            color: #9b1b30; /* Warna titik bulat */
            font-size: 1.5em; /* Ukuran titik bulat */
            line-height: 1; /* Menjaga titik bulat sejajar dengan teks */
        }
        button {
            background-color: #9b1b30;
            color: white;
            border: none;
            padding: 12px 20px;
            margin-top: 10px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            font-size: 1.1em;
            transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        button:hover {
            background-color: #7d3c98;
            transform: scale(1.05); /* Efek zoom saat hover */
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }
        .footer {
            margin-top: 20px;
            padding: 10px 0;
            border-top: 1px solid #e0e0e0;
        }
        .footer a {
            color: #9b1b30;
            text-decoration: none;
            transition: color 0.3s;
        }
        .footer a:hover {
            color: #b03a2e; /* Efek hover pada tautan */
            text-decoration: underline;
        }
        /* Tambahan untuk elemen estetika */
        .cta-section {
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: left;
            background-color: #e0e0e0; /* Latar belakang untuk bagian keunggulan di mode terang */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        body.dark-mode .cta-section {
            background-color: #2c2c2c; /* Latar belakang untuk bagian keunggulan di mode gelap */
        }
        .cta-section h3 {
            margin: 0 0 10px;
            color: #000; /* Warna teks hitam */
        }
        body.dark-mode .cta-section h3 {
            color: #ffffff; /* Warna teks terang di mode gelap */
        }
        .cta-section p {
            margin: 0;
            color: #000; /* Warna teks hitam */
            font-size: 1em; /* Ukuran font yang lebih kecil */
        }
        body.dark-mode .cta-section p {
            color: #e0e0e0; /* Warna teks terang di mode gelap */
        }
        .cta-icon {
            width: 30px;
            height: 30px;
            margin-right: 10px;
            vertical-align: middle;
        }
        .input-section {
            margin: 20px 0;
            padding: 20px;
            border-radius: 10px;
            background-color: #f9f9f9; /* Latar belakang untuk input section */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        body.dark-mode .input-section {
            background-color: #2a2a2a; /* Latar belakang input section di mode gelap */
        }
        input[type="text"] {
            width: calc(100% - 24px);
            padding: 10px;
            margin-top: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1em;
            transition: border-color 0.3s;
        }
        input[type="text"]:focus {
            border-color: #9b1b30; /* Warna border saat fokus */
            outline: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://telegra.ph/file/67d0a2f1a2e9a5a651556.jpg" alt="Header Image" class="header-image">
        <h1>ꜰᴀᴅᴢᴠᴘɴ</h1>
        <div class="cta-section">
            <h3>Keunggulan VPN Kami:</h3>
            <p><img src="https://img.icons8.com/ios-filled/50/000000/speed.png" class="cta-icon" alt="Speed Icon"/>Kecepatan tinggi dan stabil.</p>
            <p><img src="https://img.icons8.com/ios-filled/50/000000/lock-2.png" class="cta-icon" alt="Security Icon"/>Keamanan data terjamin.</p>
            <p><img src="https://img.icons8.com/ios-filled/50/000000/globe.png" class="cta-icon" alt="Access Icon"/>Akses tanpa batas.</p>
        </div>
        
        <div class="info-section">
            <h2>ᴛʀᴏᴊᴀɴ ᴀᴄᴄᴏᴜɴᴛ</h2>
            <ul>
                <li><strong>Port TLS:</strong> 443</li>
                <li><strong>Domain:</strong> ${host}</li>
                <li><strong>User ID:</strong> fadzvpn</li>
                <li><strong>ISP:</strong> RumahWeb</li>
                <li><strong>Network:</strong> auto</li>
                <li><strong>Path:</strong> /Trojan</li>
            </ul>
            <button onclick="copyToClipboard('trojan://fadzvpn@${host}:443/?type=ws&host=${host}&security=tls')">Copy Trojan</button>
        </div>

        <div class="info-section">
            <h2>ᴠʟᴇꜱꜱ ᴀᴄᴄᴏᴜɴᴛ</h2>
            <ul>
                <li><strong>Domain:</strong> sugoi.fadsvpnproject.xyz</li>
                <li><strong>User ID:</strong> b3bf7776-0451-4ab1-afb6-0f21ef63ddc2</li>
                <li><strong>ISP:</strong> Digital Ocean</li>
                <li><strong>Country:</strong> Singapore</li>
                <li><strong>Path:</strong> /vless</li>
            </ul>
            <button onclick="copyToClipboard('vless://b3bf7776-0451-4ab1-afb6-0f21ef63ddc2@sugoi.fadzvpnproject.xyz:80?encryption=none&security=none&fp=randomized&type=ws&host=sugoi.fadzvpnproject.xyz&path=%2Fvless#VLESS-HTTP')">Copy Port 80</button>
            <button onclick="copyToClipboard('vless://b3bf7776-0451-4ab1-afb6-0f21ef63ddc2@sugoi.fadzvpnproject.xyz:443?encryption=none&security=tls&sni=sugoi.fadzvpnproject.xyz&fp=randomized&type=ws&host=sugoi.fadzvpnproject.xyz&path=%2Fvless#VLESS-HTTPS')">Copy Port 443</button>
        </div>
        
        <h3>Current Time:</h3>
        <p id="current-time"></p>
        <button onclick="toggleDarkMode()">Toggle Dark Mode</button>
        
        <div class="input-section">
            <h3>Send Feedback to WhatsApp</h3>
            <input type="text" id="feedback" placeholder="Your message here...">
            <button onclick="sendFeedback()">Send Feedback</button>
        </div>

        <div class="input-section">
            <h3>Your IP Information:</h3>
            <p id="user-ip">Loading...</p>
            <p id="geo-info"></p>
        </div>

        <div class="input-section">
            <h3>Dns Record</h3>
            <input type="text" id="domain" placeholder="Enter domain (e.g., example.com)">
            <button onclick="performNslookup()">Check DNS Record</button>
            <p id="dns-result"></p>
        </div>

        <div class="footer">
            <h3>Contact Me:</h3>
            <p><a href="https://t.me/Matsumiko">Telegram</a></p>
            <p><a href="https://wa.me/6285727035336">WhatsApp</a></p>
        </div>
    </div>

    <script>
        async function getUserIP() {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            document.getElementById('user-ip').innerText = data.ip;

            // Mendapatkan informasi geografis berdasarkan IP
            const geoResponse = await fetch(`http://ip-api.com/json/${data.ip}`);
            const geoData = await geoResponse.json();
            if (geoData.status === "success") {
                document.getElementById('geo-info').innerText = `Location: ${geoData.city}, ${geoData.regionName}, ${geoData.country} - Latitude: ${geoData.lat}, Longitude: ${geoData.lon}`;
            } else {
                document.getElementById('geo-info').innerText = 'Geographical information not available.';
            }
        }

        function performNslookup() {
            const domain = document.getElementById('domain').value;
            const url = `https://dns.google/resolve?name=${domain}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.Answer) {
                        const results = data.Answer.map(record => `${record.name} - ${record.type} - ${record.data}`).join('<br>');
                        document.getElementById('dns-result').innerHTML = `DNS Records:<br>${results}`;
                    } else {
                        document.getElementById('dns-result').innerText = 'No DNS records found.';
                    }
                })
                .catch(error => {
                    document.getElementById('dns-result').innerText = 'Error during NSLookup.';
                });
        }

        function copyToClipboard(text) {
            const el = document.createElement('textarea');
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            alert('Copied: ' + text);
        }

        function updateTime() {
            const now = new Date();
            const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
            document.getElementById('current-time').innerText = now.toLocaleTimeString([], options);
        }

        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
        }

        function sendFeedback() {
            const message = document.getElementById('feedback').value;
            const whatsappUrl = `https://wa.me/6285727035336?text=${encodeURIComponent(message)}`; // Nomor WhatsApp Anda
            window.open(whatsappUrl, '_blank');
        }

        setInterval(updateTime, 1000);
        updateTime();
        getUserIP(); // Mendapatkan IP pengguna saat halaman dimuat
    </script>
</body>
</html>
`, {
                            status: 200,
                            headers: {
                                "Content-Type": "text/html;charset=utf-8",
                            }
                        });
                    default:
                        return new Response("404 Not found", { status: 404 });
                }
            } else {
                return await trojanOverWSHandler(request);
            }
        } catch (err) {
            let e = err;
            return new Response(e.toString());
        }
    }
};

// Fungsi dan logika Trojan tetap sama

async function trojanOverWSHandler(request) {
    const webSocketPair = new WebSocketPair();
    const [client, webSocket] = Object.values(webSocketPair);
    webSocket.accept();
    let address = "";
    let portWithRandomLog = "";
    const log = (info, event) => {
        console.log(`[${address}:${portWithRandomLog}] ${info}`, event || "");
    };
    const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";
    const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);
    let remoteSocketWapper = {
        value: null
    };
    let udpStreamWrite = null;
    readableWebSocketStream.pipeTo(new WritableStream({
        async write(chunk, controller) {
            if (udpStreamWrite) {
                return udpStreamWrite(chunk);
            }
            if (remoteSocketWapper.value) {
                const writer = remoteSocketWapper.value.writable.getWriter();
                await writer.write(chunk);
                writer.releaseLock();
                return;
            }
            const {
                hasError,
                message,
                portRemote = 443,
                addressRemote = "",
                rawClientData
            } = await parseTrojanHeader(chunk);
            address = addressRemote;
            portWithRandomLog = `${portRemote}--${Math.random()} tcp`;
            if (hasError) {
                throw new Error(message);
                return;
            }
            handleTCPOutBound(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, log);
        },
        close() {
            log(`readableWebSocketStream is closed`);
        },
        abort(reason) {
            log(`readableWebSocketStream is aborted`, JSON.stringify(reason));
        }
    })).catch((err) => {
        log("readableWebSocketStream pipeTo error", err);
    });
    return new Response(null, {
        status: 101,
        // @ts-ignore
        webSocket: client
    });
}

async function parseTrojanHeader(buffer) {
    if (buffer.byteLength < 56) {
        return {
            hasError: true,
            message: "invalid data"
        };
    }
    let crLfIndex = 56;
    if (new Uint8Array(buffer.slice(56, 57))[0] !== 0x0d || new Uint8Array(buffer.slice(57, 58))[0] !== 0x0a) {
        return {
            hasError: true,
            message: "invalid header format (missing CR LF)"
        };
    }
    const password = new TextDecoder().decode(buffer.slice(0, crLfIndex));
    if (password !== sha224Password) {
        return {
            hasError: true,
            message: "invalid password"
        };
    }

    const socks5DataBuffer = buffer.slice(crLfIndex + 2);
    if (socks5DataBuffer.byteLength < 6) {
        return {
            hasError: true,
            message: "invalid SOCKS5 request data"
        };
    }

    const view = new DataView(socks5DataBuffer);
    const cmd = view.getUint8(0);
    if (cmd !== 1) {
        return {
            hasError: true,
            message: "unsupported command, only TCP (CONNECT) is allowed"
        };
    }

    const atype = view.getUint8(1);
    // 0x01: IPv4 address
    // 0x03: Domain name
    // 0x04: IPv6 address
    let addressLength = 0;
    let addressIndex = 2;
    let address = "";
    switch (atype) {
        case 1:
            addressLength = 4;
            address = new Uint8Array(
              socks5DataBuffer.slice(addressIndex, addressIndex + addressLength)
            ).join(".");
            break;
        case 3:
            addressLength = new Uint8Array(
              socks5DataBuffer.slice(addressIndex, addressIndex + 1)
            )[0];
            addressIndex += 1;
            address = new TextDecoder().decode(
              socks5DataBuffer.slice(addressIndex, addressIndex + addressLength)
            );
            break;
        case 4:
            addressLength = 16;
            const dataView = new DataView(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
            const ipv6 = [];
            for (let i = 0; i < 8; i++) {
                ipv6.push(dataView.getUint16(i * 2).toString(16));
            }
            address = ipv6.join(":");
            break;
        default:
            return {
                hasError: true,
                message: `invalid addressType is ${atype}`
            };
    }

    if (!address) {
        return {
            hasError: true,
            message: `address is empty, addressType is ${atype}`
        };
    }

    const portIndex = addressIndex + addressLength;
    const portBuffer = socks5DataBuffer.slice(portIndex, portIndex + 2);
    const portRemote = new DataView(portBuffer).getUint16(0);
    return {
        hasError: false,
        addressRemote: address,
        portRemote,
        rawClientData: socks5DataBuffer.slice(portIndex + 4)
    };
}

async function handleTCPOutBound(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, log) {
    async function connectAndWrite(address, port) {
        const tcpSocket2 = connect({
            hostname: address,
            port
        });
        remoteSocket.value = tcpSocket2;
        log(`connected to ${address}:${port}`);
        const writer = tcpSocket2.writable.getWriter();
        await writer.write(rawClientData);
        writer.releaseLock();
        return tcpSocket2;
    }
    async function retry() {
        const tcpSocket2 = await connectAndWrite(proxyIP || addressRemote, portRemote);
        tcpSocket2.closed.catch((error) => {
            console.log("retry tcpSocket closed error", error);
        }).finally(() => {
            safeCloseWebSocket(webSocket);
        });
        remoteSocketToWS(tcpSocket2, webSocket, null, log);
    }
    const tcpSocket = await connectAndWrite(addressRemote, portRemote);
    remoteSocketToWS(tcpSocket, webSocket, retry, log);
}

function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
    let readableStreamCancel = false;
    const stream = new ReadableStream({
        start(controller) {
            webSocketServer.addEventListener("message", (event) => {
                if (readableStreamCancel) {
                    return;
                }
                const message = event.data;
                controller.enqueue(message);
            });
            webSocketServer.addEventListener("close", () => {
                safeCloseWebSocket(webSocketServer);
                if (readableStreamCancel) {
                    return;
                }
                controller.close();
            });
            webSocketServer.addEventListener("error", (err) => {
                log("webSocketServer error");
                controller.error(err);
            });
            const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
            if (error) {
                controller.error(error);
            } else if (earlyData) {
                controller.enqueue(earlyData);
            }
        },
        pull(controller) {},
        cancel(reason) {
            if (readableStreamCancel) {
                return;
            }
            log(`readableStream was canceled, due to ${reason}`);
            readableStreamCancel = true;
            safeCloseWebSocket(webSocketServer);
        }
    });
    return stream;
}

async function remoteSocketToWS(remoteSocket, webSocket, retry, log) {
    let hasIncomingData = false;
    await remoteSocket.readable.pipeTo(
        new WritableStream({
            start() {},
            /**
             *
             * @param {Uint8Array} chunk
             * @param {*} controller
             */
            async write(chunk, controller) {
                hasIncomingData = true;
                if (webSocket.readyState !== WS_READY_STATE_OPEN) {
                    controller.error(
                        "webSocket connection is not open"
                    );
                }
                webSocket.send(chunk);
            },
            close() {
                log(`remoteSocket.readable is closed, hasIncomingData: ${hasIncomingData}`);
            },
            abort(reason) {
                console.error("remoteSocket.readable abort", reason);
            }
        })
    ).catch((error) => {
        console.error(
            `remoteSocketToWS error:`,
            error.stack || error
        );
        safeCloseWebSocket(webSocket);
    });
    if (hasIncomingData === false && retry) {
        log(`retry`);
        retry();
    }
}

function isValidSHA224(hash) {
    const sha224Regex = /^[0-9a-f]{56}$/i;
    return sha224Regex.test(hash);
}

function base64ToArrayBuffer(base64Str) {
    if (!base64Str) {
        return { error: null };
    }
    try {
        base64Str = base64Str.replace(/-/g, "+").replace(/_/g, "/");
        const decode = atob(base64Str);
        const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
        return { earlyData: arryBuffer.buffer, error: null };
    } catch (error) {
        return { error };
    }
}

let WS_READY_STATE_OPEN = 1;
let WS_READY_STATE_CLOSING = 2;

function safeCloseWebSocket(socket) {
    try {
        if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
            socket.close();
        }
    } catch (error) {
        console.error("safeCloseWebSocket error", error);
    }
}
export {
    worker_default as
    default
};
//# sourceMappingURL=worker.js.map
