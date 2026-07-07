(function() {
  function injectStyle() {
    const style = document.createElement('style');
    style.textContent = `
      #tt-lobby-panel {
        position: fixed; top: 20px; right: 20px; z-index: 99999;
        background: rgba(15, 23, 42, 0.98); border: 1px solid rgba(99, 102, 241, 0.5);
        border-radius: 16px; padding: 16px; min-width: 200px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(12px); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      #tt-lobby-panel h3 { color: #818cf8; margin-bottom: 12px; font-size: 14px; text-align: center; }
      #tt-lobby-panel .lobby-buttons { display: flex; flex-direction: column; gap: 8px; }
      #tt-lobby-panel .lobby-btn {
        padding: 10px 14px; border: none; border-radius: 8px;
        font-size: 13px; font-weight: 600; cursor: pointer;
        transition: all 0.25s; display: flex; align-items: center; gap: 10px;
      }
      #tt-lobby-panel .lobby-btn-0 { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; }
      #tt-lobby-panel .lobby-btn-0:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4); }
      #tt-lobby-panel .lobby-btn-1 { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
      #tt-lobby-panel .lobby-btn-1:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); }
      #tt-lobby-panel .lobby-btn-2 { background: linear-gradient(135deg, #eab308, #ca8a04); color: white; }
      #tt-lobby-panel .lobby-btn-2:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(234, 179, 8, 0.4); }
      #tt-lobby-panel .lobby-btn.active { border: 2px solid white; box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
      #tt-lobby-panel #tt-status {
        margin-top: 12px; text-align: center; font-size: 11px; color: #94a3b8;
      }
      #tt-lobby-panel #tt-status.success { color: #22c55e; }
      #tt-lobby-panel #tt-status.error { color: #ef4444; }
    `;
    document.head.appendChild(style);
  }

  function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'tt-lobby-panel';
    panel.innerHTML = `
      <h3>🎮 TT Lobby</h3>
      <div class="lobby-buttons">
        <button class="lobby-btn lobby-btn-0" data-lobby="0">🟢 Lobby 0</button>
        <button class="lobby-btn lobby-btn-1 active" data-lobby="1">🔴 Lobby 1</button>
        <button class="lobby-btn lobby-btn-2" data-lobby="2">🟡 Lobby 2</button>
      </div>
      <div id="tt-status">点击选择大厅</div>
    `;
    document.body.appendChild(panel);

    const buttons = panel.querySelectorAll('.lobby-btn');
    const statusEl = panel.querySelector('#tt-status');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const lobbyId = parseInt(btn.dataset.lobby);
        
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        window.postMessage({ type: 'TT_LOBBY_SWITCH', lobbyId }, '*');
        
        statusEl.textContent = `已切换到 Lobby ${lobbyId}`;
        statusEl.className = 'success';
        setTimeout(() => { statusEl.className = ''; }, 3000);
      });
    });
  }

  function injectScript() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('lobby-inject.js');
    script.onload = () => script.remove();
    document.documentElement.appendChild(script);
  }

  injectStyle();
  
  document.addEventListener('DOMContentLoaded', () => {
    createPanel();
    injectScript();
  });
})();