import { useState } from 'react';

const getBookmarkCode = (): string => {
  var code = "javascript:(function(){";
  code += "var ok=location.hostname.indexOf('territorial.io')>-1||location.hostname.indexOf('fxclient')>-1;";
  code += "if(!ok){alert('请先打开游戏页面');return;}";
  // Core script that runs on every page load
  var core = "(function(){";
  core += "var L0='territorial.io';var W=180;var H1=Math.round(W*1.618);var H2=Math.round(H1*0.618);var TAB_W=36;";
  core += "function _ttG(){try{return localStorage.getItem('tt_lobby_enabled')==='1';}catch(e){return false;}}";
  core += "function _ttE(){localStorage.setItem('tt_lobby_enabled','1');localStorage.setItem('tt_lobby_id','0');localStorage.setItem('tt_lobby_host',L0);location.reload();}";
  core += "function _ttD(){localStorage.removeItem('tt_lobby_enabled');localStorage.removeItem('tt_lobby_id');localStorage.removeItem('tt_lobby_host');if(window._ttOrigWS){window.WebSocket=window._ttOrigWS;}window._ttHook=0;location.reload();}";
  // WebSocket Hook
  core += "if(!window._ttHook){";
  core += "window._ttHook=1;window._ttOrigWS=window.WebSocket;var O=window.WebSocket;";
  core += "window.WebSocket=function(u,p){";
  core += "var M=u;";
  core += "if(_ttG()){";
  core += "try{";
  core += "var pu=new URL(u);var ph=pu.hostname;var pp=pu.pathname;";
  core += "var tt=ph==='territorial.io'||ph==='1.territorial.io'||ph==='2.territorial.io'||ph==='game.territorial.io';";
  core += "if(tt){";
  core += "if(pp.length===5&&pp.charAt(0)==='/'&&pp.charAt(1)==='x'&&pp.charAt(2)==='0'){";
  core += "pu.pathname='/x00/';if(ph!=='game.territorial.io')pu.hostname=L0;M=pu.toString();";
  core += "}else if(pp==='/s50/'||pp==='/s51/'||pp==='/s52/'){pu.hostname=L0;M=pu.toString();}";
  core += "}";
  core += "}catch(e){}";
  core += "}";
  core += "return p?new O(M,p):new O(M);";
  core += "};";
  core += "window.WebSocket.prototype=O.prototype;window.WebSocket.prototype.constructor=window.WebSocket;";
  core += "window.WebSocket.toString=function(){return O.toString();};";
  core += "window.WebSocket.CONNECTING=0;window.WebSocket.OPEN=1;window.WebSocket.CLOSING=2;window.WebSocket.CLOSED=3;";
  core += "}";
  // UI Panel
  core += "function _ttUI(){";
  core += "if(!document.body)return setTimeout(_ttUI,100);";
  core += "var ow=document.getElementById('tt-wrap');if(ow)ow.remove();";
  // Wrapper
  core += "var wrap=document.createElement('div');wrap.id='tt-wrap';";
  core += "wrap.style.cssText='position:fixed;top:20px;right:0;z-index:99999;transition:transform 0.3s ease;';";
  // Panel 1
  core += "var d=document.createElement('div');d.id='tt-panel';";
  core += "d.style.cssText='width:'+W+'px;height:'+H1+'px;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;padding:14px;border-radius:14px 0 0 14px;font-family:sans-serif;font-size:13px;box-shadow:0 10px 40px rgba(0,0,0,0.7);border:1px solid rgba(99,102,241,0.3);overflow:hidden;margin-right:8px;';";
  core += "var hdr=document.createElement('div');hdr.style.cssText='display:flex;align-items:center;margin-bottom:12px;';";
  core += "hdr.innerHTML='<span style=\"font-size:18px;margin-right:8px;\">🏰</span><div><div style=\"font-weight:600;font-size:14px;\">Lobby 0</div><div style=\"font-size:10px;color:#94a3b8;\">快捷工具</div></div>';";
  // Toggle
  core += "function render(){";
  core += "var on=_ttG();";
  core += "var sw=document.createElement('div');";
  core += "sw.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:10px;background:'+(on?'rgba(16,185,129,0.2)':'rgba(75,85,99,0.3)')+';border:1px solid '+(on?'rgba(16,185,129,0.5)':'rgba(75,85,99,0.5)')+';cursor:pointer;';";
  core += "sw.innerHTML='<span style=\"font-weight:500;font-size:13px;\">'+(on?'已启用':'未启用')+'</span><div style=\"width:44px;height:24px;border-radius:12px;background:'+(on?'#10b981':'#4b5563')+';position:relative;\"><div style=\"width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:2px;left:'+(on?'22px':'2px')+';transition:left 0.3s ease;box-shadow:0 2px 6px rgba(0,0,0,0.3);\"></div></div>';";
  core += "sw.onclick=function(){if(on){_ttD();}else{_ttE();}};";
  core += "d.innerHTML='';d.appendChild(hdr);d.appendChild(sw);";
  core += "var tip=document.createElement('div');";
  core += "tip.style.cssText='margin-top:10px;padding:8px;border-radius:8px;font-size:11px;line-height:1.4;background:'+(on?'rgba(16,185,129,0.1)' :'rgba(251,191,36,0.1)')+';color:'+(on?'#6ee7b7':'#fbbf24')+';';";
  core += "tip.textContent=on?'页面已刷新，点击多人游戏进入 Lobby 0':'点击开启后页面将刷新';";
  core += "d.appendChild(tip);";
  core += "}";
  core += "render();wrap.appendChild(d);";
  // Panel 2
  core += "var d2=document.createElement('div');d2.id='tt-panel2';";
  core += "d2.style.cssText='width:'+W+'px;height:'+H2+'px;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;border-radius:14px 0 0 14px;font-family:sans-serif;font-size:13px;box-shadow:0 10px 40px rgba(0,0,0,0.7);border:1px solid rgba(99,102,241,0.3);overflow:hidden;display:flex;';";
  // Tab
  core += "var tab=document.createElement('div');";
  core += "tab.style.cssText='width:'+TAB_W+'px;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:rgba(99,102,241,0.2);border-right:1px solid rgba(99,102,241,0.4);transition:background 0.2s;flex-shrink:0;';";
  core += "var arrow=document.createElement('span');arrow.textContent='▶';arrow.style.cssText='font-size:12px;color:#a5b4fc;';";
  core += "var lbl=document.createElement('span');lbl.textContent='收起';lbl.style.cssText='writing-mode:vertical-rl;font-size:10px;color:#94a3b8;margin-top:6px;letter-spacing:2px;';";
  core += "tab.appendChild(arrow);tab.appendChild(lbl);";
  core += "tab.onmouseenter=function(){tab.style.background='rgba(99,102,241,0.4)';};";
  core += "tab.onmouseleave=function(){tab.style.background='rgba(99,102,241,0.2)';};";
  core += "d2.appendChild(tab);";
  // Info
  core += "var info=document.createElement('div');info.style.cssText='flex:1;padding:12px;overflow-y:auto;';";
  core += "info.innerHTML='<div style=\"font-weight:600;font-size:12px;margin-bottom:8px;color:#a5b4fc;\">🏰 TT Lobby 0</div><div style=\"font-size:10px;color:#94a3b8;line-height:1.6;margin-bottom:8px;\">点击左侧标签可收起/展开面板</div><div style=\"font-size:10px;color:#94a3b8;line-height:1.6;\">🌐 territorial.io<br/>🌐 fxclient.github.io</div>';";
  core += "d2.appendChild(info);wrap.appendChild(d2);";
  core += "document.body.appendChild(wrap);";
  // Toggle expand/collapse
  core += "var uiVisible=true;";
  core += "tab.onclick=function(){";
  core += "uiVisible=!uiVisible;";
  core += "if(uiVisible){wrap.style.transform='translateX(0)';arrow.textContent='▶';lbl.textContent='收起';}";
  core += "else{wrap.style.transform='translateX(calc(100% - '+TAB_W+'px))';arrow.textContent='◀';lbl.textContent='展开';}";
  core += "};";
  core += "}";
  core += "if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',_ttUI);}else{_ttUI();}";
  core += "})();";
  // Save core script to localStorage and inject
  code += "localStorage.setItem('_ttCore',escape(core));";
  code += "var s=document.createElement('script');s.textContent=core;document.head.appendChild(s);";
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
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold">1</span>
              <span>拖拽 🏰 Lobby 0 到浏览器收藏夹栏</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold">2</span>
              <span>打开 territorial.io 等待游戏加载</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold">3</span>
              <span>点击书签，右上角弹出控制面板</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold">4</span>
              <span>退出当前大厅后重新进入多人游戏</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-amber-400 font-bold">5</span>
              <span>点击"关闭工具"恢复原始连接并刷新</span>
            </div>
          </div>
        </div>

        <div className="bg-green-900/20 rounded-xl p-4 border border-green-900/30 mb-5">
          <p className="text-xs text-green-400">✅ 支持：territorial.io / fxclient.github.io/FXclient</p>
        </div>

        <footer className="text-center text-gray-500 text-xs">
          <p>TT Lobby 0 快捷工具</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
