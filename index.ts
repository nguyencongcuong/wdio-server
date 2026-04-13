const server = Bun.serve({
  port: process.env.PORT ?? 3000,
  // Default is 10s; /wdio waits for the full test run (often minutes). 0 disables idle timeout.
  idleTimeout: Number(process.env.BUN_IDLE_TIMEOUT ?? 0),
  routes: {
    "/": () => new Response("Welcome to the WebDriverIO server!"),
    "/wdio": async () => {
      const proc = Bun.spawn(["bun", "run", "wdio"], {
        cwd: import.meta.dir,
        env: process.env,
        stdout: "pipe",
        stderr: "pipe",
      });

      const [exitCode, stdout, stderr] = await Promise.all([
        proc.exited,
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
      ]);

      const body =
        stdout +
        (stderr.trim().length > 0 ? `\n--- stderr ---\n${stderr}` : "");

      return new Response(body, {
        status: exitCode === 0 ? 200 : 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    },
  },
});

console.log(`Server running at http://localhost:${server.port}`);
