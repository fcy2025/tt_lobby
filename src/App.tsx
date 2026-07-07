import { useState } from 'react';

const LOBBIES = [
  { id: 0, name: 'Lobby 0', icon: '🟢', host: 'territorial.io', desc: '备用大厅', color: 'from-green-500 to-emerald-600' },
  { id: 1, name: 'Lobby 1', icon: '🔴', host: '1.territorial.io', desc: '默认主大厅', color: 'from-red-500 to-rose-600' },
  { id: 2, name: 'Lobby 2', icon: '🟡', host: '2.territorial.io', desc: '备选大厅', color: 'from-yellow-500 to-amber-600' },
];

function App() {
  const [copied, setCopied] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'bookmark' | 'script'>('bookmark');

  const getBookmarkScript = (lobbyId: number) => {
    const host = LOBBIES[lobbyId].host;
    return `(function(){
      var SERVER='${host}';
      var O=window.WebSocket;
      window.WebSocket=function(u,p){
        var M=u;
        if(u&&typeof u==='string'){
          try{
            var U=new URL(u);
            var h=U.hostname;
            if(h.includes('territorial.io')||h.includes('fxclient.github.io')){
              U.hostname=SERVER;
              M=U.toString();
            }
          }catch(e){}
        }
        return p?new O(M,p):new O(M);
      };
      window.WebSocket.prototype=O.prototype;
      alert('✓ 已切换到 Lobby ${lobbyId}\\n请点击 Multiplayer 进入游戏');
    })();`.replace(/\n\s*/g, '');
  };

  const getConsoleScript = (lobbyId: number) => {
    const host = LOBBIES[lobbyId].host;
    return `(function(){
      var SERVER='${host}';
      var O=window.WebSocket;
      window.WebSocket=function(u,p){
        var M=u;
        if(u&&typeof u==='string'){
          try{
            var U=new URL(u);
            var h=U.hostname;
            if(h.includes('territorial.io')||h.includes('fxclient.github.io')){
              U.hostname=SERVER;
              M=U.toString();
            }
          }catch(e){}
        }
        return p?new O(M,p):new O(M);
      };
      window.WebSocket.prototype=O.prototype;
      alert('✓ 已切换到 Lobby ${lobbyId}\\n请点击 Multiplayer 进入游戏');
    })();`.replace(/\n\s*/g, '');
  };

  const getBookmarkUrl = (lobbyId: number) => {
    return `javascript:${encodeURIComponent(getBookmarkScript(lobbyId))}`;
  };

  const copyScript = async (lobbyId: number) => {
    await navigator.clipboard.writeText(getConsoleScript(lobbyId));
    setCopied(lobbyId);
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
              📌 书签大法
            </button>
            <button
              onClick={() => setActiveTab('script')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'script'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              📋 复制脚本
            </button>
          </div>

          {activeTab === 'bookmark' && (
            <div className="space-y-3">
              <div className="bg-indigo-900/20 rounded-lg p-3 border border-indigo-900/30">
                <p className="text-xs text-indigo-300 mb-2">💡 使用方法</p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>🖥️ 桌面端：将下方按钮拖拽到浏览器收藏夹栏</p>
                  <p>📱 移动端：Safari 可添加到书签，微信/QQ请用"复制脚本"</p>
                  <p>🎮 使用：打开游戏 → 点击书签 → 进入 Multiplayer</p>
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
                  }}
                >
                  <span className="text-2xl">{lobby.icon}</span>
                  <span className="font-bold text-lg">{lobby.name}</span>
                </a>
              ))}
              <p className="text-center text-xs text-gray-500 mt-2">
                ↑ 拖拽上方按钮到收藏夹栏，书签名自动为 "Lobby 0/1/2"
              </p>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-3">
              <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-900/30">
                <p className="text-xs text-amber-300 mb-2">💡 使用方法</p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>1. 复制对应大厅的脚本</p>
                  <p>2. 打开游戏页面</p>
                  <p>3. 按 F12 打开开发者工具 → 切换到 Console（控制台）</p>
                  <p>4. 粘贴脚本 → 回车运行</p>
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
                    onClick={() => copyScript(lobby.id)}
                    className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      copied === lobby.id
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {copied === lobby.id ? '✓' : '复制'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel rounded-2xl p-6 mb-5">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">�</div>
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
                <p className="font-medium text-white">切换大厅</p>
                <p className="text-gray-400 text-xs">点击书签或运行脚本切换到目标大厅</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-medium text-white">开始游戏</p>
                <p className="text-gray-400 text-xs">点击 Multiplayer 进入游戏</p>
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

        <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-900/30 mb-5">
          <h3 className="font-semibold text-amber-400 text-sm mb-2 flex items-center gap-2">
            <span>📱</span> 各平台支持情况
          </h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• ✅ 桌面浏览器（Chrome/Edge/Firefox）：书签 + 脚本</li>
            <li>• ✅ 手机浏览器（Safari/Chrome）：书签 + 脚本</li>
            <li>• ⚠️ 微信/QQ内置浏览器：复制脚本到地址栏（部分支持）</li>
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
