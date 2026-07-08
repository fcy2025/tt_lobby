import { useState } from 'react';

const getBookmarkCode = (): string => {
  var code = "javascript:(function(){";
  code += "var ok=location.hostname.indexOf('territorial.io')>-1||location.hostname.indexOf('fxclient')>-1;";
  code += "if(!ok){alert('请先打开游戏页面');return;}";
  code += "var H=['territorial.io','1.territorial.io','2.territorial.io'];";
  code += "function _ttG(){try{return parseInt(localStorage.getItem('tt_lobby_id')||'1');}catch(e){return 1;}}";
  code += "function _ttS(id){localStorage.setItem('tt_lobby_id',id);localStorage.setItem('tt_lobby_host',H[id]);}";
  code += "function _ttT(){return H[_ttG()]||'1.territorial.io';}";
  // Strategy 1: Hook WebSocket
  code += "if(!window._ttHook){";
  code += "window._ttHook=1;";
  code += "var O=window.WebSocket;";
  code += "window.WebSocket=function(u,p){";
  code += "var M=u;";
  code += "try{";
  code += "var pu=new URL(u);";
  code += "var ph=pu.hostname;";
  code += "var pp=pu.pathname;";
  code += "var tt=ph==='territorial.io'||ph==='1.territorial.io'||ph==='2.territorial.io'||ph==='game.territorial.io';";
  code += "if(tt){";
  code += "var id=_ttG();";
  code += "var th=_ttT();";
  code += "if(pp.length===5&&pp.charAt(0)==='/'&&pp.charAt(1)==='x'&&pp.charAt(2)==='0'){";
  code += "var xi=parseInt(pp.charAt(3));";
  code += "if(!isNaN(xi)){";
  code += "pu.pathname='/x0'+id+'/';";
  code += "if(ph!=='game.territorial.io'){pu.hostname=th;}";
  code += "M=pu.toString();";
  code += "console.log('[TT] WS x0->',M);";
  code += "}";
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
  code += "console.log('[TT] WS Hook OK',_ttG());";
  code += "}";
  // Strategy 2: Modify b1.z.aUa server array
  code += "function _ttM(){";
  code += "var t=_ttT();";
  code += "if(window.b1&&window.b1.z&&window.b1.z.aUa){";
  code += "var a=window.b1.z.aUa;";
  code += "for(var i=0;i<a.length;i++){a[i]=t;}";
  code += "console.log('[TT] aUa modified to',t);";
  code += "return true;";
  code += "}";
  code += "return false;";
  code += "}";
  code += "_ttM();";
  // UI Panel
  code += "var old=document.getElementById('tt-panel');";
  code += "if(old)old.remove();";
  code += "var d=document.createElement('div');";
  code += "d.id='tt-panel';";
  code += "d.style.cssText='position:fixed;top:10px;right:10px;z-index:99999;background:#1e293b;color:#fff;padding:10px;border-radius:10px;font-family:sans-serif;font-size:12px;box-shadow:0 4px 20px rgba(0,0,0,.5);border:1px solid #6366f1;min-width:180px;';";
  code += "var hdr=document.createElement('div');";
  code += "hdr.style.cssText='display:flex;align-items:center;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #334155;';";
  code += "hdr.innerHTML='<span style=\"font-size:16px;margin-right:6px;\">🏰</span><b>大厅切换</b>';";
  code += "var cls=document.createElement('span');";
  code += "cls.style.cssText='margin-left:auto;cursor:pointer;color:#94a3b8;';";
  code += "cls.textContent='✕';";
  code += "cls.onclick=function(){d.remove();};";
  code += "hdr.appendChild(cls);";
  code += "d.appendChild(hdr);";
  code += "var tip=document.createElement('div');";
  code += "tip.style.cssText='font-size:11px;color:#94a3b8;margin-bottom:8px;';";
  code += "tip.textContent='选择后退出并重新进入大厅';";
  code += "d.appendChild(tip);";
  code += "var list=document.createElement('div');";
  code += "list.id='tt-list';";
  code += "d.appendChild(list);";
  code += "document.body.appendChild(d);";
  code += "var L=[{id:0,n:'Lobby 0',i:'🟢'},{id:1,n:'Lobby 1',i:'🔴'},{id:2,n:'Lobby 2',i:'🟡'}];";
  code += "function render(){";
  code += "var c=_ttG();";
  code += "list.innerHTML='';";
  code += "L.forEach(function(l){";
  code += "var active=l.id===c;";
  code += "var row=document.createElement('div');";
  code += "row.style.cssText='display:flex;align-items:center;padding:8px;border-radius:6px;cursor:pointer;margin-bottom:4px;background:'+(active?'rgba(99,102,241,.3)':'rgba(255,255,255,.05)')+';border:1px solid '+(active?'#6366f1':'transparent')+';';";
  code += "row.innerHTML='<span style=\"font-size:16px;margin-right:8px;\">'+l.i+'</span><span style=\"flex:1;font-weight:'+(active?'bold':'normal')+';\">'+l.n+'</span>'+(active?'<span style=\"color:#10b981;\">✓</span>':'');";
  code += "row.onclick=function(){";
  code += "if(l.id===c)return;";
  code += "_ttS(l.id);";
  code += "render();";
  code += "_ttM();";
  code += "try{if(window.b1&&window.b1.z&&typeof window.b1.z.sJ==='function'){window.b1.z.sJ();}}catch(e){}";
  code += "};";
  code += "list.appendChild(row);";
  code += "});";
  code += "}";
  code += "render();";
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">TT Lobby Manager</h1>
          <p className="text-gray-400 text-sm">Territorial.io 大厅切换工具</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 mb-5">
          <div className="text-center mb-5">
            <div className="text-3xl mb-2">📌</div>
            <h2 className="text-xl font-bold mb-1">控制面板书签</h2>
            <p className="text-gray-400 text-xs">拖拽下方按钮到收藏夹栏</p>
          </div>

          <div className="bg-indigo-900/20 rounded-lg p-3 border border-indigo-900/30 mb-4">
            <p className="text-xs text-gray-400 space-y-1">
              <b>使用方法：</b><br/>
              1. 拖拽下方按钮到浏览器收藏夹栏<br/>
              2. 打开游戏 territorial.io<br/>
              3. 点击书签 → 右上角弹出控制面板<br/>
              4. 点击 Lobby 0/1/2 切换
            </p>
          </div>

          <a href={bookmarkUrl} draggable={true}
            className="flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-grab active:cursor-grabbing select-none shadow-lg shadow-indigo-500/30 mb-4"
            onClick={(e) => { e.preventDefault(); copy(bookmarkUrl); }}>
            <span className="text-2xl">🏰</span>
            <span className="font-bold text-lg">TT Lobby</span>
            {copied && <span className="text-xs text-white/90">已复制</span>}
          </a>

          <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-900/30">
            <p className="text-xs text-amber-300 mb-2">⭐ 油猴脚本（备用方案）</p>
            <p className="text-xs text-gray-400">安装 Tampermonkey 后，点击安装</p>
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
          <div className="space-y-2 text-sm text-gray-400">
            <p>1. 拖拽 🏰 TT Lobby 到浏览器收藏夹栏</p>
            <p>2. 打开 territorial.io 或 FXclient</p>
            <p>3. 点击书签，右上角弹出控制面板</p>
            <p>4. 选择 Lobby 0/1/2，立即切换</p>
          </div>
        </div>

        <div className="bg-green-900/20 rounded-xl p-4 border border-green-900/30 mb-5">
          <p className="text-xs text-green-400">✅ 支持：territorial.io / fxclient.github.io/FXclient</p>
        </div>

        <footer className="text-center text-gray-500 text-xs">
          <p>TT Lobby Manager</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
