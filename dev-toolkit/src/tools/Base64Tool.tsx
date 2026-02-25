import { useState } from 'react';
import { ArrowRightLeft, Copy, Check, Upload, Download, FileText } from 'lucide-react';
import ToolPage from '@/components/ToolPage';
import CodeEditor from '@/components/CodeEditor';
import Button from '@/components/Button';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isUrlSafe, setIsUrlSafe] = useState(false);

  const process = () => {
    if (!input) {
      setOutput('');
      setError('');
      return;
    }

    try {
      if (mode === 'encode') {
        let encoded = btoa(unescape(encodeURIComponent(input)));
        if (isUrlSafe) {
          encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        }
        setOutput(encoded);
      } else {
        let toDecode = input;
        if (isUrlSafe) {
          toDecode = toDecode.replace(/-/g, '+').replace(/_/g, '/');
          // Add padding
          while (toDecode.length % 4) {
            toDecode += '=';
          }
        }
        const decoded = decodeURIComponent(escape(atob(toDecode)));
        setOutput(decoded);
      }
      setError('');
    } catch (err) {
      setError((err as Error).message || 'Invalid input');
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // Extract base64 data after the comma
      const base64 = result.split(',')[1];
      setInput(base64);
      setMode('decode');
    };
    reader.readAsDataURL(file);
  };

  const downloadOutput = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64-${mode === 'encode' ? 'encoded' : 'decoded'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPage
      toolId="base64"
      title="Base64 Encoder/Decoder"
      description="Encode and decode Base64 strings and files. Supports standard and URL-safe Base64 encoding."
      keywords="base64 decode, base64 encode, base64 converter, base64 online, url safe base64"
    >
      <div className="space-y-4">
        {/* Mode Selection */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-2">Mode</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
              <button
                onClick={() => setMode('encode')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  mode === 'encode'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  mode === 'decode'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Decode
              </button>
            </div>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-2">Options</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrlSafe}
                onChange={(e) => setIsUrlSafe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">URL-safe Base64</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={process}>
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </Button>
          <label className="cursor-pointer">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </span>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Editors */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                {mode === 'encode' ? 'Plain Text' : 'Base64'}
              </label>
            </div>
            <CodeEditor
              value={input}
              onChange={setInput}
              height="400px"
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                {mode === 'encode' ? 'Base64' : 'Plain Text'}
              </label>
              <div className="flex gap-1">
                {output && (
                  <>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={downloadOutput}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <CodeEditor
              value={output}
              height="400px"
              readOnly
              placeholder={`${mode === 'encode' ? 'Encoded' : 'Decoded'} result will appear here...`}
            />
          </div>
        </div>

        {/* URL Encoder Section */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            URL Encoder/Decoder
          </h3>
          <UrlEncoder />
        </div>
      </div>
    </ToolPage>
  );
}

function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [urlMode, setUrlMode] = useState<'encode' | 'decode'>('encode');

  const processUrl = () => {
    if (!input) {
      setOutput('');
      return;
    }
    try {
      if (urlMode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (err) {
      setOutput('Error: Invalid input');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => setUrlMode('encode')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            urlMode === 'encode'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
          }`}
        >
          Encode URL
        </button>
        <button
          onClick={() => setUrlMode('decode')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            urlMode === 'decode'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
          }`}
        >
          Decode URL
        </button>
        <Button size="sm" onClick={processUrl}>
          Process
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text..."
          className="w-full h-24 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <textarea
          value={output}
          readOnly
          placeholder="Result..."
          className="w-full h-24 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm resize-none"
        />
      </div>
    </div>
  );
}
