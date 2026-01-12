"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check, Sparkles, RefreshCw } from "lucide-react";

interface OutreachGeneratorProps {
  startupId: string;
  investorId: string;
  investorName: string;
  onClose: () => void;
}

type Tone = "formal" | "friendly" | "concise";

const OutreachGenerator: React.FC<OutreachGeneratorProps> = ({
  startupId,
  investorId,
  investorName,
  onClose,
}) => {
  const [tone, setTone] = useState<Tone>("friendly");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateOutreach();
  }, []);

  const generateOutreach = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId, investorId, tone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to generate outreach");
      }

      setSubject(data.data.subject || "");
      setBody(data.data.body || "");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const fullText = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    generateOutreach();
  };

  const tones: { value: Tone; label: string; emoji: string }[] = [
    { value: "formal", label: "Formal", emoji: "🎩" },
    { value: "friendly", label: "Friendly", emoji: "😊" },
    { value: "concise", label: "Concise", emoji: "⚡" },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div 
          className="text-white p-6 flex items-center justify-between"
          style={{ 
            background: `linear-gradient(135deg, var(--text-primary), var(--text-secondary))` 
          }}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold">AI Outreach Generator</h2>
              <p className="text-sm opacity-90">
                Personalized message for {investorName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <label 
              className="block text-sm font-semibold mb-3" 
              style={{ color: 'var(--text-primary)' }}
            >
              Select Tone
            </label>
            <div className="flex gap-3">
              {tones.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setTone(t.value);
                    setTimeout(() => generateOutreach(), 100);
                  }}
                  disabled={loading}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                    tone === t.value
                      ? "border-opacity-100 text-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  style={
                    tone === t.value
                      ? { 
                          borderColor: 'var(--text-primary)',
                          background: `linear-gradient(135deg, var(--text-primary), var(--text-secondary))` 
                        }
                      : { color: 'var(--text-secondary)' }
                  }
                >
                  <span className="text-lg mr-2">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderBottomColor: 'var(--text-primary)' }}></div>
              <p style={{ color: 'var(--text-secondary)' }}>Crafting your message...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={generateOutreach}
                className="mt-3 px-4 py-2 text-white rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--text-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && subject && body && (
            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label 
                  className="block text-sm font-semibold mb-2" 
                  style={{ color: 'var(--text-primary)' }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                  style={{
                    borderColor: 'var(--text-muted)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-primary)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-muted)';
                  }}
                />
              </div>

              {/* Body */}
              <div>
                <label 
                  className="block text-sm font-semibold mb-2" 
                  style={{ color: 'var(--text-primary)' }}
                >
                  Message
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors resize-none"
                  style={{
                    borderColor: 'var(--text-muted)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-primary)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-muted)';
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, var(--text-primary), var(--text-secondary))`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 38, 61, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Message
                    </>
                  )}
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="px-6 py-3 border-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: 'var(--text-primary)',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                  Regenerate
                </button>
              </div>

              {/* Disclaimer */}
              <p 
                className="text-xs text-center mt-4" 
                style={{ color: 'var(--text-muted)' }}
              >
                💡 Review and customize before sending. This is a draft
                generated to help you start the conversation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutreachGenerator;
