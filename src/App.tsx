import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryList } from './components/HistoryList';
import { LoadingScreen } from './components/LoadingScreen';
import { analyzeAppUrl } from './server/geminiService';
import { AppAnalysis, AnalysisState } from './types';
import { Search, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    result: null,
    error: null,
  });
  const [history, setHistory] = useState<AppAnalysis[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('vigilapp_history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const saveToHistory = (analysis: AppAnalysis) => {
    // Avoid duplicates by removing existing entry for the same app name
    const filteredHistory = history.filter(item => item.appName !== analysis.appName);
    const newHistory = [analysis, ...filteredHistory].slice(0, 20); // Keep last 20 items
    setHistory(newHistory);
    localStorage.setItem('vigilapp_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('vigilapp_history');
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setState({ loading: true, result: null, error: null });

    try {
      console.log("Appel API pour analyser :", url);
      const response = await fetch('http://localhost:3001/api/app-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      setState({ loading: false, result: data, error: null });
      saveToHistory(data);
    } catch (err: any) {
      setState({
        loading: false,
        result: null,
        error: err.message || "Une erreur est survenue lors de l'analyse."
      });
    }
  };

  const handleBackToHome = () => {
    setState({ loading: false, result: null, error: null });
    setUrl('');
  };

  const handleSelectHistory = (item: AppAnalysis) => {
    setState({ loading: false, result: item, error: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-grow container max-w-3xl mx-auto px-4 py-4 md:py-8">

        {/* Intro Text */}
        {!state.result && !state.loading && (
          <div className="text-center mb-6 md:mb-10 mt-2 md:mt-4 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">Vérification de Conformité</h2>
            <p className="text-sm md:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
              Collez le lien App Store ou Google Play d'une application pour obtenir une analyse de sécurité immédiate.
            </p>
          </div>
        )}

        {/* Back Button when viewing result */}
        {state.result && (
          <button
            onClick={handleBackToHome}
            className="mb-3 md:mb-4 text-slate-500 hover:text-blue-600 font-medium flex items-center gap-1.5 text-sm md:text-base transition-colors"
          >
            <ArrowLeft size={16} className="md:w-[18px] md:h-[18px]" />
            Retour à la recherche
          </button>
        )}

        {/* Input Form - Hide when result is shown for cleaner look, or keep? Let's keep it but maybe disable */}
        {!state.result && (
          <div className={`bg-white p-1.5 md:p-2 rounded-xl shadow-lg border border-slate-200 mb-6 md:mb-8 sticky top-20 md:top-24 z-40 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 ${state.loading ? 'opacity-50 pointer-events-none' : ''}`}>
            <form onSubmit={handleAnalyze} className="flex gap-1 md:gap-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  placeholder="Lien App Store / Play Store..."
                  className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 bg-transparent border-none focus:ring-0 text-slate-900 text-sm md:text-base placeholder-slate-400 outline-none rounded-lg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={state.loading || !url}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shrink-0 text-sm md:text-base"
              >
                <span className="hidden sm:inline">Analyser</span>
                <ArrowRight size={18} className="sm:hidden" />
                <ArrowRight size={18} className="hidden sm:inline" />
              </button>
            </form>
          </div>
        )}

        {/* Loading State Animation */}
        {state.loading && (
          <LoadingScreen />
        )}

        {/* Error Message */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 md:px-6 md:py-4 rounded-xl text-center mb-6 md:mb-8 text-sm md:text-base animate-fade-in">
            <p className="font-semibold">Erreur d'analyse</p>
            <p className="mt-1 opacity-90">{state.error}</p>
          </div>
        )}

        {/* Results */}
        {state.result ? (
          <ResultDisplay data={state.result} />
        ) : (
          /* History List (only shown when no result is active) */
          !state.loading && (
            <HistoryList
              history={history}
              onSelect={handleSelectHistory}
              onClear={clearHistory}
            />
          )
        )}

      </main>

      <footer className="bg-white border-t border-slate-200 py-4 md:py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-[10px] md:text-xs leading-relaxed">
            © 2024 République Française - Outil interne d'aide à la décision.
            <br />Données fournies par Gemini Pro via Google Search Grounding.
          </p>
        </div>
      </footer>
    </div>
  );
}