// ==UserScript==
// @name         TT Lobby 0
// @namespace    https://github.com/fcy20/tt_lobby
// @version      7.2
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
  var PHI = 1.618;
  var W = 180;
  var H1 = Math.round(W * PHI);
  var H2 = Math.round(H1 * 0.618);

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
    if (win._ttOrigWS) win.WebSocket = win._ttOrigWS;
    win._ttHook = 0;
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
    var old2 = document.getElementById('tt-panel2');
    if (old2) old2.remove();

    var d = document.createElement('div');
    d.id = 'tt-panel';
    d.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;width:' + W + 'px;height:' + H1 + 'px;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;padding:14px;border-radius:14px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;box-shadow:0 10px 40px rgba(0,0,0,0.7);border:1px solid rgba(99,102,241,0.3);overflow:hidden;transition:all 0.3s ease;';

    var hdr = document.createElement('div');
    hdr.style.cssText = 'display:flex;align-items:center;margin-bottom:12px;';
    hdr.innerHTML = '<span style="font-size:18px;margin-right:8px;">🏰</span><div><div style="font-weight:600;font-size:14px;">Lobby 0</div><div style="font-size:10px;color:#94a3b8;">快捷工具</div></div>';

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
        }
        render();
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

    // Panel 2
    var d2 = document.createElement('div');
    d2.id = 'tt-panel2';
    d2.style.cssText = 'position:fixed;top:' + (20 + H1 + 8) + 'px;right:20px;z-index:99998;width:' + W + 'px;height:' + H2 + 'px;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;padding:14px;border-radius:14px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;box-shadow:0 10px 40px rgba(0,0,0,0.7);border:1px solid rgba(99,102,241,0.3);overflow:hidden;transition:all 0.3s ease;transform:translateX(' + (W + 28) + 'px);';

    var hdr2 = document.createElement('div');
    hdr2.style.cssText = 'display:flex;align-items:center;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(51,65,85,0.5);';
    hdr2.innerHTML = '<span style="font-size:16px;margin-right:6px;">⚙️</span><span style="font-weight:600;font-size:13px;">设置</span>';
    d2.appendChild(hdr2);

    var btnExpand = document.createElement('button');
    btnExpand.textContent = '展开';
    btnExpand.style.cssText = 'width:100%;padding:8px;border:none;border-radius:8px;background:rgba(99,102,241,0.2);color:#a5b4fc;font-weight:500;font-size:12px;cursor:pointer;transition:all 0.2s;margin-bottom:8px;';
    btnExpand.onmouseenter = function() { btnExpand.style.background = 'rgba(99,102,241,0.3)'; };
    btnExpand.onmouseleave = function() { btnExpand.style.background = 'rgba(99,102,241,0.2)'; };
    btnExpand.onclick = function() {
      if (d2.style.transform.indexOf('translateX') > -1 && d2.style.transform.indexOf('0px') === -1) {
        d2.style.transform = 'translateX(0px)';
        btnExpand.textContent = '收起';
      } else {
        d2.style.transform = 'translateX(' + (W + 28) + 'px)';
        btnExpand.textContent = '展开';
      }
    };
    d2.appendChild(btnExpand);

    var info = document.createElement('div');
    info.style.cssText = 'font-size:11px;color:#94a3b8;line-height:1.5;';
    info.innerHTML = '<div style="margin-bottom:4px;">📌 使用方法</div><div style="font-size:10px;">开启后退出大厅重新进入</div><div style="margin-top:8px;margin-bottom:4px;">🌐 支持平台</div><div style="font-size:10px;">territorial.io</div><div style="font-size:10px;">fxclient.github.io</div>';
    d2.appendChild(info);

    document.body.appendChild(d2);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPanel);
  } else {
    createPanel();
  }

  console.log('[TT] Lobby 0 Tool v7.2, enabled=' + isOn());
})();