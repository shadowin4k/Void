import { SpeedTest } from "@shared/schema";

interface SpeedMetricsProps {
  speedTest?: SpeedTest;
  isLoading: boolean;
}

export default function SpeedMetrics({ speedTest, isLoading }: SpeedMetricsProps) {
  const getStatusDisplay = () => {
    if (isLoading) return <span className="text-yellow-400">TESTING</span>;
    if (speedTest) return <span className="text-void-green">ACTIVE</span>;
    return <span className="text-gray-400">IDLE</span>;
  };

  const getProgressWidth = () => {
    if (isLoading) return "loading-bar";
    return speedTest ? "w-full" : "w-0";
  };

  return (
    <div className="max-w-7xl mx-auto mb-12" data-testid="speed-metrics-container">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Speed Test Status */}
        <div className="card-bg rounded-xl p-6 text-center" data-testid="card-speed-status">
          <h3 className="text-sm font-medium text-gray-400 mb-2 tracking-wider" data-testid="text-speed-label">
            SPEED TEST
          </h3>
          <div className="text-3xl font-bold mb-2 speed-pulse" data-testid="text-speed-status">
            {getStatusDisplay()}
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mb-2" data-testid="progress-container">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${getProgressWidth()}`}
              style={{ 
                background: isLoading 
                  ? "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)"
                  : "#22c55e"
              }}
              data-testid="progress-bar"
            />
          </div>
          <p className="text-xs text-gray-500" data-testid="text-refresh-info">
            Auto-refresh every 30s
          </p>
        </div>

        {/* Download Speed */}
        <div className="card-bg rounded-xl p-6 text-center" data-testid="card-download">
          <h3 className="text-sm font-medium text-gray-400 mb-2 tracking-wider" data-testid="text-download-label">
            DOWNLOAD
          </h3>
          <div className="text-3xl font-bold mb-2" data-testid="text-download-speed">
            <span className="text-void-green">
              {isLoading ? "..." : speedTest?.downloadSpeed?.toFixed(1) || "0.0"}
            </span>
          </div>
          <p className="text-sm text-gray-400" data-testid="text-download-unit">Mbps</p>
          <div className="mt-2 flex justify-center">
            <div 
              className="h-1 bg-void-green rounded glow-effect transition-all duration-500"
              style={{ width: speedTest ? `${Math.min(speedTest.downloadSpeed / 2, 48)}px` : "12px" }}
              data-testid="indicator-download"
            />
          </div>
        </div>

        {/* Upload Speed */}
        <div className="card-bg rounded-xl p-6 text-center" data-testid="card-upload">
          <h3 className="text-sm font-medium text-gray-400 mb-2 tracking-wider" data-testid="text-upload-label">
            UPLOAD
          </h3>
          <div className="text-3xl font-bold mb-2" data-testid="text-upload-speed">
            <span className="text-void-green">
              {isLoading ? "..." : speedTest?.uploadSpeed?.toFixed(1) || "0.0"}
            </span>
          </div>
          <p className="text-sm text-gray-400" data-testid="text-upload-unit">Mbps</p>
          <div className="mt-2 flex justify-center">
            <div 
              className="h-1 bg-void-green rounded glow-effect transition-all duration-500"
              style={{ width: speedTest ? `${Math.min(speedTest.uploadSpeed / 3, 32)}px` : "8px" }}
              data-testid="indicator-upload"
            />
          </div>
        </div>

        {/* Ping */}
        <div className="card-bg rounded-xl p-6 text-center" data-testid="card-ping">
          <h3 className="text-sm font-medium text-gray-400 mb-2 tracking-wider" data-testid="text-ping-label">
            PING
          </h3>
          <div className="text-3xl font-bold mb-2" data-testid="text-ping-speed">
            <span className="text-void-green">
              {isLoading ? "..." : speedTest?.ping || "0"}
            </span>
          </div>
          <p className="text-sm text-gray-400" data-testid="text-ping-unit">ms</p>
          <div className="mt-2 flex justify-center">
            <div 
              className="h-1 bg-void-green rounded glow-effect transition-all duration-500"
              style={{ width: speedTest ? `${Math.max(16 - (speedTest.ping / 2), 4)}px` : "16px" }}
              data-testid="indicator-ping"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
