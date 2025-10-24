"use client"

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 p-3">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-primary/60 rounded-full animate-typing" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-primary/60 rounded-full animate-typing" style={{ animationDelay: "200ms" }} />
        <div className="w-2 h-2 bg-primary/60 rounded-full animate-typing" style={{ animationDelay: "400ms" }} />
      </div>
      <span className="text-xs text-muted-foreground ml-2">DilSe AI is thinking...</span>
    </div>
  )
}
