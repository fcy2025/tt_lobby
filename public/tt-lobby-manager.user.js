// ==UserScript==
// @name         TT Lobby Manager
// @namespace    https://github.com/fcy20/tt_lobby
// @version      1.0.0
// @description  自动管理Territorial.io大厅切换，提供浮动选择器
// @author       fcy20
// @match        https://territorial.io/*
// @match        https://fxclient.github.io/FXclient/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const LOBBIES = [
        { id: 0, name: 'Lobby 0', icon: '🟢', host: 'territorial.io', desc: '备用大厅' },
        { id: 1, name: 'Lobby 1', icon: '🔴', host: '1.territorial.io', desc: '默认主大厅' },
        { id: 2, name: 'Lobby 2', icon: '🟡', host: '2.territorial.io', desc: '备选大厅' },
    ];

    let currentLobbyIndex = GM_getValue('tt_lobby_index', 1);
    let targetHost = LOBBIES[currentLobbyIndex].host;
    let scriptInjected = false;

    function getCurrentLobby() {
        return LOBBIES[currentLobbyIndex];
    }

    function switchLobby(index) {
        if (index < 0 || index >= LOBBIES.length) return;
        currentLobbyIndex = index;
        targetHost = LOBBIES[index].host;
        GM_setValue('tt_lobby_index', index);
        updateUI();
        injectGameScript();
        showToast(`已切换到 ${LOBBIES[index].name}`);
    }

    function injectGameScript() {
        if (scriptInjected) {
            const existing = document.getElementById('tt-lobby-script');
            if (existing) existing.remove();
        }

        const script = document.createElement('script');
        script.id = 'tt-lobby-script';
        script.dataset.targetHost = targetHost;
        script.textContent = `
            (function(){
                const SERVER="${targetHost}";
                const O=window.WebSocket;
                window.WebSocket=function(u,p){
                    let M=u;
                    if(u&&typeof u==="string"){
                        try{
                            const U=new URL(u);
                            const h=U.hostname;
                            if(h.includes("territorial.io")){
                                U.hostname=SERVER;
                                M=U.toString();
                            }
                        }catch(e){}
                    }
                    const w=p?new O(M,p):new O(M);
                    return w;
                };
                window.WebSocket.prototype=O.prototype;
            })();
        `;
        document.documentElement.appendChild(script);
        scriptInjected = true;
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.id = 'tt-lobby-toast';
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(99, 102, 241, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            font-size: 14px;
            z-index: 99999;
            animation: ttToastIn 0.3s ease, ttToastOut 0.3s ease 2.5s forwards;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            const el = document.getElementById('tt-lobby-toast');
            if (el) el.remove();
        }, 3000);
    }

    function createUI() {
        const container = document.createElement('div');
        container.id = 'tt-lobby-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        const panel = document.createElement('div');
        panel.id = 'tt-lobby-panel';
        panel.style.cssText = `
            background: rgba(15, 23, 42, 0.95);
            border-radius: 16px;
            padding: 16px;
            border: 2px solid rgba(99, 102, 241, 0.3);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            min-width: 200px;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
        `;

        const title = document.createElement('span');
        title.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            color: white;
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        title.innerHTML = '🏰 <span>TT Lobby</span>';

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'tt-lobby-toggle';
        toggleBtn.innerHTML = '▼';
        toggleBtn.style.cssText = `
            background: none;
            border: none;
            color: #8892b0;
            font-size: 10px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
        `;
        toggleBtn.onmouseenter = () => toggleBtn.style.color = 'white';
        toggleBtn.onmouseleave = () => toggleBtn.style.color = '#8892b0';

        header.appendChild(title);
        header.appendChild(toggleBtn);
        panel.appendChild(header);

        const lobbyList = document.createElement('div');
        lobbyList.id = 'tt-lobby-list';
        lobbyList.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 6px;
        `;

        LOBBIES.forEach((lobby, index) => {
            const btn = document.createElement('button');
            btn.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 10px 12px;
                border: 2px solid transparent;
                border-radius: 10px;
                background: ${index === currentLobbyIndex ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
                cursor: pointer;
                transition: all 0.2s;
                text-align: left;
            `;

            if (index === currentLobbyIndex) {
                btn.style.borderColor = '#6366f1';
                btn.style.boxShadow = '0 0 10px rgba(99, 102, 241, 0.3)';
            }

            btn.onmouseenter = () => {
                btn.style.background = 'rgba(255, 255, 255, 0.1)';
            };
            btn.onmouseleave = () => {
                btn.style.background = index === currentLobbyIndex ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)';
            };

            btn.onclick = () => switchLobby(index);

            const left = document.createElement('span');
            left.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            left.innerHTML = `<span style="font-size: 18px">${lobby.icon}</span>`;

            const right = document.createElement('span');
            right.style.cssText = `
                text-align: right;
            `;
            const name = document.createElement('span');
            name.style.cssText = `
                display: block;
                font-size: 13px;
                font-weight: 500;
                color: white;
            `;
            name.textContent = lobby.name;
            const desc = document.createElement('span');
            desc.style.cssText = `
                display: block;
                font-size: 9px;
                color: #8892b0;
            `;
            desc.textContent = lobby.desc;

            right.appendChild(name);
            right.appendChild(desc);
            btn.appendChild(left);
            btn.appendChild(right);
            lobbyList.appendChild(btn);
        });

        panel.appendChild(lobbyList);

        const footer = document.createElement('div');
        footer.style.cssText = `
            margin-top: 12px;
            padding-top: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
        `;

        const currentLabel = document.createElement('span');
        currentLabel.style.cssText = `
            font-size: 10px;
            color: #6366f1;
            font-weight: 500;
        `;
        currentLabel.textContent = `当前: ${getCurrentLobby().name}`;
        footer.appendChild(currentLabel);

        container.appendChild(panel);
        document.body.appendChild(container);

        let collapsed = false;
        toggleBtn.onclick = () => {
            collapsed = !collapsed;
            toggleBtn.innerHTML = collapsed ? '▲' : '▼';
            lobbyList.style.display = collapsed ? 'none' : 'flex';
            footer.style.display = collapsed ? 'none' : 'block';
            panel.style.minWidth = collapsed ? '60px' : '200px';
            title.innerHTML = collapsed ? '🏰' : '🏰 <span>TT Lobby</span>';
        };
    }

    GM_addStyle(`
        @keyframes ttToastIn {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes ttToastOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(20px); }
        }
        #tt-lobby-container {
            animation: ttToastIn 0.3s ease;
        }
    `);

    if (document.body) {
        createUI();
        injectGameScript();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            createUI();
            injectGameScript();
        });
    }

})();