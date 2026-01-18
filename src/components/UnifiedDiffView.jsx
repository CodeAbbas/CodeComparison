import React from 'react';

const UnifiedDiffView = ({ diffData }) => {
  return (
    <table className="w-full text-left border-collapse font-mono text-sm">
      <tbody className="divide-y divide-slate-800/50">
        {diffData.map((line, idx) => {
          let bgClass = "bg-transparent";
          let textClass = "text-slate-300";
          let symbol = " ";
          
          if (line.type === 'add') {
            bgClass = "bg-emerald-900/20";
            textClass = "text-emerald-200";
            symbol = "+";
          } else if (line.type === 'remove') {
            bgClass = "bg-rose-900/20";
            textClass = "text-rose-200";
            symbol = "-";
          }

          return (
            <tr key={idx} className={`${bgClass} hover:bg-opacity-40 transition-colors`}>
              <td className="w-12 px-2 py-0.5 text-right select-none text-slate-600 border-r border-slate-800/50 text-xs">
                {line.leftLine || ''}
              </td>
              <td className="w-12 px-2 py-0.5 text-right select-none text-slate-600 border-r border-slate-800/50 text-xs">
                {line.rightLine || ''}
              </td>
              <td className="w-6 px-2 py-0.5 text-center select-none text-slate-500 opacity-70">
                {symbol}
              </td>
              <td className={`px-2 py-0.5 whitespace-pre break-all ${textClass}`}>
                {line.content || ' '}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UnifiedDiffView;