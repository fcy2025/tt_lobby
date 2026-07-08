// ==UserScript==
// @name         TT Lobby Manager
// @namespace    https://github.com/fcy20/tt_lobby
// @version      5.0
// @description  Territorial.io 大厅切换
// @author       fcy20
// @match        https://territorial.io/*
// @match        https://*.territorial.io/*
// @match        https://fxclient.github.io/FXclient/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var HOSTS = ['territorial.io', '1.territorial.io', '2.territorial.io'];

  function getId() {
    try { return parseInt(localStorage.getItem('tt_lobby_id') || '1'); }
    catch(e) { return 1; }
  }

  function setId(id) {
    localStorage.setItem('tt_lobby_id', id);
    localStorage.setItem('tt_lobby_host', HOSTS[id]);
  }

  if (!window._ttHook) {
    window._ttHook = 1;
    var OrigWS = window.WebSocket;

    window.WebSocket = function(url, protocols) {
      var targetUrl = url;
      try {
        var parsedUrl = new URL(url);
        var host = parsedUrl.hostname;
        var path = parsedUrl.pathname;
        var ttHost = host === 'territorial.io' || host === '1.territorial.io' || host === '2.territorial.io' || host === 'game.territorial.io';
        if (ttHost) {
          var id = getId();
          var targetHost = HOSTS[id] || '1.territorial.io';
          if (path.length === 5 && path.charAt(0) === '/' && path.charAt(1) === 'x' && path.charAt(2) === '0') {
            var xId = parseInt(path.charAt(3));
            if (!isNaN(xId)) {
              parsedUrl.pathname = '/x0' + id + '/';
              if (host !== 'game.territorial.io') {
                parsedUrl.hostname = targetHost;
              }
              targetUrl = parsedUrl.toString();
              console.log('[TT] WS x0→', targetUrl);
            }
          } else if (path === '/s50/' || path === '/s51/' || path === '/s52/') {
            parsedUrl.hostname = targetHost;
            targetUrl = parsedUrl.toString();
            console.log('[TT] WS s→', targetUrl);
          }
        }
      } catch(e) {}
      if (protocols) return new OrigWS(targetUrl, protocols);
      return new OrigWS(targetUrl);
    };

    window.WebSocket.prototype = OrigWS.prototype;
    window.WebSocket.prototype.constructor = window.WebSocket;
    window.WebSocket.toString = function() { return OrigWS.toString(); };
    window.WebSocket.CONNECTING = 0;
    window.WebSocket.OPEN = 1;
    window.WebSocket.CLOSING = 2;
    window.WebSocket.CLOSED = 3;

    console.log('[TT] Hook OK, lobby=' + getId());
  }

  function createPanel() {
    var old = document.getElementById('tt-panel');
    if (old) old.remove();

    var d = document.createElement('div');
    d.id = 'tt-panel';
    d.style.cssText = 'position:fixed;top:10px;right:10px;z-index:99999;background:#1e293b;color:#fff;padding:10px;border-radius:10px;font-family:sans-serif;font-size:12px;box-shadow:0 4px 20px rgba(0,0,0,.5);border:1px solid #6366f1;min-width:180px;';

    var hdr = document.createElement('div');
    hdr.style.cssText = 'display:flex;align-items:center;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #334155;';
    hdr.innerHTML = '<span style="font-size:16px;margin-right:6px;">🏰</span><b>大厅切换</b>';
    var cls = document.createElement('span');
    cls.style.cssText = 'margin-left:auto;cursor:pointer;color:#94a3b8;';
    cls.textContent = '✕';
    cls.onclick = function() { d.remove(); };
    hdr.appendChild(cls);
    d.appendChild(hdr);

    var tip = document.createElement('div');
    tip.style.cssText = 'font-size:11px;color:#94a3b8;margin-bottom:8px;';
    tip.textContent = '切换后自动刷新页面';
    d.appendChild(tip);

    var list = document.createElement('div');
    list.id = 'tt-list';
    d.appendChild(list);
    document.body.appendChild(d);

    var L = [{id:0,n:'Lobby 0',i:'🟢'},{id:1,n:'Lobby 1',i:'🔴'},{id:2,n:'Lobby 2',i:'🟡'}];

    function render() {
      var c = getId();
      list.innerHTML = '';
      L.forEach(function(l) {
        var active = l.id === c;
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;padding:8px;border-radius:6px;cursor:pointer;margin-bottom:4px;background:' + (active?'rgba(99,102,241,.3)':'rgba(255,255,255,.05)') + ';border:1px solid ' + (active?'#6366f1':'transparent') + ';';
        row.innerHTML = '<span style="font-size:16px;margin-right:8px;">' + l.i + '</span><span style="flex:1;font-weight:' + (active?'bold':'normal') + ';">' + l.n + '</span>' + (active?'<span style="color:#10b981;">✓</span>':'');
        row.onclick = function() {
          if (l.id === c) return;
          setId(l.id);
          render();
          setTimeout(function() { location.reload(); }, 300);
        };
        list.appendChild(row);
      });
    }
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPanel);
  } else {
    createPanel();
  }
})();
