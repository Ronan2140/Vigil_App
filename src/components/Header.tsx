import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-blue-600 text-white p-1.5 md:p-2 rounded-lg">
                <ShieldCheck size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">VigilApp</h1>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium tracking-wide uppercase">Sécurité Députés</p>
            </div>
        </div>
        <div className="hidden sm:block">
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200">
                Usage Officiel
            </span>
        </div>
      </div>
    </header>
  );
};