import React from 'react';
import { AppAnalysis } from '../types';
import { CheckCircle2, XCircle, Globe, Building2, Info } from 'lucide-react';

interface ResultDisplayProps {
  data: AppAnalysis;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data }) => {
  
  const getScoreColor = (score: number) => {
    if (score >= 15) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 10) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskBadge = (level: string) => {
    switch(level) {
        case 'SAFE': return <span className="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-green-100 text-green-800 text-xs md:text-sm font-bold border border-green-200">SÛR</span>;
        case 'MODERATE': return <span className="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs md:text-sm font-bold border border-yellow-200">MODÉRÉ</span>;
        case 'HIGH': return <span className="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-orange-100 text-orange-800 text-xs md:text-sm font-bold border border-orange-200">RISQUÉ</span>;
        case 'CRITICAL': return <span className="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-red-100 text-red-800 text-xs md:text-sm font-bold border border-red-200">DANGEREUX</span>;
        default: return null;
    }
  };

  const scoreColorClass = getScoreColor(data.score);
  const borderColor = scoreColorClass.replace('bg-', 'border-').split(' ')[2];
  const textColor = scoreColorClass.split(' ')[0];

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in pb-4">
      
      {/* Header Card */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6">
        <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className="pr-2">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{data.appName}</h2>
                <div className="flex items-center gap-1.5 md:gap-2 mt-1.5 md:mt-2 text-slate-500">
                    <Globe size={14} className="md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm">Origine : <span className="font-semibold text-slate-700">{data.countryOfOrigin}</span></span>
                </div>
            </div>
            {/* Score Circle - Smaller on mobile */}
            <div className={`flex flex-col items-center justify-center shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 ${borderColor}`}>
                <span className={`text-xl md:text-2xl font-bold ${textColor}`}>{data.score}</span>
                <span className="text-[10px] text-slate-400 font-medium">/ 20</span>
            </div>
        </div>
        
        <div className="mb-3 md:mb-4">
            {getRiskBadge(data.riskLevel)}
        </div>

        <p className="text-sm md:text-base text-slate-600 italic border-l-4 border-blue-500 pl-3 md:pl-4 py-1 bg-slate-50 rounded-r-lg">
            "{data.summary}"
        </p>

        {/* Ownership Info */}
        <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-slate-100">
            <div className="flex items-start gap-2">
                <Building2 className="text-slate-400 mt-0.5 md:mt-1 shrink-0" size={16} />
                <div>
                    <h3 className="text-xs md:text-sm font-semibold text-slate-900">Actionnariat / Propriétaire</h3>
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mt-1">
                        {data.shareholders.map((holder, idx) => (
                            <span key={idx} className="inline-block bg-slate-100 text-slate-700 text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded border border-slate-200">
                                {holder}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Pros & Cons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        
        {/* Positives */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
            <h3 className="text-base md:text-lg font-semibold text-green-700 flex items-center gap-2 mb-3 md:mb-4">
                <CheckCircle2 size={18} className="md:w-5 md:h-5" />
                Points Positifs
            </h3>
            <ul className="space-y-2 md:space-y-3">
                {data.positivePoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 md:gap-3 text-sm text-slate-700 leading-snug">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></span>
                        {point}
                    </li>
                ))}
            </ul>
        </div>

        {/* Negatives */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
            <h3 className="text-base md:text-lg font-semibold text-red-700 flex items-center gap-2 mb-3 md:mb-4">
                <XCircle size={18} className="md:w-5 md:h-5" />
                Points de Vigilance
            </h3>
            <ul className="space-y-2 md:space-y-3">
                {data.negativePoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 md:gap-3 text-sm text-slate-700 leading-snug">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"></span>
                        {point}
                    </li>
                ))}
            </ul>
        </div>
      </div>

       <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 md:p-4 flex gap-3 text-xs md:text-sm text-blue-800">
            <Info className="shrink-0 text-blue-600" size={18} />
            <p className="leading-relaxed">
                Score généré par IA basé sur les infos publiques. Vérifiez les protocoles officiels.
            </p>
       </div>

    </div>
  );
};