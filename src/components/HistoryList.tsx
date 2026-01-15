import React from 'react';
import { AppAnalysis } from '../types';
import { Clock, ChevronRight, Trash2 } from 'lucide-react';

interface HistoryListProps {
  history: AppAnalysis[];
  onSelect: (item: AppAnalysis) => void;
  onClear: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-6 md:mt-10 animate-fade-in pb-8">
      <div className="flex items-center justify-between mb-3 md:mb-4 px-1">
          <h3 className="text-base md:text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Clock size={18} className="text-slate-400 md:w-5 md:h-5"/>
            Historique récent
          </h3>
          <button 
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="text-xs font-medium text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 px-2 py-1 -mr-2"
          >
            <Trash2 size={14} />
            Effacer
          </button>
      </div>
      <div className="space-y-2 md:space-y-3">
        {history.map((item, index) => (
          <div 
            key={index}
            onClick={() => onSelect(item)}
            className="bg-white border border-slate-200 rounded-lg md:rounded-xl p-3 md:p-4 flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group active:scale-[0.98] duration-150"
          >
            <div className="min-w-0 pr-2">
              <h4 className="font-semibold text-slate-800 text-sm md:text-base truncate">{item.appName}</h4>
              <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500 mt-0.5">
                 <span>{item.timestamp ? new Date(item.timestamp).toLocaleDateString('fr-FR') : '-'}</span>
                 <span className="opacity-50">•</span>
                 <span className="truncate max-w-[120px] md:max-w-[150px]">{item.countryOfOrigin}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
               <div className={`px-2 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold ${
                   item.score >= 15 ? 'bg-green-100 text-green-800 border border-green-200' :
                   item.score >= 10 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                   'bg-red-100 text-red-800 border border-red-200'
               }`}>
                 {item.score}/20
               </div>
               <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors md:w-[18px] md:h-[18px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};