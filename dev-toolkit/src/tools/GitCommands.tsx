import { useState } from 'react';
import { GitBranch, Copy, Check, Terminal, BookOpen, Plus, RotateCcw, HardDrive, Upload, Download } from 'lucide-react';
import ToolPage from '@/components/ToolPage';
import Button from '@/components/Button';

interface GitCommand {
  action: string;
  description: string;
  command: string;
}

const gitCommands: GitCommand[] = [
  // Repository
  { action: 'init', description: 'Initialize a new Git repository', command: 'git init' },
  { action: 'clone', description: 'Clone a repository', command: 'git clone <repository-url>' },
  
  // Basic workflow
  { action: 'status', description: 'Check repository status', command: 'git status' },
  { action: 'add', description: 'Stage all changes', command: 'git add .' },
  { action: 'add-file', description: 'Stage specific file', command: 'git add <file>' },
  { action: 'commit', description: 'Commit staged changes', command: 'git commit -m "<message>"' },
  { action: 'commit-amend', description: 'Amend last commit', command: 'git commit --amend -m "<new-message>"' },
  
  // Branching
  { action: 'branch', description: 'List all branches', command: 'git branch' },
  { action: 'branch-create', description: 'Create new branch', command: 'git branch <branch-name>' },
  { action: 'checkout', description: 'Switch to branch', command: 'git checkout <branch-name>' },
  { action: 'checkout-create', description: 'Create and switch to branch', command: 'git checkout -b <branch-name>' },
  { action: 'merge', description: 'Merge branch into current', command: 'git merge <branch-name>' },
  { action: 'branch-delete', description: 'Delete branch', command: 'git branch -d <branch-name>' },
  
  // Remote
  { action: 'remote', description: 'List remote repositories', command: 'git remote -v' },
  { action: 'fetch', description: 'Fetch from remote', command: 'git fetch' },
  { action: 'pull', description: 'Pull from remote', command: 'git pull' },
  { action: 'push', description: 'Push to remote', command: 'git push' },
  { action: 'push-set-upstream', description: 'Push and set upstream', command: 'git push -u origin <branch-name>' },
  
  // History
  { action: 'log', description: 'View commit history', command: 'git log' },
  { action: 'log-oneline', description: 'Compact log view', command: 'git log --oneline' },
  { action: 'log-graph', description: 'Graph view with branches', command: 'git log --oneline --graph --all' },
  { action: 'diff', description: 'Show unstaged changes', command: 'git diff' },
  { action: 'diff-staged', description: 'Show staged changes', command: 'git diff --staged' },
  { action: 'show', description: 'Show commit details', command: 'git show <commit-hash>' },
  
  // Undoing
  { action: 'restore', description: 'Restore file (discard changes)', command: 'git restore <file>' },
  { action: 'restore-staged', description: 'Unstage file', command: 'git restore --staged <file>' },
  { action: 'reset-soft', description: 'Undo last commit, keep changes', command: 'git reset --soft HEAD~1' },
  { action: 'reset-hard', description: 'Undo last commit, discard changes', command: 'git reset --hard HEAD~1' },
  { action: 'revert', description: 'Revert a commit', command: 'git revert <commit-hash>' },
  
  // Stashing
  { action: 'stash', description: 'Stash changes', command: 'git stash' },
  { action: 'stash-list', description: 'List stashes', command: 'git stash list' },
  { action: 'stash-pop', description: 'Apply and remove stash', command: 'git stash pop' },
  { action: 'stash-apply', description: 'Apply stash', command: 'git stash apply' },
  
  // Tags
  { action: 'tag', description: 'List tags', command: 'git tag' },
  { action: 'tag-create', description: 'Create annotated tag', command: 'git tag -a <tag-name> -m "<message>"' },
  { action: 'tag-push', description: 'Push tags to remote', command: 'git push --tags' },
];

const workflows = [
  {
    name: 'Start New Feature',
    steps: [
      { cmd: 'git checkout main', desc: 'Switch to main branch' },
      { cmd: 'git pull', desc: 'Get latest changes' },
      { cmd: 'git checkout -b feature/my-feature', desc: 'Create feature branch' },
      { cmd: 'git add .', desc: 'Stage changes' },
      { cmd: 'git commit -m "Add new feature"', desc: 'Commit changes' },
      { cmd: 'git push -u origin feature/my-feature', desc: 'Push to remote' },
    ]
  },
  {
    name: 'Fix Bug',
    steps: [
      { cmd: 'git checkout -b fix/bug-fix', desc: 'Create fix branch' },
      { cmd: 'git add .', desc: 'Stage fix' },
      { cmd: 'git commit -m "Fix bug"', desc: 'Commit fix' },
      { cmd: 'git checkout main', desc: 'Switch to main' },
      { cmd: 'git merge fix/bug-fix', desc: 'Merge fix' },
      { cmd: 'git push', desc: 'Push changes' },
    ]
  },
  {
    name: 'Undo Last Commit',
    steps: [
      { cmd: 'git reset --soft HEAD~1', desc: 'Undo commit, keep changes' },
      { cmd: '# or', desc: '' },
      { cmd: 'git reset --hard HEAD~1', desc: 'Undo commit, discard changes' },
    ]
  },
];

export default function GitCommands() {
  const [selectedCommand, setSelectedCommand] = useState<GitCommand | null>(null);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'commands' | 'workflows'>('commands');

  const getCommandWithValues = (cmd: string) => {
    let result = cmd;
    Object.entries(customValues).forEach(([key, value]) => {
      result = result.replace(`<${key}>`, value || `<${key}>`);
    });
    return result;
  };

  const copyCommand = async (command: string) => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const extractPlaceholders = (cmd: string): string[] => {
    const matches = cmd.match(/<([^>]+)>/g);
    return matches ? matches.map(m => m.slice(1, -1)) : [];
  };

  const categories = [...new Set(gitCommands.map(c => c.action.split('-')[0]))];

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, React.ReactNode> = {
      'init': <HardDrive className="w-4 h-4" />,
      'clone': <Download className="w-4 h-4" />,
      'status': <Terminal className="w-4 h-4" />,
      'add': <Plus className="w-4 h-4" />,
      'commit': <Check className="w-4 h-4" />,
      'branch': <GitBranch className="w-4 h-4" />,
      'checkout': <RotateCcw className="w-4 h-4" />,
      'merge': <GitBranch className="w-4 h-4" />,
      'remote': <Upload className="w-4 h-4" />,
      'fetch': <Download className="w-4 h-4" />,
      'pull': <Download className="w-4 h-4" />,
      'push': <Upload className="w-4 h-4" />,
      'log': <BookOpen className="w-4 h-4" />,
      'diff': <Terminal className="w-4 h-4" />,
      'show': <Terminal className="w-4 h-4" />,
      'restore': <RotateCcw className="w-4 h-4" />,
      'reset': <RotateCcw className="w-4 h-4" />,
      'revert': <RotateCcw className="w-4 h-4" />,
      'stash': <HardDrive className="w-4 h-4" />,
      'tag': <BookOpen className="w-4 h-4" />,
    };
    return icons[cat] || <Terminal className="w-4 h-4" />;
  };

  return (
    <ToolPage
      toolId="git-commands"
      title="Git Command Generator"
      description="Generate Git commands based on your operations. Browse common commands or follow step-by-step workflows."
      keywords="git commands, git cheat sheet, git generator, git tutorial, git reference"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('commands')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'commands'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Commands
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'workflows'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Workflows
          </button>
        </div>

        {activeTab === 'commands' && (
          <>
            {/* Command Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {gitCommands.map((cmd) => {
                const placeholders = extractPlaceholders(cmd.command);
                return (
                  <button
                    key={cmd.action}
                    onClick={() => {
                      setSelectedCommand(cmd);
                      setCustomValues({});
                    }}
                    className={`p-4 text-left rounded-lg border transition-all ${
                      selectedCommand?.action === cmd.action
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getCategoryIcon(cmd.action.split('-')[0])}
                      <code className="text-sm font-semibold">{cmd.action}</code>
                    </div>
                    <p className="text-xs text-gray-500">{cmd.description}</p>
                    {placeholders.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {placeholders.map(p => (
                          <span key={p} className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
            &lt;{p}&gt;
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Command Builder */}
            {selectedCommand && (
              <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-4">{selectedCommand.description}</h3>
                
                {extractPlaceholders(selectedCommand.command).length > 0 && (
                  <div className="mb-4 grid sm:grid-cols-2 gap-3">
                    {extractPlaceholders(selectedCommand.command).map((placeholder) => (
                      <div key={placeholder}>
                        <label className="block text-sm font-medium mb-1">
                          {placeholder.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <input
                          type="text"
                          value={customValues[placeholder] || ''}
                          onChange={(e) => setCustomValues({ ...customValues, [placeholder]: e.target.value })}
                          placeholder={`<${placeholder}>`}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <code className="flex-1 p-3 bg-gray-900 text-green-400 rounded-lg font-mono text-sm overflow-x-auto">
                    {getCommandWithValues(selectedCommand.command)}
                  </code>
                  <Button onClick={() => copyCommand(getCommandWithValues(selectedCommand.command))}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-4">
            {workflows.map((workflow, index) => (
              <div key={index} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-3">{workflow.name}</h3>
                <div className="space-y-2">
                  {workflow.steps.map((step, stepIndex) => (
                    step.cmd.startsWith('#') ? (
                      <div key={stepIndex} className="text-gray-400 text-sm italic">
                        {step.cmd}
                      </div>
                    ) : (
                      <div key={stepIndex} className="flex items-start gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs rounded-full">
                          {stepIndex + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <code className="text-sm font-mono text-gray-800 dark:text-gray-200 block truncate">
                            {step.cmd}
                          </code>
                          <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                        </div>
                        <button
                          onClick={() => copyCommand(step.cmd)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolPage>
  );
}
