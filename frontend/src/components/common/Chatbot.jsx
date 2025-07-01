import React, { useState } from "react";
import "./Chatbot.css";
import chatIcon from "../../assets/home/logo.png";

const chatbotFAQs = [
  "What is EventsBridge?",
  "How can I register for an event?",
  "Who can host events on EventsBridge?",
  "Is EventsBridge free to use?",
];

const faqPromptContext = `
You are a helpful assistant for EventsBridge, a platform for registering as a vendor , booking and organising different events, User can book the events which are registered by the vendors.
Here are some example questions and their expected context-aware responses:



Q: What is EventsBridge?
A: EventsBridge is a platform that connects event organizers with attendees. It helps manage, promote, and register for events seamlessly.

Q: How can I register for an event?
A: You can browse events on the homepage and click the 'Register' button. Follow the steps to complete registration.

Q: Who can host events on EventsBridge?
A: Anyone can host events by signing up as an organizer or vendor and creating their event from the dashboard by listing it on the become a vendor button.

Q: Is EventsBridge free to use?
A: Yes, EventsBridge is free for attendees, organisers can choose from premium and different plans available on the platform.

Use this knowledge to answer related queries in your responses.
`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const key = import.meta.env.VITE_GEMINI_API_KEY;

  const handleSend = async (customInput) => {
    const userMessage = customInput || input;
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { type: "user", text: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `${faqPromptContext}\nUser: ${userMessage}` }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "🤖 Please try asking again, I didn't get it.";

      setMessages([...newMessages, { type: "bot", text: aiText }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          type: "bot",
          text: "❌ Error connecting, please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFAQClick = (question) => {
    handleSend(question);
  };

  return (
    <div className="chatbot-container">
      {!isOpen && showTooltip && <div className="chat-tooltip">Ask me!</div>}

      <img
        src={chatIcon}
        alt="Chat Icon"
        className="chat-icon"
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
      />

      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            Ask E.B
            <span
              onClick={() => setIsOpen(false)}
              style={{ float: "right", cursor: "pointer" }}
            >
              ✖
            </span>
          </div>

          <div className="chat-body">
            {messages.length === 0 && (
              <div className="chat-message bot">
                <p>
                  <strong>Try asking:</strong>
                </p>
                <ul>
                  {chatbotFAQs.map((q, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleFAQClick(q)}
                      style={{
                        cursor: "pointer",
                        color: "#007bff",
                        marginBottom: "5px",
                      }}
                    >
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.type}`}>
                {msg.text}
              </div>
            ))}

            {loading && <div className="chat-message bot">Typing...</div>}
          </div>

          <div className="chat-footer">
            <input
            className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask something..."
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
