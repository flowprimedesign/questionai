import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function DetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("submissions") || "[]");
    const found = list.find((i) => i.id === id);
    setItem(found || null);
  }, [id]);

  if (!item)
    return (
      <div style={{ padding: 20 }}>
        <p>
          Not found. <Link to="/list">Back to list</Link>
        </p>
      </div>
    );

  function saveDraft() {
    const list = JSON.parse(localStorage.getItem("submissions") || "[]");
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) return;
    list[idx] = { ...list[idx], responseText: draft };
    localStorage.setItem("submissions", JSON.stringify(list));
    setItem(list[idx]);
    setEditing(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{item.title}</h2>
      <p>
        <small>{new Date(item.createdAt).toLocaleString()}</small>
      </p>

      <section>
        <h3>Question</h3>
        <p>{item.question || item.text}</p>
      </section>

      <section style={{ marginTop: 12 }}>
        <h3>Response</h3>
        {!editing ? (
          <div>
            <div
              style={{
                whiteSpace: "pre-wrap",
                padding: 10,
                background: "#fff",
              }}
            >
              {item.responseText || item.textResult || "(no response)"}
            </div>
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => {
                  setDraft(item.responseText || item.textResult || "");
                  setEditing(true);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <div>
            <textarea
              rows={8}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              style={{ width: "100%" }}
            />
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button onClick={saveDraft}>Save</button>
              <button
                onClick={() => {
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <p>
        <Link to="/list">Back</Link>
      </p>
    </div>
  );
}
