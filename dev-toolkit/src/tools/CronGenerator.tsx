import { useState } from 'react';
import { Calendar, Copy, Check, AlertCircle, Clock, HelpCircle } from 'lucide-react';
import { parseExpression } from 'cron-parser';
import cronstrue from 'cronstrue';
import ToolPage from '@/components/ToolPage';
import Button from '@/components/Button';

export default function CronGenerator() {
  const [expression, setExpression] = useState('0 9 * * 1');
  const [description, setDescription] = useState('');
  const [nextRuns, setNextRuns] = useState<Date[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const parseCron = () => {
    if (!expression.trim()) {
      setDescription('');
      setNextRuns([]);
      setError('');
      return;
    }

    try {
      // Get human readable description
      const desc = cronstrue.toString(expression, { 
        use24HourTimeFormat: false,
        dayOfWeekStartIndexZero: true 
      });
      setDescription(desc);

      // Get next 5 execution times
      const interval = parseExpression(expression);
      const runs: Date[] = [];
      for (let i = 0; i < 5; i++) {
        runs.push(interval.next().toDate());
      }
      setNextRuns(runs);
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setDescription('');
      setNextRuns([]);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { name: 'Every minute', expression: '* * * * *' },
    { name: 'Every 5 minutes', expression: '*/5 * * * *' },
    { name: 'Every hour', expression: '0 * * * *' },
    { name: 'Every day at midnight', expression: '0 0 * * *' },
    { name: 'Every day at 9am', expression: '0 9 * * *' },
    { name: 'Every Monday at 9am', expression: '0 9 * * 1' },
    { name: 'Every Friday at 5pm', expression: '0 17 * * 5' },
    { name: '1st of every month', expression: '0 0 1 * *' },
    { name: 'Every 15th at noon', expression: '0 12 15 * *' },
    { name: 'Every Jan 1st', expression: '0 0 1 1 *' },
  ];

  const buildExpression = (parts: {
    minute: string;
    hour: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
  }) => {
    const expr = `${parts.minute} ${parts.hour} ${parts.dayOfMonth} ${parts.month} ${parts.dayOfWeek}`;
    setExpression(expr);
    setTimeout(parseCron, 0);
  };

  return (
    <ToolPage
      toolId="cron-generator"
      title="Cron Expression Generator"
      description="Generate and explain cron expressions. Preview next execution times and build custom schedules."
      keywords="cron generator, cron expression, crontab, schedule generator, cron builder"
    >
      <div className="space-y-4">
        {/* Expression Input */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <label className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Cron Expression
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </button>
              <Button variant="secondary" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="* * * * *"
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Button onClick={parseCron}>
              Parse
            </Button>
          </div>

          {/* Visual Builder */}
          <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs text-gray-500">
            <div>Minute</div>
            <div>Hour</div>
            <div>Day (Month)</div>
            <div>Month</div>
            <div>Day (Week)</div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {expression.split(' ').map((part, i) => (
              <div key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono text-center text-sm">
                {part || '*'}
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Description */}
        {description && !error && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">Description</h3>
            <p className="text-green-800 dark:text-green-200">{description}</p>
          </div>
        )}

        {/* Next Runs */}
        {nextRuns.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Next 5 Execution Times
            </h3>
            <div className="space-y-2">
              {nextRuns.map((run, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs rounded-full">
                    {index + 1}
                  </span>
                  <span className="font-mono">
                    {run.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({getRelativeTime(run)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        {showHelp && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-3">Cron Expression Format</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Fields (in order)</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li><strong>Minute</strong> (0-59)</li>
                  <li><strong>Hour</strong> (0-23)</li>
                  <li><strong>Day of Month</strong> (1-31)</li>
                  <li><strong>Month</strong> (1-12)</li>
                  <li><strong>Day of Week</strong> (0-7, 0/7 = Sunday)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Special Characters</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li><code>*</code> - Any value</li>
                  <li><code>,</code> - Value list separator</li>
                  <li><code>-</code> - Range of values</li>
                  <li><code>/</code> - Step values</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Presets */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-3">Common Presets</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.expression}
                onClick={() => {
                  setExpression(preset.expression);
                  setTimeout(parseCron, 0);
                }}
                className={`p-3 text-left rounded-lg border transition-all ${
                  expression === preset.expression
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="font-medium text-sm">{preset.name}</div>
                <code className="text-xs text-gray-500 block mt-1">{preset.expression}</code>
              </button>
            ))}
          </div>
        </div>

        {/* Simple Builder */}
        <SimpleCronBuilder onChange={buildExpression} />
      </div>
    </ToolPage>
  );
}

function SimpleCronBuilder({ onChange }: { onChange: (parts: any) => void }) {
  const [values, setValues] = useState({
    minute: '0',
    hour: '9',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*'
  });

  const handleChange = (field: string, value: string) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    onChange(newValues);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-4">Simple Builder</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Minute</label>
          <select
            value={values.minute}
            onChange={(e) => handleChange('minute', e.target.value)}
            className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
          >
            <option value="*">Every minute</option>
            <option value="0">0</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Hour</label>
          <select
            value={values.hour}
            onChange={(e) => handleChange('hour', e.target.value)}
            className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
          >
            <option value="*">Every hour</option>
            {[...Array(24)].map((_, i) => (
              <option key={i} value={i}>{i}:00</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Day of Month</label>
          <select
            value={values.dayOfMonth}
            onChange={(e) => handleChange('dayOfMonth', e.target.value)}
            className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
          >
            <option value="*">Every day</option>
            {[...Array(31)].map((_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Month</label>
          <select
            value={values.month}
            onChange={(e) => handleChange('month', e.target.value)}
            className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
          >
            <option value="*">Every month</option>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Day of Week</label>
          <select
            value={values.dayOfWeek}
            onChange={(e) => handleChange('dayOfWeek', e.target.value)}
            className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
          >
            <option value="*">Every day</option>
            <option value="1-5">Weekdays</option>
            <option value="0,6">Weekends</option>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <option key={i} value={i}>{d}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
  return 'soon';
}
