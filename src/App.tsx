import { useState } from 'react';

const LOBBIES = [
  { id: 0, name: 'Lobby 0', icon: '🟢', host: 'territorial.io', desc: '备用大厅', color: 'from-green-500 to-emerald-600' },
  { id: 1, name: 'Lobby 1', icon: '🔴', host: '1.territorial.io', desc: '默认主大厅', color: 'from-red-500 to-rose-600' },
  { id: 2, name: 'Lobby 2', icon: '🟡', host: '2.territorial.io', desc: '备选大厅', color: 'from-yellow-500 to-amber-600' },
];

// 注入到游戏页面的浮动 UI 脚本
const getInjectUIScript = (lobbyId: number) => {
  const host = LOBBIES[lobbyId].host;
  return `(function(){
    var h='${host}';
    var lid=${lobbyId};
    if(document.getElementById('tt-lobby-fab')){
      var fab=document.getElementById('tt-lobby-fab');
      fab.querySelector('.tt-lobby-label').textContent='Lobby '+lid;
      fab.style.background='linear-gradient(135deg,#6366f1,#8b5cf6)';
    }else{
      var fab=document.createElement('div');
      fab.id='tt-lobby-fab';
      fab.style.cssText='position:fixed;top:20px;right:20px;z-index:99999;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:10px 16px;border-radius:12px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 20px rgba(99,102,241,.5);user-select:none;transition:all .2s;display:flex;align-items:center;gap:8px;';
      fab.innerHTML='<span style="font-size:18px">🏰</span><span class="tt-lobby-label">Lobby '+lid+'</span>';
      fab.onmouseenter=function(){fab.style.transform='scale(1.05)';};
      fab.onmouseleave=function(){fab.style.transform='scale(1)';};
      fab.onclick=function(){
        if(typeof window.aiCommand746==='function'){
          try{window.aiCommand746(0);fab.style.background='linear-gradient(135deg,#10b981,#059669)';setTimeout(function(){fab.style.background='linear-gradient(135deg,#6366f1,#8b5cf6)';},1000);}catch(e){location.reload();}
        }else{
          location.reload();
        }
      };
      document.body.appendChild(fab);
    }
    if(!window._ttOrigWS){
      window._ttOrigWS=window.WebSocket;
      window.WebSocket=function(u,p){
        var M=u;
        if(u&&typeof u==='string'){
          try{
            var U=new URL(u);
            if(U.hostname.includes('territorial.io')&&U.pathname==='/s52/'){
              U.hostname=h;
              M=U.toString();
            }
          }catch(e){}
        }
        var w=p?new window._ttOrigWS(M,p):new window._ttOrigWS(M);
        return w;
      };
      window.WebSocket.prototype=window._ttOrigWS.prototype;
      window.WebSocket.prototype.constructor=window.WebSocket;
      window.WebSocket.toString=function(){return window._ttOrigWS.toString()};
      window.WebSocket.OPEN=window._ttOrigWS.OPEN;
      window.WebSocket.CLOSED=window._ttOrigWS.CLOSED;
      window.WebSocket.CLOSING=window._ttOrigWS.CLOSING;
      window.WebSocket.CONNECTING=window._ttOrigWS.CONNECTING;
    }
  })();`;
};

// 书签脚本：注入浮动 UI 按钮
const getScript = (lobbyId: number) => {
  const host = LOBBIES[lobbyId].host;
  return `(function(){
    var h='${host}';
    localStorage.setItem('tt_lobby_host',h);
    localStorage.setItem('tt_lobby_id','${lobbyId}');
    var inGame=window.location.hostname.includes('territorial.io')||window.location.hostname.includes('fxclient');
    if(!inGame){alert('请先打开游戏页面');return;}
    var s=document.createElement('script');
    s.textContent=${JSON.stringify(getInjectUIScript(lobbyId))};
    document.body.appendChild(s);
  })();`.replace(/\n\s*/g, '');
};

const getBaseUrl = (): string => {
  try {
    return (import.meta as any).env?.BASE_URL || '/';
  } catch {
    return '/';
  }
};

function App() {
  const [copied, setCopied] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'bookmark' | 'userscript' | 'script'>('bookmark');

  const getBookmarkUrl = (lobbyId: number) => {
    return `javascript:${encodeURIComponent(getScript(lobbyId))}`;
  };

  const copyText = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
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
              📌 浮动按钮
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
                  <p>1. 拖拽下方按钮到收藏夹栏</p>
                  <p>2. 打开游戏页面（territorial.io）</p>
                  <p>3. 点击书签 → 右上角出现 🏰 浮动按钮</p>
                  <p>4. 点击浮动按钮立即切换 lobby</p>
                  <p>5. 再次点击浮动按钮可切换到其他 lobby</p>
                </div>
              </div>
              {LOBBIES.map((lobby) => (
                <a
                  key={lobby.id}
                  href={getBookmarkUrl(lobby.id)}
                  draggable={true}
                  className={`flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-gradient-to-r ${lobby.color} hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-grab active:cursor-grabbing select-none`}
                  onClick={(e) => {
                    e.preventDefault();
                    copyText(getBookmarkUrl(lobby.id), lobby.id);
                  }}
                >
                  <span className="text-2xl">{lobby.icon}</span>
                  <span className="font-bold text-lg">{lobby.name}</span>
                  {copied === lobby.id && <span className="text-xs text-white/90">已复制链接</span>}
                </a>
              ))}
            </div>
          )}

          {activeTab === 'userscript' && (
            <div className="space-y-3">
              <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-900/30">
                <p className="text-xs text-amber-300 mb-2">⭐ 推荐方案（每次刷新自动生效）</p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>1. 安装 Tampermonkey 浏览器扩展</p>
                  <p>2. 点击下方"安装脚本"按钮</p>
                  <p>3. 打开游戏，自动进入对应 lobby</p>
                </div>
              </div>
              {LOBBIES.map((lobby) => (
                <div key={lobby.id} className="flex items-center gap-2">
                  <div className={`flex-1 flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r ${lobby.color}`}>
                    <span className="text-xl">{lobby.icon}</span>
                    <div>
                      <p className="font-bold text-sm">{lobby.name}</p>
                      <p className="text-xs text-white/70">{lobby.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const base = getBaseUrl();
                      const url = `${window.location.origin}${base}tt-lobby-manager.user.js`;
                      window.open(url, '_blank');
                    }}
                    className="px-3 py-3 rounded-xl font-medium text-sm bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    安装
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const base = getBaseUrl();
                  copyText(`https://${window.location.host}${base}tt-lobby-manager.user.js`, 99);
                }}
                className="w-full py-2 px-3 rounded-lg text-xs bg-slate-800/50 text-gray-400 hover:bg-slate-700/50"
              >
                {copied === 99 ? '✓ 已复制脚本地址' : '📋 复制脚本直链'}
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
                <p className="font-medium text-white">打开游戏</p>
                <p className="text-gray-400 text-xs">在浏览器中打开 territorial.io</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-medium text-white">点击书签</p>
                <p className="text-gray-400 text-xs">点击对应大厅书签，右上角出现 🏰 浮动按钮</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-medium text-white">点击浮动按钮</p>
                <p className="text-gray-400 text-xs">点击 🏰 按钮立即切换，无需刷新</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
              <div>
                <p className="font-medium text-white">切换其他 lobby</p>
                <p className="text-gray-400 text-xs">点击其他书签 → 点击新的 🏰 按钮</p>
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
