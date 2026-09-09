import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.error("API error:", err));
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-900 to-gray-700 text-white">
      <h1 className="text-3xl font-bold">{message || "Loading..."}</h1>
    </div>
  );
}
