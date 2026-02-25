import { useState } from 'react';
import { Send, Plus, Trash2, Clock, Copy, Check, AlertCircle } from 'lucide-react';
import ToolPage from '@/components/ToolPage';
import CodeEditor from '@/components/CodeEditor';
import Button from '@/components/Button';
import type { ApiRequest, ApiResponse } from '@/types';

export default function ApiTester() {
  const [request, setRequest] = useState<ApiRequest>({
    method: 'GET',
    url: '',
    headers: { 'Content-Type': 'application/json' },
    body: ''
  });
  
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'headers' | 'body'>('headers');

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  const sendRequest = async () => {
    if (!request.url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    const startTime = performance.now();

    try {
      const fetchOptions: RequestInit = {
        method: request.method,
        headers: request.headers,
      };

      if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.body) {
        fetchOptions.body = request.body;
      }

      const res = await fetch(request.url, fetchOptions);
      const endTime = performance.now();

      const headers: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        headers[key] = value;
      });

      let body = '';
      const contentType = res.headers.get('content-type');
      
      try {
        if (contentType?.includes('application/json')) {
          const json = await res.json();
          body = JSON.stringify(json, null, 2);
        } else {
          body = await res.text();
        }
      } catch {
        body = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers,
        body,
        time: Math.round(endTime - startTime)
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateHeader = (key: string, value: string, oldKey?: string) => {
    const newHeaders = { ...request.headers };
    if (oldKey && oldKey !== key) {
      delete newHeaders[oldKey];
    }
    if (key) {
      newHeaders[key] = value;
    }
    setRequest({ ...request, headers: newHeaders });
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...request.headers };
    delete newHeaders[key];
    setRequest({ ...request, headers: newHeaders });
  };

  const copyResponse = async () => {
    if (!response?.body) return;
    await navigator.clipboard.writeText(response.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: number) => {
    if (status < 300) return 'text-green-600 dark:text-green-400';
    if (status < 400) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const sampleRequests = [
    { name: 'JSONPlaceholder GET', method: 'GET' as const, url: 'https://jsonplaceholder.typicode.com/posts/1', body: '' },
    { name: 'JSONPlaceholder POST', method: 'POST' as const, url: 'https://jsonplaceholder.typicode.com/posts', body: JSON.stringify({ title: 'foo', body: 'bar', userId: 1 }) },
    { name: 'HTTPBin GET', method: 'GET' as const, url: 'https://httpbin.org/get', body: '' },
    { name: 'HTTPBin POST', method: 'POST' as const, url: 'https://httpbin.org/post', body: JSON.stringify({ test: 'data' }) },
  ];

  return (
    <ToolPage
      toolId="api-tester"
      title="API Tester"
      description="Test HTTP APIs with a lightweight Postman alternative. Send GET, POST, PUT, DELETE requests and view responses."
      keywords="api tester, rest api client, http client, postman alternative, api testing tool"
    >
      <div className="space-y-4">
        {/* URL Bar */}
        <div className="flex flex-col sm:flex-row gap-2 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <select
            value={request.method}
            onChange={(e) => setRequest({ ...request, method: e.target.value as any })}
            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {methods.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="text"
            value={request.url}
            onChange={(e) => setRequest({ ...request, url: e.target.value })}
            placeholder="https://api.example.com/endpoint"
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <Button onClick={sendRequest} isLoading={loading}>
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>

        {/* Request Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('headers')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'headers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Headers
          </button>
          <button
            onClick={() => setActiveTab('body')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'body'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Body
          </button>
        </div>

        {/* Request Content */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            {activeTab === 'headers' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Request Headers</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => updateHeader('', '', undefined)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {Object.entries(request.headers).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => updateHeader(e.target.value, value, key)}
                      placeholder="Header name"
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateHeader(key, e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={() => removeHeader(key)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'body' && ['POST', 'PUT', 'PATCH'].includes(request.method) && (
              <div>
                <label className="block text-sm font-medium mb-2">Request Body</label>
                <CodeEditor
                  value={request.body}
                  onChange={(v) => setRequest({ ...request, body: v })}
                  language="json"
                  height="300px"
                  placeholder="{}"
                />
              </div>
            )}

            {activeTab === 'body' && !['POST', 'PUT', 'PATCH'].includes(request.method) && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-500 text-center">
                Body not available for {request.method} requests
              </div>
            )}
          </div>

          {/* Response */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Response</label>
              {response && (
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold ${getStatusColor(response.status)}`}>
                    {response.status} {response.statusText}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {response.time}ms
                  </span>
                  {response.body && (
                    <Button variant="ghost" size="sm" onClick={copyResponse}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {response && (
              <div className="space-y-4">
                {/* Response Headers */}
                <details className="text-sm">
                  <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                    Response Headers ({Object.keys(response.headers).length})
                  </summary>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="font-medium">{key}:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </details>

                {/* Response Body */}
                <CodeEditor
                  value={response.body}
                  language="json"
                  height="400px"
                  readOnly
                />
              </div>
            )}

            {!response && !error && !loading && (
              <div className="h-96 flex items-center justify-center text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg border-dashed">
                Click Send to make a request
              </div>
            )}
          </div>
        </div>

        {/* Sample Requests */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-3">Sample Requests</h3>
          <div className="flex flex-wrap gap-2">
            {sampleRequests.map((sample, index) => (
              <button
                key={index}
                onClick={() => setRequest({
                  method: sample.method,
                  url: sample.url,
                  headers: { 'Content-Type': 'application/json' },
                  body: sample.body
                })}
                className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors text-sm"
              >
                <span className="font-mono text-xs text-blue-600 dark:text-blue-400 mr-2">{sample.method}</span>
                {sample.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
