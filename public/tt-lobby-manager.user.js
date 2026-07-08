// ==UserScript==
// @name         TT Lobby 0
// @namespace    https://github.com/fcy20/tt_lobby
// @version      7.1
// @description  快捷连接到 Territorial.io Lobby 0
// @author       fcy20
// @match        https://territorial.io/*
// @match        https://*.territorial.io/*
// @match        https://fxclient.github.io/FXclient/*
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(function() {
  'use strict';

  var win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  var L0 = 'territorial.io';

  function isOn() {
    try { return localStorage.getItem('tt_lobby_enabled') === '1'; }
    catch(e) { return false; }
  }

  function turnOn() {
    localStorage.setItem('tt_lobby_enabled', '1');
    localStorage.setItem('tt_lobby_id', '0');
    localStorage.setItem('tt_lobby_host', L0);
  }

  function turnOff() {
    localStorage.removeItem('tt_lobby_enabled');
    localStorage.removeItem('tt_lobby_id');
    localStorage.removeItem('tt_lobby_host');
    location.reload();
  }

  if (!win._ttHook) {
    win._ttHook = 1;
    win._ttOrigWS = win.WebSocket;
    var O = win.WebSocket;

    win.WebSocket = function(url, protocols) {
      var M = url;
      if (!isOn()) {
        return protocols ? new O(url, protocols) : new O(url);
      }
      try {
        var pu = new URL(url);
        var ph = pu.hostname;
        var pp = pu.pathname;
        var tt = ph === 'territorial.io' || ph === '1.territorial.io' || ph === '2.territorial.io' || ph === 'game.territorial.io';
        if (tt) {
          if (pp.length === 5 && pp.charAt(0) === '/' && pp.charAt(1) === 'x' && pp.charAt(2) === '0') {
            pu.pathname = '/x00/';
            if (ph !== 'game.territorial.io') pu.hostname = L0;
            M = pu.toString();
          } else if (pp === '/s50/' || pp === '/s51/' || pp === '/s52/') {
            pu.hostname = L0;
            M = pu.toString();
          }
        }
      } catch(e) {}
      return protocols ? new O(M, protocols) : new O(M);
    };

    win.WebSocket.prototype = O.prototype;
    win.WebSocket.prototype.constructor = win.WebSocket;
    win.WebSocket.toString = function() { return O.toString(); };
    win.WebSocket.CONNECTING = 0;
    win.WebSocket.OPEN = 1;
    win.WebSocket.CLOSING = 2;
    win.WebSocket.CLOSED = 3;
  }

  function modAua() {
    if (!isOn()) return false;
    if (win.b1 && win.b1.z && win.b1.z.aUa) {
      for (var i = 0; i < win.b1.z.aUa.length; i++) win.b1.z.aUa[i] = L0;
      return true;
    }
    return false;
  }

  function hookDi() {
    if (!isOn() || !win.b1 || !win.b1.z || !win.b1.z.di || win.b1.z._ttDiHooked) return;
    win.b1.z._ttDiHooked = 1;
    var orig = win.b1.z.di;
    win.b1.z.di = function() {
      var r = orig.apply(this, arguments);
      if (this.aUa && isOn()) for (var i = 0; i < this.aUa.length; i++) this.aUa[i] = L0;
      return r;
    };
  }

  var t = setInterval(function() { if (modAua()) hookDi(); }, 500);
  setTimeout(function() { clearInterval(t); }, 30000);

  function createPanel() {
    var old = document.getElementById('tt-panel');
    if (old) old.remove();

    var d = document.createElement('div');
    d.id = 'tt-panel';
    d.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;padding:14px;border-radius:14px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;box-shadow:0 10px 40px rgba(0,0,0,0.7);border:1px solid rgba(99,102,241,0.3);min-width:180px;';

    var hdr = document.createElement('div');
    hdr.style.cssText = 'display:flex;align-items:center;margin-bottom:12px;';
    hdr.innerHTML = '<span style="font-size:18px;margin-right:8px;">🏰</span><div><div style="font-weight:600;font-size:14px;">Lobby 0</div><div style="font-size:10px;color:#94a3b8;">快捷工具</div></div>';
    d.appendChild(hdr);

    function render() {
      var on = isOn();
      var sw = document.createElement('div');
      sw.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:10px;background:' + (on ? 'rgba(16,185,129,0.2)' : 'rgba(75,85,99,0.3)') + ';border:1px solid ' + (on ? 'rgba(16,185,129,0.5)' : 'rgba(75,85,99,0.5)') + ';';
      sw.innerHTML = '<span style="font-weight:500;font-size:13px;">' + (on ? '已启用' : '未启用') + '</span><div style="width:44px;height:24px;border-radius:12px;background:' + (on ? '#10b981' : '#4b5563') + ';position:relative;transition:background 0.3s ease;cursor:pointer;"><div style="width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:2px;left:' + (on ? '22px' : '2px') + ';transition:left 0.3s ease;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div></div>';
      sw.onclick = function() {
        if (on) {
          turnOff();
        } else {
          turnOn();
          modAua();
          render();
        }
      };

      d.innerHTML = '';
      d.appendChild(hdr);
      d.appendChild(sw);

      var tip = document.createElement('div');
      tip.style.cssText = 'margin-top:10px;padding:8px;border-radius:8px;font-size:11px;line-height:1.4;background:' + (on ? 'rgba(16,185,129,0.1)' : 'rgba(251,191,36,0.1)') + ';color:' + (on ? '#6ee7b7' : '#fbbf24') + ';';
      tip.textContent = on ? '退出大厅后重新进入多人游戏' : '点击开启后连接到 Lobby 0';
      d.appendChild(tip);
    }

    render();
    document.body.appendChild(d);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPanel);
  } else {
    createPanel();
  }

  console.log('[TT] Lobby 0 Tool v7.1, enabled=' + isOn());
})();