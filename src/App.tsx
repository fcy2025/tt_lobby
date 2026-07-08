import { useState } from 'react';

const getBookmarkCode = (): string => {
  var code = "javascript:(function(){";
  code += "var ok=location.hostname.indexOf('territorial.io')>-1||location.hostname.indexOf('fxclient')>-1;";
  code += "if(!ok){alert('请先打开游戏页面');return;}";
  code += "var L0='territorial.io';";
  code += "function _ttG(){try{return localStorage.getItem('tt_lobby_enabled')==='1';}catch(e){return false;}}";
  code += "function _ttT(){return L0;}";
  // Toggle
  code += "var enabled=_ttG();";
  code += "if(enabled){";
  code += "localStorage.removeItem('tt_lobby_enabled');";
  code += "localStorage.removeItem('tt_lobby_id');";
  code += "localStorage.removeItem('tt_lobby_host');";
  code += "if(window._ttHook){";
  code += "window._ttHook=0;";
  code += "if(window.WebSocket&&window._ttOrigWS){";
  code += "window.WebSocket=window._ttOrigWS;";
  code += "}";
  code += "}";
  code += "location.reload();";
  code += "return;";
  code += "}";
  // Enable
  code += "localStorage.setItem('tt_lobby_enabled','1');";
  code += "localStorage.setItem('tt_lobby_id','0');";
  code += "localStorage.setItem('tt_lobby_host',L0);";
  // Strategy 1: Hook WebSocket
  code += "if(!window._ttHook){";
  code += "window._ttHook=1;";
  code += "window._ttOrigWS=window.WebSocket;";
  code += "var O=window.WebSocket;";
  code += "window.WebSocket=function(u,p){";
  code += "var M=u;";
  code += "try{";
  code += "var pu=new URL(u);";
  code += "var ph=pu.hostname;";
  code += "var pp=pu.pathname;";
  code += "var tt=ph==='territorial.io'||ph==='1.territorial.io'||ph==='2.territorial.io'||ph==='game.territorial.io';";
  code += "if(tt){";
  code += "var th=L0;";
  code += "if(pp.length===5&&pp.charAt(0)==='/'&&pp.charAt(1)==='x'&&pp.charAt(2)==='0'){";
  code += "pu.pathname='/x00/';";
  code += "if(ph!=='game.territorial.io'){pu.hostname=th;}";
  code += "M=pu.toString();";
  code += "console.log('[TT] WS x00->',M);";
  code += "}else if(pp==='/s50/'||pp==='/s51/'||pp==='/s52/'){";
  code += "pu.hostname=th;";
  code += "M=pu.toString();";
  code += "console.log('[TT] WS s->',M);";
  code += "}";
  code += "}";
  code += "}catch(e){}";
  code += "return p?new O(M,p):new O(M);";
  code += "};";
  code += "window.WebSocket.prototype=O.prototype;";
  code += "window.WebSocket.prototype.constructor=window.WebSocket;";
  code += "window.WebSocket.toString=function(){return O.toString();};";
  code += "window.WebSocket.CONNECTING=0;window.WebSocket.OPEN=1;window.WebSocket.CLOSING=2;window.WebSocket.CLOSED=3;";
  code += "}";
  // Strategy 2: Modify b1.z.aUa
  code += "function _ttM(){";
  code += "if(window.b1&&window.b1.z&&window.b1.z.aUa){";
  code += "for(var i=0;i<window.b1.z.aUa.length;i++){window.b1.z.aUa[i]=L0;}";
  code += "console.log('[TT] aUa modified to',L0);";
  code += "return true;";
  code += "}";
  code += "return false;";
  code += "}";
  code += "_ttM();";
  // Poll for b1
  code += "var b1T=setInterval(function(){";
  code += "if(_ttM()){clearInterval(b1T);}";
  code += "},300);";
  code += "setTimeout(function(){clearInterval(b1T);},10000);";
  // UI Panel
  code += "var old=document.getElementById('tt-panel');";
  code += "if(old)old.remove();";
  code += "var d=document.createElement('div');";
  code += "d.id='tt-panel';";
  code += "d.style.cssText='position:fixed;top:20px;right:20px;z-index:99999;background:rgba(30,41,59,0.95);backdrop-filter:blur(10px);color:#fff;padding:16px;border-radius:16px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;box-shadow:0 8px 32px rgba(0,0,0,0.6);border:1px solid rgba(99,102,241,0.4);min-width:200px;transition:all 0.3s ease;';";
  code += "var hdr=document.createElement('div');";
  code += "hdr.style.cssText='display:flex;align-items:center;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid rgba(51,65,85,0.6);';";
  code += "hdr.innerHTML='<span style=\"font-size:20px;margin-right:8px;\">🏰</span><div><div style=\"font-weight:600;font-size:14px;\">Lobby 0 工具</div><div style=\"font-size:11px;color:#94a3b8;\">已启用</div></div>';";
  code += "var hide=document.createElement('span');";
  code += "hide.style.cssText='margin-left:auto;cursor:pointer;color:#94a3b8;font-size:14px;padding:4px;transition:color 0.2s;';";
  code += "hide.textContent='◀';";
  code += "hide.title='隐藏面板';";
  code += "hide.onmouseenter=function(){hide.style.color='#fff';};";
  code += "hide.onmouseleave=function(){hide.style.color='#94a3b8';};";
  code += "hide.onclick=function(){";
  code += "d.style.transform='translateX(calc(100% - 40px))';";
  code += "d.style.opacity='0.3';";
  code += "d.style.padding='16px 8px';";
  code += "d.style.minWidth='40px';";
  code += "show.style.display='block';";
  code += "};";
  code += "hdr.appendChild(hide);";
  code += "d.appendChild(hdr);";
  // Toggle Button
  code += "var btn=document.createElement('button');";
  code += "btn.textContent='关闭工具';";
  code += "btn.style.cssText='width:100%;padding:10px;border:none;border-radius:10px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-weight:600;font-size:13px;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 12px rgba(239,68,68,0.3);';";
  code += "btn.onmouseenter=function(){btn.style.transform='scale(1.02)';btn.style.boxShadow='0 6px 16px rgba(239,68,68,0.4);';};";
  code += "btn.onmouseleave=function(){btn.style.transform='scale(1)';btn.style.boxShadow='0 4px 12px rgba(239,68,68,0.3);';};";
  code += "btn.onclick=function(){";
  code += "localStorage.removeItem('tt_lobby_enabled');";
  code += "localStorage.removeItem('tt_lobby_id');";
  code += "localStorage.removeItem('tt_lobby_host');";
  code += "location.reload();";
  code += "};";
  code += "d.appendChild(btn);";
  // Tip
  code += "var tip=document.createElement('div');";
  code += "tip.style.cssText='margin-top:12px;padding:10px;background:rgba(99,102,241,0.1);border-radius:8px;font-size:11px;color:#a5b4fc;line-height:1.5;';";
  code += "tip.innerHTML='<div style=\"font-weight:600;margin-bottom:4px;\">💡 使用提示</div><div>退出当前大厅后重新进入多人游戏即可连接到 Lobby 0</div><div>隐藏面板后点击右侧箭头显示</div>';";
  code += "d.appendChild(tip);";
  code += "document.body.appendChild(d);";
  // Show button
  code += "var show=document.createElement('div');";
  code += "show.id='tt-show';";
  code += "show.style.cssText='position:fixed;top:20px;right:20px;z-index:99998;width:40px;height:40px;border-radius:12px;background:rgba(30,41,59,0.9);backdrop-filter:blur(10px);border:1px solid rgba(99,102,241,0.4);cursor:pointer;display:none;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 16px rgba(0,0,0,0.4);transition:all 0.2s;';";
  code += "show.textContent='▶';";
  code += "show.onmouseenter=function(){show.style.transform='scale(1.1)';};";
  code += "show.onmouseleave=function(){show.style.transform='scale(1)';};";
  code += "show.onclick=function(){";
  code += "show.style.display='none';";
  code += "d.style.transform='translateX(0)';";
  code += "d.style.opacity='1';";
  code += "d.style.padding='16px';";
  code += "d.style.minWidth='200px';";
  code += "};";
  code += "document.body.appendChild(show);";
  code += "console.log('[TT] Lobby 0 enabled');";
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
