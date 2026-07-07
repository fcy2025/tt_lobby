(function() {
  const servers = ['territorial.io', '1.territorial.io', '2.territorial.io'];
  let currentLobby = 1;

  const storageHost = localStorage.getItem('tt_lobby_host');
  const storageId = localStorage.getItem('tt_lobby_id');
  if (storageHost && storageId) {
    currentLobby = parseInt(storageId);
    console.log('[TT Lobby] Lobby from localStorage:', currentLobby);
  }

  const originalWebSocket = window.WebSocket;
  let redirected = false;
  let activeCount = 0;
  window.WebSocket = function(url, protocols) {
    let targetUrl = url;
    if (!redirected) {
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.hostname.includes('territorial.io')) {
          parsedUrl.hostname = servers[currentLobby];
          targetUrl = parsedUrl.toString();
          redirected = true;
          console.log('[TT Lobby] WebSocket redirected to:', targetUrl);
        }
      } catch(e) {}
    }
    const ws = new originalWebSocket(targetUrl, protocols);
    activeCount++;
    ws.addEventListener('close', () => {
      activeCount--;
      if (activeCount <= 0) {
        redirected = false;
        activeCount = 0;
      }
    });
    return ws;
  };
  window.WebSocket.prototype = originalWebSocket.prototype;
  window.WebSocket.toString = function() { return originalWebSocket.toString(); };

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'TT_LOBBY_SWITCH') {
      currentLobby = event.data.lobbyId;
      localStorage.setItem('tt_lobby_host', servers[currentLobby]);
      localStorage.setItem('tt_lobby_id', currentLobby.toString());
      console.log('[TT Lobby] Lobby switched to:', currentLobby);
      location.reload();
    }
  });

  window.ttLobbyId = currentLobby;
  localStorage.removeItem('tt_lobby_host');
  localStorage.removeItem('tt_lobby_id');
  console.log('[TT Lobby] Script loaded successfully! Current: Lobby', currentLobby);
})();