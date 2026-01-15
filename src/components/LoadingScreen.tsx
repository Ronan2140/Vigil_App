import React, { useState, useEffect } from 'react';
import { Shield, Search, Database, Globe, Lock, FileCheck } from 'lucide-react';

const steps = [
  { text: "Initialisation du protocole sécurisé...", icon: Shield },
  { text: "Recherche de l'empreinte numérique...", icon: Search },
  { text: "Scan des bases de données internationales...", icon: Database },
  { text: "Analyse de la structure capitalistique...", icon: Globe },
  { text: "Vérification des antécédents de sécurité...", icon: Lock },
  { text: "Compilation du rapport de conformité...", icon: FileCheck },
];

export const LoadingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Cycle through steps every 1.2 seconds, stopping at the last one
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
      {/* Animated Icon Container */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full pulse-ring"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg border border-blue-100 z-10">
          <CurrentIcon className="w-10 h-10 text-blue-600 animate-pulse" />
        </div>
      </div>

      {/* Text Output */}
      <div className="text-center space-y-2 max-w-xs mx-auto">
        <h3 className="text-lg font-semibold text-slate-800">Analyse en cours</h3>
        <div className="h-6 overflow-hidden relative">
            {/* We key the text to force a little fade animation on change */}
            <p key={currentStep} className="text-sm text-slate-500 font-medium animate-fade-in">
              {steps[currentStep].text}
            </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-48 md:w-64 h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
        <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
      
      <p className="text-[10px] text-slate-400 mt-8 uppercase tracking-widest">
        VigilApp Security Core
      </p>
    </div>
  );
};