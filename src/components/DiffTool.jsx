import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  FileCode, 
  LayoutTemplate, 
  Columns, 
  Upload, 
  Trash2,
  Code
} from 'lucide-react';

// Import sub-components
import UnifiedDiffView from './UnifiedDiffView';
import SplitDiffView from './SplitDiffView';

const DiffTool = () => {
  const [diffLib, setDiffLib] = useState(null);
  const [originalCode, setOriginalCode] = useState('');
  const [modifiedCode, setModifiedCode] = useState('');
  const [diffData, setDiffData] = useState([]);
  const [viewMode, setViewMode] = useState('split'); // 'split' or 'unified'
  const [stats, setStats] = useState({ additions: 0, deletions: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Load jsdiff library dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.1.0/diff.min.js";
    script.async = true;
    script.onload = () => {
      if (window.Diff) {
        setDiffLib(window.Diff);
        setIsLoading(false);
        // Load initial mock data
        loadMockData(window.Diff);
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const loadMockData = (lib) => {
    const original = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

const cart = [
  { name: 'Apple', price: 1.20 },
  { name: 'Banana', price: 0.80 }
];

console.log(calculateTotal(cart));`;

    const modified = `// Refactored to use reduce
const calculateTotal = (items) => {
  return items.reduce((acc, item) => acc + item.price, 0);
};

const cart = [
  { name: 'Apple', price: 1.20 },
  { name: 'Banana', price: 0.80 },
  { name: 'Orange', price: 1.50 } // Added item
];

// Display formatted total
console.log(\`Total: $\${calculateTotal(cart).toFixed(2)}\`);`;

    setOriginalCode(original);
    setModifiedCode(modified);
    if (lib) computeDiff(original, modified, lib);
  };

  const computeDiff = (oldText, newText, lib = diffLib) => {
    if (!lib) return;

    // Use diffLines for code comparison
    const changes = lib.diffLines(oldText, newText, { newlineIsToken: false });
    
    let processedLines = [];
    let leftLineNumber = 1;
    let rightLineNumber = 1;
    let addCount = 0;
    let delCount = 0;

    // Process diff into renderable lines
    changes.forEach(part => {
      const lines = part.value.replace(/\n$/, '').split('\n'); // Remove trailing newline for split
      
      // Handle edge case where empty string splits to ['']
      if (part.value === '') return;

      if (part.added) {
        addCount += part.count;
        lines.forEach(line => {
          processedLines.push({
            type: 'add',
            content: line,
            leftLine: null,
            rightLine: rightLineNumber++
          });
        });
      } else if (part.removed) {
        delCount += part.count;
        lines.forEach(line => {
          processedLines.push({
            type: 'remove',
            content: line,
            leftLine: leftLineNumber++,
            rightLine: null
          });
        });
      } else {
        lines.forEach(line => {
          processedLines.push({
            type: 'unchanged',
            content: line,
            leftLine: leftLineNumber++,
            rightLine: rightLineNumber++
          });
        });
      }
    });

    setStats({ additions: addCount, deletions: delCount });
    setDiffData(processedLines);
  };

  // Re-compute when inputs change
  useEffect(() => {
    if (diffLib) {
      const timeout = setTimeout(() => {
        computeDiff(originalCode, modifiedCode);
      }, 300); // Debounce
      return () => clearTimeout(timeout);
    }
  }, [originalCode, modifiedCode, diffLib]);

  // File Upload Handlers
  const handleFileUpload = (e, target) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (target === 'original') setOriginalCode(event.target.result);
      else setModifiedCode(event.target.result);
    };
    reader.readAsText(file);
  };

  // Drag and drop handlers
  const handleDrop = (e, target) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (target === 'original') setOriginalCode(event.target.result);
      else setModifiedCode(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="min-h-screen  w-full bg-slate-950 text-slate-200 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 shadow-md">
        <div className="w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <ArrowRightLeft className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Code Comparison
              </h1>
              <p className="text-xs text-slate-400">Codebase & Generated File Comparison</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="hidden md:flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-full border border-slate-800 text-sm font-mono">
              <span className="text-green-400 flex items-center gap-1">
                +{stats.additions} <span className="text-slate-500 text-xs">INS</span>
              </span>
              <span className="w-px h-4 bg-slate-800"></span>
              <span className="text-red-400 flex items-center gap-1">
                -{stats.deletions} <span className="text-slate-500 text-xs">DEL</span>
              </span>
            </div>

            {/* View Toggle */}
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => setViewMode('split')}
                className={`p-2 rounded-md transition-all ${viewMode === 'split' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Split View"
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={`p-2 rounded-md transition-all ${viewMode === 'unified' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Unified View"
              >
                <LayoutTemplate className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto w-full p-4 md:p-6 flex flex-col gap-6">
        
        {/* Input Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96 min-h-[300px]">
          {/* Original Input */}
          <div 
            className="flex flex-col gap-2 relative group"
            onDrop={(e) => handleDrop(e, 'original')}
            onDragOver={handleDragOver}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider px-1">
              <span className="flex items-center gap-2"><FileCode className="w-4 h-4" /> Original Codebase</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setOriginalCode('')}
                  className="hover:text-red-400" title="Clear"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="relative flex-1">
              <textarea
                value={originalCode}
                onChange={(e) => setOriginalCode(e.target.value)}
                className="w-full h-full bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-300 placeholder-slate-600 shadow-inner"
                placeholder="Paste original code here or drag & drop a file..."
              />
              <label className="absolute bottom-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg cursor-pointer transition-colors shadow-lg border border-slate-700">
                <Upload className="w-4 h-4" />
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'original')} />
              </label>
            </div>
          </div>

          {/* Modified Input */}
          <div 
            className="flex flex-col gap-2 relative group"
            onDrop={(e) => handleDrop(e, 'modified')}
            onDragOver={handleDragOver}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider px-1">
              <span className="flex items-center gap-2"><Code className="w-4 h-4" /> Generated / Edited Code</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                  onClick={() => setModifiedCode('')}
                  className="hover:text-red-400" title="Clear"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="relative flex-1">
              <textarea
                value={modifiedCode}
                onChange={(e) => setModifiedCode(e.target.value)}
                className="w-full h-full bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-300 placeholder-slate-600 shadow-inner"
                placeholder="Paste new code here or drag & drop a file..."
              />
              <label className="absolute bottom-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg cursor-pointer transition-colors shadow-lg border border-slate-700">
                <Upload className="w-4 h-4" />
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'modified')} />
              </label>
            </div>
          </div>
        </div>

        {/* Diff Output Area */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 animate-pulse">
            Loading Diff Library...
          </div>
        ) : (
          <div className="flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
            {/* Diff Header */}
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              <span className="ml-2 text-xs text-slate-500 font-mono">diff_output.diff</span>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {viewMode === 'unified' ? (
                <UnifiedDiffView diffData={diffData} />
              ) : (
                <SplitDiffView diffData={diffData} />
              )}
              {diffData.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <p>No code changes detected or fields are empty.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DiffTool;