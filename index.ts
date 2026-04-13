const server = Bun.serve({
  port: process.env.PORT ?? 3000,
  routes: {
    "/": () => new Response("Welcome to the WebDriverIO server!"),
    "/wdio": async () => {
      const process = Bun.spawn(["bun", "wdio"])

      return new Response(process.stdout, {status: 200});
    }
  }
});

console.log(`Server running at http://localhost:${server.port}`);
