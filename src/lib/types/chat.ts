import { AiResponse } from "@effect/ai/AiResponse"
import { UserMessage } from "@effect/ai/AiInput"
import { Schema } from "effect"

export const ChatUserMessage = Schema.Struct({
  _id: Schema.String,
  _rev: Schema.optional(Schema.String),
  type: Schema.Literal("ChatUserMessage"),
  createdAt: Schema.Number,
  ai: UserMessage
})
export type ChatUserMessage = typeof ChatUserMessage.Encoded

export const ChatAssistantMessage = Schema.Struct({
  _id: Schema.String,
  _rev: Schema.optional(Schema.String),
  type: Schema.Literal("ChatAssistantMessage"),
  error: Schema.optional(Schema.String),
  ai: AiResponse
})
export type ChatAssistantMessage = typeof ChatAssistantMessage.Encoded

export const ChatAssistantMessageChunk = Schema.Struct({
  _id: Schema.String,
  _rev: Schema.optional(Schema.String),
  type: Schema.Literal("ChatAssistantMessageChunk"),
  ai: AiResponse
})
export type ChatAssistantMessageChunk = typeof ChatAssistantMessageChunk.Encoded

export const ChatAssistantMessageError = Schema.Struct({
  _id: Schema.String,
  _rev: Schema.optional(Schema.String),
  type: Schema.Literal("ChatAssistantMessageError"),
  error: Schema.String
})
export type ChatAssistantMessageError = typeof ChatAssistantMessageError.Encoded

export const ChatMessage = Schema.Union(ChatUserMessage, ChatAssistantMessage, ChatAssistantMessageChunk, ChatAssistantMessageError)
export type ChatMessage = typeof ChatMessage.Encoded

export const Chat = Schema.Struct({
  _id: Schema.String,
  _rev: Schema.optional(Schema.String),
  name: Schema.String,
  createdAt: Schema.Number,
  status: Schema.Literal("active", "generating"),
  pinned: Schema.optional(Schema.Boolean)
})
export type Chat = typeof Chat.Encoded