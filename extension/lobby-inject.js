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
  const activeConns = [];
  window.WebSocket = function(url, protocols) {
    let targetUrl = url;
    let isTT = false;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes('territorial.io') && parsedUrl.pathname === '/s52/') {
        isTT = true;
        parsedUrl.hostname = servers[currentLobby];
        targetUrl = parsedUrl.toString();
        console.log('[TT Lobby] WebSocket redirected to:', targetUrl);
      }
    } catch(e) {}
    const ws = new originalWebSocket(targetUrl, protocols);
    if (isTT) {
      activeConns.push(ws);
      ws.addEventListener('close', () => {
        const idx = activeConns.indexOf(ws);
        if (idx >= 0) activeConns.splice(idx, 1);
      });
    }
    return ws;
  };
  window.WebSocket.prototype = originalWebSocket.prototype;
  window.WebSocket.prototype.constructor = window.WebSocket;
  window.WebSocket.toString = function() { return originalWebSocket.toString(); };
  window.WebSocket.OPEN = originalWebSocket.OPEN;
  window.WebSocket.CLOSED = originalWebSocket.CLOSED;
  window.WebSocket.CLOSING = originalWebSocket.CLOSING;
  window.WebSocket.CONNECTING = originalWebSocket.CONNECTING;

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'TT_LOBBY_SWITCH') {
      currentLobby = event.data.lobbyId;
      localStorage.setItem('tt_lobby_host', servers[currentLobby]);
      localStorage.setItem('tt_lobby_id', currentLobby.toString());
      console.log('[TT Lobby] Lobby switched to:', currentLobby);
      for (let i = activeConns.length - 1; i >= 0; i--) {
        try { activeConns[i].close(); } catch(e) {}
      }
      activeConns.length = 0;
    }
  });

  window.ttLobbyId = currentLobby;
  localStorage.removeItem('tt_lobby_host');
  localStorage.removeItem('tt_lobby_id');
  console.log('[TT Lobby] Script loaded successfully! Current: Lobby', currentLobby);
})();