import { ConnectionInfo as ConnectionInfoType } from "@shared/schema";

interface ConnectionInfoProps {
  connection?: ConnectionInfoType;
  isLoading: boolean;
}

export default function ConnectionInfo({ connection, isLoading }: ConnectionInfoProps) {
  if (isLoading) {
    return (
      <div className="card-bg rounded-xl p-6" data-testid="card-connection-loading">
        <h2 className="text-lg font-semibold mb-6 tracking-wider" data-testid="text-connection-title">
          CONNECTION
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
    <div className="card-bg rounded-xl p-6" data-testid="card-connection">
      <h2 className="text-lg font-semibold mb-6 tracking-wider" data-testid="text-connection-title">
        CONNECTION
      </h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center" data-testid="row-tor-network">
          <span className="text-gray-400">Tor Network:</span>
          <span className="text-gray-300" data-testid="text-tor">
            {connection?.isTor ? "YES" : "NO"}
          </span>
        </div>
        
        <div className="flex justify-between items-center" data-testid="row-proxy-vpn">
          <span className="text-gray-400">Proxy/VPN:</span>
          <span className="text-gray-300" data-testid="text-proxy">
            {connection?.isProxy ? "YES" : "NO"}
          </span>
        </div>
      </div>
    </div>
  );
}
