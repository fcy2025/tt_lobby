// ==UserScript==
// @name         TT Lobby Manager
// @namespace    https://github.com/fcy20/tt_lobby
// @version      2.0
// @description  自动管理Territorial.io大厅切换，提供浮动按钮快速切换
// @author       fcy20
// @match        https://territorial.io/*
// @match        https://fxclient.github.io/FXclient/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const LOBBIES = [
    { id: 0, name: 'Lobby 0', icon: '🟢', host: 'territorial.io', desc: '备用大厅' },
    { id: 1, name: 'Lobby 1', icon: '🔴', host: '1.territorial.io', desc: '默认主大厅' },
    { id: 2, name: 'Lobby 2', icon: '🟡', host: '2.territorial.io', desc: '备选大厅' },
  ];

  let currentLobbyIndex = 1;
  try {
    const stored = localStorage.getItem('tt_lobby_id');
    if (stored !== null) currentLobbyIndex = parseInt(stored);
  } catch(e) {}

  let targetHost = LOBBIES[currentLobbyIndex].host;
  let scriptInjected = false;
  let originalWS = null;

  function injectWSHook() {
    if (scriptInjected) return;
    if (window._ttOrigWS) {
      originalWS = window._ttOrigWS;
    } else {
      originalWS = window.WebSocket;
      window._ttOrigWS = originalWS;
    }

    const O = originalWS;
    const MyWS = function(u, p) {
      let M = u;
      if (u && typeof u === 'string') {
        try {
          const U = new URL(u);
          if (U.hostname.includes('territorial.io') && U.pathname === '/s52/') {
            U.hostname = targetHost;
            M = U.toString();
          }
        } catch(e) {}
      }
      return p ? new O(M, p) : new O(M);
    };
    MyWS.prototype = O.prototype;
    MyWS.prototype.constructor = MyWS;
    MyWS.toString = function() { return O.toString(); };
    MyWS.OPEN = O.OPEN;
    MyWS.CLOSED = O.CLOSED;
    MyWS.CLOSING = O.CLOSING;
    MyWS.CONNECTING = O.CONNECTING;

    window.WebSocket = MyWS;
    scriptInjected = true;
    console.log('[TT Lobby] WebSocket hook installed for', targetHost);
  }

  function switchLobby(index) {
    if (index < 0 || index >= LOBBIES.length) return;
    currentLobbyIndex = index;
    targetHost = LOBBIES[index].host;
    try {
      localStorage.setItem('tt_lobby_id', index.toString());
      localStorage.setItem('tt_lobby_host', targetHost);
    } catch(e) {}
    updateFab();
    try {
      if (typeof window.aiCommand746 === 'function') {
        window.aiCommand746(0);
        showToast('✓ 已切换到 ' + LOBBIES[index].name);
      } else {
        showToast('✓ 已设置 ' + LOBBIES[index].name + '，点击多人游戏生效');
      }
    } catch(e) {
      showToast('✓ 已设置 ' + LOBBIES[index].name);
    }
  }

  function createFab() {
    if (document.getElementById('tt-lobby-fab')) return;
    const fab = document.createElement('div');
    fab.id = 'tt-lobby-fab';
    fab.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;user-select:none;';
    fab.innerHTML = `
      <div id="tt-lobby-main" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:10px 16px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 20px rgba(99,102,241,.5);display:flex;align-items:center;gap:8px;transition:all .2s;">
        <span style="font-size:18px">🏰</span>
        <span class="tt-lobby-label">Lobby ${currentLobbyIndex}</span>
        <span style="font-size:10px;margin-left:4px">▼</span>
      </div>
      <div id="tt-lobby-menu" style="display:none;margin-top:8px;background:rgba(15,23,42,.95);border-radius:12px;padding:8px;border:1px solid rgba(99,102,241,.3);box-shadow:0 4px 20px rgba(0,0,0,.5);min-width:200px;">
        <div style="font-size:11px;color:#8892b0;padding:6px 8px 4px;">选择大厅</div>
        ${LOBBIES.map((l, i) => `
          <div class="tt-lobby-item" data-id="${i}" style="display:flex;align-items:center;gap:8px;padding:8px;border-radius:8px;cursor:pointer;background:${i === currentLobbyIndex ? 'rgba(99,102,241,.2)' : 'transparent'};border:1px solid ${i === currentLobbyIndex ? '#6366f1' : 'transparent'};">
            <span style="font-size:18px">${l.icon}</span>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:500;color:#fff">${l.name}</div>
              <div style="font-size:10px;color:#8892b0">${l.desc}</div>
            </div>
            ${i === currentLobbyIndex ? '<span style="color:#10b981;font-size:14px">✓</span>' : ''}
          </div>
        `).join('')}
      </div>
    `;
    document.body.appendChild(fab);

    const main = document.getElementById('tt-lobby-main');
    const menu = document.getElementById('tt-lobby-menu');
    main.onmouseenter = () => main.style.transform = 'scale(1.05)';
    main.onmouseleave = () => main.style.transform = 'scale(1)';
    main.onclick = (e) => {
      e.stopPropagation();
      const visible = menu.style.display === 'block';
      menu.style.display = visible ? 'none' : 'block';
    };

    fab.querySelectorAll('.tt-lobby-item').forEach(item => {
      item.onmouseenter = () => { if (!item.style.background.includes('99, 102, 241')) item.style.background = 'rgba(255,255,255,.05)'; };
      item.onmouseleave = () => { const id = parseInt(item.dataset.id); item.style.background = id === currentLobbyIndex ? 'rgba(99,102,241,.2)' : 'transparent'; };
      item.onclick = (e) => {
        e.stopPropagation();
        const id = parseInt(item.dataset.id);
        switchLobby(id);
        setTimeout(() => { menu.style.display = 'none'; }, 300);
      };
    });

    document.addEventListener('click', () => { menu.style.display = 'none'; });
  }

  function updateFab() {
    const label = document.querySelector('.tt-lobby-label');
    if (label) label.textContent = 'Lobby ' + currentLobbyIndex;
    const main = document.getElementById('tt-lobby-main');
    if (main) {
      main.style.background = 'linear-gradient(135deg,#10b981,#059669)';
      setTimeout(() => { main.style.background = 'linear-gradient(135deg,#6366f1,#8b5cf6)'; }, 800);
    }
    const fab = document.getElementById('tt-lobby-fab');
    if (fab) createFab();
  }

  function showToast(message) {
    const old = document.getElementById('tt-lobby-toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.id = 'tt-lobby-toast';
    toast.style.cssText = 'position:fixed;top:80px;right:20px;z-index:100000;background:rgba(16,185,129,.95);color:#fff;padding:10px 16px;border-radius:10px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:13px;font-weight:500;box-shadow:0 4px 15px rgba(16,185,129,.4);animation:ttToastIn .3s ease;';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 2500);
  }

  // 注入 WebSocket 钩子
  injectWSHook();

  // 在 document-start 时立即执行钩子，后续也需要在 DOMContentLoaded 后再次确保
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectWSHook();
      createFab();
    });
  } else {
    injectWSHook();
    createFab();
  }

  // 监听可能的 SPA 重新初始化
  let lastAiCmd = window.aiCommand746;
  setInterval(() => {
    if (window.aiCommand746 !== lastAiCmd) {
      lastAiCmd = window.aiCommand746;
      console.log('[TT Lobby] Game re-initialized');
    }
  }, 1000);

})();
