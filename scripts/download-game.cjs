const https = require('https');
const fs = require('fs');
const path = require('path');

const SERVERS = ['territorial.io', '1.territorial.io', '2.territorial.io'];

const INJECT_SCRIPT = `
<script>
(function() {
  const params = new URLSearchParams(window.location.search);
  const lobbyId = parseInt(params.get('lobby')) || 1;
  const servers = ${JSON.stringify(SERVERS)};
  
  console.log('[TT Lobby] Auto-injected for Lobby', lobbyId);
  
  const originalWebSocket = window.WebSocket;
  window.WebSocket = function(url, protocols) {
    let targetUrl = url;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes('territorial.io')) {
        parsedUrl.hostname = servers[lobbyId];
        targetUrl = parsedUrl.toString();
        console.log('[TT Lobby] WebSocket redirected to:', targetUrl);
      }
    } catch(e) {}
    return new originalWebSocket(targetUrl, protocols);
  };
  
  window.ttLobbyId = lobbyId;
})();
</script>
`;

function downloadHTML(url, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const injectedHTML = data.replace('</head>', INJECT_SCRIPT + '</head>');
        fs.writeFileSync(outputPath, injectedHTML, 'utf-8');
        console.log(`✓ Downloaded and injected: ${outputPath}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error('✗ Download failed:', err.message);
      reject(err);
    });
  });
}

async function main() {
  const distDir = path.join(__dirname, '../dist');
  
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  console.log('📥 Downloading territorial.io HTML...');
  
  try {
    await downloadHTML('https://territorial.io', path.join(distDir, 'game.html'));
    console.log('✅ All done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

main();