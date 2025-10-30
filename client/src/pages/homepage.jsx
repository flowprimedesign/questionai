import React from "react";

export default function HomePage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome</h2>
      <p>
        This demo shows a small CRUD app that accepts text and images from a
        form. Model inference is handled by a server-side generative API.
      </p>
      <p>
        Use the "New" link to create a submission, or "All" to view saved
        submissions.
      </p>
    </div>
  );
}
