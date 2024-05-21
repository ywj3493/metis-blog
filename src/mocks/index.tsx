export async function enableMocking() {
  console.log("enableMocking");
  if (typeof window === "undefined") {
    const { server } = await import("./server");
    console.log("MSW server");
    server.listen();
  } else {
    const { worker } = await import("./browser");
    console.log("MSW browser");
    await worker.start();
  }
}
