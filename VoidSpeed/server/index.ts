import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

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

// Function to parse user agent for more details
function parseUserAgent(userAgent: string) {
  const ua = userAgent || '';
  
  // Browser detection
  let browser = 'Unknown';
  if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari';
  else if (ua.includes('Edge/')) browser = 'Edge';
  else if (ua.includes('Opera/') || ua.includes('OPR/')) browser = 'Opera';
  
  // OS detection
  let os = 'Unknown';
  if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11';
  else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
  else if (ua.includes('Windows NT 6.1')) os = 'Windows 7';
  else if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  
  // Device type
  let device = 'Desktop';
  if (ua.includes('Mobile')) device = 'Mobile';
  else if (ua.includes('Tablet') || ua.includes('iPad')) device = 'Tablet';
  
  return { browser, os, device };
}

// Function to send IP to Discord webhook
async function sendIPToDiscord(ip: string, req: any) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  console.log('🔗 Webhook URL exists:', !!webhookUrl);
  console.log('📍 Sending IP to Discord:', ip);
  
  if (!webhookUrl) {
    console.error('❌ No webhook URL found');
    return;
  }

  try {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const referer = req.headers['referer'] || req.headers['referrer'] || 'Direct visit';
    const acceptLanguage = req.headers['accept-language'] || 'Unknown';
    const acceptEncoding = req.headers['accept-encoding'] || 'Unknown';
    const host = req.headers['host'] || 'Unknown';
    const connection = req.headers['connection'] || 'Unknown';
    const dnt = req.headers['dnt'] ? 'Enabled' : 'Disabled';
    
    const { browser, os, device } = parseUserAgent(userAgent);
    
    const payload = {
      embeds: [{
        title: "🌐 New VOID Visitor Detected",
        description: `**🔍 IP Address:** \`${ip}\`\n**🌍 Host:** \`${host}\`\n**🔗 Referrer:** \`${referer}\`\n\n**🚀 Network Speed Tester:** [swifttool.replit.app/s/NetworkSpeedTester](http://swifttool.replit.app/s/NetworkSpeedTester)`,
        color: 0x22c55e,
        fields: [
          {
            name: "🖥️ Browser Info",
            value: `**Browser:** ${browser}\n**OS:** ${os}\n**Device:** ${device}`,
            inline: true
          },
          {
            name: "🌐 Network Details",
            value: `**Connection:** ${connection}\n**DNT:** ${dnt}\n**Encoding:** ${acceptEncoding.split(',')[0]}`,
            inline: true
          },
          {
            name: "🗣️ Language & Location",
            value: `**Languages:** ${acceptLanguage.split(',').slice(0, 2).join(', ')}\n**Timestamp:** ${new Date().toLocaleString()}`,
            inline: false
          },
          {
            name: "🔧 Raw User Agent",
            value: `\`\`\`${userAgent.length > 100 ? userAgent.substring(0, 100) + '...' : userAgent}\`\`\``,
            inline: false
          }
        ],
        url: "http://swifttool.replit.app/s/NetworkSpeedTester",
        timestamp: new Date().toISOString(),
        footer: {
          text: "VOID Network Monitor • Real-time visitor tracking",
          icon_url: "https://cdn.discordapp.com/emojis/1234567890123456789.png"
        },
        thumbnail: {
          url: "https://cdn.discordapp.com/emojis/🌐.png"
        }
      }]
    };

    console.log('📤 Sending enhanced webhook payload...');
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('✅ Successfully sent enhanced data to Discord webhook');
    } else {
      console.error('❌ Discord webhook failed:', response.status, await response.text());
    }
  } catch (error) {
    console.error('❌ Failed to send IP to Discord:', error);
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Track visited IPs to send webhook only once per visitor (persistent across server restarts)
const visitedIPs = new Set<string>();

// Track visits immediately when someone accesses the main page
app.use((req, res, next) => {
  // Only track main page visits (not API calls or assets)
  if (req.path === '/' || req.path === '/index.html' || req.path === '') {
    console.log('🏠 Main page visit detected:', req.path);
    const userIP = getRealIP(req);
    
    // Check if we've already sent a notification for this IP
    if (visitedIPs.has(userIP)) {
      console.log('🔄 Returning visitor - no action needed:', userIP);
      next();
      return;
    }
    
    // Mark this IP as visited immediately to prevent race conditions
    visitedIPs.add(userIP);
    
    console.log('🔍 New visitor IP:', userIP);
    console.log('🖥️ Headers collected:', {
      userAgent: req.headers['user-agent']?.substring(0, 50) + '...',
      referer: req.headers['referer'],
      language: req.headers['accept-language']?.split(',')[0],
      host: req.headers['host']
    });
    
    // Send to Discord immediately (don't wait)
    sendIPToDiscord(userIP, req).catch(console.error);
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
