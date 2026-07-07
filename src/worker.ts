const TARGET_HOST = 'territorial.io';

const INJECTED_SCRIPT = `
(function() {
    const LOBBIES = [
        { id: 0, name: 'Lobby 0', icon: '🟢', host: 'territorial.io' },
        { id: 1, name: 'Lobby 1', icon: '🔴', host: '1.territorial.io' },
        { id: 2, name: 'Lobby 2', icon: '🟡', host: '2.territorial.io' },
    ];

    let targetLobbyId = 1;
    const urlParams = new URLSearchParams(window.location.search);
    const lobbyParam = urlParams.get('lobby');
    if (lobbyParam !== null) {
        const parsed = parseInt(lobbyParam, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < LOBBIES.length) {
            targetLobbyId = parsed;
        }
    }

    const targetServer = LOBBIES[targetLobbyId].host;

    function patchServerConfig() {
        try {
            for (const key in window) {
                try {
                    const obj = window[key];
                    if (!obj || typeof obj !== 'object') continue;

                    if (obj.z && typeof obj.z === 'object') {
                        if (obj.z.aHM !== undefined && obj.z.aUa && Array.isArray(obj.z.aUa)) {
                            obj.z.aHM = 3;
                            obj.z.aUa = ['territorial.io', '1.territorial.io', '2.territorial.io'];
                            return true;
                        }
                    }

                    if (obj.aHM !== undefined && obj.aUa && Array.isArray(obj.aUa)) {
                        let hasTerritorial = false;
                        for (const item of obj.aUa) {
                            if (item && item.includes && item.includes('territorial.io')) {
                                hasTerritorial = true;
                                break;
                            }
                        }
                        if (hasTerritorial) {
                            obj.aHM = 3;
                            obj.aUa = ['territorial.io', '1.territorial.io', '2.territorial.io'];
                            return true;
                        }
                    }

                    for (const subKey in obj) {
                        try {
                            const subObj = obj[subKey];
                            if (!subObj || typeof subObj !== 'object') continue;

                            if (subObj.aHM !== undefined && subObj.aUa && Array.isArray(subObj.aUa)) {
                                let hasTerritorial = false;
                                for (const item of subObj.aUa) {
                                    if (item && item.includes && item.includes('territorial.io')) {
                                        hasTerritorial = true;
                                        break;
                                    }
                                }
                                if (hasTerritorial) {
                                    subObj.aHM = 3;
                                    subObj.aUa = ['territorial.io', '1.territorial.io', '2.territorial.io'];
                                    return true;
                                }
                            }
                        } catch(e) {}
                    }
                } catch(e) {}
            }
        } catch(e) {}
        return false;
    }

    let attempts = 0;
    const maxAttempts = 200;
    const patchInterval = setInterval(() => {
        if (patchServerConfig() || attempts >= maxAttempts) {
            clearInterval(patchInterval);
        }
        attempts++;
    }, 50);

    setTimeout(() => {
        clearInterval(patchInterval);
        patchServerConfig();
    }, 20000);

    const originalWebSocket = window.WebSocket;

    window.WebSocket = function(url, protocols) {
        let modifiedUrl = url;

        if (url && typeof url === 'string') {
            try {
                const urlObj = new URL(url);
                const hostname = urlObj.hostname;

                if (/^[12]\.territorial\.io$/.test(hostname)) {
                    urlObj.hostname = targetServer;
                    modifiedUrl = urlObj.toString();
                }
            } catch(e) {}
        }

        const ws = protocols 
            ? new originalWebSocket(modifiedUrl, protocols) 
            : new originalWebSocket(modifiedUrl);
            
        return ws;
    };

    window.WebSocket.prototype = originalWebSocket.prototype;

    function createLobbySelector() {
        const container = document.createElement('div');
        container.id = 'tt-lobby-selector';
        container.style.cssText = \`
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            animation: slideIn 0.3s ease;
        \`;

        const panel = document.createElement('div');
        panel.style.cssText = \`
            background: rgba(15, 23, 42, 0.95);
            border-radius: 16px;
            padding: 12px;
            border: 2px solid rgba(99, 102, 241, 0.3);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            min-width: 180px;
        \`;

        const header = document.createElement('div');
        header.style.cssText = \`
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        \`;

        const title = document.createElement('span');
        title.style.cssText = \`
            font-size: 12px;
            font-weight: 600;
            color: white;
        \`;
        title.textContent = '🏰 TT Lobby';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = \`
            background: none;
            border: none;
            color: #8892b0;
            font-size: 18px;
            cursor: pointer;
            padding: 0 4px;
            line-height: 1;
        \`;
        closeBtn.onclick = () => container.remove();

        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        const currentLabel = document.createElement('div');
        currentLabel.style.cssText = \`
            font-size: 10px;
            color: #6366f1;
            margin-bottom: 8px;
            text-align: center;
        \`;
        currentLabel.textContent = \`当前: \${LOBBIES[targetLobbyId].icon} \${LOBBIES[targetLobbyId].name}\`;
        panel.appendChild(currentLabel);

        LOBBIES.forEach((lobby, index) => {
            const btn = document.createElement('button');
            btn.style.cssText = \`
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 8px 10px;
                border: 2px solid transparent;
                border-radius: 8px;
                background: \${index === targetLobbyId ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
                cursor: pointer;
                transition: all 0.2s;
                text-align: left;
                margin-bottom: 4px;
            \`;

            if (index === targetLobbyId) {
                btn.style.borderColor = '#6366f1';
            }

            btn.onmouseenter = () => {
                btn.style.background = 'rgba(255, 255, 255, 0.1)';
            };
            btn.onmouseleave = () => {
                btn.style.background = index === targetLobbyId ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)';
            };

            btn.onclick = () => {
                window.location.href = \`?lobby=\${index}\`;
            };

            const left = document.createElement('span');
            left.innerHTML = \`<span style="font-size: 16px">\${lobby.icon}</span>\`;

            const right = document.createElement('span');
            right.style.cssText = \`
                font-size: 12px;
                color: white;
                font-weight: 500;
            \`;
            right.textContent = lobby.name;

            btn.appendChild(left);
            btn.appendChild(right);
            panel.appendChild(btn);
        });

        container.appendChild(panel);
        document.body.appendChild(container);

        const style = document.createElement('style');
        style.textContent = \`
            @keyframes slideIn {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }
        \`;
        document.head.appendChild(style);
    }

    if (document.body) {
        createLobbySelector();
    } else {
        document.addEventListener('DOMContentLoaded', createLobbySelector);
    }
})();
`;

async function handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname || '/';

    if (path === '/favicon.ico') {
        const response = await fetch(`https://${TARGET_HOST}/favicon.ico`);
        return new Response(response.body, {
            headers: { ...response.headers, 'Access-Control-Allow-Origin': '*' },
        });
    }

    if (path.startsWith('/s52/')) {
        const lobbyParam = url.searchParams.get('lobby');
        let serverHost = '1.territorial.io';
        if (lobbyParam === '0') {
            serverHost = 'territorial.io';
        } else if (lobbyParam === '1') {
            serverHost = '1.territorial.io';
        } else if (lobbyParam === '2') {
            serverHost = '2.territorial.io';
        }
        const wsUrl = `wss://${serverHost}${path}`;
        
        return new Response(null, {
            status: 101,
            webSocket: {
                async onUpgrade(ws) {
                    const remoteWs = new WebSocket(wsUrl);
                    remoteWs.binaryType = 'arraybuffer';

                    remoteWs.onopen = () => {
                        ws.accept();
                    };

                    remoteWs.onmessage = (event) => {
                        if (event.data instanceof ArrayBuffer) {
                            ws.send(event.data);
                        } else {
                            ws.send(event.data);
                        }
                    };

                    remoteWs.onerror = () => {
                        ws.close();
                    };

                    remoteWs.onclose = () => {
                        ws.close();
                    };

                    ws.onmessage = (event) => {
                        if (remoteWs.readyState === WebSocket.OPEN) {
                            remoteWs.send(event.data);
                        }
                    };

                    ws.onerror = () => {
                        remoteWs.close();
                    };

                    ws.onclose = () => {
                        remoteWs.close();
                    };
                },
            },
        });
    }

    const targetUrl = `https://${TARGET_HOST}${path}${url.search}`;
    const response = await fetch(targetUrl, {
        headers: {
            ...request.headers,
            'Host': TARGET_HOST,
            'Origin': `https://${TARGET_HOST}`,
        },
    });

    let content = await response.text();

    if (path === '/' || path === '') {
        content = content.replace(
            '</body>',
            `<script>${INJECTED_SCRIPT}</script></body>`
        );
    }

    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');

    return new Response(content, {
        status: response.status,
        headers: headers,
    });
}

export default {
    async fetch(request: Request): Promise<Response> {
        return handleRequest(request);
    },
};