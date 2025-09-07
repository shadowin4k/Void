import { type SpeedTest, type InsertSpeedTest, type SecurityAnalysis, type InsertSecurityAnalysis, type ConnectionInfo, type InsertConnectionInfo } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Speed Test methods
  getLatestSpeedTest(): Promise<SpeedTest | undefined>;
  createSpeedTest(speedTest: InsertSpeedTest): Promise<SpeedTest>;
  getSpeedTestHistory(limit?: number): Promise<SpeedTest[]>;

  // Security Analysis methods
  getLatestSecurityAnalysis(): Promise<SecurityAnalysis | undefined>;
  createSecurityAnalysis(analysis: InsertSecurityAnalysis): Promise<SecurityAnalysis>;

  // Connection Info methods
  getLatestConnectionInfo(): Promise<ConnectionInfo | undefined>;
  createConnectionInfo(info: InsertConnectionInfo): Promise<ConnectionInfo>;
}

export class MemStorage implements IStorage {
  private speedTests: Map<string, SpeedTest>;
  private securityAnalyses: Map<string, SecurityAnalysis>;
  private connectionInfos: Map<string, ConnectionInfo>;

  constructor() {
    this.speedTests = new Map();
    this.securityAnalyses = new Map();
    this.connectionInfos = new Map();
  }

  async getLatestSpeedTest(): Promise<SpeedTest | undefined> {
    const tests = Array.from(this.speedTests.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return tests[0];
  }

  async createSpeedTest(insertSpeedTest: InsertSpeedTest): Promise<SpeedTest> {
    const id = randomUUID();
    const speedTest: SpeedTest = {
      ...insertSpeedTest,
      id,
      createdAt: new Date(),
    };
    this.speedTests.set(id, speedTest);
    return speedTest;
  }

  async getSpeedTestHistory(limit = 10): Promise<SpeedTest[]> {
    const tests = Array.from(this.speedTests.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return tests.slice(0, limit);
  }

  async getLatestSecurityAnalysis(): Promise<SecurityAnalysis | undefined> {
    const analyses = Array.from(this.securityAnalyses.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return analyses[0];
  }

  async createSecurityAnalysis(insertAnalysis: InsertSecurityAnalysis): Promise<SecurityAnalysis> {
    const id = randomUUID();
    const analysis: SecurityAnalysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date(),
    };
    this.securityAnalyses.set(id, analysis);
    return analysis;
  }

  async getLatestConnectionInfo(): Promise<ConnectionInfo | undefined> {
    const infos = Array.from(this.connectionInfos.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return infos[0];
  }

  async createConnectionInfo(insertInfo: InsertConnectionInfo): Promise<ConnectionInfo> {
    const id = randomUUID();
    const info: ConnectionInfo = {
      ...insertInfo,
      id,
      createdAt: new Date(),
    };
    this.connectionInfos.set(id, info);
    return info;
  }
}

export const storage = new MemStorage();
