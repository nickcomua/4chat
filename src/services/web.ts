import { WebSdk } from "@effect/opentelemetry"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-web"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { Effect, Layer } from "effect";
import { DevTools } from "@effect/experimental";
import { BrowserSocket } from "@effect/platform-browser";
import { FetchHttpClient, HttpClient } from "@effect/platform";

const WebSdkLive = WebSdk.layer(() => ({
  resource: { serviceName: "t3-chat-front" },
  spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter())
}))
const DevToolsLive = DevTools.layerWebSocket().pipe(
  Layer.provide(BrowserSocket.layerWebSocketConstructor),
)
export const runWeb = <T>(effect: Effect.Effect<T, never, HttpClient.HttpClient>) =>
  effect.pipe(
    Effect.catchAllCause((e) => Effect.tap(Effect.die(e), () => Effect.logError("runWeb error", e))),
    Effect.provide(WebSdkLive),
    Effect.provide(DevToolsLive),
    Effect.provide(FetchHttpClient.layer),
    Effect.runPromise);
