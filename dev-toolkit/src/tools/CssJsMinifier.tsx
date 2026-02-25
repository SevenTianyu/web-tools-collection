import { useState } from 'react';
import { Minimize2, Maximize2, Copy, Check, AlertCircle } from 'lucide-react';
import { minify as minifyJS } from 'uglify-js';
import { html as beautifyHTML } from 'js-beautify';
import ToolPage from '@/components/ToolPage';
import CodeEditor from '@/components/CodeEditor';
import Button from '@/components/Button';

export default function CssJsMinifier() {
  const [language, setLanguage] = useState<'javascript' | 'css' | 'html'>('javascript');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'minify' | 'beautify'>('minify');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<{ original: number; compressed: number; ratio: string } | null>(null);

  const process = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      setStats(null);
      return;
    }

    const originalSize = new Blob([input]).size;

    try {
      setError('');
      let result = '';

      if (mode === 'minify') {
        switch (language) {
          case 'javascript': {
            const minified = minifyJS(input);
            if (minified.error) {
              throw new Error(minified.error.message);
            }
            result = minified.code || '';
            break;
          }
          case 'css':
            result = minifyCSS(input);
            break;
          case 'html':
            result = minifyHTML(input);
            break;
        }
      } else {
        // Beautify
        switch (language) {
          case 'javascript':
            result = beautifyHTML(input, { indent_size: 2, indent_char: ' ' });
            break;
          case 'css':
            result = beautifyCSS(input);
            break;
          case 'html':
            result = beautifyHTML(input, { indent_size: 2, indent_char: ' ', wrap_line_length: 80 });
            break;
        }
      }

      setOutput(result);
      
      const compressedSize = new Blob([result]).size;
      const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      setStats({
        original: originalSize,
        compressed: compressedSize,
        ratio: mode === 'minify' ? ratio : (100 - parseFloat(ratio)).toFixed(1)
      });
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
      setStats(null);
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const minifyCSS = (css: string): string => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around selectors/braces
      .replace(/;}/g, '}') // Remove last semicolon
      .trim();
  };

  const beautifyCSS = (css: string): string => {
    let formatted = '';
    let indent = 0;
    
    css = css.replace(/\s+/g, ' ').trim();
    
    for (let i = 0; i < css.length; i++) {
      const char = css[i];
      
      if (char === '{') {
        formatted += ' {\n' + '  '.repeat(++indent);
      } else if (char === '}') {
        formatted += '\n' + '  '.repeat(--indent) + '}\n' + '  '.repeat(indent);
      } else if (char === ';') {
        formatted += ';\n' + '  '.repeat(indent);
      } else {
        formatted += char;
      }
    }
    
    return formatted.trim();
  };

  const minifyHTML = (html: string): string => {
    return html
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s+/g, ' ') // Collapse whitespace
      .trim();
  };

  const languageLabels = {
    javascript: 'JavaScript',
    css: 'CSS',
    html: 'HTML'
  };

  return (
    <ToolPage
      toolId="css-js-minifier"
      title="CSS/JS Minifier & Beautifier"
      description="Minify and beautify CSS, JavaScript, and HTML code. Reduce file size or make code readable with proper formatting."
      keywords="css minifier, js minifier, javascript beautifier, code minify, css beautifier, html minifier"
    >
      <div className="space-y-4">
        {/* Language & Mode Selection */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="javascript">JavaScript</option>
              <option value="css">CSS</option>
              <option value="html">HTML</option>
            </select>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-2">Mode</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
              <button
                onClick={() => setMode('minify')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  mode === 'minify'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Minimize2 className="w-4 h-4" />
                Minify
              </button>
              <button
                onClick={() => setMode('beautify')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  mode === 'beautify'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Maximize2 className="w-4 h-4" />
                Beautify
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={process}>
            {mode === 'minify' ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
            {mode === 'minify' ? 'Minify' : 'Beautify'}
          </Button>
          {output && (
            <Button variant="secondary" onClick={copyToClipboard}>
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy Result
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Stats */}
        {stats && mode === 'minify' && (
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Original</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {(stats.original / 1024).toFixed(2)} KB
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Minified</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {(stats.compressed / 1024).toFixed(2)} KB
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Savings</div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {parseFloat(stats.ratio) > 0 ? `${stats.ratio}%` : '0%'}
              </div>
            </div>
          </div>
        )}

        {/* Editors */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Input ({languageLabels[language]})</label>
            </div>
            <CodeEditor
              value={input}
              onChange={setInput}
              language={language}
              height="500px"
              placeholder={`Paste your ${languageLabels[language]} code here...`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                {mode === 'minify' ? 'Minified' : 'Beautified'} Output
              </label>
            </div>
            <CodeEditor
              value={output}
              language={language}
              height="500px"
              readOnly
              placeholder={`${mode === 'minify' ? 'Minified' : 'Beautified'} code will appear here...`}
            />
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
