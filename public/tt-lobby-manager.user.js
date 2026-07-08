// ==UserScript==
// @name         TT Lobby 0
// @namespace    https://github.com/fcy20/tt_lobby
// @version      8.0
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

  function createUI() {
    var oldBtn = document.getElementById('tt-toggle-btn');
    if (oldBtn) oldBtn.remove();
    var oldPanel = document.getElementById('tt-panel');
    if (oldPanel) oldPanel.remove();

    var btn = document.createElement('div');
    btn.id = 'tt-toggle-btn';
    btn.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;width:44px;height:44px;border-radius:50%;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);border:1px solid rgba(99,102,241,0.4);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 20px rgba(0,0,0,0.5);transition:all 0.3s ease;';
    btn.title = 'Lobby 0 工具';

    var panel = document.createElement('div');
    panel.id = 'tt-panel';
    panel.style.cssText = 'position:fixed;top:70px;right:20px;z-index:99998;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;padding:20px;border-radius:16px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;box-shadow:0 8px 32px rgba(0,0,0,0.6);border:1px solid rgba(99,102,241,0.4);min-width:240px;opacity:0;visibility:hidden;transform:translateY(-10px);transition:all 0.3s ease;';

    function updateBtn() {
      var on = isOn();
      btn.textContent = on ? '🟢' : '⚪';
      btn.style.borderColor = on ? 'rgba(16,185,129,0.6)' : 'rgba(99,102,241,0.4)';
      btn.style.boxShadow = on ? '0 4px 20px rgba(16,185,129,0.4)' : '0 4px 20px rgba(0,0,0,0.5)';
    }

    function togglePanel() {
      var hidden = panel.style.visibility === 'hidden';
      if (hidden) {
        panel.style.opacity = '1';
        panel.style.visibility = 'visible';
        panel.style.transform = 'translateY(0)';
        btn.style.transform = 'rotate(90deg)';
      } else {
        panel.style.opacity = '0';
        panel.style.visibility = 'hidden';
        panel.style.transform = 'translateY(-10px)';
        btn.style.transform = 'rotate(0deg)';
      }
    }

    function updatePanel() {
      var on = isOn();
      panel.innerHTML = '';

      var hdr = document.createElement('div');
      hdr.style.cssText = 'display:flex;align-items:center;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(51,65,85,0.6);';
      hdr.innerHTML = '<span style="font-size:24px;margin-right:10px;">🏰</span><div><div style="font-weight:600;font-size:15px;">Lobby 0</div><div style="font-size:11px;color:#94a3b8;">' + (on ? '已启用' : '已关闭') + '</div></div>';
      panel.appendChild(hdr);

      var switchRow = document.createElement('div');
      switchRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding:12px;background:rgba(255,255,255,0.05);border-radius:12px;';

      var label = document.createElement('span');
      label.style.cssText = 'font-weight:500;font-size:14px;';
      label.textContent = '启用 Lobby 0';
      switchRow.appendChild(label);

      var sw = document.createElement('button');
      sw.style.cssText = 'width:48px;height:28px;border-radius:14px;border:none;cursor:pointer;transition:all 0.3s ease;position:relative;';
      sw.style.background = on ? '#10b981' : '#334155';

      var knob = document.createElement('div');
      knob.style.cssText = 'position:absolute;width:24px;height:24px;border-radius:50%;background:#fff;top:2px;transition:all 0.3s ease;box-shadow:0 2px 6px rgba(0,0,0,0.3);';
      knob.style.left = on ? '22px' : '2px';
      sw.appendChild(knob);

      sw.onclick = function() {
        if (on) {
          turnOff();
        } else {
          turnOn();
          modAua();
          updateBtn();
          updatePanel();
        }
      };
      switchRow.appendChild(sw);
      panel.appendChild(switchRow);

      var tip = document.createElement('div');
      tip.style.cssText = 'padding:12px;border-radius:10px;font-size:12px;line-height:1.6;';
      if (on) {
        tip.style.background = 'rgba(99,102,241,0.1)';
        tip.style.color = '#a5b4fc';
        tip.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">💡 已连接 Lobby 0</div><div>退出当前大厅后重新进入多人游戏即可</div>';
      } else {
        tip.style.background = 'rgba(251,191,36,0.1)';
        tip.style.color = '#fbbf24';
        tip.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">💡 点击开关启用</div><div>开启后所有连接将重定向到 Lobby 0</div>';
      }
      panel.appendChild(tip);
    }

    btn.onclick = function(e) {
      e.stopPropagation();
      togglePanel();
      if (panel.style.visibility === 'visible') {
        updatePanel();
      }
    };

    document.addEventListener('click', function(e) {
      if (!btn.contains(e.target) && !panel.contains(e.target)) {
        panel.style.opacity = '0';
        panel.style.visibility = 'hidden';
        panel.style.transform = 'translateY(-10px)';
        btn.style.transform = 'rotate(0deg)';
      }
    });

    btn.onmouseenter = function() { btn.style.transform = 'scale(1.1)'; };
    btn.onmouseleave = function() { btn.style.transform = 'scale(1)'; };

    document.body.appendChild(btn);
    document.body.appendChild(panel);
    updateBtn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createUI);
  } else {
    createUI();
  }

  console.log('[TT] Lobby 0 Tool v8.0, enabled=' + isOn());
})();