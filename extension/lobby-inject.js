(function() {
  const servers = ['territorial.io', '1.territorial.io', '2.territorial.io'];
  let currentLobby = 1;

  const urlParams = new URLSearchParams(window.location.search);
  const lobbyParam = urlParams.get('tt_lobby');
  if (lobbyParam !== null) {
    const idx = parseInt(lobbyParam);
    if (idx >= 0 && idx < servers.length) {
      currentLobby = idx;
      console.log('[TT Lobby] Lobby from URL:', currentLobby);
    }
  }

  const storageHost = localStorage.getItem('tt_lobby_host');
  const storageId = localStorage.getItem('tt_lobby_id');
  if (storageHost && storageId) {
    currentLobby = parseInt(storageId);
    console.log('[TT Lobby] Lobby from localStorage:', currentLobby);
  }

  const originalWebSocket = window.WebSocket;
  window.WebSocket = function(url, protocols) {
    let targetUrl = url;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes('territorial.io') || parsedUrl.hostname.includes('fxclient.github.io')) {
        parsedUrl.hostname = servers[currentLobby];
        targetUrl = parsedUrl.toString();
        console.log('[TT Lobby] WebSocket redirected to:', targetUrl);
      }
    } catch(e) {}
    return new originalWebSocket(targetUrl, protocols);
  };
  window.WebSocket.prototype = originalWebSocket.prototype;

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'TT_LOBBY_SWITCH') {
      currentLobby = event.data.lobbyId;
      console.log('[TT Lobby] Lobby switched to:', currentLobby);
      alert('✓ 已切换到 Lobby ' + currentLobby + '！请点击 Multiplayer 进入游戏');
    }
  });

  window.ttLobbyId = currentLobby;
  localStorage.removeItem('tt_lobby_host');
  localStorage.removeItem('tt_lobby_id');
  console.log('[TT Lobby] Script loaded successfully! Current: Lobby', currentLobby);
})();