import Editor from '@monaco-editor/react';
import { useTheme } from '@/contexts/ThemeContext';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  placeholder?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language = 'text',
  height = '400px',
  readOnly = false,
  placeholder
}: CodeEditorProps) {
  const { isDark } = useTheme();

  const handleEditorChange = (value: string | undefined) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  };

  const getTheme = () => {
    return isDark ? 'vs-dark' : 'light';
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme={getTheme()}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: 'Fira Code, JetBrains Mono, Consolas, Monaco, monospace',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          contextmenu: true,
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true
          }
        }}
        loading={
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
