import { execSync } from "node:child_process";
import path from "node:path";
import { config } from "dotenv";

const TEST_DATABASE_URL = "postgresql://postgres:dhanasri_dev_pg@localhost:5432/dhanasri_saree_test";

export default function globalSetup() {
  config({ path: path.resolve(__dirname, "../.env.test"), override: true });

  // Keep the test database's schema in sync before the suite runs.
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    cwd: path.resolve(__dirname, ".."),
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
    stdio: "inherit",
  });
}
