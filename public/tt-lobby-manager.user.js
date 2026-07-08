// ==UserScript==
// @name         TT Lobby Manager
// @namespace    https://github.com/fcy20/tt_lobby
// @version      3.3
// @description  Territorial.io 大厅切换 - 支持所有WebSocket路径模式
// @author       fcy20
// @match        https://territorial.io/*
// @match        https://fxclient.github.io/FXclient/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const hosts = ['territorial.io', '1.territorial.io', '2.territorial.io'];
  const LOBBIES = [
    { id: 0, name: 'Lobby 0', icon: '🟢', desc: '备用大厅' },
    { id: 1, name: 'Lobby 1', icon: '🔴', desc: '默认主大厅' },
    { id: 2, name: 'Lobby 2', icon: '🟡', desc: '备选大厅' },
  ];

  function getSaved() {
    try { return parseInt(localStorage.getItem('tt_lobby_id') || '1'); }
    catch(e) { return 1; }
  }

  function injectWS() {
    if (window._ttOrigWS) return;
    const O = window.WebSocket;
    window._ttOrigWS = O;
    window.WebSocket = function(u, p) {
      let M = u;
      if (u && typeof u === 'string') {
        try {
          const U = new URL(u);
          const host = U.hostname;
          const path = U.pathname;
          const isTT = host === 'territorial.io' || host === '1.territorial.io' || host === '2.territorial.io' || host === 'game.territorial.io';
          if (isTT) {
            const id = getSaved();
            const targetHost = hosts[id] || '1.territorial.io';
            if (path.length === 5 && path.charAt(0) === '/' && path.charAt(1) === 'x' && path.charAt(2) === '0') {
              const xId = parseInt(path.charAt(3));
              if (!isNaN(xId)) {
                U.pathname = '/x0' + id + '/';
                if (host !== 'game.territorial.io') {
                  U.hostname = targetHost;
                }
                M = U.toString();
                console.log('[TT] WS x0→', M);
              }
            } else if (path === '/s50/' || path === '/s51/' || path === '/s52/') {
              U.hostname = targetHost;
              M = U.toString();
              console.log('[TT] WS s→', M);
            }
          }
        } catch(e) { console.log('[TT] URL parse error:', e); }
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
    console.log('[TT] WS hook installed for Lobby', getSaved());
  }

  // document-start: inject immediately
  injectWS();

  // Also hook window.onload to catch late initializations
  const origOnload = window.onload;
  window.onload = function() {
    injectWS();
    if (typeof origOnload === 'function') {
      try { origOnload(); } catch(e) {}
    }
  };

  function createPanel() {
    const old = document.getElementById('tt-lobby-panel');
    if (old) old.remove();
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
    const list = document.getElementById('tt-lobby-list');

    function rebuild() {
      const current = getSaved();
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
          localStorage.setItem('tt_lobby_id', l.id.toString());
          localStorage.setItem('tt_lobby_host', hosts[l.id]);
          rebuild();
          const c = document.getElementById('tt-lobby-current');
          if (c) c.textContent = 'Lobby ' + l.id;
          try {
            if (typeof aiCommand746 === 'function') aiCommand746(0);
            else if (typeof window.aiCommand746 === 'function') window.aiCommand746(0);
            else if (typeof bw === 'function') bw(0);
          } catch(e) { console.log('[TT] Switch error:', e); }
        };
        list.appendChild(btn);
      });
    }
    rebuild();
    document.getElementById('tt-lobby-close').onclick = () => panel.remove();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPanel);
  } else {
    createPanel();
  }
})();
