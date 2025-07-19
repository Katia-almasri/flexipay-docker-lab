import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/Database.config.js";
import { processWeeklyPayouts } from "../jobs/Payout.job.js";

(async () => {
  await connectDB();

  // 🕓 Every Monday at 2:00 AM
  cron.schedule("*/1 * * * *", async () => {
    console.log("🚀 Starting weekly payout job...");
    await processWeeklyPayouts();
  });

  console.log("📅 Cron job scheduled: Weekly Payout (every Monday @ 2AM)");
})();
