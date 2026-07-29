import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => {
  const loggers: Array<{
    info: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    debug: ReturnType<typeof vi.fn>;
  }> = [];
  const makeLogger = () => ({
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  });
  const pino = Object.assign(
    vi.fn(() => {
      const l = makeLogger();
      loggers.push(l);
      return l;
    }),
    { stdTimeFunctions: { isoTime: vi.fn() } },
  );
  return { loggers, pino };
});

vi.mock("pino", () => ({ default: h.pino }));

type LoggerModule = typeof import("./logger");

async function freshImport(): Promise<LoggerModule> {
  vi.resetModules();
  h.loggers.length = 0;
  h.pino.mockClear();
  return import("./logger");
}

function moduleLogger() {
  return h.loggers[0];
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("module-level pino logger", () => {
  it("creates the logger without a transport outside development", async () => {
    await freshImport();
    const config = h.pino.mock.calls[0][0] as Record<string, unknown>;
    expect(config.transport).toBeUndefined();
    expect(config.timestamp).toBe(h.pino.stdTimeFunctions.isoTime);
  });

  it("configures a pino-pretty transport in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    await freshImport();
    const config = h.pino.mock.calls[0][0] as {
      transport?: { target: string };
    };
    expect(config.transport).toBeDefined();
    expect(config.transport?.target).toBe("pino-pretty");
  });

  it("honours LOG_LEVEL when set", async () => {
    vi.stubEnv("LOG_LEVEL", "debug");
    await freshImport();
    const config = h.pino.mock.calls[0][0] as Record<string, unknown>;
    expect(config.level).toBe("debug");
  });
});

describe("NotionAPILogger.getInstance", () => {
  it("returns the same singleton instance", async () => {
    const { NotionAPILogger } = await freshImport();
    const a = NotionAPILogger.getInstance();
    const b = NotionAPILogger.getInstance();
    expect(a).toBe(b);
  });
});

describe("NotionAPILogger.logCall", () => {
  it("logs success with logger.info", async () => {
    const { NotionAPILogger } = await freshImport();
    const instance = NotionAPILogger.getInstance();
    instance.logCall("getPosts", true, 42);
    expect(moduleLogger().info).toHaveBeenCalledTimes(1);
    expect(moduleLogger().error).not.toHaveBeenCalled();
  });

  it("logs failure with logger.error", async () => {
    const { NotionAPILogger } = await freshImport();
    const instance = NotionAPILogger.getInstance();
    instance.logCall("getPosts", false, 42);
    expect(moduleLogger().error).toHaveBeenCalledTimes(1);
    expect(moduleLogger().info).not.toHaveBeenCalled();
  });
});

describe("NotionAPILogger.getStats", () => {
  it("returns zeroed stats with no calls (averageDuration 0)", async () => {
    const { NotionAPILogger } = await freshImport();
    const instance = NotionAPILogger.getInstance();
    const stats = instance.getStats();
    expect(stats).toEqual({
      total: 0,
      successful: 0,
      failed: 0,
      byFunction: {},
      averageDuration: 0,
    });
  });

  it("aggregates counts, byFunction and averageDuration across calls", async () => {
    const { NotionAPILogger } = await freshImport();
    const instance = NotionAPILogger.getInstance();
    instance.logCall("getPosts", true, 100);
    instance.logCall("getPosts", true, 200);
    instance.logCall("getTags", false, 0); // duration falsy -> excluded from avg
    instance.logCall("getTags", true, undefined); // duration undefined -> excluded

    const stats = instance.getStats();
    expect(stats.total).toBe(4);
    expect(stats.successful).toBe(3);
    expect(stats.failed).toBe(1);
    expect(stats.byFunction).toEqual({ getPosts: 2, getTags: 2 });
    expect(stats.averageDuration).toBe(150);
  });
});

describe("NotionAPILogger.printFinalStats", () => {
  it("logs final stats via pino and console", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const { NotionAPILogger } = await freshImport();
    const instance = NotionAPILogger.getInstance();
    instance.logCall("getPosts", true, 100);

    instance.printFinalStats();

    expect(moduleLogger().info).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
    // The byFunction loop prints each function line.
    expect(
      logSpy.mock.calls.some((call) => String(call[0]).includes("getPosts")),
    ).toBe(true);
  });
});

describe("NotionAPILogger.printCurrentStats", () => {
  it("logs current stats via pino", async () => {
    const { NotionAPILogger } = await freshImport();
    const instance = NotionAPILogger.getInstance();
    instance.printCurrentStats();
    expect(moduleLogger().info).toHaveBeenCalledWith(
      expect.objectContaining({ type: "current_stats" }),
      expect.stringContaining("API 호출"),
    );
  });
});

describe("NotionAPILogger.setupBuildEndLogger", () => {
  it("registers process handlers that print final stats", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((() => undefined) as never);
    const onSpy = vi
      .spyOn(process, "on")
      .mockImplementation(() => process as never);

    const { NotionAPILogger } = await freshImport();
    NotionAPILogger.setupBuildEndLogger();

    const handlers = new Map<string, (...args: unknown[]) => unknown>();
    for (const call of onSpy.mock.calls) {
      handlers.set(
        call[0] as string,
        call[1] as (...args: unknown[]) => unknown,
      );
    }

    expect(handlers.has("exit")).toBe(true);
    expect(handlers.has("SIGINT")).toBe(true);
    expect(handlers.has("SIGTERM")).toBe(true);
    expect(handlers.has("uncaughtException")).toBe(true);

    // Non-error handlers just print final stats.
    handlers.get("exit")?.();
    handlers.get("SIGINT")?.();
    handlers.get("SIGTERM")?.();
    expect(logSpy).toHaveBeenCalled();

    // uncaughtException handler logs via a new pino logger and exits.
    const callsBefore = h.pino.mock.calls.length;
    handlers.get("uncaughtException")?.(new Error("boom"));
    expect(h.pino.mock.calls.length).toBe(callsBefore + 1);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

describe("withPinoLogger", () => {
  it("logs and returns the result on success", async () => {
    const { withPinoLogger, NotionAPILogger } = await freshImport();
    const logCallSpy = vi.spyOn(NotionAPILogger.getInstance(), "logCall");
    const wrapped = withPinoLogger(
      async (a: number, b: number) => a + b,
      "sum",
    );

    await expect(wrapped(2, 3)).resolves.toBe(5);
    expect(moduleLogger().debug).toHaveBeenCalled();
    expect(logCallSpy).toHaveBeenCalledWith("sum", true, expect.any(Number));
  });

  it("logs and rethrows on error", async () => {
    const { withPinoLogger, NotionAPILogger } = await freshImport();
    const logCallSpy = vi.spyOn(NotionAPILogger.getInstance(), "logCall");
    const err = new Error("kaboom");
    const wrapped = withPinoLogger(async () => {
      throw err;
    }, "failing");

    await expect(wrapped()).rejects.toBe(err);
    expect(logCallSpy).toHaveBeenCalledWith(
      "failing",
      false,
      expect.any(Number),
    );
    expect(moduleLogger().error).toHaveBeenCalled();
  });

  it("logs a generic message when a non-Error is thrown", async () => {
    const { withPinoLogger } = await freshImport();
    const wrapped = withPinoLogger(async () => {
      throw "string failure";
    }, "weird");

    await expect(wrapped()).rejects.toBe("string failure");
    const errorCall = moduleLogger().error.mock.calls.find(
      (c) => (c[0] as { type?: string })?.type === "api_call_error",
    );
    expect((errorCall?.[0] as { error: string }).error).toBe("Unknown error");
  });
});
