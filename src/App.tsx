function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-60 -right-60 w-120 h-120 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-60 -left-60 w-120 h-120 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="text-8xl mb-6">🏰</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
            TT Lobby Manager
          </h1>
          <p className="text-gray-400 text-lg">Territorial.io 大厅切换工具</p>
        </div>



        <div className="glass-panel rounded-2xl p-8 mb-6">
          <div className="text-center">
            <div className="text-5xl mb-4">🔌</div>
            <h2 className="text-2xl font-bold mb-2">推荐：安装浏览器扩展</h2>
            <p className="text-gray-400 mb-6">安装后访问游戏自动生效，一键切换大厅</p>
            
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
              <pre className="text-xs text-gray-400 whitespace-pre-wrap">
1. 下载扩展压缩包
2. 解压扩展压缩包到任意文件夹
3. 打开 Edge → 扩展 → 管理扩展
4. 开启"开发人员模式"
5. 点击"加载已解压的扩展"
6. 选择解压后的扩展文件夹
7. 访问 territorial.io 即可使用
              </pre>
            </div>

            <button
              onClick={() => window.open('/tt_lobby/extension.zip', '_blank')}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>⬇️</span>
              <span>下载扩展压缩包</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-panel rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🟢</div>
            <p className="font-bold">Lobby 0</p>
            <p className="text-xs text-gray-400">备用大厅</p>
          </div>
          <div className="glass-panel rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔴</div>
            <p className="font-bold">Lobby 1</p>
            <p className="text-xs text-gray-400">默认主大厅</p>
          </div>
          <div className="glass-panel rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🟡</div>
            <p className="font-bold">Lobby 2</p>
            <p className="text-xs text-gray-400">备选大厅</p>
          </div>
        </div>

        <div className="bg-green-900/20 rounded-xl p-4 border border-green-900/30">
          <h3 className="font-semibold text-green-400 text-sm mb-2 flex items-center gap-2">
            <span>✅</span> 安全提示
          </h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• 使用浏览器扩展方案不会触发账号封禁</li>
            <li>• 扩展直接在官方页面运行，Origin 头正确</li>
            <li>• 无需安装任何额外软件</li>
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