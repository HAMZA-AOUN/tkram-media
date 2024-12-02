"use client";
import { useEffect, useState } from "react";

const WebSocketPage = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Automatically start connection on page load
    startConnection();

    // Clean up on component unmount
    return () => {
      stopConnection();
    };
  }, []);

  const startConnection = () => {
    if (socket) return; // Prevent duplicate connections

    const ws = new WebSocket("wss://echo.websocket.org/");

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setMessages((prev) => [...prev, "WebSocket connected"]);
      startDefaultBehavior(ws);
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
      setMessages((prev) => [...prev, `Server: ${event.data}`]);
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setMessages((prev) => [...prev, "WebSocket disconnected"]);
      stopDefaultBehavior();
    };

    setSocket(ws);
  };

  const stopConnection = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
    stopDefaultBehavior();
  };

  const restartConnection = () => {
    stopConnection();
    startConnection();
  };

  const startDefaultBehavior = (ws: WebSocket) => {
    const id = setInterval(() => {
      const message = `${counter}`;
      ws.send(message);
      setMessages((prev) => [...prev, `You: ${message}`]);
      setCounter((prev) => prev + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopDefaultBehavior = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.send(input);
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>WebSocket Echo Client</h1>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={stopConnection}
          style={{ padding: "5px 10px", marginRight: "10px" }}
        >
          Stop Connection
        </button>
        <button
          onClick={restartConnection}
          style={{ padding: "5px 10px", marginRight: "10px" }}
        >
          Restart Connection
        </button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a message"
          style={{ width: "300px", marginRight: "10px" }}
        />
        <button onClick={sendMessage} style={{ padding: "5px 10px" }}>
          Send
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Messages</h2>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            maxHeight: "300px",
            overflowY: "scroll",
          }}
        >
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebSocketPage;
