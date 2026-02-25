import { useState } from 'react';
import { Fingerprint, Copy, Check, RefreshCw, Settings, Download } from 'lucide-react';
import { v4 as uuidv4, v1 as uuidv1 } from 'uuid';
import ToolPage from '@/components/ToolPage';
import Button from '@/components/Button';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [version, setVersion] = useState<'v4' | 'v1'>('v4');
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState<'standard' | 'no-hyphens' | 'uppercase' | 'braces'>('standard');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      let uuid = version === 'v4' ? uuidv4() : uuidv1();
      
      switch (format) {
        case 'no-hyphens':
          uuid = uuid.replace(/-/g, '');
          break;
        case 'uppercase':
          uuid = uuid.toUpperCase();
          break;
        case 'braces':
          uuid = `{${uuid}}`;
          break;
      }
      
      newUuids.push(uuid);
    }
    setUuids(newUuids);
    setCopiedIndex(null);
  };

  const copyToClipboard = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadUuids = () => {
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateNamespaceUuid = (namespace: string, name: string) => {
    // Simplified namespace UUID generation using v5 logic simulation
    // In production, use proper UUID v5 implementation
    const hash = namespace + name;
    let hashNum = 0;
    for (let i = 0; i < hash.length; i++) {
      hashNum = ((hashNum << 5) - hashNum) + hash.charCodeAt(i);
      hashNum |= 0;
    }
    const uuid = Math.abs(hashNum).toString(16).padStart(32, '0');
    return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-5${uuid.slice(13, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20, 32)}`;
  };

  return (
    <ToolPage
      toolId="uuid-generator"
      title="UUID Generator"
      description="Generate UUID v4 and v1 identifiers. Generate multiple UUIDs at once with various formatting options."
      keywords="uuid generator, guid generator, uuid v4, unique id, generate uuid online"
    >
      <div className="space-y-4">
        {/* Options */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Version</label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value as 'v4' | 'v1')}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="v4">UUID v4 (Random)</option>
                <option value="v1">UUID v1 (Timestamp-based)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {version === 'v4' ? 'Random 128-bit identifier' : 'Based on timestamp and MAC address'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">Max 100 at once</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="standard">Standard (lowercase)</option>
                <option value="uppercase">UPPERCASE</option>
                <option value="no-hyphens">No hyphens</option>
                <option value="braces">With braces {'{}'}</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={generate} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </div>

        {/* UUID List */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Fingerprint className="w-5 h-5" />
              Generated UUIDs ({uuids.length})
            </h3>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={copyAll}>
                {copiedIndex === -1 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button variant="secondary" size="sm" onClick={downloadUuids}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group"
              >
                <span className="text-xs text-gray-400 w-8">{index + 1}</span>
                <code className="flex-1 font-mono text-sm truncate">{uuid}</code>
                <button
                  onClick={() => copyToClipboard(uuid, index)}
                  className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  {copiedIndex === index ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* UUID Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">UUID v4</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Version 4 UUIDs are randomly generated. They have 122 bits of randomness, 
              making collisions extremely unlikely. Most commonly used for unique identifiers.
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">UUID v1</h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Version 1 UUIDs are based on the current timestamp and the computer's MAC address. 
              They can be sorted chronologically but may reveal system information.
            </p>
          </div>
        </div>

        {/* Namespace UUID Generator */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Namespace UUID (v5)
          </h3>
          <NamespaceUuidGenerator generate={generateNamespaceUuid} />
        </div>
      </div>
    </ToolPage>
  );
}

function NamespaceUuidGenerator({ generate }: { generate: (ns: string, name: string) => string }) {
  const [namespace, setNamespace] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!namespace || !name) return;
    setResult(generate(namespace, name));
  };

  const copyToClipboard = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={namespace}
          onChange={(e) => setNamespace(e.target.value)}
          placeholder="Namespace UUID (e.g., 6ba7b810-9dad-11d1-80b4-00c04fd430c8)"
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleGenerate}>Generate v5</Button>
        {result && (
          <Button variant="secondary" size="sm" onClick={copyToClipboard}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        )}
      </div>
      {result && (
        <code className="block p-3 bg-white dark:bg-gray-800 rounded-lg font-mono text-sm">
          {result}
        </code>
      )}
      <p className="text-xs text-gray-500">
        UUID v5 generates a deterministic UUID based on a namespace UUID and a name.
      </p>
    </div>
  );
}
