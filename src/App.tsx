import { useState } from 'react';

const getBookmarkCode = (): string => {
  var code = "javascript:(function(){";
  code += "var ok=location.hostname.indexOf('territorial.io')>-1||location.hostname.indexOf('fxclient')>-1;";
  code += "if(!ok){alert('请先打开游戏页面');return;}";
  code += "var L0='territorial.io';";
  code += "function isOn(){try{return localStorage.getItem('tt_lobby_enabled')==='1';}catch(e){return false;}}";
  code += "function turnOn(){localStorage.setItem('tt_lobby_enabled','1');localStorage.setItem('tt_lobby_id','0');localStorage.setItem('tt_lobby_host',L0);}";
  code += "function turnOff(){localStorage.removeItem('tt_lobby_enabled');localStorage.removeItem('tt_lobby_id');localStorage.removeItem('tt_lobby_host');location.reload();}";
  // WebSocket Hook
  code += "if(!window._ttHook){";
  code += "window._ttHook=1;window._ttOrigWS=window.WebSocket;var O=window.WebSocket;";
  code += "window.WebSocket=function(u,p){";
  code += "var M=u;if(!isOn()){return p?new O(u,p):new O(u);}";
  code += "try{";
  code += "var pu=new URL(u);var ph=pu.hostname;var pp=pu.pathname;";
  code += "var tt=ph==='territorial.io'||ph==='1.territorial.io'||ph==='2.territorial.io'||ph==='game.territorial.io';";
  code += "if(tt){";
  code += "if(pp.length===5&&pp.charAt(0)==='/'&&pp.charAt(1)==='x'&&pp.charAt(2)==='0'){pu.pathname='/x00/';if(ph!=='game.territorial.io')pu.hostname=L0;M=pu.toString();}";
  code += "else if(pp==='/s50/'||pp==='/s51/'||pp==='/s52/'){pu.hostname=L0;M=pu.toString();}";
  code += "}";
  code += "}catch(e){}return p?new O(M,p):new O(M);";
  code += "};";
  code += "window.WebSocket.prototype=O.prototype;window.WebSocket.prototype.constructor=window.WebSocket;";
  code += "window.WebSocket.toString=function(){return O.toString();};";
  code += "window.WebSocket.CONNECTING=0;window.WebSocket.OPEN=1;window.WebSocket.CLOSING=2;window.WebSocket.CLOSED=3;";
  code += "}";
  // Modify aUa
  code += "function modAua(){";
  code += "if(!isOn())return false;";
  code += "if(window.b1&&window.b1.z&&window.b1.z.aUa){for(var i=0;i<window.b1.z.aUa.length;i++)window.b1.z.aUa[i]=L0;return true;}";
  code += "return false;";
  code += "}";
  code += "modAua();";
  code += "var b1T=setInterval(function(){if(modAua())clearInterval(b1T);},300);";
  code += "setTimeout(function(){clearInterval(b1T);},10000);";
  // UI - Mini Button
  code += "var oldBtn=document.getElementById('tt-toggle-btn');if(oldBtn)oldBtn.remove();";
  code += "var oldPanel=document.getElementById('tt-panel');if(oldPanel)oldPanel.remove();";
  code += "var btn=document.createElement('div');btn.id='tt-toggle-btn';";
  code += "btn.style.cssText='position:fixed;top:20px;right:20px;z-index:99999;width:44px;height:44px;border-radius:50%;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);border:1px solid rgba(99,102,241,0.4);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 20px rgba(0,0,0,0.5);transition:all 0.3s ease;';";
  code += "btn.title='Lobby 0';";
  // Panel
  code += "var panel=document.createElement('div');panel.id='tt-panel';";
  code += "panel.style.cssText='position:fixed;top:70px;right:20px;z-index:99998;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;padding:20px;border-radius:16px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;box-shadow:0 8px 32px rgba(0,0,0,0.6);border:1px solid rgba(99,102,241,0.4);min-width:240px;opacity:0;visibility:hidden;transform:translateY(-10px);transition:all 0.3s ease;';";
  // Update Button
  code += "function updBtn(){";
  code += "var on=isOn();";
  code += "btn.textContent=on?'🟢':'⚪';";
  code += "btn.style.borderColor=on?'rgba(16,185,129,0.6)':'rgba(99,102,241,0.4)';";
  code += "btn.style.boxShadow=on?'0 4px 20px rgba(16,185,129,0.4)':'0 4px 20px rgba(0,0,0,0.5)';";
  code += "}";
  // Update Panel
  code += "function updPanel(){";
  code += "var on=isOn();panel.innerHTML='';";
  // Header
  code += "var hdr=document.createElement('div');";
  code += "hdr.style.cssText='display:flex;align-items:center;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(51,65,85,0.6);';";
  code += "hdr.innerHTML='<span style=\"font-size:24px;margin-right:10px;\">🏰</span><div><div style=\"font-weight:600;font-size:15px;\">Lobby 0</div><div style=\"font-size:11px;color:#94a3b8;\">'+(on?'已启用':'已关闭')+'</div></div>';";
  code += "panel.appendChild(hdr);";
  // Switch
  code += "var swRow=document.createElement('div');";
  code += "swRow.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding:12px;background:rgba(255,255,255,0.05);border-radius:12px;';";
  code += "var lbl=document.createElement('span');lbl.style.cssText='font-weight:500;font-size:14px;';lbl.textContent='启用 Lobby 0';swRow.appendChild(lbl);";
  code += "var sw=document.createElement('button');";
  code += "sw.style.cssText='width:48px;height:28px;border-radius:14px;border:none;cursor:pointer;transition:all 0.3s ease;position:relative;';";
  code += "sw.style.background=on?'#10b981':'#334155';";
  code += "var knob=document.createElement('div');";
  code += "knob.style.cssText='position:absolute;width:24px;height:24px;border-radius:50%;background:#fff;top:2px;transition:all 0.3s ease;box-shadow:0 2px 6px rgba(0,0,0,0.3);';";
  code += "knob.style.left=on?'22px':'2px';sw.appendChild(knob);";
  code += "sw.onclick=function(){";
  code += "if(on){turnOff();}else{turnOn();modAua();updBtn();updPanel();}";
  code += "};swRow.appendChild(sw);panel.appendChild(swRow);";
  // Tip
  code += "var tip=document.createElement('div');";
  code += "tip.style.cssText='padding:12px;border-radius:10px;font-size:12px;line-height:1.6;';";
  code += "if(on){tip.style.background='rgba(99,102,241,0.1)';tip.style.color='#a5b4fc';tip.innerHTML='<div style=\"font-weight:600;margin-bottom:4px;\">💡 已连接 Lobby 0</div><div>退出当前大厅后重新进入多人游戏即可</div>';}";
  code += "else{tip.style.background='rgba(251,191,36,0.1)';tip.style.color='#fbbf24';tip.innerHTML='<div style=\"font-weight:600;margin-bottom:4px;\">💡 点击开关启用</div><div>开启后所有连接将重定向到 Lobby 0</div>';}";
  code += "panel.appendChild(tip);";
  code += "}";
  // Toggle
  code += "function toggle(){";
  code += "var hidden=panel.style.visibility==='hidden';";
  code += "if(hidden){panel.style.opacity='1';panel.style.visibility='visible';panel.style.transform='translateY(0)';btn.style.transform='rotate(90deg)';updPanel();}";
  code += "else{panel.style.opacity='0';panel.style.visibility='hidden';panel.style.transform='translateY(-10px)';btn.style.transform='rotate(0deg)';}";
  code += "}";
  // Events
  code += "btn.onclick=function(e){e.stopPropagation();toggle();};";
  code += "document.addEventListener('click',function(e){";
  code += "if(!btn.contains(e.target)&&!panel.contains(e.target)){";
  code += "panel.style.opacity='0';panel.style.visibility='hidden';panel.style.transform='translateY(-10px)';btn.style.transform='rotate(0deg)';";
  code += "}";
  code += "});";
  code += "btn.onmouseenter=function(){btn.style.transform='scale(1.1)';};";
  code += "btn.onmouseleave=function(){btn.style.transform='scale(1)';};";
  code += "document.body.appendChild(btn);document.body.appendChild(panel);";
  code += "turnOn();modAua();updBtn();";
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
