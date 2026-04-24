"use client";

import { useState, useRef, useEffect } from "react";
import { generateAIResponse } from "@/app/actions/ai";
import { Send, Bot, User, Loader2, Sparkles, Paperclip, Mic, FileText, LayoutTemplate, PenTool, Image as ImageIcon, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import clsx from "clsx";

type Message = {
  role: "user" | "model";
  text: string;
};

const suggestions = [
  { icon: PenTool, title: "Draft an post for ", color: "text-yellow-500", bg: "bg-yellow-100" },
  { icon: ImageIcon, title: "Craft a Sales message", color: "text-blue-500", bg: "bg-blue-100" },
  { icon: User, title: "write an email", color: "text-emerald-500", bg: "bg-emerald-100" },
  { icon: LayoutTemplate, title: " write a proposal", color: "text-rose-500", bg: "bg-rose-100" },
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to UI
    const newMessages: Message[] = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    // Format history for Gemini API
    const history = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Call server action
    const response = await generateAIResponse(userMessage, history);

    if (response.error) {
      setMessages((prev) => [...prev, { role: "model", text: `Error: ${response.error}` }]);
    } else if (response.text) {
      setMessages((prev) => [...prev, { role: "model", text: response.text }]);
    }

    setIsLoading(false);
  };

  const handleSuggestionClick = (title: string) => {
    setInput(`Help me with: ${title}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white relative">

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-40 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="max-w-4xl mx-auto w-full pt-10">

          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 animation-fade-in">
              <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">Welcome to Askus AI</h1>
              <p className="text-slate-500 mb-12 text-center text-lg max-w-lg">
                Get started by giving AI a task and let it do the rest. Not sure where to start?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s.title)}
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-violet-100 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={clsx("flex h-10 w-10 items-center justify-center rounded-xl", s.bg, s.color)}>
                        <s.icon className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-slate-700">{s.title}</span>
                    </div>
                    <div className="text-slate-300 group-hover:text-violet-400 transition-colors">
                      <Plus className="h-5 w-5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 pb-8">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={clsx(
                    "flex items-start gap-4 max-w-[85%]",
                    message.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={clsx(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm mt-1",
                      message.role === "user"
                        ? "bg-violet-500 text-white"
                        : "bg-teal-100 text-teal-600"
                    )}
                  >
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div
                    className={clsx(
                      "px-5 py-4 text-[15px] shadow-sm leading-relaxed overflow-hidden",
                      message.role === "user"
                        ? "bg-violet-500 text-white rounded-2xl rounded-tr-sm"
                        : "bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm"
                    )}
                  >
                    {message.role === "user" ? (
                      <div className="whitespace-pre-wrap">{message.text}</div>
                    ) : (
                      <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-50 prose-pre:text-slate-800 prose-pre:border prose-pre:border-slate-200">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-4 max-w-[85%]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600 shadow-sm mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm px-5 py-4 bg-white border border-slate-100 text-slate-700 shadow-sm flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                    <span className="text-sm font-medium">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-8 px-4 md:px-8">
        <div className="max-w-4xl mx-auto relative">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-violet-200 shadow-[0_8px_30px_rgba(139,92,246,0.12)] overflow-hidden focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400 transition-all"
          >
            <div className="relative flex items-center px-4 py-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent text-slate-800 placeholder:text-slate-400 outline-none text-base py-1"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-violet-500 hover:bg-violet-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>

            {/* Bottom Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/50 border-t border-slate-100/80">
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <button type="button" className="flex items-center gap-1.5 hover:text-slate-800 transition-colors">
                  <Paperclip className="h-4 w-4" />
                  <span>Attach</span>
                </button>
                <button type="button" className="flex items-center gap-1.5 hover:text-slate-800 transition-colors">
                  <Mic className="h-4 w-4" />
                  <span>Voice Message</span>
                </button>
                <button type="button" className="flex items-center gap-1.5 hover:text-slate-800 transition-colors">
                  <FileText className="h-4 w-4" />
                  <span>Browse Prompts</span>
                </button>
              </div>
              <div className="text-xs text-slate-400">
                {input.length} / 3,000
              </div>
            </div>
          </form>
          <div className="mt-3 text-center text-xs text-slate-400">
            Build by Askus Studio :)
          </div>
        </div>
      </div>
    </div>
  );
}
