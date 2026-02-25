import { useState, useEffect } from 'react';
import { Clock, Copy, Check, RefreshCw, Calendar } from 'lucide-react';
import { format, fromUnixTime, getUnixTime, parseISO } from 'date-fns';
import ToolPage from '@/components/ToolPage';
import Button from '@/components/Button';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState<string>(String(Math.floor(Date.now() / 1000)));
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  const [copied, setCopied] = useState<{ ts: boolean; iso: boolean }>({ ts: false, iso: false });
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getConvertedDate = () => {
    const ts = parseInt(timestamp);
    if (isNaN(ts)) return null;
    
    const multiplier = unit === 'seconds' ? 1000 : 1;
    try {
      return new Date(ts * multiplier);
    } catch {
      return null;
    }
  };

  const convertDateToTimestamp = () => {
    if (!dateInput) return;
    
    try {
      const dateStr = timeInput ? `${dateInput}T${timeInput}` : dateInput;
      const date = parseISO(dateStr);
      const ts = unit === 'seconds' ? getUnixTime(date) : date.getTime();
      setTimestamp(String(ts));
    } catch {
      // Invalid date
    }
  };

  const setToNow = () => {
    const now = Date.now();
    setTimestamp(String(unit === 'seconds' ? Math.floor(now / 1000) : now));
  };

  const copyToClipboard = async (value: string, type: 'ts' | 'iso') => {
    await navigator.clipboard.writeText(value);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  const convertedDate = getConvertedDate();
  const currentTimestamp = unit === 'seconds' ? Math.floor(currentTime / 1000) : currentTime;

  const formatOptions = [
    { label: 'ISO 8601', format: (d: Date) => d.toISOString() },
    { label: 'UTC String', format: (d: Date) => d.toUTCString() },
    { label: 'Local String', format: (d: Date) => d.toString() },
    { label: 'Date Only', format: (d: Date) => format(d, 'yyyy-MM-dd') },
    { label: 'Time Only', format: (d: Date) => format(d, 'HH:mm:ss') },
    { label: 'Full Date/Time', format: (d: Date) => format(d, 'yyyy-MM-dd HH:mm:ss') },
    { label: 'Relative', format: (d: Date) => getRelativeTime(d) },
  ];

  return (
    <ToolPage
      toolId="timestamp-converter"
      title="Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates. Supports both seconds and milliseconds."
      keywords="timestamp converter, unix timestamp, epoch converter, date converter, timestamp to date"
    >
      <div className="space-y-4">
        {/* Current Time */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium">Current Time</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Unix (seconds):</span>
              <code className="ml-2 font-mono">{Math.floor(currentTime / 1000)}</code>
            </div>
            <div>
              <span className="text-gray-500">Unix (ms):</span>
              <code className="ml-2 font-mono">{currentTime}</code>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gray-500">ISO:</span>
              <code className="ml-2 font-mono">{new Date(currentTime).toISOString()}</code>
            </div>
          </div>
        </div>

        {/* Timestamp Input */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <label className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timestamp
            </label>
            <div className="flex items-center gap-2">
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'seconds' | 'milliseconds')}
                className="px-3 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
              >
                <option value="seconds">Seconds</option>
                <option value="milliseconds">Milliseconds</option>
              </select>
              <Button variant="ghost" size="sm" onClick={setToNow}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Now
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter timestamp"
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Button variant="secondary" onClick={() => copyToClipboard(timestamp, 'ts')}>
              {copied.ts ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              { label: 'Now', value: String(currentTimestamp) },
              { label: '+1 min', value: String(currentTimestamp + (unit === 'seconds' ? 60 : 60000)) },
              { label: '+1 hour', value: String(currentTimestamp + (unit === 'seconds' ? 3600 : 3600000)) },
              { label: '+1 day', value: String(currentTimestamp + (unit === 'seconds' ? 86400 : 86400000)) },
              { label: '-1 day', value: String(currentTimestamp - (unit === 'seconds' ? 86400 : 86400000)) },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setTimestamp(preset.value)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Converted Date */}
        {convertedDate && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-green-900 dark:text-green-100">Converted Date</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(convertedDate.toISOString(), 'iso')}
              >
                {copied.iso ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3">
              {formatOptions.map((opt) => (
                <div key={opt.label} className="flex flex-col p-2 bg-white dark:bg-gray-800 rounded">
                  <span className="text-xs text-gray-500 mb-1">{opt.label}</span>
                  <code className="text-sm font-mono truncate">{opt.format(convertedDate)}</code>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date to Timestamp */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date to Timestamp
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              value={dateInput}
              onChange={(e) => {
                setDateInput(e.target.value);
                setTimeout(convertDateToTimestamp, 0);
              }}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="time"
              value={timeInput}
              onChange={(e) => {
                setTimeInput(e.target.value);
                setTimeout(convertDateToTimestamp, 0);
              }}
              step="1"
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Time Zones */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-3">Common Time Zones</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            {[
              { name: 'UTC', zone: 'UTC' },
              { name: 'New York', zone: 'America/New_York' },
              { name: 'London', zone: 'Europe/London' },
              { name: 'Paris', zone: 'Europe/Paris' },
              { name: 'Tokyo', zone: 'Asia/Tokyo' },
              { name: 'Sydney', zone: 'Australia/Sydney' },
            ].map((tz) => (
              <div key={tz.zone} className="p-2 bg-white dark:bg-gray-800 rounded">
                <span className="text-gray-500">{tz.name}:</span>
                <span className="ml-2 font-mono">
                  {new Date().toLocaleTimeString('en-US', { timeZone: tz.zone, hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolPage>
  );
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const absDiff = Math.abs(diff);
  
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  const suffix = diff < 0 ? 'from now' : 'ago';
  
  if (seconds < 60) return `${seconds} seconds ${suffix}`;
  if (minutes < 60) return `${minutes} minutes ${suffix}`;
  if (hours < 24) return `${hours} hours ${suffix}`;
  if (days < 30) return `${days} days ${suffix}`;
  
  return date.toLocaleDateString();
}
