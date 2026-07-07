import { useState, useCallback, useRef, useEffect } from 'react';
import { LOBBIES } from './types';

function App() {
  const [selectedLobby, setSelectedLobby] = useState<number | null>(null);
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectStatus, setInjectStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const injectScript = useCallback(() => {
    if (!selectedLobby || !iframeRef.current) return;
    
    setIsInjecting(true);
    setInjectStatus('idle');

    const script = `
      (function() {
        const lobbyId = ${selectedLobby};
        const servers = ['territorial.io', '1.territorial.io', '2.territorial.io'];
        
        console.log('[TT Lobby] Injecting lobby selector for Lobby', lobbyId);
        
        const originalWebSocket = window.WebSocket;
        window.WebSocket = function(url, protocols) {
          const parsedUrl = new URL(url);
          if (parsedUrl.hostname.endsWith('territorial.io')) {
            parsedUrl.hostname = servers[lobbyId];
            console.log('[TT Lobby] Redirecting WebSocket to:', parsedUrl.toString());
          }
          return new originalWebSocket(parsedUrl.toString(), protocols);
        };
        
        console.log('[TT Lobby] Script injected successfully! Lobby:', lobbyId);
        window.dispatchEvent(new CustomEvent('tt-lobby-injected', { detail: { lobbyId } }));
      })();
    `;

    try {
      const blob = new Blob([script], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      
      const injectScript = document.createElement('script');
      injectScript.src = url;
      injectScript.onload = () => {
        URL.revokeObjectURL(url);
        setIsInjecting(false);
        setInjectStatus('success');
        setTimeout(() => setInjectStatus('idle'), 3000);
      };
      injectScript.onerror = () => {
        URL.revokeObjectURL(url);
        setIsInjecting(false);
        setInjectStatus('error');
        setTimeout(() => setInjectStatus('idle'), 3000);
      };

      iframeRef.current.contentDocument?.head.appendChild(injectScript);
    } catch (error) {
      console.error('[TT Lobby] Injection failed:', error);
      setIsInjecting(false);
      setInjectStatus('error');
      setTimeout(() => setInjectStatus('idle'), 3000);
    }
  }, [selectedLobby]);

  useEffect(() => {
    if (selectedLobby) {
      const timer = setTimeout(() => {
        injectScript();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedLobby, injectScript]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-60 -right-60 w-120 h-120 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-60 -left-60 w-120 h-120 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏰</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            TT Lobby Manager
          </h1>
          <p className="text-gray-400">一键进入游戏大厅</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span>🎮</span> 选择大厅
              </h3>
              <div className="space-y-3">
                {LOBBIES.map(lobby => (
                  <button
                    key={lobby.id}
                    onClick={() => setSelectedLobby(lobby.id)}
                    className={`w-full p-4 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 ${
                      selectedLobby === lobby.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30'
                        : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700'
                    }`}
                  >
                    <span className="text-3xl">{lobby.icon}</span>
                    <div className="text-left">
                      <p className="text-white">{lobby.name}</p>
                      <p className="text-xs text-gray-400">{lobby.description}</p>
                    </div>
                    {selectedLobby === lobby.id && (
                      <span className="ml-auto text-green-400">✓</span>
                    )}
                  </button>
                ))}
              </div>

              {selectedLobby && (
                <div className="mt-4">
                  <button
                    onClick={injectScript}
                    disabled={isInjecting}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isInjecting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>注入中...</span>
                      </>
                    ) : (
                      <>
                        <span>🔄</span>
                        <span>重新注入脚本</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="glass-panel rounded-2xl p-6">
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
                  <span className="text-gray-300">等待游戏加载，脚本会自动注入</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">3.</span>
                  <span className="text-gray-300">点击游戏中的 "Multiplayer" 按钮</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">4.</span>
                  <span className="text-gray-300">自动进入所选大厅！</span>
                </li>
              </ol>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span>⚡</span> 快速访问
              </h3>
              <div className="space-y-3">
                <a
                  href="https://territorial.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🏠</span>
                    <div>
                      <p className="font-medium">官方客户端</p>
                      <p className="text-xs text-gray-400">territorial.io</p>
                    </div>
                  </div>
                </a>
                <a
                  href="https://fxclient.github.io/FXclient"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">✨</span>
                    <div>
                      <p className="font-medium">FX Client</p>
                      <p className="text-xs text-gray-400">第三方客户端</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎮</span>
                  <div>
                    <p className="font-semibold">游戏窗口</p>
                    <p className="text-xs text-gray-400">
                      {selectedLobby 
                        ? `已选择: Lobby ${selectedLobby}` 
                        : '请选择大厅'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {injectStatus === 'success' && (
                    <span className="text-green-400 text-sm flex items-center gap-1">
                      <span>✓</span> 脚本注入成功
                    </span>
                  )}
                  {injectStatus === 'error' && (
                    <span className="text-red-400 text-sm flex items-center gap-1">
                      <span>✗</span> 注入失败，请重试
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <iframe
                  ref={iframeRef}
                  src="https://territorial.io"
                  className="w-full h-[600px] border-none bg-black"
                  title="Territorial.io Game"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
                {!selectedLobby && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl block mb-4">👉</span>
                      <p className="text-xl font-bold text-gray-300">请在左侧选择大厅</p>
                      <p className="text-gray-500 mt-2">选择后游戏将自动加载并注入脚本</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-900/20 rounded-xl p-4 border border-green-900/30">
                <h3 className="font-semibold text-green-400 text-sm mb-2 flex items-center gap-2">
                  <span>✅</span> 安全提示
                </h3>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• 使用本工具不会触发账号封禁</li>
                  <li>• 保持正确的 Origin 头</li>
                  <li>• 无需安装任何插件或扩展</li>
                </ul>
              </div>
              <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-900/30">
                <h3 className="font-semibold text-blue-400 text-sm mb-2 flex items-center gap-2">
                  <span>🌍</span> 平台支持
                </h3>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Windows / macOS / Linux</li>
                  <li>• iOS / Android</li>
                  <li>• 微信 / QQ 内置浏览器</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>TT Lobby Manager • Territorial.io 大厅管理工具</p>
        </footer>
      </div>
    </div>
  );
}

export default App;