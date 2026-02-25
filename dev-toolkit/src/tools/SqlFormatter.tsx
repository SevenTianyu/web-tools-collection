import { useState } from 'react';
import { Wand2, Copy, Check, Database } from 'lucide-react';
import { format } from 'sql-formatter';
import ToolPage from '@/components/ToolPage';
import CodeEditor from '@/components/CodeEditor';
import Button from '@/components/Button';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState('sql');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState({
    keywordCase: 'upper' as 'upper' | 'lower' | 'preserve',
    indentStyle: 'standard' as 'standard' | 'tabularLeft' | 'tabularRight',
    linesBetweenQueries: 1,
  });

  const dialects = [
    { value: 'sql', label: 'Standard SQL' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'mariadb', label: 'MariaDB' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'tsql', label: 'T-SQL (SQL Server)' },
    { value: 'plsql', label: 'PL/SQL (Oracle)' },
    { value: 'redshift', label: 'Redshift' },
    { value: 'spark', label: 'Spark' },
    { value: 'snowflake', label: 'Snowflake' },
    { value: 'db2', label: 'DB2' },
    { value: 'hive', label: 'Hive' },
  ];

  const formatSql = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const formatted = format(input, {
        language: dialect as any,
        keywordCase: options.keywordCase,
        indentStyle: options.indentStyle,
        linesBetweenQueries: options.linesBetweenQueries,
      });
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleQueries = [
    `SELECT u.id, u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = 1 GROUP BY u.id, u.name HAVING COUNT(o.id) > 5 ORDER BY order_count DESC LIMIT 10;`,
    `INSERT INTO products (name, price, category) VALUES ('Laptop', 999.99, 'Electronics'), ('Mouse', 29.99, 'Electronics');`,
    `UPDATE users SET last_login = NOW(), login_count = login_count + 1 WHERE id = 123;`,
    `DELETE FROM logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);`,
  ];

  return (
    <ToolPage
      toolId="sql-formatter"
      title="SQL Formatter"
      description="Format and beautify SQL queries with syntax highlighting. Supports multiple SQL dialects including PostgreSQL, MySQL, SQLite, and more."
      keywords="sql formatter, sql beautifier, sql pretty print, format sql, sql highlighter"
    >
      <div className="space-y-4">
        {/* Options */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">SQL Dialect</label>
              <select
                value={dialect}
                onChange={(e) => setDialect(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {dialects.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Keyword Case</label>
              <select
                value={options.keywordCase}
                onChange={(e) => setOptions({ ...options, keywordCase: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="upper">UPPERCASE</option>
                <option value="lower">lowercase</option>
                <option value="preserve">Preserve</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Indent Style</label>
              <select
                value={options.indentStyle}
                onChange={(e) => setOptions({ ...options, indentStyle: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="standard">Standard</option>
                <option value="tabularLeft">Tabular Left</option>
                <option value="tabularRight">Tabular Right</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lines Between Queries</label>
              <input
                type="number"
                min={0}
                max={5}
                value={options.linesBetweenQueries}
                onChange={(e) => setOptions({ ...options, linesBetweenQueries: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={formatSql}>
            <Wand2 className="w-4 h-4 mr-2" />
            Format SQL
          </Button>
          <Button variant="secondary" onClick={() => setInput('')}>
            Clear
          </Button>
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
              <label className="text-sm font-medium">Input SQL</label>
            </div>
            <CodeEditor
              value={input}
              onChange={setInput}
              language="sql"
              height="500px"
              placeholder="Paste your SQL query here..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Formatted SQL</label>
              {output && (
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              )}
            </div>
            <CodeEditor
              value={output}
              language="sql"
              height="500px"
              readOnly
              placeholder="Formatted SQL will appear here..."
            />
          </div>
        </div>

        {/* Sample Queries */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Sample Queries
          </h3>
          <div className="space-y-2">
            {sampleQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => setInput(query)}
                className="w-full text-left p-3 bg-white dark:bg-gray-800 rounded-lg hover:ring-2 hover:ring-blue-500 transition-all text-sm font-mono truncate"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
