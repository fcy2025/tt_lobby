// ==UserScript==
// @name         TT Lobby Manager
// @namespace    https://github.com/fcy20/tt_lobby
// @version      3.1
// @description  Territorial.io 大厅切换 - 提供浮动控制面板
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
  const HOSTS = ['territorial.io', '1.territorial.io', '2.territorial.io'];

  function getSaved() {
    try { return parseInt(localStorage.getItem('tt_lobby_id') || '1'); }
    catch(e) { return 1; }
  }

  // ===== 第一步：立即注入 WebSocket 钩子（document-start 时执行）=====
  function injectWSHook() {
    if (window._ttOrigWS) return;
    const O = window.WebSocket;
    window._ttOrigWS = O;
    window.WebSocket = function(u, p) {
      let M = u;
      if (u && typeof u === 'string') {
        try {
          const U = new URL(u);
          if (U.hostname.includes('territorial.io') && U.pathname === '/s52/') {
            const id = getSaved();
            U.hostname = HOSTS[id] || '1.territorial.io';
            M = U.toString();
            console.log('[TT Lobby] WS→', M);
          }
        } catch(e) {}
      }
      if (p && Array.isArray(p)) return new O(M, p);
      if (p) return new O(M, p);
      return new O(M);
    };
    window.WebSocket.prototype = O.prototype;
    window.WebSocket.prototype.constructor = window.WebSocket;
    try { Object.defineProperty(window.WebSocket, 'name', { value: 'WebSocket', configurable: true }); }
    catch(e) {}
    window.WebSocket.toString = function() { return O.toString(); };
    window.WebSocket.OPEN = O.OPEN;
    window.WebSocket.CLOSED = O.CLOSED;
    window.WebSocket.CLOSING = O.CLOSING;
    window.WebSocket.CONNECTING = O.CONNECTING;
    console.log('[TT Lobby] WebSocket hook installed for Lobby', getSaved());
  }

  // 立即注入
  injectWSHook();

  // ===== 第二步：DOM 加载后创建控制面板 =====
  function createPanel() {
    if (document.getElementById('tt-lobby-panel')) return;
    const cur = getSaved();

    const panel = document.createElement('div');
    panel.id = 'tt-lobby-panel';
    panel.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;user-select:none;background:linear-gradient(135deg,#1e293b,#0f172a);color:#fff;padding:12px;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.5);border:1px solid rgba(99,102,241,.3);min-width:220px;';
    panel.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.1);">
        <span style="font-size:20px">🏰</span>
        <span style="font-weight:700;font-size:15px;flex:1">大厅切换</span>
        <span id="tt-lobby-close" style="cursor:pointer;opacity:.6;font-size:18px;line-height:1">×</span>
      </div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:8px">当前: <b id="tt-lobby-current" style="color:#a5b4fc">Lobby ${cur}</b></div>
      <div id="tt-lobby-list" style="display:flex;flex-direction:column;gap:6px"></div>
    `;
    document.body.appendChild(panel);

    function rebuildList() {
      const current = getSaved();
      const list = document.getElementById('tt-lobby-list');
      list.innerHTML = '';
      LOBBIES.forEach((l) => {
        const isCur = l.id === current;
        const btn = document.createElement('div');
        btn.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;background:' + (isCur ? 'rgba(99,102,241,.2)' : 'rgba(255,255,255,.03)') + ';border:1px solid ' + (isCur ? '#6366f1' : 'rgba(255,255,255,.08)') + ';transition:all .15s;';
        btn.innerHTML = `
          <span style="font-size:20px">${l.icon}</span>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:600">${l.name}</div>
            <div style="font-size:10px;color:#94a3b8">${l.desc}</div>
          </div>
          ${isCur ? '<span style="color:#10b981;font-size:16px">✓</span>' : ''}
        `;
        btn.onmouseenter = () => { if (!isCur) btn.style.background = 'rgba(255,255,255,.08)'; };
        btn.onmouseleave = () => { btn.style.background = isCur ? 'rgba(99,102,241,.2)' : 'rgba(255,255,255,.03)'; };
        btn.onclick = () => {
          if (l.id === current) return;
          try {
            localStorage.setItem('tt_lobby_id', l.id.toString());
            localStorage.setItem('tt_lobby_host', HOSTS[l.id]);
          } catch(e) {}
          rebuildList();
          const c = document.getElementById('tt-lobby-current');
          if (c) c.textContent = 'Lobby ' + l.id;
          try {
            if (typeof aiCommand746 === 'function') aiCommand746(0);
            else if (typeof window.aiCommand746 === 'function') window.aiCommand746(0);
          } catch(e) { console.log('[TT] aiCommand746 error:', e); }
        };
        list.appendChild(btn);
      });
    }

    rebuildList();
    document.getElementById('tt-lobby-close').onclick = () => panel.remove();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPanel);
  } else {
    createPanel();
  }
})();
