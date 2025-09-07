import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import StarField from "@/components/StarField";
import SpeedMetrics from "@/components/SpeedMetrics";
import SecurityPanel from "@/components/SecurityPanel";
import ConnectionInfo from "@/components/ConnectionInfo";
import ThreatAnalysis from "@/components/ThreatAnalysis";

export default function Dashboard() {
  // Queries for data
  const { data: speedTest, isLoading: speedLoading } = useQuery({
    queryKey: ["/api/speed-test/latest"],
  });

  const { data: security, isLoading: securityLoading } = useQuery({
    queryKey: ["/api/security/latest"],
  });

  const { data: connection, isLoading: connectionLoading } = useQuery({
    queryKey: ["/api/connection/latest"],
  });

  const { data: status } = useQuery({
    queryKey: ["/api/status"],
  });

  // Mutations for triggering new tests
  const speedTestMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/speed-test"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/speed-test/latest"] });
    },
  });

  const securityAnalysisMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/security/analyze"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security/latest"] });
    },
  });

  const connectionInfoMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/connection/gather"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connection/latest"] });
    },
  });

  // Track visit when component mounts
  useEffect(() => {
    // Track the visit
    apiRequest("POST", "/api/visit").catch(console.error);
  }, []);

  // Auto-start tests on component mount
  useEffect(() => {
    if (!speedTest) {
      speedTestMutation.mutate();
    }
    if (!security) {
      securityAnalysisMutation.mutate();
    }
    if (!connection) {
      connectionInfoMutation.mutate();
    }
  }, [speedTest, security, connection]);

  // Removed auto-refresh to prevent constant page updates

  return (
    <div className="min-h-screen bg-void-dark text-white relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10 min-h-screen p-6">
        {/* Header */}
        <header className="text-center mb-12" data-testid="header-main">
          <h1 className="text-6xl font-light tracking-[0.3em] mb-4" data-testid="text-title">
            V O I D
          </h1>
          <p className="text-gray-400 text-lg tracking-wide" data-testid="text-subtitle">
            NETWORK SPEED & SECURITY MONITOR
          </p>
        </header>

        {/* Speed Metrics */}
        <SpeedMetrics 
          speedTest={speedTest}
          isLoading={speedLoading || speedTestMutation.isPending}
        />

        {/* Security Panels */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <SecurityPanel 
            security={security}
            isLoading={securityLoading}
          />
          
          <ConnectionInfo 
            connection={connection}
            isLoading={connectionLoading}
          />
          
          <ThreatAnalysis 
            security={security}
            isLoading={securityLoading}
          />
        </div>

        {/* Status Indicator */}
        <div className="max-w-7xl mx-auto mt-12 text-center" data-testid="status-indicator">
          <div className="card-bg rounded-xl p-4 inline-block">
            <span className="text-void-green text-sm font-medium glow-effect" data-testid="status-text">
              ● REAL-TIME MONITORING ACTIVE
            </span>
            <span className="text-gray-400 text-sm ml-4" data-testid="status-timestamp">
              Last updated: {status ? new Date(status.lastUpdate).toLocaleTimeString() : "Loading..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
