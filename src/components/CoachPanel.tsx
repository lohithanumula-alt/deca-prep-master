"use client";

import { useState, useRef, useEffect } from "react";
import { ExamQuestion, CoachMessage } from "@/types/exam";
import MarkdownRenderer from "./MarkdownRenderer";

interface CoachPanelProps {
  question: ExamQuestion;
  selectedAnswer: "A" | "B" | "C" | "D";
  onClose?: () => void;
}

export default function CoachPanel({ question, selectedAnswer, onClose }: CoachPanelProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      getInitialBreakdown();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInitialBreakdown = async () => {
    setIsLoading(true);
    setStreamingContent("");
    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, selectedAnswer, messages: [] }),
      });
      if (!response.ok) throw new Error("Failed");
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No body");
      const decoder = new TextDecoder();
      let fullContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        setStreamingContent(fullContent);
      }
      setMessages([{ role: "assistant", content: fullContent }]);
      setStreamingContent("");
    } catch {
      setMessages([{ role: "assistant", content: "Sorry, I had trouble loading the breakdown. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendFollowUp = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = inputValue.trim();
    setInputValue("");
    const newMessages: CoachMessage[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);
    setStreamingContent("");
    try {
      const response = await fetch("/api/coach", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      if (!response.ok) throw new Error("Failed");
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No body");
      const decoder = new TextDecoder();
      let fullContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        setStreamingContent(fullContent);
      }
      setMessages([...newMessages, { role: "assistant", content: fullContent }]);
      setStreamingContent("");
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
            AI
          </div>
          <div>
            <h3 className="text-gray-900 font-bold text-sm">AI Coach</h3>
            <p className="text-gray-400 text-xs">{question.piCode} · {question.instructionalArea}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
            isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {isCorrect ? "✓ Correct" : "✗ Incorrect"}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {isLoading && messages.length === 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing your answer…</span>
            </div>
            {streamingContent && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <MarkdownRenderer content={streamingContent} />
                <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse rounded" />
              </div>
            )}
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "flex justify-end" : ""}>
            {msg.role === "user" ? (
              <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 max-w-xs text-sm">
                {msg.content}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <MarkdownRenderer content={msg.content} />
              </div>
            )}
          </div>
        ))}

        {isLoading && messages.length > 0 && streamingContent && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <MarkdownRenderer content={streamingContent} />
            <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse rounded" />
          </div>
        )}

        {isLoading && messages.length > 0 && !streamingContent && (
          <div className="flex items-center gap-2 text-gray-400 text-sm p-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
            <span>Thinking…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendFollowUp(); } }}
            placeholder="Ask a follow-up question…"
            disabled={isLoading}
            className="flex-1 bg-gray-50 text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2.5 text-sm border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
          />
          <button
            onClick={sendFollowUp}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-blue-500 transition-colors disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <p className="text-gray-400 text-xs mt-2">Press Enter to send · Ask about any concept</p>
      </div>
    </div>
  );
}
