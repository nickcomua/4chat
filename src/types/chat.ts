export interface Message {
  _id: string
  createdAt: number
  content: string
  role: "user" | "assistant"
}
