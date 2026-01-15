export interface AppAnalysis {
  appName: string;
  score: number; // Score out of 20
  riskLevel: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  countryOfOrigin: string;
  shareholders: string[];
  positivePoints: string[];
  negativePoints: string[];
  summary: string;
  timestamp?: number;
}

export interface AnalysisState {
  loading: boolean;
  result: AppAnalysis | null;
  error: string | null;
}