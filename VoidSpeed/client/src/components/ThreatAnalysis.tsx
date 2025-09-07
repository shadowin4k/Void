import { SecurityAnalysis } from "@shared/schema";

interface ThreatAnalysisProps {
  security?: SecurityAnalysis;
  isLoading: boolean;
}

export default function ThreatAnalysis({ security, isLoading }: ThreatAnalysisProps) {
  const getRiskLevel = (score: number) => {
    if (score < 10) return { label: "LOW RISK", color: "text-void-green" };
    if (score < 30) return { label: "MEDIUM RISK", color: "text-yellow-400" };
    if (score < 60) return { label: "HIGH RISK", color: "text-orange-400" };
    return { label: "CRITICAL RISK", color: "text-red-400" };
  };

  if (isLoading) {
    return (
      <div className="card-bg rounded-xl p-6" data-testid="card-threat-loading">
        <h2 className="text-lg font-semibold mb-6 tracking-wider" data-testid="text-threat-title">
          THREAT ANALYSIS
        </h2>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Security Risk Score</span>
            <span className="text-gray-600">Loading...</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-gray-600 h-2 rounded-full w-1/4 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const riskLevel = getRiskLevel(security?.riskScore || 0);
  const riskPercentage = Math.min((security?.riskScore || 0), 100);

  return (
    <div className="card-bg rounded-xl p-6" data-testid="card-threat">
      <h2 className="text-lg font-semibold mb-6 tracking-wider" data-testid="text-threat-title">
        THREAT ANALYSIS
      </h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2" data-testid="row-risk-score">
          <span className="text-gray-400">Security Risk Score</span>
          <span className="text-void-green font-bold glow-effect" data-testid="text-risk-score">
            {security?.riskScore || 0}/100
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2" data-testid="progress-risk-container">
          <div 
            className="bg-void-green h-2 rounded-full glow-effect transition-all duration-1000"
            style={{ width: `${Math.max(riskPercentage, 2)}%` }}
            data-testid="progress-risk-bar"
          />
        </div>
        <span 
          className={`text-xs mt-1 block ${riskLevel.color}`}
          data-testid="text-risk-level"
        >
          {riskLevel.label}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center" data-testid="row-overall-threat">
          <span className="text-gray-400 text-sm">Overall Threat:</span>
          <span 
            className={`text-sm font-medium ${
              security?.overallThreat === "benign" 
                ? "text-void-green glow-effect" 
                : security?.overallThreat === "suspicious"
                ? "text-yellow-400"
                : "text-red-400"
            }`}
            data-testid="text-overall-threat"
          >
            {security?.overallThreat?.toUpperCase() || "UNKNOWN"}
          </span>
        </div>
        
        <div className="flex justify-between items-center" data-testid="row-reputation">
          <span className="text-gray-400 text-sm">Reputation:</span>
          <span 
            className={`text-sm font-medium ${
              security?.reputation === "clean" 
                ? "text-void-green glow-effect" 
                : "text-yellow-400"
            }`}
            data-testid="text-reputation"
          >
            {security?.reputation?.toUpperCase() || "UNKNOWN"}
          </span>
        </div>
        
        <div className="flex justify-between items-center" data-testid="row-anonymization">
          <span className="text-gray-400 text-sm">Anonymization:</span>
          <span className="text-gray-300 text-sm" data-testid="text-anonymization">
            {security?.anonymization?.toUpperCase() || "NONE"}
          </span>
        </div>
      </div>
    </div>
  );
}
