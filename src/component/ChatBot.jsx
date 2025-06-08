import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrashCan, faStop } from "@fortawesome/free-solid-svg-icons";
import LogoGemini from "../assets/logoGemini.png";
import { TbArrowsMaximize } from "react-icons/tb";
import { PiPaperPlaneRightFill } from "react-icons/pi";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import Typewriter from "typewriter-effect";
import {
  getUserCheck,
} from "../config/FetchingData";

const ChatBot = ({ closeBot, openBot }) => {

  const [user, setUser] = useState();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const handleInput = (event) => {
    setInput(event.target.value);
  };
  const [messages, setMessages] = useState("");
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const [displayMessages, setDisplayMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chat_messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [lebarLayar, setLebarLayar] = useState(false);
  const typingIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [closeChatBot, setCloseChatBot] = useState(closeBot);

  
  const getDataUser = async () => {
    try {
      const dataUser = await getUserCheck();
      setUser(dataUser.nama);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataUser();
  }, []);

  useEffect(() => {
    setCloseChatBot(closeBot);
  }, [closeBot]);

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post(
        "http://localhost:3000/chat",
        { message: input },
        { withCredentials: true }
      );

      const botReply =
        response.data.reply || "Maaf, saya tidak bisa menjawab saat ini.";
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setLoading(false);
    }

    setInput("");
  };

  useEffect(() => {
    const savedMessages = localStorage.getItem("chat_messages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    if (!messages?.length) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role === "bot") {
      setDisplayMessages((prevMessages) => {
        // Cek apakah pesan bot ini sudah ada di displayMessages
        const existingMessage = prevMessages.find(
          (msg) => msg.role === "bot" && msg.text === lastMessage.text
        );

        if (existingMessage) {
          // Jika sudah ada, pastikan status isTyped tetap true
          return prevMessages.map((msg) =>
            msg.text === lastMessage.text ? { ...msg, isTyped: true } : msg
          );
        } else {
          // Jika pesan bot baru, tambahkan dengan isTyped: false
          return [
            ...prevMessages,
            { role: "bot", text: lastMessage.text, isTyped: false },
          ];
        }
      });

      // Cek apakah pesan ini sudah diketik sebelumnya
      if (!lastMessage.isTyped) {
        typingIndexRef.current = 0;
        setIsTyping(true);
        startTypingEffect(lastMessage.text);
      }
    } else {
      // Tambahkan pesan user langsung tanpa efek ketikan
      setDisplayMessages([...messages]);
    }
  }, [messages]);

  // Simpan displayMessages ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(displayMessages));
  }, [displayMessages]);

  // Ambil data dari localStorage saat pertama kali render
  useEffect(() => {
    const savedMessages = localStorage.getItem("chat_messages");
    if (savedMessages) {
      setDisplayMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    if (!messages?.length) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "bot") {
      setDisplayMessages((prevMessages) => {
        const lastDisplayed = prevMessages.find(
          (msg) => msg.role === "bot" && msg.text === lastMessage.text
        );

        if (lastDisplayed) {
          return prevMessages.map((msg) =>
            msg.text === lastMessage.text ? { ...msg, isTyped: true } : msg
          );
        } else {
          return [
            ...prevMessages,
            { role: "bot", text: lastMessage.text, isTyped: false },
          ];
        }
      });

      if (!lastMessage.isTyped) {
        typingIndexRef.current = 0;
        setIsTyping(true);
        startTypingEffect(lastMessage.text);
      }
    } else {
      setDisplayMessages([...messages]);
    }
  }, [messages]);

  const startTypingEffect = (fullText) => {
    const charPerStep = 10;
    const typingSpeed = 50;

    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    typingIntervalRef.current = setInterval(() => {
      setDisplayMessages((prevMessages) => {
        const newMessages = prevMessages.map((msg, index) =>
          index === prevMessages.length - 1 && msg.role === "bot"
            ? { ...msg, text: fullText.slice(0, typingIndexRef.current) }
            : msg
        );

        saveMessagesToLocalStorage(newMessages);

        return newMessages;
      });

      typingIndexRef.current += charPerStep;

      if (typingIndexRef.current >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
      }
    }, typingSpeed);
  };

  const stopTypingEffect = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    setDisplayMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((msg, index) =>
        index === prevMessages.length - 1 && msg.role === "bot"
          ? { ...msg, text: messages[messages.length - 1].text }
          : msg
      );

      saveMessagesToLocalStorage(updatedMessages);

      return updatedMessages;
    });
    setIsTyping(false);
  };

  const saveMessagesToLocalStorage = (messages) => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  };

  const clearChatHistory = () => {
    localStorage.removeItem("chat_messages");
    setDisplayMessages([]);
    setMessages("");
  };

  const handleLebarLayar = () => {
    setLebarLayar((prev) => !prev);
  };

  const hanldeCloseChatBot = () => {
    setCloseChatBot((prev) => !prev);
    openBot(false);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayMessages, isTyping]); 


  return (
    <div>
      {!closeChatBot ? null : (
        <>
          {" "}
          <div
            className={`bg-slate-900 ${
              lebarLayar
                ? "w-full top-0 left-0 h-screen z-[999] fixed"
                : "min-h-[400px] w-[90%] md:w-[60%] fixed top-1/2 -translate-y-1/2 mt-[50px] ml-[20px] md:ml-[90px] z-[10] md:z-[1] rounded-md"
            }`}
          >
            <div
              ref={chatContainerRef}
              className={`flex-1 h-max ${
                lebarLayar ? "max-h-[calc(100vh-130px)]" : "max-h-[280px]"
              }  mt-10 mx-4 overflow-y-auto text-slate-200 text-xs relative`}
            >
              {displayMessages?.length > 0 &&
                displayMessages.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`h-max p-2 w-full flex ${
                      item.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`bg-slate-700 px-5 py-3 max-w-[80%] ${
                        item.role === "user"
                          ? "rounded-tl-2xl rounded-bl-2xl rounded-br-2xl"
                          : "rounded-tr-2xl rounded-bl-2xl rounded-br-2xl"
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        breaks={true}
                        components={{
                          p: ({ node, ...props }) => (
                            <p
                              className="whitespace-pre-wrap mb-2 text-sm"
                              {...props}
                            />
                          ),
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={dracula}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-lg p-2 my-2"
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="bg-gray-800 text-green-400 px-1 py-0.5 rounded">
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {item.text}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
            </div>
            {messages?.length <= 0 ? (
              <h1 className="text-3xl w-max absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
                <Typewriter
                  options={{
                    strings: ["Hallo, " + user + ".."],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </h1>
            ) : null}
            <div className="absolute top-2 left-2 text-slate-200 font-semibold text-base flex gap-2 items-center">
              <img src={LogoGemini} className="w-5" alt="" />
              Gemini <span className="font-normal text-sm">2.0 Flash</span>
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <TbArrowsMaximize
                className="text-xl text-slate-200 cursor-pointer"
                onClick={() => handleLebarLayar()}
              />
              <FontAwesomeIcon
                className="text-[22px] text-slate-200 cursor-pointer"
                onClick={() => hanldeCloseChatBot()}
                icon={faXmark}
              />
            </div>
            <div ref={chatEndRef} />
            <form onSubmit={sendMessage}>
              <div className="rounded-md max-h-max absolute bottom-0 pb-5 z-[1] bg-slate-900 w-full flex justify-center items-center gap-3 px-5">
                <button type="button">
                  <FontAwesomeIcon
                    className="text-[22px] text-slate-200 cursor-pointer"
                    onClick={() => clearChatHistory()}
                    icon={faTrashCan}
                  />
                </button>
                <input
                  onChange={handleInput}
                  value={input}
                  className="w-[90%] focus:outline-none bg-transparent text-slate-200 text-base p-3 border border-slate-500 rounded-md focus:border-slate-200"
                  type="text"
                  name=""
                />
                <button type="submit">
                  {" "}
                  {isTyping ? (
                    <FontAwesomeIcon
                      className="w-5 h-5 text-slate-200 cursor-pointer border border-slate-200 rounded-full p-2"
                      onClick={() => stopTypingEffect()}
                      icon={faStop}
                    />
                  ) : (
                    <PiPaperPlaneRightFill
                      className={`text-2xl ${
                        input.length > 0 ? "text-slate-200" : "text-slate-500 "
                      }`}
                    />
                  )}
                </button>
              </div>
            </form>
            <div ref={chatEndRef} />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBot;
