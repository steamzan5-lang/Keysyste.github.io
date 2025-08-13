import { useState } from "react";

export default function App() {
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");

  async function verifyKey() {
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Error connecting to server");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Roblox Key System</h1>
      <input
        className="p-2 rounded text-black"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Masukkan key"
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 px-4 py-2 mt-4 rounded"
        onClick={verifyKey}
      >
        Verifikasi
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
