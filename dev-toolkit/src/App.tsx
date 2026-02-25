import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';

// Tool imports
import JsonXmlYaml from '@/tools/JsonXmlYaml';
import RegexTester from '@/tools/RegexTester';
import Base64Tool from '@/tools/Base64Tool';
import SqlFormatter from '@/tools/SqlFormatter';
import CssJsMinifier from '@/tools/CssJsMinifier';
import GitCommands from '@/tools/GitCommands';
import ApiTester from '@/tools/ApiTester';
import JwtDecoder from '@/tools/JwtDecoder';
import UuidGenerator from '@/tools/UuidGenerator';
import TimestampConverter from '@/tools/TimestampConverter';
import HtmlEntities from '@/tools/HtmlEntities';
import CronGenerator from '@/tools/CronGenerator';

import './index.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            
            {/* Tool Routes */}
            <Route path="tools/json-xml-yaml" element={<JsonXmlYaml />} />
            <Route path="tools/regex-tester" element={<RegexTester />} />
            <Route path="tools/base64" element={<Base64Tool />} />
            <Route path="tools/sql-formatter" element={<SqlFormatter />} />
            <Route path="tools/css-js-minifier" element={<CssJsMinifier />} />
            <Route path="tools/git-commands" element={<GitCommands />} />
            <Route path="tools/api-tester" element={<ApiTester />} />
            <Route path="tools/jwt-decoder" element={<JwtDecoder />} />
            <Route path="tools/uuid-generator" element={<UuidGenerator />} />
            <Route path="tools/timestamp-converter" element={<TimestampConverter />} />
            <Route path="tools/html-entities" element={<HtmlEntities />} />
            <Route path="tools/cron-generator" element={<CronGenerator />} />
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
