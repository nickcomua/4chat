import { NodeSdk } from "@effect/opentelemetry"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { Effect, Logger, LogLevel, Redacted, Scope } from "effect";
import { DevTools } from "@effect/experimental"
import { NodeSocket } from "@effect/platform-node"
import { Layer } from "effect"
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { WorkflowEngine } from "@effect/workflow";
import { ShardingConfig } from "@effect/cluster";
import { ClusterWorkflowEngine, SqlMessageStorage, Runners, Sharding, ShardManager, SqlShardStorage } from "@effect/cluster";
import { PgClient } from "@effect/sql-pg";

const DevToolsLive = DevTools.layerWebSocket().pipe(
    Layer.provide(NodeSocket.layerWebSocketConstructor),
)

export const NodeSdkLive = NodeSdk.layer(() => ({
    resource: { serviceName: "4chat-back" },
    spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter())
}))

const MyWorkflowEngine = ClusterWorkflowEngine.layer.pipe(
    Layer.provideMerge(Sharding.layer),
    Layer.provide(ShardManager.layerClientLocal),
    Layer.provide(Runners.layerNoop),
    // Layer.provideMerge(MessageStorage.layerMemory),
    Layer.provide(SqlShardStorage.layer),
    Layer.provideMerge(SqlMessageStorage.layer),
    Layer.provideMerge(
        PgClient.layer({
            // database: "effect_cluster",
            username: "postgres",
            password: Redacted.make(process.env.POSTGRES_PASSWORD!),
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
        })
    ),
    // Layer.provideMerge(
    //     SqliteClient.layer({
    //         filename: "effect_cluster.db",
    //         // worker: NodeWorker.layerWorker,
    //         //   database: "effect_cluster",
    //         //   username: "cluster",
    //         //   password: Redacted.make("cluster")
    //     })
    // ),
    Layer.provide(ShardingConfig.layer({
        // entityMailboxCapacity: 10,
        // entityTerminationTimeout: 0,
        // entityMessagePollInterval: 5000,
        // sendRetryInterval: 100
    })),
)


export const runNode = <T>(effect: Effect.Effect<T, any, Scope.Scope | HttpClient.HttpClient | WorkflowEngine.WorkflowEngine>) =>
    effect.pipe(
        Effect.scoped,
        Effect.catchAllCause((e) => Effect.tap(Effect.die(e), () => Effect.logError("runNode error", e))),
        Effect.provide(MyWorkflowEngine),
        Effect.provide(NodeSdkLive),
        Effect.provide(DevToolsLive),
        Effect.provide(FetchHttpClient.layer),
        Effect.provide(Logger.pretty),
        // Effect.provide(Logger.minimumLogLevel(LogLevel.All)),
        Effect.runPromise);


