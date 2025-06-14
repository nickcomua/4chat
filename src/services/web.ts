import { WebSdk } from "@effect/opentelemetry"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"

export const WebSdkLive = WebSdk.layer(() => ({
    resource: { serviceName: "example" },
    spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter())
  }))
  