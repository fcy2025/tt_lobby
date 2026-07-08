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
  code += "var TAB_W=20;";
  code += "function _ttG(){try{return localStorage.getItem('tt_lobby_enabled')==='1';}catch(e){return false;}}";
  code += "function _ttE(){localStorage.setItem('tt_lobby_enabled','1');localStorage.setItem('tt_lobby_id','0');localStorage.setItem('tt_lobby_host',L0);}";
  code += "function _ttD(){localStorage.removeItem('tt_lobby_enabled');localStorage.removeItem('tt_lobby_id');localStorage.removeItem('tt_lobby_host');if(window._ttOrigWS){window.WebSocket=window._ttOrigWS;}window._ttHook=0;}";
  // WebSocket Hook
  code += "if(!window._ttHook){";
  code += "window._ttHook=1;";
  code += "window._ttOrigWS=window.WebSocket;";
  code += "var O=window.WebSocket;";
  code += "window.WebSocket=function(u,p){";
  code += "var M=u;";
  code += "if(_ttG()){";
  code += "try{";
  code += "var pu=new URL(u);";
  code += "var ph=pu.hostname;";
  code += "var pp=pu.pathname;";
  code += "var tt=ph==='territorial.io'||ph==='1.territorial.io'||ph==='2.territorial.io'||ph==='game.territorial.io';";
  code += "if(tt){";
  code += "if(pp.length===5&&pp.charAt(0)==='/'&&pp.charAt(1)==='x'&&pp.charAt(2)==='0'){";
  code += "pu.pathname='/x00/';";
  code += "if(ph!=='game.territorial.io')pu.hostname=L0;";
  code += "M=pu.toString();";
  code += "}else if(pp==='/s50/'||pp==='/s51/'||pp==='/s52/'){";
  code += "pu.hostname=L0;";
  code += "M=pu.toString();";
  code += "}";
  code += "}";
  code += "}catch(e){}";
  code += "}";
  code += "return p?new O(M,p):new O(M);";
  code += "};";
  code += "window.WebSocket.prototype=O.prototype;";
  code += "window.WebSocket.prototype.constructor=window.WebSocket;";
  code += "window.WebSocket.toString=function(){return O.toString();};";
  code += "window.WebSocket.CONNECTING=0;window.WebSocket.OPEN=1;window.WebSocket.CLOSING=2;window.WebSocket.CLOSED=3;";
  code += "}";
  // Modify b1.z.aUa
  code += "function _ttM(){";
  code += "if(_ttG()&&window.b1&&window.b1.z&&window.b1.z.aUa){";
  code += "for(var i=0;i<window.b1.z.aUa.length;i++)window.b1.z.aUa[i]=L0;";
  code += "return true;";
  code += "}";
  code += "return false;";
  code += "}";
  code += "_ttM();";
  code += "var b1T=setInterval(function(){if(_ttM())clearInterval(b1T);},300);";
  code += "setTimeout(function(){clearInterval(b1T);},10000);";
  // UI
  code += "var old=document.getElementById('tt-panel');if(old)old.remove();";
  code += "var old2=document.getElementById('tt-panel2');if(old2)old2.remove();";
  // Panel 1
  code += "var d=document.createElement('div');";
  code += "d.id='tt-panel';";
  code += "d.style.cssText='position:fixed;top:20px;right:20px;z-index:99999;width:'+W+'px;height:'+H1+'px;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;padding:14px;border-radius:14px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;box-shadow:0 10px 40px rgba(0,0,0,0.7);border:1px solid rgba(99,102,241,0.3);overflow:hidden;';";
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
  code += "sw.onclick=function(){";
  code += "if(on){_ttD();}else{_ttE();_ttM();}render();";
  code += "};";
  code += "d.innerHTML='';";
  code += "d.appendChild(hdr);";
  code += "d.appendChild(sw);";
  // Tip
  code += "var tip=document.createElement('div');";
  code += "tip.style.cssText='margin-top:10px;padding:8px;border-radius:8px;font-size:11px;line-height:1.4;background:'+(on?'rgba(16,185,129,0.1)':'rgba(251,191,36,0.1)')+';color:'+(on?'#6ee7b7':'#fbbf24')+';';";
  code += "tip.textContent=on?'退出大厅后重新进入多人游戏':'点击开启后连接到 Lobby 0';";
  code += "d.appendChild(tip);";
  code += "}";
  code += "render();";
  code += "document.body.appendChild(d);";
  // Panel 2 - with tab visible when collapsed
  code += "var expanded=false;";
  code += "var d2=document.createElement('div');";
  code += "d2.id='tt-panel2';";
  code += "d2.style.cssText='position:fixed;top:'+(20+H1+8)+'px;right:20px;z-index:99998;width:'+W+'px;height:'+H2+'px;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;border-radius:14px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;box-shadow:0 10px 40px rgba(0,0,0,0.7);border:1px solid rgba(99,102,241,0.3);overflow:hidden;transition:transform 0.3s ease;transform:translateX(calc(100% - '+TAB_W+'px));';";
  // Tab
  code += "var tab=document.createElement('div');";
  code += "tab.style.cssText='position:absolute;top:0;left:0;width:'+TAB_W+'px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(99,102,241,0.3);border-right:1px solid rgba(99,102,241,0.5);transition:background 0.2s;';";
  code += "tab.innerHTML='<span style=\"writing-mode:vertical-rl;text-orientation:mixed;font-size:11px;font-weight:600;color:#a5b4fc;letter-spacing:1px;\">设置</span>';";
  code += "tab.onmouseenter=function(){tab.style.background='rgba(99,102,241,0.5)';};";
  code += "tab.onmouseleave=function(){if(!expanded)tab.style.background='rgba(99,102,241,0.3)';};";
  code += "tab.onclick=function(){togglePanel2();};";
  code += "d2.appendChild(tab);";
  // Content
  code += "var content=document.createElement('div');";
  code += "content.style.cssText='position:absolute;top:0;left:'+TAB_W+'px;right:0;bottom:0;padding:12px;overflow-y:auto;';";
  code += "var hdr2=document.createElement('div');";
  code += "hdr2.style.cssText='display:flex;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(51,65,85,0.5);';";
  code += "hdr2.innerHTML='<span style=\"font-size:14px;font-weight:600;\">设置</span>';";
  code += "content.appendChild(hdr2);";
  code += "var info=document.createElement('div');";
  code += "info.style.cssText='font-size:11px;color:#94a3b8;line-height:1.6;';";
  code += "info.innerHTML='<div style=\"margin-bottom:6px;color:#a5b4fc;font-weight:500;\">📌 使用方法</div><div style=\"margin-bottom:8px;\">开启后退出大厅，重新进入多人游戏即可连接到 Lobby 0</div><div style=\"margin-bottom:6px;color:#a5b4fc;font-weight:500;\">🌐 支持平台</div><div>territorial.io</div><div>fxclient.github.io</div>';";
  code += "content.appendChild(info);";
  code += "d2.appendChild(content);";
  code += "document.body.appendChild(d2);";
  code += "function togglePanel2(){";
  code += "expanded=!expanded;";
  code += "if(expanded){d2.style.transform='translateX(0px)';tab.style.background='rgba(99,102,241,0.5)';}";
  code += "else{d2.style.transform='translateX(calc(100% - '+TAB_W+'px))';tab.style.background='rgba(99,102,241,0.3)';}";
  code += "}";
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
