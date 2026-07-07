export type ClientType = 'official' | 'fxclient';

export interface Lobby {
  id: number;
  name: string;
  description: string;
  icon: string;
  available: boolean;
  playerCount?: number;
  serverLoad?: number;
  serverHost: string;
}

export interface ClientConfig {
  type: ClientType;
  name: string;
  baseUrl: string;
  description: string;
  icon: string;
}

export interface ServerStatus {
  lobbyId: number;
  status: 'online' | 'offline' | 'unknown';
  playerCount: number;
  latency: number;
}

export const LOBBIES: Lobby[] = [
  { id: 0, name: 'Lobby 0', description: '备用大厅，通常玩家较少', icon: '🟢', available: true, serverHost: 'territorial.io' },
  { id: 1, name: 'Lobby 1', description: '默认主大厅，玩家最多', icon: '🔴', available: true, serverHost: '1.territorial.io' },
  { id: 2, name: 'Lobby 2', description: '备选大厅，分流负载', icon: '🟡', available: true, serverHost: '2.territorial.io' },
];

export const CLIENTS: ClientConfig[] = [
  {
    type: 'official',
    name: '官方客户端',
    baseUrl: 'https://territorial.io',
    description: 'Territorial.io 官方游戏客户端',
    icon: '🏠',
  },
  {
    type: 'fxclient',
    name: 'FX Client',
    baseUrl: 'https://fxclient.github.io/FXclient',
    description: '第三方增强客户端，提供更好的用户体验',
    icon: '✨',
  },
];