import path from "node:path";
import pino from "pino";

const logFile = path.join(process.cwd(), "logs", "notion-api.log");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "HH:MM:ss",
            destination: logFile,
          },
        }
      : undefined,
});

export class NotionAPILogger {
  private static instance: NotionAPILogger;
  private calls: Array<{
    timestamp: number;
    function: string;
    duration?: number;
    success: boolean;
  }> = [];

  static getInstance() {
    if (!NotionAPILogger.instance) {
      NotionAPILogger.instance = new NotionAPILogger();
    }
    return NotionAPILogger.instance;
  }

  logCall(functionName: string, success: boolean, duration?: number) {
    this.calls.push({
      timestamp: Date.now(),
      function: functionName,
      duration,
      success,
    });

    const callNumber = this.calls.length;
    const logData = {
      callNumber,
      function: functionName,
      duration,
      success,
      type: "notion_api_call",
    };

    if (success) {
      logger.info(logData, `✅ Notion API 호출 성공 [${callNumber}]`);
    } else {
      logger.error(logData, `❌ Notion API 호출 실패 [${callNumber}]`);
    }
  }

  getStats() {
    const successful = this.calls.filter((c) => c.success).length;
    const failed = this.calls.filter((c) => c.success === false).length;
    const byFunction = this.calls.reduce(
      (acc, call) => {
        acc[call.function] = (acc[call.function] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const validDurations = this.calls.filter(
      (c) => c.duration && c.duration > 0,
    );
    const averageDuration =
      validDurations.length > 0
        ? /* v8 ignore next -- c.duration is guaranteed >0 by the filter above, so `|| 0` is unreachable and exists only for TS's number|undefined type */
          validDurations.reduce((acc, c) => acc + (c.duration || 0), 0) /
          validDurations.length
        : 0;

    return {
      total: this.calls.length,
      successful,
      failed,
      byFunction,
      averageDuration,
    };
  }

  printFinalStats() {
    const stats = this.getStats();

    // pino로 최종 통계 로깅
    logger.info(
      {
        type: "final_stats",
        stats: {
          total: stats.total,
          successful: stats.successful,
          failed: stats.failed,
          averageDuration: stats.averageDuration,
          byFunction: stats.byFunction,
        },
      },
      "🚀 NOTION API 빌드 통계 (최종)",
    );

    // 콘솔에도 보기 좋게 출력
    console.log("\n🚀 =====================================");
    console.log("🚀 NOTION API 빌드 통계 (최종)");
    console.log("🚀 =====================================");
    console.log(`📊 총 호출 횟수: ${stats.total}`);
    console.log(`✅ 성공: ${stats.successful}`);
    console.log(`❌ 실패: ${stats.failed}`);
    console.log(`⏱️  평균 응답시간: ${stats.averageDuration.toFixed(2)}ms`);
    console.log("\n📋 함수별 호출 횟수:");
    for (const [fn, count] of Object.entries(stats.byFunction)) {
      console.log(`   ${fn}: ${count}회`);
    }
    console.log("🚀 =====================================\n");
  }

  printCurrentStats() {
    const stats = this.getStats();
    logger.info(
      {
        type: "current_stats",
        stats,
      },
      `📊 현재까지 ${stats.total}회 API 호출`,
    );
  }

  static setupBuildEndLogger() {
    const logger = NotionAPILogger.getInstance();

    const printStats = () => {
      logger.printFinalStats();
    };

    process.on("exit", printStats);
    process.on("SIGINT", printStats);
    process.on("SIGTERM", printStats);
    process.on("uncaughtException", (error) => {
      pino().error({ error }, "Uncaught Exception 발생");
      logger.printFinalStats();
      process.exit(1);
    });
  }
}

export function withPinoLogger<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  functionName: string,
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    const apiLogger = NotionAPILogger.getInstance();
    const startTime = Date.now();

    // 호출 시작 로깅
    logger.debug(
      {
        function: functionName,
        args: args.length,
        type: "api_call_start",
      },
      `🚀 ${functionName} 호출 시작`,
    );

    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;

      // 성공 로깅
      apiLogger.logCall(functionName, true, duration);

      logger.debug(
        {
          function: functionName,
          duration,
          type: "api_call_success",
        },
        `✅ ${functionName} 완료`,
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      // 실패 로깅
      apiLogger.logCall(functionName, false, duration);

      logger.error(
        {
          function: functionName,
          duration,
          error: error instanceof Error ? error.message : "Unknown error",
          type: "api_call_error",
        },
        `❌ ${functionName} 실패`,
      );

      throw error;
    }
  };
}
