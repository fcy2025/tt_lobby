import { useState } from 'react';

const getBookmarkCode = (): string => {
  var code = "javascript:(function(){";
  code += "var ok=location.hostname.indexOf('territorial.io')>-1||location.hostname.indexOf('fxclient')>-1;";
  code += "if(!ok){alert('请先打开游戏页面');return;}";
  code += "var L0='territorial.io';";
  code += "var PHI=1.618;";
  code += "var W=180;";
  code += "var H1=Math.round(W*PHI);";
  code += "var H2=Math.round(H1*0.618);";
  code += "var GAP=8;";
  code += "var TAB_W=36;";
  code += "function _ttG(){try{return localStorage.getItem('tt_lobby_enabled')==='1';}catch(e){return false;}}";
  code += "function _ttE(){localStorage.setItem('tt_lobby_enabled','1');localStorage.setItem('tt_lobby_id','0');localStorage.setItem('tt_lobby_host',L0);}";
  code += "function _ttD(){localStorage.removeItem('tt_lobby_enabled');localStorage.removeItem('tt_lobby_id');localStorage.removeItem('tt_lobby_host');if(window._ttOrigWS){window.WebSocket=window._ttOrigWS;}window._ttHooked=0;}";
  code += "function _ttHook(){if(!window._ttHooked){window._ttHooked=1;window._ttOrigWS=window.WebSocket;var O=window.WebSocket;window.WebSocket=function(u,p){var M=u;if(_ttG()){try{var pu=new URL(u);var ph=pu.hostname;var pp=pu.pathname;var tt=ph==='territorial.io'||ph==='1.territorial.io'||ph==='2.territorial.io'||ph==='game.territorial.io';if(tt){if(pp.length===5&&pp.charAt(0)==='/'&&pp.charAt(1)==='x'&&pp.charAt(2)==='0'){pu.pathname='/x00/';if(ph!=='game.territorial.io')pu.hostname=L0;M=pu.toString();}else if(pp==='/s50/'||pp==='/s51/'||pp==='/s52/'){pu.hostname=L0;M=pu.toString();}}}catch(e){}}return p?new O(M,p):new O(M);};window.WebSocket.prototype=O.prototype;window.WebSocket.prototype.constructor=window.WebSocket;window.WebSocket.toString=function(){return O.toString();};window.WebSocket.CONNECTING=0;window.WebSocket.OPEN=1;window.WebSocket.CLOSING=2;window.WebSocket.CLOSED=3;console.log('[TT] Hook installed');}}";
  // Install hook immediately
  code += "_ttHook();";
  // UI - cleanup
  code += "var ow=document.getElementById('tt-wrap');if(ow)ow.remove();";
  // Wrapper
  code += "var wrap=document.createElement('div');";
  code += "wrap.id='tt-wrap';";
  code += "wrap.style.cssText='position:fixed;top:20px;right:0;z-index:99999;transition:transform 0.3s ease;';";
  // Panel 1
  code += "var d=document.createElement('div');";
  code += "d.id='tt-panel';";
  code += "d.style.cssText='width:'+W+'px;height:'+H1+'px;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;padding:14px;border-radius:14px 0 0 14px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;box-shadow:0 10px 40px rgba(0,0,0,0.7);border:1px solid rgba(99,102,241,0.3);overflow:hidden;margin-right:'+GAP+'px;';";
  // Header
  code += "var hdr=document.createElement('div');";
  code += "hdr.style.cssText='display:flex;align-items:center;margin-bottom:12px;';";
  code += "hdr.innerHTML='<span style=\"font-size:18px;margin-right:8px;\">🏰</span><div><div style=\"font-weight:600;font-size:14px;\">Lobby 0</div><div style=\"font-size:10px;color:#94a3b8;\">快捷工具</div></div>';";
  // Toggle
  code += "function render(){";
  code += "var on=_ttG();";
  code += "var sw=document.createElement('div');";
  code += "sw.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:10px;background:'+(on?'rgba(16,185,129,0.2)':'rgba(75,85,99,0.3)')+';border:1px solid '+(on?'rgba(16,185,129,0.5)':'rgba(75,85,99,0.5)')+';cursor:pointer;transition:all 0.2s;';";
  code += "sw.innerHTML='<span style=\"font-weight:500;font-size:13px;\">'+(on?'已启用':'未启用')+'</span><div style=\"width:44px;height:24px;border-radius:12px;background:'+(on?'#10b981':'#4b5563')+';position:relative;transition:background 0.3s ease;\"><div style=\"width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:2px;left:'+(on?'22px':'2px')+';transition:left 0.3s ease;box-shadow:0 2px 6px rgba(0,0,0,0.3);\"></div></div>';";
  code += "sw.onclick=function(){if(on){_ttD();}else{_ttE();_ttHook();}render();};";
  code += "d.innerHTML='';d.appendChild(hdr);d.appendChild(sw);";
  code += "var tip=document.createElement('div');";
  code += "tip.style.cssText='margin-top:10px;padding:8px;border-radius:8px;font-size:11px;line-height:1.4;background:'+(on?'rgba(16,185,129,0.1)':'rgba(251,191,36,0.1)')+';color:'+(on?'#6ee7b7':'#fbbf24')+';';";
  code += "tip.textContent=on?'退出大厅后重新进入多人游戏':'点击开启后连接到 Lobby 0';";
  code += "d.appendChild(tip);";
  code += "}";
  code += "render();";
  code += "wrap.appendChild(d);";
  // Panel 2
  code += "var d2=document.createElement('div');";
  code += "d2.id='tt-panel2';";
  code += "d2.style.cssText='width:'+W+'px;height:'+H2+'px;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;border-radius:14px 0 0 14px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;box-shadow:0 10px 40px rgba(0,0,0,0.7);border:1px solid rgba(99,102,241,0.3);overflow:hidden;display:flex;';";
  // Tab
  code += "var tab=document.createElement('div');";
  code += "tab.style.cssText='width:'+TAB_W+'px;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:rgba(99,102,241,0.2);border-right:1px solid rgba(99,102,241,0.4);transition:background 0.2s;flex-shrink:0;';";
  code += "var arrow=document.createElement('span');";
  code += "arrow.textContent='▶';arrow.style.cssText='font-size:12px;color:#a5b4fc;';";
  code += "var lbl=document.createElement('span');";
  code += "lbl.textContent='收起';lbl.style.cssText='writing-mode:vertical-rl;font-size:10px;color:#94a3b8;margin-top:6px;letter-spacing:2px;';";
  code += "tab.appendChild(arrow);tab.appendChild(lbl);";
  code += "tab.onmouseenter=function(){tab.style.background='rgba(99,102,241,0.4)';};";
  code += "tab.onmouseleave=function(){tab.style.background='rgba(99,102,241,0.2)';};";
  code += "d2.appendChild(tab);";
  // Info
  code += "var info=document.createElement('div');";
  code += "info.style.cssText='flex:1;padding:12px;overflow-y:auto;';";
  code += "info.innerHTML='<div style=\"font-weight:600;font-size:12px;margin-bottom:8px;color:#a5b4fc;\">🏰 TT Lobby 0</div><div style=\"font-size:10px;color:#94a3b8;line-height:1.6;margin-bottom:8px;\">点击左侧标签可收起/展开面板</div><div style=\"font-size:10px;color:#94a3b8;line-height:1.6;\">🌐 territorial.io<br/>🌐 fxclient.github.io</div>';";
  code += "d2.appendChild(info);";
  code += "wrap.appendChild(d2);";
  code += "document.body.appendChild(wrap);";
  // Toggle expand/collapse
  code += "var uiVisible=true;";
  code += "tab.onclick=function(){";
  code += "uiVisible=!uiVisible;";
  code += "if(uiVisible){";
  code += "wrap.style.transform='translateX(0)';arrow.textContent='▶';lbl.textContent='收起';";
  code += "}else{";
  code += "wrap.style.transform='translateX(calc(100% - '+TAB_W+'px))';arrow.textContent='◀';lbl.textContent='展开';";
  code += "}";
  code += "};";
  code += "})();";
  return code;
};

function App() {
  const [copied, setCopied] = useState(false);

  const bookmarkUrl = getBookmarkCode();

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="relative max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏰</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">TT Lobby 0</h1>
          <p className="text-gray-400 text-sm">快捷连接到 Lobby 0</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 mb-5">
          <div className="text-center mb-5">
            <div className="text-3xl mb-2">📌</div>
            <h2 className="text-xl font-bold mb-1">快捷书签</h2>
            <p className="text-gray-400 text-xs">拖拽下方按钮到收藏夹栏</p>
          </div>

          <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-900/30 mb-4">
            <p className="text-xs text-emerald-300 space-y-1">
              <b>使用方法：</b><br/>
              1. 拖拽下方按钮到浏览器收藏夹栏<br/>
              2. 打开游戏 territorial.io<br/>
              3. 点击书签 → 启用 Lobby 0<br/>
              4. 退出大厅后重新进入即可
            </p>
          </div>

          <a href={bookmarkUrl} draggable={true}
            className="flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-grab active:cursor-grabbing select-none shadow-lg shadow-emerald-500/30 mb-4"
            onClick={(e) => { e.preventDefault(); copy(bookmarkUrl); }}>
            <span className="text-2xl">🏰</span>
            <span className="font-bold text-lg">Lobby 0</span>
            {copied && <span className="text-xs text-white/90">已复制</span>}
          </a>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <a href="https://territorial.io/" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-400 text-xs font-medium transition-colors">
              <span>🎮</span>
              <span>游戏官网</span>
            </a>
            <a href="https://fxclient.github.io/FXclient/" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30 text-purple-400 text-xs font-medium transition-colors">
              <span>🎮</span>
              <span>FXclient</span>
            </a>
          </div>

          <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-900/30">
            <p className="text-xs text-amber-300 mb-2">⭐ 油猴脚本（备用方案）</p>
            <p className="text-xs text-gray-400">安装 Tampermonkey 后自动启用</p>
            <button onClick={() => {
              const base = (typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL) || '/';
              window.open(`${window.location.origin}${base}tt-lobby-manager.user.js`, '_blank');
            }} className="w-full mt-2 py-2 px-3 rounded-lg text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium">
              📥 安装油猴脚本
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 mb-5">
          <h2 className="text-lg font-bold mb-3 text-center">📖 使用教程</h2>

          <div className="bg-emerald-900/10 rounded-xl p-4 border border-emerald-900/20 mb-4">
            <p className="text-sm font-semibold text-emerald-400 mb-3">📌 书签（桌面端）</p>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex gap-2">
                <span className="text-emerald-400 font-bold">1</span>
                <span>拖拽 🏰 Lobby 0 到浏览器收藏夹栏</span>
              </div>
              <div className="flex gap-2">
                <span className="text-emerald-400 font-bold">2</span>
                <span>打开游戏（territorial.io 或 FXclient）</span>
              </div>
              <div className="flex gap-2">
                <span className="text-emerald-400 font-bold">3</span>
                <span>点击书签，右上角弹出控制面板</span>
              </div>
              <div className="flex gap-2">
                <span className="text-emerald-400 font-bold">4</span>
                <span>启用后退出大厅重新进入即可</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/10 rounded-xl p-4 border border-amber-900/20">
            <p className="text-sm font-semibold text-amber-400 mb-3">⭐ 油猴脚本（移动端推荐）</p>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex gap-2">
                <span className="text-amber-400 font-bold">1</span>
                <span>安装油猴扩展（安卓 Kiwi/Firefox，iOS Userscripts）</span>
              </div>
              <div className="flex gap-2">
                <span className="text-amber-400 font-bold">2</span>
                <span>点击"安装油猴脚本"按钮</span>
              </div>
              <div className="flex gap-2">
                <span className="text-amber-400 font-bold">3</span>
                <span>打开游戏，控制面板自动显示</span>
              </div>
              <div className="flex gap-2">
                <span className="text-amber-400 font-bold">4</span>
                <span>启用后退出大厅重新进入即可</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-900/20 rounded-xl p-4 border border-green-900/30 mb-5">
          <p className="text-xs text-green-400">✅ 支持：territorial.io / fxclient.github.io/FXclient</p>
        </div>

        <footer className="text-center text-gray-500 text-xs">
          <p>TT Lobby 0 快捷工具 v8.0</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
