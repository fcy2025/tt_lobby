// ==UserScript==
// @name         TT Lobby Manager
// @namespace    https://github.com/fcy20/tt_lobby
// @version      4.0
// @description  Territorial.io 大厅切换
// @author       fcy20
// @match        https://territorial.io/*
// @match        https://fxclient.github.io/FXclient/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  if (window._ttHook) return;
  window._ttHook = true;

  var O = window.WebSocket;
  var H = ['territorial.io', '1.territorial.io', '2.territorial.io'];

  function getId() {
    try { return parseInt(localStorage.getItem('tt_lobby_id') || '1'); }
    catch(e) { return 1; }
  }

  // 注入WebSocket钩子
  window.WebSocket = function(u, p) {
    var M = u;
    if (typeof u === 'string' && u.indexOf('territorial.io') > -1) {
      var id = getId();
      var h = H[id] || '1.territorial.io';
      M = u.replace(/\/\/[^\/]+/, '//' + h);
      console.log('[TT]', u, '->', M);
    }
    return p ? new O(M, p) : new O(M);
  };

  window.WebSocket.prototype = O.prototype;
  window.WebSocket.prototype.constructor = window.WebSocket;
  window.WebSocket.toString = function() { return O.toString(); };
  window.WebSocket.CONNECTING = 0;
  window.WebSocket.OPEN = 1;
  window.WebSocket.CLOSING = 2;
  window.WebSocket.CLOSED = 3;

  console.log('[TT] Hook OK lobby=' + getId());

  // 创建控制面板
  function createPanel() {
    var old = document.getElementById('tt-panel');
    if (old) old.remove();

    var d = document.createElement('div');
    d.id = 'tt-panel';
    d.style = 'position:fixed;top:10px;right:10px;z-index:99999;background:#1e293b;color:#fff;padding:10px;border-radius:10px;font-family:sans-serif;font-size:12px;box-shadow:0 4px 20px rgba(0,0,0,.5);border:1px solid #6366f1;min-width:180px;';
    d.innerHTML = '<div style="display:flex;align-items:center;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #334155;"><span style="font-size:16px;margin-right:6px;">🏰</span><b>大厅切换</b><span id="tt-close" style="margin-left:auto;cursor:pointer;color:#94a3b8;">✕</span></div><div id="tt-list"></div>';
    document.body.appendChild(d);

    var list = document.getElementById('tt-list');
    var L = [{id:0,n:'Lobby 0',i:'🟢'},{id:1,n:'Lobby 1',i:'🔴'},{id:2,n:'Lobby 2',i:'🟡'}];

    function render() {
      var c = getId();
      list.innerHTML = '';
      L.forEach(function(l) {
        var active = l.id === c;
        var row = document.createElement('div');
        row.style = 'display:flex;align-items:center;padding:8px;border-radius:6px;cursor:pointer;margin-bottom:4px;background:' + (active ? 'rgba(99,102,241,.3)' : 'rgba(255,255,255,.05)') + ';border:1px solid ' + (active ? '#6366f1' : 'transparent') + ';';
        row.innerHTML = '<span style="font-size:16px;margin-right:8px;">' + l.i + '</span><span style="flex:1;font-weight:' + (active ? 'bold' : 'normal') + ';">' + l.n + '</span>' + (active ? '<span style="color:#10b981;">✓</span>' : '');
        row.onclick = function() {
          if (l.id === c) return;
          localStorage.setItem('tt_lobby_id', l.id);
          localStorage.setItem('tt_lobby_host', H[l.id]);
          render();
          try { if (typeof aiCommand746 === 'function') aiCommand746(0); } catch(e) {}
          try { if (typeof window.aiCommand746 === 'function') window.aiCommand746(0); } catch(e) {}
        };
        list.appendChild(row);
      });
    }
    render();
    document.getElementById('tt-close').onclick = function() { d.remove(); };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPanel);
  } else {
    createPanel();
  }
})();
