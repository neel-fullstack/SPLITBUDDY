import React from "react";

export default function UserFooter() {
  return (
    <footer
      className="text-center py-3 mt-auto"
      style={{
        background: "#185a9d",
        color: "#fff",
        borderTop: "3px solid #185a9d",
        boxShadow: "0 -8px 24px rgba(24, 90, 157, 0.18), 0 -1.5px 0 #185b9d10, 0 50px 30px rgba(24, 90, 157, 0.18)",
        fontWeight: 500,
        letterSpacing: "1px",
      }}
    >
      © {new Date().getFullYear()} SplitBuddy. All rights reserved.
    </footer>
  );
}