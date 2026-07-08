// ==UserScript==
// @name         TT Lobby Manager
// @namespace    https://github.com/fcy20/tt_lobby
// @version      3.0
// @description  Territorial.io 大厅切换 - 提供浮动控制面板
// @author       fcy20
// @match        https://territorial.io/*
// @match        https://fxclient.github.io/FXclient/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const LOBBIES = [
    { id: 0, name: 'Lobby 0', icon: '🟢', host: 'territorial.io', desc: '备用大厅' },
    { id: 1, name: 'Lobby 1', icon: '🔴', host: '1.territorial.io', desc: '默认主大厅' },
    { id: 2, name: 'Lobby 2', icon: '🟡', host: '2.territorial.io', desc: '备选大厅' },
  ];

  let currentLobby = 1;
  try {
    const stored = localStorage.getItem('tt_lobby_id');
    if (stored !== null) currentLobby = parseInt(stored);
  } catch(e) {}

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
            U.hostname = LOBBIES[currentLobby].host;
            M = U.toString();
            console.log('[TT Lobby] WebSocket →', M);
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
    console.log('[TT Lobby] WebSocket hook installed for', LOBBIES[currentLobby].name);
  }

  function switchLobby(id) {
    if (id < 0 || id >= LOBBIES.length) return;
    if (id === currentLobby) return;
    currentLobby = id;
    try {
      localStorage.setItem('tt_lobby_id', id.toString());
      localStorage.setItem('tt_lobby_host', LOBBIES[id].host);
    } catch(e) {}
    updatePanel();
    try {
      if (typeof window.aiCommand746 === 'function') {
        window.aiCommand746(0);
        showToast('✓ 已切换到 ' + LOBBIES[id].name);
      } else {
        showToast('✓ 已设置 ' + LOBBIES[id].name);
      }
    } catch(e) {
      showToast('✓ 已设置 ' + LOBBIES[id].name);
    }
  }

  function createPanel() {
    if (document.getElementById('tt-lobby-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'tt-lobby-panel';
    panel.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;user-select:none;background:linear-gradient(135deg,#1e293b,#0f172a);color:#fff;padding:12px;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.5);border:1px solid rgba(99,102,241,.3);min-width:220px;';
    panel.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.1);">
        <span style="font-size:20px">🏰</span>
        <span style="font-weight:700;font-size:15px;flex:1">大厅切换</span>
        <span id="tt-lobby-close" style="cursor:pointer;opacity:.6;font-size:18px;line-height:1">×</span>
      </div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:8px">当前: <b id="tt-lobby-current" style="color:#a5b4fc">Lobby ${currentLobby}</b></div>
      <div id="tt-lobby-list" style="display:flex;flex-direction:column;gap:6px"></div>
    `;
    document.body.appendChild(panel);

    const list = document.getElementById('tt-lobby-list');
    LOBBIES.forEach((l) => {
      const btn = document.createElement('div');
      const isCurrent = l.id === currentLobby;
      btn.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;background:' + (isCurrent ? 'rgba(99,102,241,.2)' : 'rgba(255,255,255,.03)') + ';border:1px solid ' + (isCurrent ? '#6366f1' : 'rgba(255,255,255,.08)') + ';transition:all .15s;';
      btn.innerHTML = `
        <span style="font-size:20px">${l.icon}</span>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:600">${l.name}</div>
          <div style="font-size:10px;color:#94a3b8">${l.desc}</div>
        </div>
        ${isCurrent ? '<span style="color:#10b981;font-size:16px">✓</span>' : ''}
      `;
      btn.onmouseenter = () => { if (!isCurrent) btn.style.background = 'rgba(255,255,255,.08)'; };
      btn.onmouseleave = () => { btn.style.background = (l.id === currentLobby) ? 'rgba(99,102,241,.2)' : 'rgba(255,255,255,.03)'; };
      btn.onclick = () => switchLobby(l.id);
      list.appendChild(btn);
    });

    document.getElementById('tt-lobby-close').onclick = () => panel.remove();
  }

  function updatePanel() {
    const c = document.getElementById('tt-lobby-current');
    if (c) c.textContent = 'Lobby ' + currentLobby;
    createPanel();
  }

  function showToast(message) {
    const old = document.getElementById('tt-lobby-toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.id = 'tt-lobby-toast';
    toast.style.cssText = 'position:fixed;top:80px;right:20px;z-index:100000;background:rgba(16,185,129,.95);color:#fff;padding:10px 16px;border-radius:10px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:13px;font-weight:500;box-shadow:0 4px 15px rgba(16,185,129,.4);';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 2500);
  }

  function init() {
    injectWSHook();
    createPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
