import { useState, useEffect, useCallback } from 'react';
import { Play, Copy, Check, HelpCircle } from 'lucide-react';
import ToolPage from '@/components/ToolPage';
import CodeEditor from '@/components/CodeEditor';
import Button from '@/components/Button';

interface Match {
  text: string;
  index: number;
  groups: string[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const testRegex = useCallback(() => {
    if (!pattern || !text) {
      setMatches([]);
      setError('');
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const results: Match[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(text)) !== null) {
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        match = regex.exec(text);
        if (match) {
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      setMatches(results);
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setMatches([]);
    }
  }, [pattern, flags, text]);

  useEffect(() => {
    testRegex();
  }, [testRegex]);

  const copyPattern = async () => {
    const fullPattern = `/${pattern}/${flags}`;
    await navigator.clipboard.writeText(fullPattern);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFlag = (flag: string) => {
    setFlags(prev => 
      prev.includes(flag) 
        ? prev.replace(flag, '') 
        : prev + flag
    );
  };

  const highlightedText = () => {
    if (!matches.length) return text;

    const parts: { text: string; isMatch: boolean }[] = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      if (match.index > lastIndex) {
        parts.push({ text: text.slice(lastIndex, match.index), isMatch: false });
      }
      parts.push({ text: match.text, isMatch: true });
      lastIndex = match.index + match.text.length;
    });

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), isMatch: false });
    }

    return parts.map((part, i) => (
      part.isMatch ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-600/50 px-0.5 rounded">
          {part.text}
        </mark>
      ) : (
        <span key={i}>{part.text}</span>
      )
    ));
  };

  const flagDescriptions: Record<string, string> = {
    'g': 'Global - Find all matches',
    'i': 'Ignore case',
    'm': 'Multiline',
    's': 'Dotall (. matches newlines)',
    'u': 'Unicode',
    'y': 'Sticky'
  };

  return (
    <ToolPage
      toolId="regex-tester"
      title="Regex Tester"
      description="Test and debug regular expressions with real-time match highlighting. Supports all JavaScript regex flags and features."
      keywords="regex tester, regular expression, regex debugger, pattern matching, regex online, javascript regex"
    >
      <div className="space-y-6">
        {/* Pattern Input */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">Regular Expression</label>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
            >
              <HelpCircle className="w-4 h-4" />
              Regex Cheatsheet
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern"
                className="w-full pl-8 pr-12 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">/{flags}</span>
            </div>
            <Button variant="secondary" onClick={copyPattern}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          {/* Flags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(flagDescriptions).map(([flag, desc]) => (
              <button
                key={flag}
                onClick={() => toggleFlag(flag)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  flags.includes(flag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title={desc}
              >
                {flag}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Help Section */}
        {showHelp && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-3">Regex Cheatsheet</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div>
                <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Character Classes</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li><code>.</code> - Any character</li>
                  <li><code>\d</code> - Digit</li>
                  <li><code>\w</code> - Word character</li>
                  <li><code>\s</code> - Whitespace</li>
                  <li><code>[abc]</code> - Character set</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Quantifiers</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li><code>*</code> - 0 or more</li>
                  <li><code>+</code> - 1 or more</li>
                  <li><code>?</code> - 0 or 1</li>
                  <li><code>{'{n}'}</code> - Exactly n</li>
                  <li><code>{'{n,m}'}</code> - n to m</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Anchors & Groups</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li><code>^</code> - Start of string</li>
                  <li><code>$</code> - End of string</li>
                  <li><code>(...)</code> - Capture group</li>
                  <li><code>(?:...)</code> - Non-capturing</li>
                  <li><code>|</code> - Alternation</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Test Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Test Text</label>
          <CodeEditor
            value={text}
            onChange={setText}
            height="200px"
            placeholder="Enter text to test against the regex pattern..."
          />
        </div>

        {/* Results */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-3">
            Matches ({matches.length})
          </h3>
          
          {text && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-sm mb-4 whitespace-pre-wrap">
              {highlightedText()}
            </div>
          )}

          {matches.length > 0 ? (
            <div className="space-y-2">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">Match {index + 1}</span>
                    <span className="text-xs text-gray-500">Index: {match.index}</span>
                  </div>
                  <code className="block mt-1 text-green-600 dark:text-green-400">{match.text}</code>
                  {match.groups.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Groups: {match.groups.map((g, i) => (
                        <span key={i} className="mr-2">{i + 1}: {g || '(empty)'}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              {pattern ? 'No matches found' : 'Enter a pattern to see matches'}
            </p>
          )}
        </div>

        {/* Sample Patterns */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-3">Sample Patterns</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              { pattern: '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$', desc: 'Email validation' },
              { pattern: 'https?://[^\s]+', desc: 'URL matching' },
              { pattern: '\b\d{3}-\d{2}-\d{4}\b', desc: 'SSN format' },
              { pattern: '^\+?[\d\s-]{10,}$', desc: 'Phone number' },
              { pattern: '<[^>]+>', desc: 'HTML tags' },
              { pattern: '#[0-9A-Fa-f]{6}', desc: 'Hex color codes' },
            ].map((item) => (
              <button
                key={item.pattern}
                onClick={() => setPattern(item.pattern)}
                className="text-left p-3 bg-white dark:bg-gray-800 rounded-lg hover:ring-2 hover:ring-blue-500 transition-all"
              >
                <code className="text-sm text-blue-600 dark:text-blue-400 block truncate">
                  {item.pattern}
                </code>
                <span className="text-xs text-gray-500">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
