import { SecurityAnalysis } from "@shared/schema";

interface SecurityPanelProps {
  security?: SecurityAnalysis;
  isLoading: boolean;
}

export default function SecurityPanel({ security, isLoading }: SecurityPanelProps) {
  if (isLoading) {
    return (
      <div className="card-bg rounded-xl p-6" data-testid="card-security-loading">
        <h2 className="text-lg font-semibold mb-6 tracking-wider" data-testid="text-security-title">
          SECURITY
        </h2>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-gray-400">Loading...</span>
              <span className="text-gray-600">...</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-bg rounded-xl p-6" data-testid="card-security">
      <h2 className="text-lg font-semibold mb-6 tracking-wider" data-testid="text-security-title">
        SECURITY
      </h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center" data-testid="row-threat-level">
          <span className="text-gray-400">Threat Level:</span>
          <span 
            className={`font-medium ${
              security?.threatLevel === "clean" 
                ? "text-void-green glow-effect" 
                : security?.threatLevel === "low"
                ? "text-yellow-400"
                : "text-red-400"
            }`}
            data-testid="text-threat-level"
          >
            {security?.threatLevel?.toUpperCase() || "UNKNOWN"}
          </span>
        </div>
        
        <div className="flex justify-between items-center" data-testid="row-anonymous">
          <span className="text-gray-400">Anonymous:</span>
          <span className="text-gray-300" data-testid="text-anonymous">
            {security?.isAnonymous ? "YES" : "NO"}
          </span>
        </div>
        
        <div className="flex justify-between items-center" data-testid="row-known-attacker">
          <span className="text-gray-400">Known Attacker:</span>
          <span className="text-gray-300" data-testid="text-known-attacker">
            {security?.isKnownAttacker ? "YES" : "NO"}
          </span>
        </div>
        
        <div className="flex justify-between items-center" data-testid="row-malware">
          <span className="text-gray-400">Malware:</span>
          <span 
            className={`font-medium ${
              security?.hasMalware 
                ? "text-red-400" 
                : "text-void-green glow-effect"
            }`}
            data-testid="text-malware"
          >
            {security?.hasMalware ? "DETECTED" : "CLEAN"}
          </span>
        </div>
      </div>
    </div>
  );
}
