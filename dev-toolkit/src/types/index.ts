export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  keywords: string[];
  path: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  headers: Record<string, string>;
  body: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
}

export interface GitCommand {
  action: string;
  description: string;
  command: string;
}
