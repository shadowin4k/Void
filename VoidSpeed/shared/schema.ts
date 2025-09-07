import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const speedTests = pgTable("speed_tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  downloadSpeed: real("download_speed").notNull(),
  uploadSpeed: real("upload_speed").notNull(),
  ping: integer("ping").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const securityAnalysis = pgTable("security_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threatLevel: text("threat_level").notNull().default("clean"),
  riskScore: integer("risk_score").notNull().default(0),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  isKnownAttacker: boolean("is_known_attacker").notNull().default(false),
  hasMalware: boolean("has_malware").notNull().default(false),
  overallThreat: text("overall_threat").notNull().default("benign"),
  reputation: text("reputation").notNull().default("clean"),
  anonymization: text("anonymization").notNull().default("none"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const connectionInfo = pgTable("connection_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  isTor: boolean("is_tor").notNull().default(false),
  isProxy: boolean("is_proxy").notNull().default(false),
  isp: text("isp").notNull(),
  asn: text("asn").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSpeedTestSchema = createInsertSchema(speedTests).omit({
  id: true,
  createdAt: true,
});

export const insertSecurityAnalysisSchema = createInsertSchema(securityAnalysis).omit({
  id: true,
  createdAt: true,
});

export const insertConnectionInfoSchema = createInsertSchema(connectionInfo).omit({
  id: true,
  createdAt: true,
});

export type InsertSpeedTest = z.infer<typeof insertSpeedTestSchema>;
export type SpeedTest = typeof speedTests.$inferSelect;

export type InsertSecurityAnalysis = z.infer<typeof insertSecurityAnalysisSchema>;
export type SecurityAnalysis = typeof securityAnalysis.$inferSelect;

export type InsertConnectionInfo = z.infer<typeof insertConnectionInfoSchema>;
export type ConnectionInfo = typeof connectionInfo.$inferSelect;
