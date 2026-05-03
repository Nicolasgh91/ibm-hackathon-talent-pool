import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { chatService } from '@/services/chatService'
import { toast } from 'sonner'

export function Chat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [sending, setSending] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: userMsg }])
    try {
      setSending(true)
      const res = await chatService.send({ message: userMsg })
      setMessages((m) => [...m, { role: 'assistant', text: res.message }])
    } catch (e) {
      toast.error('Chat request failed')
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assistant</h1>
          <p className="mt-2 text-gray-600">Uses POST /api/v1/chat (JWT + rate limit in production).</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[240px] space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
              {messages.length === 0 ? (
                <p className="text-sm text-gray-500">Send a message to start.</p>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      msg.role === 'user'
                        ? 'ml-auto max-w-[85%] rounded-lg bg-primary-100 px-3 py-2 text-sm text-primary-900'
                        : 'mr-auto max-w-[85%] rounded-lg bg-white px-3 py-2 text-sm text-gray-800 shadow-sm ring-1 ring-gray-100'
                    }
                  >
                    {msg.text}
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Type a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                disabled={sending}
              />
              <Button variant="primary" onClick={send} disabled={sending || !input.trim()}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
