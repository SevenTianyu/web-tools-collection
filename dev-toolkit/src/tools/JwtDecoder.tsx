import { useState } from 'react';
import { Key, Copy, Check, AlertCircle, Shield } from 'lucide-react';
import { decodeJwt } from 'jose';
import ToolPage from '@/components/ToolPage';
import CodeEditor from '@/components/CodeEditor';
import Button from '@/components/Button';

export default function JwtDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<{ header: object; payload: object; signature: string } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<{ header: boolean; payload: boolean }>({ header: false, payload: false });

  const decode = () => {
    if (!input.trim()) {
      setDecoded(null);
      setError('');
      return;
    }

    try {
      // Clean up the token
      const token = input.trim().replace(/^Bearer\s+/i, '');
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
      }

      const payload = decodeJwt(token);
      
      // Decode header manually
      const headerJson = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
      const header = JSON.parse(headerJson);

      setDecoded({
        header,
        payload,
        signature: parts[2]
      });
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setDecoded(null);
    }
  };

  const copyToClipboard = async (data: object, type: 'header' | 'payload') => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const sampleTokens = [
    {
      name: 'Sample JWT',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    }
  ];

  return (
    <ToolPage
      toolId="jwt-decoder"
      title="JWT Decoder"
      description="Decode and verify JSON Web Tokens. View the header, payload, and signature of JWT tokens."
      keywords="jwt decode, jwt verify, json web token, jwt parser, jwt inspector"
    >
      <div className="space-y-4">
        {/* Input */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Key className="w-4 h-4" />
              JWT Token
            </label>
            <Button size="sm" onClick={decode}>
              Decode
            </Button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JWT token here (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
            className="w-full h-32 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <p className="mt-2 text-xs text-gray-500">
            Supports tokens with or without "Bearer " prefix
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Decoded Output */}
        {decoded && (
          <div className="space-y-4">
            {/* Token Info */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Algorithm</div>
                <div className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                  {(decoded.header as any).alg || 'N/A'}
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Token Type</div>
                <div className="text-lg font-mono font-bold text-green-600 dark:text-green-400">
                  {(decoded.header as any).typ || 'N/A'}
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Signature</div>
                <div className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400 truncate">
                  {decoded.signature.slice(0, 16)}...
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Header</h3>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(decoded.header, 'header')}>
                  {copied.header ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto text-sm">
                <code>{JSON.stringify(decoded.header, null, 2)}</code>
              </pre>
            </div>

            {/* Payload */}
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Payload</h3>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(decoded.payload, 'payload')}>
                  {copied.payload ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              {/* Claims Table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-3 py-2 text-left">Claim</th>
                      <th className="px-3 py-2 text-left">Value</th>
                      <th className="px-3 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Object.entries(decoded.payload).map(([key, value]) => (
                      <tr key={key}>
                        <td className="px-3 py-2 font-mono text-blue-600 dark:text-blue-400">{key}</td>
                        <td className="px-3 py-2">
                          {key === 'exp' || key === 'iat' || key === 'nbf' ? (
                            <span title={formatDate(value as number)}>
                              {value} ({formatDate(value as number)})
                            </span>
                          ) : (
                            String(value)
                          )}
                        </td>
                        <td className="px-3 py-2 text-gray-500 text-xs">
                          {getClaimDescription(key)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <pre className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto text-sm">
                <code>{JSON.stringify(decoded.payload, null, 2)}</code>
              </pre>
            </div>

            {/* Security Warning */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
              <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Security Note</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  This tool only decodes the JWT token for inspection. It does not verify the signature. 
                  Never paste production JWT tokens with sensitive data into online tools.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sample Tokens */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="font-semibold mb-3">Sample Token</h3>
          {sampleTokens.map((sample, index) => (
            <button
              key={index}
              onClick={() => {
                setInput(sample.token);
                setTimeout(decode, 0);
              }}
              className="w-full text-left p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
            >
              <div className="font-medium">{sample.name}</div>
              <code className="text-xs text-gray-500 block truncate mt-1">{sample.token}</code>
            </button>
          ))}
        </div>
      </div>
    </ToolPage>
  );
}

function getClaimDescription(claim: string): string {
  const descriptions: Record<string, string> = {
    'iss': 'Issuer',
    'sub': 'Subject',
    'aud': 'Audience',
    'exp': 'Expiration Time',
    'nbf': 'Not Before',
    'iat': 'Issued At',
    'jti': 'JWT ID',
    'name': 'Full Name',
    'email': 'Email Address',
    'preferred_username': 'Preferred Username',
    'roles': 'User Roles',
    'scope': 'OAuth Scopes'
  };
  return descriptions[claim] || '';
}
