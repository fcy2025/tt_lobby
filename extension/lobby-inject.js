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
  window.WebSocket = function(url, protocols) {
    let targetUrl = url;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === 'territorial.io') {
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