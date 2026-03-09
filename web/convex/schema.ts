import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
export default defineSchema({
  ...authTables,
  userProfiles: defineTable({ userId: v.string(), totalRewrites: v.number(), createdAt: v.number() }).index("by_userId", ["userId"]),
  rewrites: defineTable({
    originalText: v.string(), targetTone: v.string(), rewrittenText: v.string(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
