"use client";

import { useEffect, useState, useRef } from "react";

const WebSocketPage = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(true); // For controlling automatic sending
  const messageCounter = useRef<number>(0); // Tracks the next number to send
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Tracks the interval

  // Initialize WebSocket connection
  const connectWebSocket = () => {
    const ws = new WebSocket("wss://echo.websocket.org/");

    // Assign event handlers
    ws.onopen = () => console.log("WebSocket connection opened");
    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
      setMessages((prev) => [...prev, `Server: ${event.data}`]);
    };
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket connection closed");

    setSocket(ws);
  };

  const startAutoSending = () => {
    if (!intervalRef.current && socket) {
      intervalRef.current = setInterval(() => {
        if (
          socket &&
          socket.readyState === WebSocket.OPEN &&
          !isSendingMessage
        ) {
          const nextMessage = messageCounter.current++;
          socket.send(nextMessage.toString());
          setMessages((prev) => [...prev, `You: ${nextMessage}`]);
        }
      }, 1000); // Sends a message every second
    }
  };

  const stopAutoSending = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopConnection = () => {
    stopAutoSending();
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  const restartConnection = () => {
    stopConnection();
    setMessages([]);
    messageCounter.current = 0;
    connectWebSocket();
  };

  useEffect(() => {
    connectWebSocket();

    // Clean up on component unmount
    return () => {
      stopAutoSending();
      if (socket) {
        socket.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isRunning) {
      startAutoSending();
    } else {
      stopAutoSending();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, socket]);

  const sendMessage = () => {
    if (socket && input.trim()) {
      setIsSendingMessage(true);
      socket.send(input);
      setMessages((prev) => [...prev, `You: ${input}`]);
      setIsSendingMessage(false);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center gap-4  px-2 lg:px-20 py-32 ">
      <h1 className="text-xl lg:text-3xl text-gray-700 font-bold tracking-wider  ">
        WebSocket Echo Client
      </h1>
      <div className="h-[1px] w-full bg-gray-300  " />

      <div
        className="flex flex-col gap-4  lg:flex-row  items-center justify-between  text-gray-700 lg:pl-4 w-full lg:ring-gray-200 
      lg:ring-2 rounded-xl "
      >
        <div className="w-full lg:w-1/2 flex items-center justify-between gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a message"
            className="outline-none px-8 py-2 hover:ring-2  w-full  bg-gray-50 rounded-xl ring-1 ring-gray-200 text-xl"
          />
          <button
            className="w-fit px-5 py-1
          rounded-xl ring-1 ring-gray-200 font-semibold hover:bg-blue-400 hover:text-white
          transition-all duration-400 ease-in-out"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
        <div className="flex ring-2 lg:ring-0 ring-gray-200 items-center justify-between lg:justify-end w-full lg:w-1/2   ">
          <div
            onClick={() => setIsRunning((prev) => !prev)}
            className="lg:border-l-2 border-r-2 cursor-pointer w-full h-14 items-center justify-center flex 
            hover:bg-gray-900 hover:border-gray-900 hover:text-white px-2 font-semibold
              transition-all duration-400 ease-in-out "
          >
            {isRunning ? "Pause Auto Send" : "Resume Auto Send"}
          </div>
          <div
            className="border-r-2 cursor-pointer w-full h-14 items-center justify-center flex
             hover:bg-gray-900 hover:border-gray-900 hover:text-white px-2 font-semibold
         transition-all duration-400 ease-in-out "
            onClick={stopConnection}
          >
            Stop Connection
          </div>
          <div
            className=" lg:rounded-tr-xl w-full lg:rounded-br-xl cursor-pointer h-14 items-center justify-center flex
             hover:bg-gray-900 hover:border-gray-900 hover:text-white px-2 font-semibold
         transition-all duration-400 ease-in-out "
            onClick={restartConnection}
          >
            Restart Connection
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex flex-col gap-1 mt-8   w-full items-center justify-start ">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full pl-2  items-center justify-start  
              ${index % 2 === 0 ? " border-b pb-1  border-gray-200" : ""}`}
          >
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebSocketPage;
