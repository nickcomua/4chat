import { AiResponse } from "@effect/ai/AiResponse"
import { AssistantMessage, UserMessage } from "@effect/ai/AiInput"
import { Schema } from "effect"

export class ChatUserMessage extends Schema.Class<ChatUserMessage>("ChatUserMessage")({
  _id: Schema.String,
  _rev: Schema.optional(Schema.String),
  type: Schema.Literal("ChatUserMessage"),
  createdAt: Schema.Number,
  ai: UserMessage
}) { }

export class ChatAssistantMessage extends Schema.Class<ChatAssistantMessage>("ChatAssistantMessage")({
  _id: Schema.String,
  _rev: Schema.optional(Schema.String),
  type: Schema.Literal("ChatAssistantMessage"),
  ai: AiResponse
}) { }

export class ChatAssistantMessageChunk extends Schema.Class<ChatAssistantMessageChunk>("ChatAssistantMessageChunk")({
  _id: Schema.String,
  _rev: Schema.optional(Schema.String),
  type: Schema.Literal("ChatAssistantMessageChunk"),
  ai: AiResponse
}) { }

export const ChatMessage = Schema.Union(ChatUserMessage, ChatAssistantMessage, ChatAssistantMessageChunk)
export type ChatMessage = typeof ChatMessage.Type

export class Chat extends Schema.Class<Chat>("Chat")({
  _id: Schema.String,
  name: Schema.String,
  createdAt: Schema.Number,
  pinned: Schema.optional(Schema.Boolean)
}) { }