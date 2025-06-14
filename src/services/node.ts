import { NodeSdk } from "@effect/opentelemetry"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { Effect } from "effect";
import { DevTools } from "@effect/experimental"
import { NodeSocket } from "@effect/platform-node"
import { Layer } from "effect"

const DevToolsLive = DevTools.layerWebSocket().pipe(
    Layer.provide(NodeSocket.layerWebSocketConstructor),
)

export const NodeSdkLive = NodeSdk.layer(() => ({
    resource: { serviceName: "t3-chat-back" },
    spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter())
}))

export const runNode = <T>(effect: Effect.Effect<T, any, never>) =>
    effect.pipe(
        Effect.provide(NodeSdkLive),
        Effect.provide(DevToolsLive),
        Effect.catchAllCause((e) => Effect.tap(Effect.die(e), () => Effect.logError("runNode error", e))),
        Effect.runPromise);


