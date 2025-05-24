"use client";
import confetti from "canvas-confetti";
import Starfield from "@/components/StarField";
import React, { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.message || "Something went wrong");
        return;
      }

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ff66cc", "#cc33ff", "#ff99cc", "#cc66ff"],
      });

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error");
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black">
      <Starfield />

      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 animate-[pulse_15s_ease-in-out_infinite] mix-blend-overlay opacity-70" />

      <div className="absolute top-10 left-20 w-72 h-72 bg-pink-500 rounded-full filter blur-3xl opacity-40 animate-[blob_12s_infinite]"></div>
      <div className="absolute bottom-16 right-24 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-30 animate-[blob_10s_infinite]"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-black/30 backdrop-blur-lg border border-purple-700/50 rounded-2xl shadow-xl space-y-6">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 text-center">
          ✉️ Send Your Grievance
        </h1>
        <p className="text-center text-purple-300 text-sm mt-2">
          Feel free to share any problems or feedback you have!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            required
            disabled={status === "sending"}
            className="
            w-full px-4 py-3 bg-black/50 placeholder-purple-300 text-white 
            rounded-lg border border-purple-600 outline-none transition
           focus:border-pink-500 focus:ring-2 focus:ring-pink-500
            focus:shadow-[0_0_15px_rgba(255,105,180,0.7)]
           "
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            required
            disabled={status === "sending"}
            className="
             w-full px-4 py-3 bg-black/50 placeholder-purple-300 text-white 
             rounded-lg border border-purple-600 outline-none transition
             focus:border-pink-500 focus:ring-2 focus:ring-pink-500
              focus:shadow-[0_0_15px_rgba(255,105,180,0.7)]
            "
          />
          <textarea
            name="message"
            placeholder="Type your issue here…"
            required
            disabled={status === "sending"}
            className="
            w-full px-4 py-3 bg-black/50 placeholder-purple-300 text-white 
            rounded-lg border border-purple-600 outline-none transition
           focus:border-pink-500 focus:ring-2 focus:ring-pink-500
           focus:shadow-[0_0_15px_rgba(255,105,180,0.7)]
            resize-none h-32"
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-lg transition 
              ${
                status === "sending"
                  ? "bg-purple-800 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              }`}
          >
            {status === "sending" ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                  />
                  <path
                    fill="currentColor"
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  />
                </svg>
                Sending…
              </>
            ) : (
              "Send"
            )}
          </button>
        </form>

        {status === "error" && (
          <p className="text-center text-red-400 text-sm">{errorMessage}</p>
        )}
        {status === "success" && (
          <p className="text-center text-green-400 text-sm">
            Email sent successfully!
          </p>
        )}
      </div>
    </main>
  );
}
