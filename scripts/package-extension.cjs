const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const extensionDir = path.join(__dirname, '../extension');
const distDir = path.join(__dirname, '../dist');

function createZip(files, outputPath) {
  const centralDirectory = [];
  let offset = 0;

  const localFileData = files.map(file => {
    const data = fs.readFileSync(file.path);
    const compressed = zlib.deflateSync(data);
    
    const fileName = file.name;
    const crc32 = crc32Buffer(data);
    
    const localHeader = Buffer.alloc(30 + fileName.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(0x0002, 4);
    localHeader.writeUInt16LE(0x0000, 6);
    localHeader.writeUInt16LE(0x0000, 8);
    localHeader.writeUInt16LE(0x0000, 10);
    localHeader.writeUInt16LE(8, 12);
    localHeader.writeUInt32LE(crc32, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(fileName.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localHeader.write(fileName, 30);
    
    centralDirectory.push({
      version: 0x0014,
      versionNeeded: 0x0002,
      flags: 0x0000,
      method: 8,
      modTime: 0x4E20,
      modDate: 0x5D07,
      crc32,
      compressedSize: compressed.length,
      uncompressedSize: data.length,
      fileNameLength: fileName.length,
      extraLength: 0,
      commentLength: 0,
      diskNumber: 0,
      internalAttrs: 0x0000,
      externalAttrs: 0x81A40000,
      localOffset: offset,
      fileName
    });
    
    offset += localHeader.length + compressed.length;
    
    return Buffer.concat([localHeader, compressed]);
  });

  const centralDirData = centralDirectory.map(entry => {
    const cdEntry = Buffer.alloc(46 + entry.fileName.length);
    cdEntry.writeUInt32LE(0x02014b50, 0);
    cdEntry.writeUInt16LE(entry.version, 4);
    cdEntry.writeUInt16LE(entry.versionNeeded, 6);
    cdEntry.writeUInt16LE(entry.flags, 8);
    cdEntry.writeUInt16LE(entry.method, 10);
    cdEntry.writeUInt16LE(entry.modTime, 12);
    cdEntry.writeUInt16LE(entry.modDate, 14);
    cdEntry.writeUInt32LE(entry.crc32, 16);
    cdEntry.writeUInt32LE(entry.compressedSize, 20);
    cdEntry.writeUInt32LE(entry.uncompressedSize, 24);
    cdEntry.writeUInt16LE(entry.fileNameLength, 28);
    cdEntry.writeUInt16LE(entry.extraLength, 30);
    cdEntry.writeUInt16LE(entry.commentLength, 32);
    cdEntry.writeUInt16LE(entry.diskNumber, 34);
    cdEntry.writeUInt16LE(entry.internalAttrs, 36);
    cdEntry.writeUInt32LE(entry.externalAttrs, 38);
    cdEntry.writeUInt32LE(entry.localOffset, 42);
    cdEntry.write(entry.fileName, 46);
    return cdEntry;
  });

  const cdBuffer = Buffer.concat(centralDirData);
  
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(centralDirectory.length, 8);
  eocd.writeUInt16LE(centralDirectory.length, 10);
  eocd.writeUInt32LE(cdBuffer.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  const finalBuffer = Buffer.concat([...localFileData, cdBuffer, eocd]);
  fs.writeFileSync(outputPath, finalBuffer);
}

function crc32Buffer(buf) {
  let crc = 0xFFFFFFFF;
  const table = [];
  
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function main() {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const files = [
    { path: path.join(extensionDir, 'manifest.json'), name: 'manifest.json' },
    { path: path.join(extensionDir, 'content-script.js'), name: 'content-script.js' },
    { path: path.join(extensionDir, 'content-style.css'), name: 'content-style.css' },
    { path: path.join(extensionDir, 'lobby-inject.js'), name: 'lobby-inject.js' }
  ];

  const outputPath = path.join(distDir, 'extension.zip');
  
  createZip(files, outputPath);
  console.log(`✓ Extension packaged: ${outputPath}`);
}

main();