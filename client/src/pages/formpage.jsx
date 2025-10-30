import React, { useState } from "react";
import { generateText } from "../utilities/geminiaidemo";

export default function FormPage() {
  const [question, setQuestion] = useState("");
  const [modelId, setModelId] = useState("gemini-2.0-flash");
  const [textBusy, setTextBusy] = useState(false);

  const [responseText, setResponseText] = useState("");
  const [responseIsJson, setResponseIsJson] = useState(false);
  const [error, setError] = useState(null);

  // GenAI call moved to utilities/geminiaidemo.generateText

  async function handleSubmitText(e) {
    e && e.preventDefault && e.preventDefault();
    setTextBusy(true);
    setError(null);
    setResponseText("");
    try {
      const result = await generateText({
        model: modelId,
        question,
        persist: {
          title: (question || "Question").slice(0, 80),
          question,
          model: modelId,
        },
      });

      if (!result.ok) {
        setError(result.error || "Unknown error");
      } else {
        setResponseIsJson(Boolean(result.isJson));
        setResponseText(result.respText || "");
      }
    } finally {
      setTextBusy(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Text prompt</h2>

      <form
        onSubmit={handleSubmitText}
        style={{ display: "grid", gap: 10, maxWidth: 700 }}
      >
        <label>
          Model
          <select value={modelId} onChange={(e) => setModelId(e.target.value)}>
            <option value="gemini-2.0-flash">gemini-2.0-flash</option>
            <option value="gemini-2.5-flash">gemini-2.5-flash</option>
          </select>
        </label>

        <label>
          Your question
          <textarea
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>

        <div>
          <button type="submit" disabled={textBusy}>
            {textBusy ? "Thinking…" : "Submit"}
          </button>
        </div>
      </form>

      {error && (
        <div
          style={{ color: "#b00020", whiteSpace: "pre-wrap", marginTop: 12 }}
        >
          Error: {error}
        </div>
      )}

      {responseText && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            border: "1px solid #ddd",
          }}
        >
          <strong>Response</strong>
          <div style={{ marginTop: 8 }}>
            {responseIsJson ? (
              <pre style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>
                {responseText}
              </pre>
            ) : (
              <div style={{ whiteSpace: "pre-wrap" }}>{responseText}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
