import { useState } from 'react';
import { LOBBIES } from './types';

function App() {
  const [hoveredLobby, setHoveredLobby] = useState<number | null>(null);

  const openLobby = (lobbyId: number) => {
    const url = `${window.location.origin}/tt_lobby/game.html?lobby=${lobbyId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-60 -right-60 w-120 h-120 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-60 -left-60 w-120 h-120 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-lg mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="text-8xl mb-6">🏰</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
            TT Lobby Manager
          </h1>
          <p className="text-gray-400">一键进入游戏大厅</p>
        </div>

        <div className="space-y-4">
          {LOBBIES.map(lobby => (
            <button
              key={lobby.id}
              onClick={() => openLobby(lobby.id)}
              onMouseEnter={() => setHoveredLobby(lobby.id)}
              onMouseLeave={() => setHoveredLobby(null)}
              className={`w-full p-6 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-between group ${
                hoveredLobby === lobby.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 scale-[1.02]'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl group-hover:scale-110 transition-transform">{lobby.icon}</span>
                <div className="text-left">
                  <p className="text-white">{lobby.name}</p>
                  <p className="text-sm text-gray-400">{lobby.description}</p>
                </div>
              </div>
              <span className={`text-2xl transition-transform ${hoveredLobby === lobby.id ? 'translate-x-2' : ''}`}>
                →
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 glass-panel rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>✨</span> 使用说明
          </h3>
          <ol className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">1.</span>
              <span className="text-gray-300">选择目标大厅（Lobby 0/1/2）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">2.</span>
              <span className="text-gray-300">游戏会在新窗口自动加载</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">3.</span>
              <span className="text-gray-300">脚本已自动注入，点击 Multiplayer 即可</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">4.</span>
              <span className="text-gray-300">可随时点击右上角按钮切换大厅</span>
            </li>
          </ol>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <a
            href="https://territorial.io"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all text-center"
          >
            <span className="text-3xl block mb-2">🏠</span>
            <span className="text-sm font-medium">官方客户端</span>
          </a>
          <a
            href="https://fxclient.github.io/FXclient"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all text-center"
          >
            <span className="text-3xl block mb-2">✨</span>
            <span className="text-sm font-medium">FX Client</span>
          </a>
        </div>

        <div className="mt-6 bg-green-900/20 rounded-xl p-4 border border-green-900/30">
          <h3 className="font-semibold text-green-400 text-sm mb-2 flex items-center gap-2">
            <span>✅</span> 安全提示
          </h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• 使用本工具不会触发账号封禁</li>
            <li>• 无需安装任何插件或扩展</li>
            <li>• 支持所有平台和浏览器</li>
          </ul>
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>TT Lobby Manager • Territorial.io 大厅管理工具</p>
        </footer>
      </div>
    </div>
  );
}

export default App;