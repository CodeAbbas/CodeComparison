import React from 'react';

const SplitDiffView = ({ diffData }) => {
  // Refined Preprocessing for "Aligned" Split View
  // We group consecutive Removals and consecutive Additions
  const alignedRows = [];
  let idx = 0;
  while(idx < diffData.length) {
    const line = diffData[idx];
    if (line.type === 'unchanged') {
      alignedRows.push({ left: line, right: line });
      idx++;
    } else {
      // Collect block of removals
      const removes = [];
      while(idx < diffData.length && diffData[idx].type === 'remove') {
        removes.push(diffData[idx]);
        idx++;
      }
      // Collect block of additions
      const adds = [];
      while(idx < diffData.length && diffData[idx].type === 'add') {
        adds.push(diffData[idx]);
        idx++;
      }
      
      // Pair them up
      const maxLen = Math.max(removes.length, adds.length);
      for (let k = 0; k < maxLen; k++) {
        alignedRows.push({
          left: k < removes.length ? removes[k] : null,
          right: k < adds.length ? adds[k] : null
        });
      }
    }
  }

  return (
    <table className="w-full text-left border-collapse font-mono text-sm table-fixed">
      <colgroup>
        <col className="w-[50%]" />
        <col className="w-[50%]" />
      </colgroup>
      <tbody className="divide-y divide-slate-800/50">
        {alignedRows.map((row, idx) => {
          const leftClass = row.left?.type === 'remove' ? 'bg-rose-900/20 text-rose-200' : 'text-slate-300';
          const rightClass = row.right?.type === 'add' ? 'bg-emerald-900/20 text-emerald-200' : 'text-slate-300';
          
          return (
            <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
              {/* LEFT COLUMN */}
              <td className={`align-top border-r border-slate-800 ${leftClass} ${!row.left ? 'bg-slate-900/50' : ''}`}>
                <div className="flex">
                   <span className="w-8 inline-block text-right select-none text-slate-600 text-xs pr-2 mr-2 border-r border-slate-800/30 shrink-0">
                     {row.left?.leftLine || ''}
                   </span>
                   <span className="whitespace-pre break-all overflow-hidden block w-full">
                     {row.left?.content || ''}
                   </span>
                </div>
              </td>

              {/* RIGHT COLUMN */}
              <td className={`align-top ${rightClass} ${!row.right ? 'bg-slate-900/50' : ''}`}>
                <div className="flex">
                   <span className="w-8 inline-block text-right select-none text-slate-600 text-xs pr-2 mr-2 border-r border-slate-800/30 shrink-0">
                     {row.right?.rightLine || ''}
                   </span>
                   <span className="whitespace-pre break-all overflow-hidden block w-full">
                     {row.right?.content || ''}
                   </span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SplitDiffView;