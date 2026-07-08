// ==UserScript==
// @name         TT Lobby Manager
// @namespace    https://github.com/fcy20/tt_lobby
// @version      6.0
// @description  Territorial.io 大厅切换
// @author       fcy20
// @match        https://territorial.io/*
// @match        https://*.territorial.io/*
// @match        http://territorial.io/*
// @match        http://*.territorial.io/*
// @match        https://fxclient.github.io/FXclient/*
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(function() {
  'use strict';

  var win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  var HOSTS = ['territorial.io', '1.territorial.io', '2.territorial.io'];

  function getId() {
    try { return parseInt(localStorage.getItem('tt_lobby_id') || '1'); }
    catch(e) { return 1; }
  }

  function setId(id) {
    localStorage.setItem('tt_lobby_id', id);
    localStorage.setItem('tt_lobby_host', HOSTS[id]);
  }

  function getTarget() {
    return HOSTS[getId()] || '1.territorial.io';
  }

  // === Strategy 1: Hook WebSocket ===
  if (!win._ttHook) {
    win._ttHook = 1;
    var OrigWS = win.WebSocket;

    win.WebSocket = function(url, protocols) {
      var targetUrl = url;
      try {
        var parsedUrl = new URL(url);
        var host = parsedUrl.hostname;
        var path = parsedUrl.pathname;
        var ttHost = host === 'territorial.io' || host === '1.territorial.io' || host === '2.territorial.io' || host === 'game.territorial.io';
        if (ttHost) {
          var target = getTarget();
          if (path.length === 5 && path.charAt(0) === '/' && path.charAt(1) === 'x' && path.charAt(2) === '0') {
            var xId = parseInt(path.charAt(3));
            if (!isNaN(xId)) {
              parsedUrl.pathname = '/x0' + getId() + '/';
              if (host !== 'game.territorial.io') {
                parsedUrl.hostname = target;
              }
              targetUrl = parsedUrl.toString();
              console.log('[TT] WS x0 redirected:', url, '->', targetUrl);
            }
          } else if (path === '/s50/' || path === '/s51/' || path === '/s52/') {
            parsedUrl.hostname = target;
            targetUrl = parsedUrl.toString();
            console.log('[TT] WS s redirected:', url, '->', targetUrl);
          }
        }
      } catch(e) {}
      if (protocols) return new OrigWS(targetUrl, protocols);
      return new OrigWS(targetUrl);
    };

    win.WebSocket.prototype = OrigWS.prototype;
    win.WebSocket.prototype.constructor = win.WebSocket;
    win.WebSocket.toString = function() { return OrigWS.toString(); };
    win.WebSocket.CONNECTING = 0;
    win.WebSocket.OPEN = 1;
    win.WebSocket.CLOSING = 2;
    win.WebSocket.CLOSED = 3;

    console.log('[TT] WebSocket hook installed, lobby=' + getId());
  }

  // === Strategy 2: Modify b1.z.aUa server array ===
  function modifyAua(zObj) {
    if (!zObj || !zObj.aUa) return false;
    var target = getTarget();
    var changed = false;
    for (var i = 0; i < zObj.aUa.length; i++) {
      if (zObj.aUa[i] !== target) {
        zObj.aUa[i] = target;
        changed = true;
      }
    }
    if (changed) {
      console.log('[TT] aUa modified to:', target, zObj.aUa);
    }
    return true;
  }

  function hookDi(zObj) {
    if (!zObj || !zObj.di || zObj._ttDiHooked) return;
    zObj._ttDiHooked = 1;
    var origDi = zObj.di;
    zObj.di = function() {
      var result = origDi.apply(this, arguments);
      var target = getTarget();
      if (this.aUa) {
        for (var i = 0; i < this.aUa.length; i++) {
          this.aUa[i] = target;
        }
        console.log('[TT] aUa re-hooked after di(), target=' + target);
      }
      return result;
    };
    console.log('[TT] b1.z.di() hooked');
  }

  function tryModifyB1() {
    if (win.b1 && win.b1.z) {
      modifyAua(win.b1.z);
      hookDi(win.b1.z);
      return true;
    }
    return false;
  }

  // Try immediately and poll
  if (!tryModifyB1()) {
    var b1Timer = setInterval(function() {
      if (tryModifyB1()) {
        clearInterval(b1Timer);
      }
    }, 300);
    // Stop polling after 30s
    setTimeout(function() { clearInterval(b1Timer); }, 30000);
  }

  // Re-check periodically to handle re-initialization
  setInterval(function() {
    tryModifyB1();
  }, 2000);

  // === Strategy 3: UI Panel ===
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
          // Modify aUa immediately
          tryModifyB1();
          // Try to reconnect
          try {
            if (win.b1 && win.b1.z && typeof win.b1.z.sJ === 'function') {
              win.b1.z.sJ();
            }
          } catch(e) {}
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

  console.log('[TT] Lobby Manager v6.0 loaded, lobby=' + getId());
})();
