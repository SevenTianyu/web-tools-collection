import { useState } from 'react';
import { Hash, ArrowRightLeft, Copy, Check, Code } from 'lucide-react';
import ToolPage from '@/components/ToolPage';
import CodeEditor from '@/components/CodeEditor';
import Button from '@/components/Button';

const commonEntities = [
  { char: '&', entity: '&amp;', name: 'Ampersand' },
  { char: '<', entity: '&lt;', name: 'Less than' },
  { char: '>', entity: '&gt;', name: 'Greater than' },
  { char: '"', entity: '&quot;', name: 'Double quote' },
  { char: "'", entity: '&#x27;', name: 'Single quote' },
  { char: ' ', entity: '&nbsp;', name: 'Non-breaking space' },
  { char: '©', entity: '&copy;', name: 'Copyright' },
  { char: '®', entity: '&reg;', name: 'Registered' },
  { char: '™', entity: '&trade;', name: 'Trademark' },
  { char: '€', entity: '&euro;', name: 'Euro' },
  { char: '£', entity: '&pound;', name: 'Pound' },
  { char: '¥', entity: '&yen;', name: 'Yen' },
  { char: '§', entity: '&sect;', name: 'Section' },
  { char: '¶', entity: '&para;', name: 'Paragraph' },
  { char: '•', entity: '&bull;', name: 'Bullet' },
  { char: '…', entity: '&hellip;', name: 'Ellipsis' },
  { char: '—', entity: '&mdash;', name: 'Em dash' },
  { char: '–', entity: '&ndash;', name: 'En dash' },
  { char: '“', entity: '&ldquo;', name: 'Left double quote' },
  { char: '”', entity: '&rdquo;', name: 'Right double quote' },
  { char: '‘', entity: '&lsquo;', name: 'Left single quote' },
  { char: '’', entity: '&rsquo;', name: 'Right single quote' },
  { char: '«', entity: '&laquo;', name: 'Left guillemet' },
  { char: '»', entity: '&raquo;', name: 'Right guillemet' },
];

export default function HtmlEntities() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [preserveTags, setPreserveTags] = useState(false);

  const process = () => {
    if (!input) {
      setOutput('');
      return;
    }

    if (mode === 'encode') {
      setOutput(encodeHtmlEntities(input, preserveTags));
    } else {
      setOutput(decodeHtmlEntities(input));
    }
  };

  const encodeHtmlEntities = (text: string, preserveHtmlTags: boolean): string => {
    if (preserveHtmlTags) {
      // Encode only characters inside text nodes, not HTML tags
      return text.replace(/([^<]*)(<[^>]*>)?/g, (match, textContent, tag) => {
        const encoded = textContent
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;');
        return encoded + (tag || '');
      });
    }
    
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  };

  const decodeHtmlEntities = (text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertEntity = (entity: string) => {
    setInput(prev => prev + entity);
  };

  return (
    <ToolPage
      toolId="html-entities"
      title="HTML Entities Encoder/Decoder"
      description="Encode and decode HTML entities. Convert special characters to their HTML entity equivalents and vice versa."
      keywords="html entities, html encode, html decode, html escape, html special characters"
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
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  mode === 'decode'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                Decode
              </button>
            </div>
          </div>

          {mode === 'encode' && (
            <div className="flex-1 w-full">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preserveTags}
                  onChange={(e) => setPreserveTags(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Preserve HTML tags</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Only encode text content, not HTML tags
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={process}>
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </Button>
          {output && (
            <Button variant="secondary" onClick={copyToClipboard}>
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy Result
            </Button>
          )}
        </div>

        {/* Editors */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                {mode === 'encode' ? 'Plain Text' : 'HTML with Entities'}
              </label>
            </div>
            <CodeEditor
              value={input}
              onChange={setInput}
              language="html"
              height="300px"
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter HTML entities to decode...'}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                {mode === 'encode' ? 'HTML Entities' : 'Plain Text'}
              </label>
            </div>
            <CodeEditor
              value={output}
              language="html"
              height="300px"
              readOnly
              placeholder={`${mode === 'encode' ? 'Encoded' : 'Decoded'} result will appear here...`}
            />
          </div>
        </div>

        {/* Quick Reference */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Common HTML Entities
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {commonEntities.map((item) => (
              <button
                key={item.entity}
                onClick={() => insertEntity(item.char)}
                className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors text-center group"
                title={item.name}
              >
                <span className="text-lg block">{item.char}</span>
                <code className="text-xs text-gray-500 group-hover:text-blue-600 block truncate">
                  {item.entity}
                </code>
              </button>
            ))}
          </div>
        </div>

        {/* Numbered Entities Reference */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-3">Numbered Entities</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            You can also use numeric entities in decimal (&#38;) or hexadecimal (&#x26;) format:
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {[
              { char: '<', decimal: '&#60;', hex: '&#x3C;' },
              { char: '>', decimal: '&#62;', hex: '&#x3E;' },
              { char: '&', decimal: '&#38;', hex: '&#x26;' },
              { char: '"', decimal: '&#34;', hex: '&#x22;' },
              { char: "'", decimal: '&#39;', hex: '&#x27;' },
              { char: '©', decimal: '&#169;', hex: '&#xA9;' },
            ].map((item) => (
              <div key={item.char} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-lg">{item.char}</span>
                <div className="text-right">
                  <code className="text-xs text-gray-500 block">{item.decimal}</code>
                  <code className="text-xs text-gray-500 block">{item.hex}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
