import { useState } from 'react';

// 注入到游戏页面的脚本
const getPanelScript = (): string => {
  return `(function(){
    var hosts=['territorial.io','1.territorial.io','2.territorial.io'];

    function getSaved(){
      try{return parseInt(localStorage.getItem('tt_lobby_id')||'1');}
      catch(e){return 1;}
    }

    // 注入WebSocket钩子
    function injectWS(){
      if(window._ttOrigWS)return;
      var O=window.WebSocket;
      window._ttOrigWS=O;
      window.WebSocket=function(u,p){
        var M=u;
        if(u&&typeof u==='string'){
          try{
            var U=new URL(u);
            var host=U.hostname;
            var path=U.pathname;
            var isTT=host==='territorial.io'||host==='1.territorial.io'||host==='2.territorial.io'||host==='game.territorial.io';
            if(isTT){
              var id=getSaved();
              var targetHost=hosts[id]||'1.territorial.io';
              // Handle /x0N/ paths (e.g., /x01/ -> /x0{id}/)
              if(path.length===5&&path.charAt(0)==='/'&&path.charAt(1)==='x'&&path.charAt(2)==='0'){
                var xId=parseInt(path.charAt(3));
                if(!isNaN(xId)){
                  U.pathname='/x0'+id+'/';
                  if(host!=='game.territorial.io'){
                    U.hostname=targetHost;
                  }
                  M=U.toString();
                  console.log('[TT] WS x0→',M);
                }
              }
              // Handle /s50/, /s51/, /s52/ paths
              else if(path==='/s50/'||path==='/s51/'||path==='/s52/'){
                U.hostname=targetHost;
                M=U.toString();
                console.log('[TT] WS s→',M);
              }
            }
          }catch(e){console.log('[TT] URL parse error:',e);}
        }
        if(p&&Array.isArray(p))return new O(M,p);
        if(p)return new O(M,p);
        return new O(M);
      };
      window.WebSocket.prototype=O.prototype;
      window.WebSocket.prototype.constructor=window.WebSocket;
      try{Object.defineProperty(window.WebSocket,'name',{value:'WebSocket',configurable:true});}catch(e){}
      window.WebSocket.toString=function(){return O.toString();};
      window.WebSocket.OPEN=O.OPEN;
      window.WebSocket.CLOSED=O.CLOSED;
      window.WebSocket.CLOSING=O.CLOSING;
      window.WebSocket.CONNECTING=O.CONNECTING;
      console.log('[TT] WS hook installed for Lobby',getSaved());
    }

    // 覆盖window.onload，确保在游戏初始化前注入钩子
    function hookOnload(){
      var origOnload=window.onload;
      window.onload=function(){
        injectWS();
        if(typeof origOnload==='function'){
          try{origOnload();}catch(e){}
        }
      };
    }

    // 立即注入钩子
    injectWS();

    // 如果页面还没加载完成，覆盖onload
    if(document.readyState!=='complete'){
      hookOnload();
      console.log('[TT] Waiting for page load...');
    }else{
      // 页面已加载，尝试重新初始化游戏
      console.log('[TT] Page already loaded');
      try{
        if(typeof aiCommand746==='function'){aiCommand746(0);console.log('[TT] Re-initiated game');}
        else if(typeof window.aiCommand746==='function'){window.aiCommand746(0);console.log('[TT] Re-initiated game');}
        else if(typeof bw==='function'){bw(0);console.log('[TT] Called bw(0)');}
      }catch(e){console.log('[TT] Re-init error:',e);}
    }

    // 创建控制面板
    function createPanel(){
      var old=document.getElementById('tt-lobby-panel');
      if(old)old.remove();
      var cur=getSaved();
      var panel=document.createElement('div');
      panel.id='tt-lobby-panel';
      panel.style.cssText='position:fixed;top:20px;right:20px;z-index:99999;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;user-select:none;background:linear-gradient(135deg,#1e293b,#0f172a);color:#fff;padding:12px;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.5);border:1px solid rgba(99,102,241,.3);min-width:220px;';
      panel.innerHTML='<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.1);"><span style="font-size:20px">🏰</span><span style="font-weight:700;font-size:15px;flex:1">大厅切换</span><span id="tt-lobby-close" style="cursor:pointer;opacity:.6;font-size:18px;line-height:1">×</span></div><div style="font-size:11px;color:#94a3b8;margin-bottom:8px">当前: <b id="tt-lobby-current" style="color:#a5b4fc">Lobby '+cur+'</b></div><div id="tt-lobby-list" style="display:flex;flex-direction:column;gap:6px"></div>';
      document.body.appendChild(panel);
      var list=document.getElementById('tt-lobby-list');
      var LOBBIES=[{id:0,name:'Lobby 0',icon:'🟢',desc:'备用大厅'},{id:1,name:'Lobby 1',icon:'🔴',desc:'默认主大厅'},{id:2,name:'Lobby 2',icon:'🟡',desc:'备选大厅'}];
      function rebuild(){
        var current=getSaved();
        list.innerHTML='';
        LOBBIES.forEach(function(l){
          var isCur=l.id===current;
          var btn=document.createElement('div');
          btn.style.cssText='display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;background:'+(isCur?'rgba(99,102,241,.2)':'rgba(255,255,255,.03)')+';border:1px solid '+(isCur?'#6366f1':'rgba(255,255,255,.08)')+';transition:all .15s;';
          btn.innerHTML='<span style="font-size:20px">'+l.icon+'</span><div style="flex:1"><div style="font-size:14px;font-weight:600">'+l.name+'</div><div style="font-size:10px;color:#94a3b8">'+l.desc+'</div></div>'+(isCur?'<span style="color:#10b981;font-size:16px">✓</span>':'');
          btn.onmouseenter=function(){if(!isCur)btn.style.background='rgba(255,255,255,.08)';};
          btn.onmouseleave=function(){btn.style.background=isCur?'rgba(99,102,241,.2)':'rgba(255,255,255,.03)';};
          btn.onclick=function(){
            if(l.id===current)return;
            localStorage.setItem('tt_lobby_id',l.id.toString());
            localStorage.setItem('tt_lobby_host',hosts[l.id]);
            rebuild();
            var c=document.getElementById('tt-lobby-current');
            if(c)c.textContent='Lobby '+l.id;
            try{
              if(typeof aiCommand746==='function'){aiCommand746(0);}
              else if(typeof window.aiCommand746==='function'){window.aiCommand746(0);}
              else if(typeof bw==='function'){bw(0);}
            }catch(e){console.log('[TT] Switch error:',e);}
          };
          list.appendChild(btn);
        });
      }
      rebuild();
      document.getElementById('tt-lobby-close').onclick=function(){panel.remove();};
    }

    // DOM就绪后创建控制面板
    if(document.readyState==='loading'){
      document.addEventListener('DOMContentLoaded',createPanel);
    }else{
      createPanel();
    }
  })();`;
};

// 书签脚本：点击后注入控制面板
const getBookmarkScript = (): string => {
  return `(function(){
    var inGame=window.location.hostname.includes('territorial.io')||window.location.hostname.includes('fxclient');
    if(!inGame){alert('请先打开游戏页面（territorial.io）后再使用此书签');return;}
    var s=document.createElement('script');
    s.textContent=${JSON.stringify(getPanelScript())};
    document.body.appendChild(s);
  })();`;
};

const getBaseUrl = (): string => {
  try {
    return (import.meta as any).env?.BASE_URL || '/';
  } catch {
    return '/';
  }
};

function App() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookmark' | 'userscript'>('bookmark');

  const getBookmarkUrl = (): string => {
    return `javascript:${encodeURIComponent(getBookmarkScript())}`;
  };

  const copyText = async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-60 w-120 h-120 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-60 -left-60 w-120 h-120 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏰</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            TT Lobby Manager
          </h1>
          <p className="text-gray-400 text-sm">Territorial.io 大厅切换工具</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 mb-5">
          <div className="text-center mb-5">
            <div className="text-3xl mb-2">⚡</div>
            <h2 className="text-xl font-bold mb-1">快速切换大厅</h2>
            <p className="text-gray-400 text-xs">支持官方版和FXclient版</p>
          </div>

          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setActiveTab('bookmark')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'bookmark'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              📌 控制面板
            </button>
            <button
              onClick={() => setActiveTab('userscript')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'userscript'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              ⭐ 油猴脚本
            </button>
          </div>

          {activeTab === 'bookmark' && (
            <div className="space-y-3">
              <div className="bg-indigo-900/20 rounded-lg p-3 border border-indigo-900/30">
                <p className="text-xs text-indigo-300 mb-2">💡 使用方法（推荐）</p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>1. <b>拖拽下方按钮</b>到浏览器收藏夹栏</p>
                  <p>2. 打开游戏页面（territorial.io）</p>
                  <p>3. 点击书签 → 右上角弹出<b>控制面板</b></p>
                  <p>4. 点击控制面板里的 Lobby 0/1/2 切换</p>
                  <p>5. 可多次点击切换，无需刷新页面</p>
                </div>
              </div>

              <a
                href={getBookmarkUrl()}
                draggable={true}
                className="flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-grab active:cursor-grabbing select-none shadow-lg shadow-indigo-500/30"
                onClick={(e) => {
                  e.preventDefault();
                  copyText(getBookmarkUrl());
                }}
              >
                <span className="text-2xl">🏰</span>
                <span className="font-bold text-lg">TT Lobby</span>
                {copied && <span className="text-xs text-white/90">已复制</span>}
              </a>

              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                <p className="text-xs text-gray-400 mb-2">📱 移动端使用：</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>微信/QQ内置浏览器可能不支持书签，请使用"⭐ 油猴脚本"方案</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'userscript' && (
            <div className="space-y-3">
              <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-900/30">
                <p className="text-xs text-amber-300 mb-2">⭐ 最稳定方案（每次刷新自动生效）</p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>1. 安装 Tampermonkey 浏览器扩展</p>
                  <p>2. 点击下方"安装脚本"按钮</p>
                  <p>3. 打开游戏，自动应用控制面板</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const base = getBaseUrl();
                  const url = `${window.location.origin}${base}tt-lobby-manager.user.js`;
                  window.open(url, '_blank');
                }}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-transform font-bold"
              >
                📥 安装油猴脚本
              </button>

              <button
                onClick={() => {
                  const base = getBaseUrl();
                  copyText(`https://${window.location.host}${base}tt-lobby-manager.user.js`);
                }}
                className="w-full py-2 px-3 rounded-lg text-xs bg-slate-800/50 text-gray-400 hover:bg-slate-700/50"
              >
                {copied ? '✓ 已复制脚本地址' : '📋 复制脚本直链'}
              </button>
            </div>
          )}
        </div>

        <div className="glass-panel rounded-2xl p-6 mb-5">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">📖</div>
            <h2 className="text-xl font-bold mb-1">使用教程</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-medium text-white">添加书签</p>
                <p className="text-gray-400 text-xs">拖拽"TT Lobby"按钮到收藏夹栏</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-medium text-white">打开游戏</p>
                <p className="text-gray-400 text-xs">在浏览器打开 territorial.io</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-medium text-white">点击书签</p>
                <p className="text-gray-400 text-xs">弹出控制面板，显示当前 Lobby</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
              <div>
                <p className="font-medium text-white">选择 Lobby</p>
                <p className="text-gray-400 text-xs">点击目标 Lobby 立即切换</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-900/20 rounded-xl p-4 border border-green-900/30 mb-5">
          <h3 className="font-semibold text-green-400 text-sm mb-2 flex items-center gap-2">
            <span>✅</span> 支持的游戏
          </h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• 官方版：territorial.io</li>
            <li>• FXclient 版：fxclient.github.io/FXclient</li>
          </ul>
        </div>

        <footer className="text-center text-gray-500 text-xs">
          <p>TT Lobby Manager • Territorial.io 大厅管理工具</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
