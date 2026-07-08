// ==UserScript==
// @name         TT Lobby 0
// @namespace    https://github.com/fcy20/tt_lobby
// @version      7.4
// @description  快捷连接到 Territorial.io Lobby 0
// @author       fcy20
// @match        https://territorial.io/*
// @match        https://*.territorial.io/*
// @match        https://fxclient.github.io/FXclient/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  var L0 = 'territorial.io';
  var PHI = 1.618;
  var W = 180;
  var H1 = Math.round(W * PHI);
  var H2 = Math.round(H1 * 0.618);
  var GAP = 8;
  var TAB_W = 24;

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
    if (window._ttOrigWS) window.WebSocket = window._ttOrigWS;
    window._ttHook = 0;
  }

  // === WebSocket Hook (runs immediately at document-start) ===
  if (!window._ttHook) {
    window._ttHook = 1;
    window._ttOrigWS = window.WebSocket;
    var O = window.WebSocket;

    window.WebSocket = function(url, protocols) {
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

    window.WebSocket.prototype = O.prototype;
    window.WebSocket.prototype.constructor = window.WebSocket;
    window.WebSocket.toString = function() { return O.toString(); };
    window.WebSocket.CONNECTING = 0;
    window.WebSocket.OPEN = 1;
    window.WebSocket.CLOSING = 2;
    window.WebSocket.CLOSED = 3;
  }

  // === b1.z.aUa modification ===
  function modAua() {
    if (!isOn()) return false;
    if (window.b1 && window.b1.z && window.b1.z.aUa) {
      for (var i = 0; i < window.b1.z.aUa.length; i++) window.b1.z.aUa[i] = L0;
      return true;
    }
    return false;
  }

  function hookDi() {
    if (!isOn() || !window.b1 || !window.b1.z || !window.b1.z.di || window.b1.z._ttDiHooked) return;
    window.b1.z._ttDiHooked = 1;
    var orig = window.b1.z.di;
    window.b1.z.di = function() {
      var r = orig.apply(this, arguments);
      if (this.aUa && isOn()) for (var i = 0; i < this.aUa.length; i++) this.aUa[i] = L0;
      return r;
    };
  }

  var auaTimer = setInterval(function() { if (modAua()) hookDi(); }, 500);
  setTimeout(function() { clearInterval(auaTimer); }, 30000);

  // === UI Panel (waits for body) ===
  function createPanel() {
    var ow = document.getElementById('tt-wrap');
    if (ow) ow.remove();

    // Wrapper
    var wrap = document.createElement('div');
    wrap.id = 'tt-wrap';
    wrap.style.cssText = 'position:fixed;top:20px;right:0;z-index:99999;transition:transform 0.3s ease;';

    // Panel 1 - Lobby 0 controls
    var d = document.createElement('div');
    d.id = 'tt-panel';
    d.style.cssText = 'width:' + W + 'px;height:' + H1 + 'px;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;padding:14px;border-radius:14px 0 0 14px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;box-shadow:0 10px 40px rgba(0,0,0,0.7);border:1px solid rgba(99,102,241,0.3);overflow:hidden;margin-right:' + GAP + 'px;';

    var hdr = document.createElement('div');
    hdr.style.cssText = 'display:flex;align-items:center;margin-bottom:12px;';
    hdr.innerHTML = '<span style="font-size:18px;margin-right:8px;">🏰</span><div><div style="font-weight:600;font-size:14px;">Lobby 0</div><div style="font-size:10px;color:#94a3b8;">快捷工具</div></div>';

    function render() {
      var on = isOn();
      var sw = document.createElement('div');
      sw.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:10px;background:' + (on ? 'rgba(16,185,129,0.2)' : 'rgba(75,85,99,0.3)') + ';border:1px solid ' + (on ? 'rgba(16,185,129,0.5)' : 'rgba(75,85,99,0.5)') + ';cursor:pointer;transition:all 0.2s;';
      sw.innerHTML = '<span style="font-weight:500;font-size:13px;">' + (on ? '已启用' : '未启用') + '</span><div style="width:44px;height:24px;border-radius:12px;background:' + (on ? '#10b981' : '#4b5563') + ';position:relative;transition:background 0.3s ease;"><div style="width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:2px;left:' + (on ? '22px' : '2px') + ';transition:left 0.3s ease;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div></div>';
      sw.onclick = function() {
        if (on) turnOff(); else { turnOn(); modAua(); }
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
    wrap.appendChild(d);

    // Panel 2 - expand/collapse control
    var d2 = document.createElement('div');
    d2.id = 'tt-panel2';
    d2.style.cssText = 'width:' + W + 'px;height:' + H2 + 'px;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;border-radius:14px 0 0 14px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;box-shadow:0 10px 40px rgba(0,0,0,0.7);border:1px solid rgba(99,102,241,0.3);overflow:hidden;display:flex;';

    // Tab
    var tab = document.createElement('div');
    tab.style.cssText = 'width:' + TAB_W + 'px;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:rgba(99,102,241,0.2);border-right:1px solid rgba(99,102,241,0.4);transition:background 0.2s;flex-shrink:0;';

    var arrow = document.createElement('span');
    arrow.textContent = '▶';
    arrow.style.cssText = 'font-size:12px;color:#a5b4fc;transition:transform 0.3s ease;';

    var lbl = document.createElement('span');
    lbl.textContent = '收起';
    lbl.style.cssText = 'writing-mode:vertical-rl;font-size:10px;color:#94a3b8;margin-top:6px;letter-spacing:2px;';

    tab.appendChild(arrow);
    tab.appendChild(lbl);
    tab.onmouseenter = function() { tab.style.background = 'rgba(99,102,241,0.4)'; };
    tab.onmouseleave = function() { tab.style.background = 'rgba(99,102,241,0.2)'; };
    d2.appendChild(tab);

    // Info
    var info = document.createElement('div');
    info.style.cssText = 'flex:1;padding:12px;overflow-y:auto;';
    info.innerHTML = '<div style="font-weight:600;font-size:12px;margin-bottom:8px;color:#a5b4fc;">🏰 TT Lobby 0</div><div style="font-size:10px;color:#94a3b8;line-height:1.6;margin-bottom:8px;">点击左侧标签可收起/展开面板</div><div style="font-size:10px;color:#94a3b8;line-height:1.6;">🌐 territorial.io<br/>🌐 fxclient.github.io</div>';
    d2.appendChild(info);

    wrap.appendChild(d2);
    document.body.appendChild(wrap);

    // Toggle
    var uiVisible = true;
    tab.onclick = function() {
      uiVisible = !uiVisible;
      if (uiVisible) {
        wrap.style.transform = 'translateX(0)';
        arrow.textContent = '▶';
        lbl.textContent = '收起';
      } else {
        wrap.style.transform = 'translateX(' + W + 'px)';
        arrow.textContent = '◀';
        lbl.textContent = '展开';
      }
    };
  }

  // Robust wait for body
  function tryCreate() {
    if (document.body) {
      createPanel();
    } else {
      setTimeout(tryCreate, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryCreate);
  } else {
    tryCreate();
  }
  // Fallback
  setTimeout(tryCreate, 2000);

  console.log('[TT] Lobby 0 Tool v7.4 loaded, enabled=' + isOn());
})();