import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const saveRewrite = mutation({
  args: { originalText: v.string(), targetTone: v.string(), rewrittenText: v.string() },
  handler: async (ctx, args) => await ctx.db.insert("rewrites", { ...args, createdAt: Date.now() }),
});
export const getRecent = query({ args: {}, handler: async (ctx) => await ctx.db.query("rewrites").order("desc").take(20) });
export const getStatus = query({ args: {}, handler: async () => ({ status: "Online", timestamp: Date.now() }) });
