import { sendMessageWorkflow } from "@/lib/ai/send-workflow"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  // req.signal.addEventListener('abort', () => {
  //   console.log('abort')
  //   return Response.json({succeed:true})
  // })
  try {
    await sendMessageWorkflow(await req.json())
    return Response.json({succeed:true})
  } catch (error) {
    console.error('Error processing request:', error)
    return Response.json({ error: 'Failed to process request' }, { status: 400 })
  }
}