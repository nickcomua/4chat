import { WebSdk } from "@effect/opentelemetry"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-web"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { Effect, Layer, LogLevel, Logger, Scope } from "effect";
import { DevTools } from "@effect/experimental";
import { BrowserSocket } from "@effect/platform-browser";
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { scope } from "effect/Layer";

const WebSdkLive = WebSdk.layer(() => ({
  resource: { serviceName: "4chat-front" },
  spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter())
}))
const DevToolsLive = DevTools.layerWebSocket().pipe(
  Layer.provide(BrowserSocket.layerWebSocketConstructor),
)
export const runWeb = <T>(effect: Effect.Effect<T, never, HttpClient.HttpClient | Scope.Scope>) =>
  effect.pipe(
    Effect.provide(scope),
    Effect.catchAllCause((e) => Effect.tap(Effect.die(e), () => Effect.logError("runWeb error", e))),
    Effect.provide(WebSdkLive),
    Effect.provide(DevToolsLive),
    Effect.provide(FetchHttpClient.layer),
    Effect.provide(Logger.pretty),
    // Effect.provide(Logger.minimumLogLevel(LogLevel.All)), 
    Effect.runPromise);
