import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ViewAllPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem("submissions") || "[]"));
  }, []);

  function handleDelete(id) {
    if (!confirm("Delete this submission?")) return;
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    localStorage.setItem("submissions", JSON.stringify(next));
  }

  if (items.length === 0)
    return (
      <div style={{ padding: 20 }}>
        <h3>No submissions yet</h3>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h2>All Submissions</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {items.map((it) => (
          <div
            key={it.id}
            style={{
              border: "1px solid #e6e6e6",
              padding: 12,
              borderRadius: 6,
              background: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{it.title}</strong>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {it.model ? <span>Model: {it.model} · </span> : null}
                  <span>{new Date(it.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link to={`/detail/${it.id}`}>Open</Link>
                <button onClick={() => handleDelete(it.id)}>Delete</button>
              </div>
            </div>

            {it.responseText ? (
              <div
                style={{ marginTop: 10, color: "#111", whiteSpace: "pre-wrap" }}
              >
                {it.responseText.length > 300
                  ? it.responseText.slice(0, 300) + "…"
                  : it.responseText}
              </div>
            ) : (
              <div style={{ marginTop: 10, color: "#888" }}>No response</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
