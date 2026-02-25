import { useState, useCallback } from 'react';
import { ArrowRightLeft, Copy, Check, FileJson, FileCode, FileType } from 'lucide-react';
import yaml from 'js-yaml';
import { xml2js, js2xml } from 'xml-js';
import ToolPage from '@/components/ToolPage';
import CodeEditor from '@/components/CodeEditor';
import Button from '@/components/Button';

type Format = 'json' | 'xml' | 'yaml';

export default function JsonXmlYaml() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sourceFormat, setSourceFormat] = useState<Format>('json');
  const [targetFormat, setTargetFormat] = useState<Format>('yaml');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatLabels: Record<Format, { label: string; icon: React.ReactNode }> = {
    json: { label: 'JSON', icon: <FileJson className="w-4 h-4" /> },
    xml: { label: 'XML', icon: <FileCode className="w-4 h-4" /> },
    yaml: { label: 'YAML', icon: <FileType className="w-4 h-4" /> },
  };

  const detectFormat = (text: string): Format => {
    const trimmed = text.trim();
    if (trimmed.startsWith('<')) return 'xml';
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
    return 'yaml';
  };

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      setError('');
      let result = '';

      // Parse input based on source format
      let parsed: unknown;
      switch (sourceFormat) {
        case 'json':
          parsed = JSON.parse(input);
          break;
        case 'xml':
          parsed = xml2js(input, { compact: true });
          break;
        case 'yaml':
          parsed = yaml.load(input);
          break;
      }

      // Convert to target format
      switch (targetFormat) {
        case 'json':
          result = JSON.stringify(parsed, null, 2);
          break;
        case 'xml':
          result = js2xml(parsed as object, { 
            compact: true, 
            spaces: 2,
            fullTagEmptyElement: true 
          });
          break;
        case 'yaml':
          result = yaml.dump(parsed, { indent: 2 });
          break;
      }

      setOutput(result);
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  }, [input, sourceFormat, targetFormat]);

  const formatInput = () => {
    if (!input.trim()) return;

    try {
      setError('');
      let formatted = '';

      switch (sourceFormat) {
        case 'json':
          formatted = JSON.stringify(JSON.parse(input), null, 2);
          break;
        case 'xml': {
          const parsed = xml2js(input, { compact: true });
          formatted = js2xml(parsed, { compact: true, spaces: 2, fullTagEmptyElement: true });
          break;
        }
        case 'yaml': {
          const parsed = yaml.load(input);
          formatted = yaml.dump(parsed, { indent: 2 });
          break;
        }
      }

      setInput(formatted);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const swapFormats = () => {
    setSourceFormat(targetFormat);
    setTargetFormat(sourceFormat);
    setInput(output);
    setOutput(input);
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguage = (format: Format): string => {
    switch (format) {
      case 'json': return 'json';
      case 'xml': return 'xml';
      case 'yaml': return 'yaml';
      default: return 'text';
    }
  };

  return (
    <ToolPage
      toolId="json-xml-yaml"
      title="JSON/XML/YAML Converter"
      description="Convert between JSON, XML, and YAML formats with validation and formatting. All conversions happen locally in your browser."
      keywords="json formatter, xml converter, yaml parser, json to xml, xml to json, json to yaml, yaml to json"
    >
      <div className="space-y-4">
        {/* Format Selection */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-2">From</label>
            <select
              value={sourceFormat}
              onChange={(e) => setSourceFormat(e.target.value as Format)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.entries(formatLabels).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={swapFormats}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Swap formats"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-2">To</label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value as Format)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.entries(formatLabels).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={convert}>
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Convert
          </Button>
          <Button variant="secondary" onClick={formatInput}>
            Format Input
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Editors */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Input ({formatLabels[sourceFormat].label})</label>
            </div>
            <CodeEditor
              value={input}
              onChange={setInput}
              language={getLanguage(sourceFormat)}
              height="400px"
              placeholder={`Paste your ${formatLabels[sourceFormat].label} here...`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Output ({formatLabels[targetFormat].label})</label>
              {output && (
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              )}
            </div>
            <CodeEditor
              value={output}
              language={getLanguage(targetFormat)}
              height="400px"
              readOnly
              placeholder={`Converted ${formatLabels[targetFormat].label} will appear here...`}
            />
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
