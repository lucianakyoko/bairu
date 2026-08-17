import { spawnSync } from "node:child_process";

const environment = process.argv[2];
const command = process.argv.slice(3);

const allowedEnvironments = new Set(["development", "test"]);

if (!allowedEnvironments.has(environment)) {
  console.error(
    `Unsupported environment "${environment}". Supported environments: development, test.`,
  );
  process.exit(1);
}

if (command.length === 0) {
  console.error("No command provided.");
  process.exit(1);
}

const result = spawnSync(command[0], command.slice(1), {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: environment,
  },
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
