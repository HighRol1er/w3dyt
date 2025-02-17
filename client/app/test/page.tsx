"use client";

import { useEffect, useState } from "react";

interface ExchangeData {
  exchange: string;
  symbol: string;
  price: number;
  changeRate: string;
}

export default function TestPage() {
  const [messages, setMessages] = useState<ExchangeData[]>([]);
  const [status, setStatus] = useState("disconnected");

  useEffect(() => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3010/exchange"
    );

    ws.onopen = () => {
      console.log("Connected to exchange gateway");
      setStatus("connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev.slice(-9), data]); // 최근 10개만 유지
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from exchange gateway");
      setStatus("disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("error");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Exchange WebSocket Test</h1>
      <div className="mb-4">
        Status:{" "}
        <span
          className={`font-bold ${
            status === "connected" ? "text-green-500" : "text-red-500"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900"
          >
            <div className="font-bold">{msg.exchange}</div>
            <div>Symbol: {msg.symbol}</div>
            <div>Price: {msg.price}</div>
            <div>Change: {msg.changeRate}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
