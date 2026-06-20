import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am your travel assistant. How can I help you plan your next trip?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessageText = inputText;
        const newUserMessage = {
            id: messages.length + 1,
            text: userMessageText,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputText("");
        setIsLoading(true);

        try {
            const response = await axios.post('http://https://smart-travel-ai-backend.onrender.com/api/chat', {
                message: userMessageText
            });

            const botResponse = {
                id: messages.length + 2,
                text: response.data.response,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorResponse = {
                id: messages.length + 2,
                text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <MessageCircle size={20} />
                            <span className="font-semibold">Travel Assistant</span>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="hover:bg-blue-700 p-1 rounded transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                    }`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="mb-3 flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm flex items-center gap-2 text-gray-500 text-sm">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={!inputText.trim() || isLoading}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                className={`${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center`}
                aria-label="Open chat"
            >
                <MessageCircle size={28} />
            </button>
        </div>
    );
};

export default Chatbot;
