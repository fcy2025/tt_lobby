import { useState } from 'react';

const LOBBIES = [
  { id: 0, name: 'Lobby 0', icon: '🟢', host: 'territorial.io', desc: '备用大厅', color: 'from-green-500 to-emerald-600' },
  { id: 1, name: 'Lobby 1', icon: '🔴', host: '1.territorial.io', desc: '默认主大厅', color: 'from-red-500 to-rose-600' },
  { id: 2, name: 'Lobby 2', icon: '🟡', host: '2.territorial.io', desc: '备选大厅', color: 'from-yellow-500 to-amber-600' },
];

function App() {
  const [copied, setCopied] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'url' | 'bookmark' | 'script'>('url');

  const getScript = (lobbyId: number) => {
    const host = LOBBIES[lobbyId].host;
    return `(function(){
      var h='${host}';
      var id='${lobbyId}';
      localStorage.setItem('tt_lobby_host',h);
      localStorage.setItem('tt_lobby_id',id);
      var u=location.href;
      var isGame=u.includes('territorial.io')||u.includes('fxclient.github.io/FXclient');
      if(isGame){
        location.reload();
      }else{
        var c=confirm('切换到 Lobby ${lobbyId}\\n\\n选择进入的游戏：\\n确定 = 官方版 territorial.io\\n取消 = FXclient 版');
        if(c){
          location.href='https://territorial.io/';
        }else{
          location.href='https://fxclient.github.io/FXclient/';
        }
      }
    })();`.replace(/\n\s*/g, '');
  };

  const getBootScript = () => {
    return `(function(){
      var h=localStorage.getItem('tt_lobby_host');
      var u=new URL(location.href);
      var q=u.searchParams.get('tt_lobby');
      if(q){
        var ids=[0,1,2];
        var idx=ids.indexOf(parseInt(q));
        if(idx>=0){h=['territorial.io','1.territorial.io','2.territorial.io'][idx];localStorage.setItem('tt_lobby_host',h);localStorage.setItem('tt_lobby_id',q)}
      }
      if(h){
        var O=window.WebSocket;
        window.WebSocket=function(u,p){
          var M=u;
          if(u&&typeof u==='string'){
            try{
              var U=new URL(u);
              var hn=U.hostname;
              if(hn.includes('territorial.io')||hn.includes('fxclient.github.io')){
                U.hostname=h;
                M=U.toString();
              }
            }catch(e){}
          }
          return p?new O(M,p):new O(M);
        };
        window.WebSocket.prototype=O.prototype;
        var id=localStorage.getItem('tt_lobby_id');
        console.log('TT Lobby: 已切换到 Lobby '+id+' ('+h+')');
      }
      localStorage.removeItem('tt_lobby_host');
      localStorage.removeItem('tt_lobby_id');
    })();`.replace(/\n\s*/g, '');
  };

  const getBookmarkUrl = (lobbyId: number) => {
    return `javascript:${encodeURIComponent(getScript(lobbyId))}`;
  };

  const getGameUrl = (lobbyId: number, type: 'official' | 'fxclient') => {
    const base = type === 'official' ? 'https://territorial.io/' : 'https://fxclient.github.io/FXclient/';
    return `${base}?tt_lobby=${lobbyId}`;
  };

  const copyScript = async (lobbyId: number) => {
    await navigator.clipboard.writeText(getScript(lobbyId));
    setCopied(lobbyId);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyBootScript = async () => {
    await navigator.clipboard.writeText(getBootScript());
    setCopied(-1);
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
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'url'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              🔗 链接直达
            </button>
            <button
              onClick={() => setActiveTab('bookmark')}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'bookmark'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              📌 书签
            </button>
            <button
              onClick={() => setActiveTab('script')}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'script'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              📋 脚本
            </button>
          </div>

          {activeTab === 'url' && (
            <div className="space-y-3">
              <div className="bg-indigo-900/20 rounded-lg p-3 border border-indigo-900/30">
                <p className="text-xs text-indigo-300 mb-1">💡 使用方法</p>
                <p className="text-xs text-gray-400">点击下方按钮直接进入对应大厅，或复制链接分享给好友</p>
              </div>
              {LOBBIES.map((lobby) => (
                <div key={lobby.id} className={`rounded-xl bg-gradient-to-r ${lobby.color} overflow-hidden`}>
                  <div className="flex items-center gap-3 p-3">
                    <span className="text-2xl">{lobby.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{lobby.name}</p>
                    </div>
                  </div>
                  <div className="bg-black/20 px-3 py-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => window.open(getGameUrl(lobby.id, 'official'), '_blank')}
                      className="py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-all"
                    >
                      官方版
                    </button>
                    <button
                      onClick={() => window.open(getGameUrl(lobby.id, 'fxclient'), '_blank')}
                      className="py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-all"
                    >
                      FXclient
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'bookmark' && (
            <div className="space-y-3">
              <div className="bg-indigo-900/20 rounded-lg p-3 border border-indigo-900/30">
                <p className="text-xs text-indigo-300 mb-2">💡 添加书签</p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>🖥️ 桌面端：拖拽下方按钮到收藏夹栏</p>
                  <p>📱 移动端：请使用"链接直达"或"脚本"方式</p>
                </div>
              </div>
              {LOBBIES.map((lobby) => (
                <a
                  key={lobby.id}
                  href={getBookmarkUrl(lobby.id)}
                  draggable={true}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r ${lobby.color} hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-grab active:cursor-grabbing`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert('请将此按钮拖拽到浏览器收藏夹栏');
                  }}
                >
                  <span className="text-2xl">{lobby.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{lobby.name}</p>
                  </div>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-md">拖拽</span>
                </a>
              ))}
            </div>
          )}

          {activeTab === 'script' && (
            <div className="space-y-3">
              <div className="bg-amber-900/20 rounded-lg p-3 border border-amber-900/30">
                <p className="text-xs text-amber-300 mb-1">💡 使用方法</p>
                <p className="text-xs text-gray-400">复制脚本 → 打开游戏 → 按 F12 打开控制台 → 粘贴回车</p>
              </div>
              {LOBBIES.map((lobby) => (
                <div key={lobby.id} className="flex items-center gap-2">
                  <div className={`flex-1 flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r ${lobby.color}`}>
                    <span className="text-xl">{lobby.icon}</span>
                    <div>
                      <p className="font-bold text-sm">{lobby.name}</p>
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
            <div className="text-3xl mb-2">🛡️</div>
            <h2 className="text-xl font-bold mb-1">自动应用脚本</h2>
            <p className="text-gray-400 text-xs">添加到书签，每次打开游戏自动应用大厅设置</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-400">每次进入游戏前点击此书签，自动应用上次选择的大厅设置</p>
          </div>
          <div className="flex gap-2">
            <a
              href={`javascript:${encodeURIComponent(getBootScript())}`}
              draggable={true}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-transform text-center font-bold text-sm cursor-grab active:cursor-grabbing"
              onClick={(e) => {
                e.preventDefault();
                alert('请将此按钮拖拽到浏览器收藏夹栏');
              }}
            >
              📌 TT Lobby
            </a>
            <button
              onClick={copyBootScript}
              className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                copied === -1
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              {copied === -1 ? '✓' : '复制'}
            </button>
          </div>
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
                <p className="font-medium text-white">选择大厅</p>
                <p className="text-gray-400 text-xs">选择目标大厅和游戏版本</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-medium text-white">进入游戏</p>
                <p className="text-gray-400 text-xs">点击按钮直接进入对应大厅</p>
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

        <footer className="text-center text-gray-500 text-xs">
          <p>TT Lobby Manager • Territorial.io 大厅管理工具</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
