

const getBookmarkCode = (): string => {
  return "javascript:(function(){var L='territorial.io';var ok=location.hostname.indexOf('territorial.io')>-1||location.hostname.indexOf('fxclient')>-1;if(!ok){alert('请先打开游戏页面');return;}function G(){try{return localStorage.getItem('tt_lobby_enabled')==='1';}catch(e){return false;}}function E(){localStorage.setItem('tt_lobby_enabled','1');localStorage.setItem('tt_lobby_id','0');localStorage.setItem('tt_lobby_host',L);}function D(){localStorage.removeItem('tt_lobby_enabled');localStorage.removeItem('tt_lobby_id');localStorage.removeItem('tt_lobby_host');if(window._ttOrigWS){window.WebSocket=window._ttOrigWS;}window._ttHooked=0;}function H(){if(window._ttHooked)return;window._ttHooked=1;window._ttOrigWS=window.WebSocket;var O=window.WebSocket;window.WebSocket=function(u,p){var M=u;if(G()){try{var pu=new URL(u);var ph=pu.hostname;var pp=pu.pathname;var tt=ph==='territorial.io'||ph==='1.territorial.io'||ph==='2.territorial.io'||ph==='game.territorial.io';if(tt){if(pp.length===5&&pp.charAt(0)==='/'&&pp.charAt(1)==='x'&&pp.charAt(2)==='0'){pu.pathname='/x00/';if(ph!=='game.territorial.io')pu.hostname=L;M=pu.toString();}else if(pp==='/s50/'||pp==='/s51/'||pp==='/s52/'){pu.hostname=L;M=pu.toString();}}}catch(e){}}return p?new O(M,p):new O(M);};window.WebSocket.prototype=O.prototype;window.WebSocket.prototype.constructor=window.WebSocket;window.WebSocket.toString=function(){return O.toString();};window.WebSocket.CONNECTING=0;window.WebSocket.OPEN=1;window.WebSocket.CLOSING=2;window.WebSocket.CLOSED=3;console.log('[TT] Hook');};H();var ow=document.getElementById('tt-panel');if(ow)ow.remove();var d=document.createElement('div');d.id='tt-panel';d.style.cssText='position:fixed;top:20px;right:20px;z-index:99999;width:200px;background:rgba(30,41,59,0.95);backdrop-filter:blur(12px);color:#fff;padding:14px;border-radius:14px;font-family:sans-serif;font-size:13px;box-shadow:0 10px 40px rgba(0,0,0,0.7);border:1px solid rgba(99,102,241,0.3);';var hdr=document.createElement('div');hdr.style.cssText='display:flex;align-items:center;margin-bottom:12px;';hdr.innerHTML='<span style=\"font-size:18px;margin-right:8px;\">🏰</span><div><div style=\"font-weight:600;font-size:14px;\">Lobby 0</div><div style=\"font-size:10px;color:#94a3b8;\">快捷工具</div></div>';function R(){var on=G();var sw=document.createElement('div');sw.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:10px;background:'+(on?'rgba(16,185,129,0.2)':'rgba(75,85,99,0.3)')+';border:1px solid '+(on?'rgba(16,185,129,0.5)':'rgba(75,85,99,0.5)')+';cursor:pointer;';sw.innerHTML='<span style=\"font-weight:500;font-size:13px;\">'+(on?'已启用':'未启用')+'</span><div style=\"width:44px;height:24px;border-radius:12px;background:'+(on?'#10b981':'#4b5563')+';position:relative;\"><div style=\"width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:2px;left:'+(on?'22px':'2px')+';transition:left 0.3s;box-shadow:0 2px 6px rgba(0,0,0,0.3);\"></div></div>';sw.onclick=function(){if(on){D();}else{E();H();}R();};d.innerHTML='';d.appendChild(hdr);d.appendChild(sw);var tip=document.createElement('div');tip.style.cssText='margin-top:10px;padding:8px;border-radius:8px;font-size:11px;line-height:1.4;background:'+(on?'rgba(16,185,129,0.1)':'rgba(251,191,36,0.1)')+';color:'+(on?'#6ee7b7':'#fbbf24')+';';tip.textContent=on?'退出大厅后重新进入':'点击开启后连接 Lobby 0';d.appendChild(tip);};R();document.body.appendChild(d);})();";
};

function App() {
  const bookmarkUrl = getBookmarkCode();

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
            <p className="text-gray-400 text-xs">拖拽或复制代码使用</p>
          </div>

          <a href={bookmarkUrl} draggable={true}
            onClick={(e) => { e.preventDefault(); }}
            className="flex items-center justify-center gap-3 w-full p-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-emerald-500/30 cursor-grab active:cursor-grabbing select-none mb-4">
            <span className="text-2xl">🏰</span>
            <span className="font-bold text-lg">Lobby 0</span>
          </a>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 text-center">
              <div className="text-2xl mb-2">🖥️</div>
              <p className="text-xs font-semibold text-gray-200 mb-1">桌面端</p>
              <p className="text-xs text-gray-400">按住按钮拖到收藏夹栏</p>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 text-center">
              <div className="text-2xl mb-2">📱</div>
              <p className="text-xs font-semibold text-gray-200 mb-1">移动端</p>
              <p className="text-xs text-gray-400">复制代码到地址栏执行</p>
            </div>
          </div>

          <div className="mt-4">
            <a href="https://territorial.io/" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-400 text-sm font-medium transition-colors">
              <span>🎮</span>
              <span>打开游戏</span>
            </a>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 mb-5">
          <h2 className="text-lg font-bold mb-4 text-center">📖 使用教程</h2>

          <div className="space-y-4">
            <div className="bg-emerald-900/10 rounded-xl p-4 border border-emerald-900/20">
              <p className="text-sm font-semibold text-emerald-400 mb-3">🖥️ 桌面端操作</p>
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex gap-2">
                  <span className="text-emerald-400 font-bold">1</span>
                  <span>按住 🏰 Lobby 0 按钮拖到浏览器收藏夹栏</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-400 font-bold">2</span>
                  <span>打开 territorial.io</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-400 font-bold">3</span>
                  <span>点击收藏夹栏中的书签，右上角出现控制面板</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-400 font-bold">4</span>
                  <span>启用后退出大厅重新进入即可</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/10 rounded-xl p-4 border border-blue-900/20">
              <p className="text-sm font-semibold text-blue-400 mb-3">📱 移动端操作</p>
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">1</span>
                  <span>在浏览器中打开本工具页面</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">2</span>
                  <span>长按 🏰 Lobby 0 按钮选择"复制链接"</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">3</span>
                  <span>打开 territorial.io，等待游戏加载</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">4</span>
                  <span>点击地址栏，粘贴链接并回车</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">5</span>
                  <span>右上角出现控制面板，启用后退出重进</span>
                </div>
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
