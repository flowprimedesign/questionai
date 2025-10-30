// Utility to call the GenAI proxy and return a normalized response.
export async function generateText({ model, question, persist } = {}) {
  try {
    const content = { parts: [{ text: String(question || "Hello") }] };
    const body = { model, contents: [content] };

    const devBase =
      typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.DEV
        ? "http://localhost:3001"
        : "";

    const r = await fetch(`${devBase}/api/genai/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let json = null;
    let textBody = null;
    const contentType = r.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        json = await r.json();
      } catch (parseErr) {
        textBody = await r.text();
        return {
          ok: false,
          error: `Response JSON parse error: ${String(
            parseErr
          )}\nBody: ${textBody}`,
        };
      }
    } else {
      textBody = await r.text();
      if (!r.ok) {
        return {
          ok: false,
          error: String(textBody || r.statusText || "Unknown error"),
        };
      }
      return { ok: true, respText: textBody, isJson: false };
    }

    if (!r.ok) {
      const msg = json?.error || json?.message || r.statusText || "Unknown";
      return { ok: false, error: String(msg) };
    }

    let respText = null;
    let isJson = false;

    if (json?.text) {
      respText = String(json.text);
      isJson = false;
    } else if (
      json?.candidates &&
      Array.isArray(json.candidates) &&
      json.candidates[0]?.content &&
      Array.isArray(json.candidates[0].content?.parts)
    ) {
      try {
        const parts = json.candidates[0].content.parts;
        const texts = parts
          .map((p) => (p && p.text ? String(p.text) : null))
          .filter(Boolean);
        respText = texts.join("\n\n");
        isJson = false;
      } catch {
        respText = JSON.stringify(json, null, 2);
        isJson = true;
      }
    } else if (
      json &&
      json.output &&
      Array.isArray(json.output) &&
      json.output[0]?.content &&
      Array.isArray(json.output[0].content)
    ) {
      const c = json.output[0].content[0];
      if (c?.text) {
        respText = String(c.text);
        isJson = false;
      } else {
        respText = JSON.stringify(json, null, 2);
        isJson = true;
      }
    } else {
      respText = JSON.stringify(json, null, 2);
      isJson = true;
    }

    // Persist submission if requested
    try {
      if (persist) {
        const id =
          Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        const submission = {
          id,
          title: persist?.title || "Submission",
          question: persist?.question || "",
          model: persist?.model || "",
          responseText: respText,
          createdAt: new Date().toISOString(),
        };
        const list = JSON.parse(localStorage.getItem("submissions") || "[]");
        list.unshift(submission);
        localStorage.setItem("submissions", JSON.stringify(list));
      }
    } catch (err) {
      console.error("failed to save submission", err);
    }

    return { ok: true, respText, isJson };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export default { generateText };
