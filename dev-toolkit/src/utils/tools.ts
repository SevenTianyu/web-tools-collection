import type { Tool } from '@/types';

export const tools: Tool[] = [
  {
    id: 'json-xml-yaml',
    name: 'JSON/XML/YAML Converter',
    description: 'Convert between JSON, XML, and YAML formats with validation and formatting',
    icon: 'FileJson',
    category: 'Data Format',
    keywords: ['json formatter', 'xml converter', 'yaml parser', 'json to xml', 'xml to json'],
    path: '/tools/json-xml-yaml'
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions with real-time match highlighting',
    icon: 'Search',
    category: 'Development',
    keywords: ['regex tester', 'regular expression', 'regex debugger', 'pattern matching'],
    path: '/tools/regex-tester'
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings and files',
    icon: 'Code',
    category: 'Encoding',
    keywords: ['base64 decode', 'base64 encode', 'base64 converter', 'base64 online'],
    path: '/tools/base64'
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries with syntax highlighting',
    icon: 'Database',
    category: 'Database',
    keywords: ['sql formatter', 'sql beautifier', 'sql pretty print', 'format sql'],
    path: '/tools/sql-formatter'
  },
  {
    id: 'css-js-minifier',
    name: 'CSS/JS Minifier',
    description: 'Minify and beautify CSS and JavaScript code',
    icon: 'Minimize2',
    category: 'Optimization',
    keywords: ['css minifier', 'js minifier', 'javascript beautifier', 'code minify'],
    path: '/tools/css-js-minifier'
  },
  {
    id: 'git-commands',
    name: 'Git Command Generator',
    description: 'Generate Git commands based on your operations',
    icon: 'GitBranch',
    category: 'Version Control',
    keywords: ['git commands', 'git cheat sheet', 'git generator', 'git tutorial'],
    path: '/tools/git-commands'
  },
  {
    id: 'api-tester',
    name: 'API Tester',
    description: 'Test HTTP APIs with a lightweight Postman alternative',
    icon: 'Send',
    category: 'API',
    keywords: ['api tester', 'rest api client', 'http client', 'postman alternative'],
    path: '/tools/api-tester'
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and verify JSON Web Tokens',
    icon: 'Key',
    category: 'Security',
    keywords: ['jwt decode', 'jwt verify', 'json web token', 'jwt parser'],
    path: '/tools/jwt-decoder'
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUID v4 and v1 identifiers',
    icon: 'Fingerprint',
    category: 'Generators',
    keywords: ['uuid generator', 'guid generator', 'uuid v4', 'unique id'],
    path: '/tools/uuid-generator'
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates',
    icon: 'Clock',
    category: 'Time',
    keywords: ['timestamp converter', 'unix timestamp', 'epoch converter', 'date converter'],
    path: '/tools/timestamp-converter'
  },
  {
    id: 'html-entities',
    name: 'HTML Entities',
    description: 'Encode and decode HTML entities',
    icon: 'Hash',
    category: 'Encoding',
    keywords: ['html entities', 'html encode', 'html decode', 'html escape'],
    path: '/tools/html-entities'
  },
  {
    id: 'cron-generator',
    name: 'Cron Expression Generator',
    description: 'Generate and explain cron expressions',
    icon: 'Calendar',
    category: 'Scheduling',
    keywords: ['cron generator', 'cron expression', 'crontab', 'schedule generator'],
    path: '/tools/cron-generator'
  }
];

export const categories = [...new Set(tools.map(t => t.category))];

export function getToolById(id: string): Tool | undefined {
  return tools.find(t => t.id === id);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter(t => t.category === category);
}
