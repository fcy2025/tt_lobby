// ==UserScript==
// @name         TT Lobby 0
// @namespace    https://github.com/fcy20/tt_lobby
// @version      7.0
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
    var oldShow = document.getElementById('tt-show');
    if (oldShow) oldShow.remove();

    var d = document.createElement('div');
    d.id = 'tt-panel';
    d.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;background:rgba(30,41,59,0.95);backdrop-filter:blur(10px);color:#fff;padding:16px;border-radius:16px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;box-shadow:0 8px 32px rgba(0,0,0,0.6);border:1px solid rgba(99,102,241,0.4);min-width:200px;transition:all 0.3s ease;';

    var hdr = document.createElement('div');
    hdr.style.cssText = 'display:flex;align-items:center;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid rgba(51,65,85,0.6);';

    var hide = document.createElement('span');
    hide.style.cssText = 'margin-left:auto;cursor:pointer;color:#94a3b8;font-size:14px;padding:4px;transition:color 0.2s;';
    hide.textContent = '◀';
    hide.title = '隐藏面板';
    hide.onmouseenter = function() { hide.style.color = '#fff'; };
    hide.onmouseleave = function() { hide.style.color = '#94a3b8'; };

    var btn = document.createElement('button');
    btn.style.cssText = 'width:100%;padding:10px;border:none;border-radius:10px;color:#fff;font-weight:600;font-size:13px;cursor:pointer;transition:all 0.2s;';

    var tip = document.createElement('div');
    tip.style.cssText = 'margin-top:12px;padding:10px;border-radius:8px;font-size:11px;line-height:1.5;';

    function render() {
      var on = isOn();
      hdr.innerHTML = '<span style="font-size:20px;margin-right:8px;">🏰</span><div><div style="font-weight:600;font-size:14px;">Lobby 0 工具</div><div style="font-size:11px;color:#94a3b8;">' + (on ? '已启用' : '已关闭') + '</div></div>';
      hdr.appendChild(hide);

      if (on) {
        btn.textContent = '关闭工具';
        btn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
        btn.style.boxShadow = '0 4px 12px rgba(239,68,68,0.3)';
        btn.onmouseenter = function() { btn.style.transform = 'scale(1.02)'; btn.style.boxShadow = '0 6px 16px rgba(239,68,68,0.4)'; };
        btn.onmouseleave = function() { btn.style.transform = 'scale(1)'; btn.style.boxShadow = '0 4px 12px rgba(239,68,68,0.3)'; };
        btn.onclick = turnOff;

        tip.style.background = 'rgba(99,102,241,0.1)';
        tip.style.color = '#a5b4fc';
        tip.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">💡 使用提示</div><div>退出大厅后重新进入多人游戏</div><div>隐藏面板后点击箭头显示</div>';
      } else {
        btn.textContent = '开启工具';
        btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        btn.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)';
        btn.onmouseenter = function() { btn.style.transform = 'scale(1.02)'; btn.style.boxShadow = '0 6px 16px rgba(16,185,129,0.4)'; };
        btn.onmouseleave = function() { btn.style.transform = 'scale(1)'; btn.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)'; };
        btn.onclick = function() { turnOn(); modAua(); render(); };

        tip.style.background = 'rgba(251,191,36,0.1)';
        tip.style.color = '#fbbf24';
        tip.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">💡 使用提示</div><div>点击开启后，连接将重定向到 Lobby 0</div><div>退出大厅后重新进入即可</div>';
      }
    }

    render();
    d.appendChild(hdr);
    d.appendChild(btn);
    d.appendChild(tip);
    document.body.appendChild(d);

    var show = document.createElement('div');
    show.id = 'tt-show';
    show.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99998;width:40px;height:40px;border-radius:12px;background:rgba(30,41,59,0.9);backdrop-filter:blur(10px);border:1px solid rgba(99,102,241,0.4);cursor:pointer;display:none;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 16px rgba(0,0,0,0.4);transition:all 0.2s;';
    show.textContent = '▶';
    show.onmouseenter = function() { show.style.transform = 'scale(1.1)'; };
    show.onmouseleave = function() { show.style.transform = 'scale(1)'; };
    show.onclick = function() {
      show.style.display = 'none';
      d.style.transform = 'translateX(0)';
      d.style.opacity = '1';
      d.style.padding = '16px';
      d.style.minWidth = '200px';
    };
    document.body.appendChild(show);

    hide.onclick = function() {
      d.style.transform = 'translateX(calc(100% - 40px))';
      d.style.opacity = '0.3';
      d.style.padding = '16px 8px';
      d.style.minWidth = '40px';
      show.style.display = 'flex';
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPanel);
  } else {
    createPanel();
  }

  console.log('[TT] Lobby 0 Tool v7.0, enabled=' + isOn());
})();