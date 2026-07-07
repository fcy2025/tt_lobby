(function() {
  const servers = ['territorial.io', '1.territorial.io', '2.territorial.io'];
  let currentLobby = 1;

  const originalWebSocket = window.WebSocket;
  window.WebSocket = function(url, protocols) {
    let targetUrl = url;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes('territorial.io')) {
        parsedUrl.hostname = servers[currentLobby];
        targetUrl = parsedUrl.toString();
        console.log('[TT Lobby] WebSocket redirected to:', targetUrl);
      }
    } catch(e) {}
    return new originalWebSocket(targetUrl, protocols);
  };

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'TT_LOBBY_SWITCH') {
      currentLobby = event.data.lobbyId;
      console.log('[TT Lobby] Lobby switched to:', currentLobby);
      alert('✓ 已切换到 Lobby ' + currentLobby + '！请点击 Multiplayer 进入游戏');
    }
  });

  window.ttLobbyId = currentLobby;
  console.log('[TT Lobby] Script loaded successfully!');
})();