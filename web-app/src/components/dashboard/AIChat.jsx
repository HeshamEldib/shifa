import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AIChat.css";

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [fileType, setFileType] = useState("external");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const privacyNotice =
    "⚠️ بيان الخصوصية: شفاء AI لا تخزن بياناتك الشخصية أو الحساسة في الـ chat history. يتم حفظ المحادثة فقط في جهازك، ويمكنك مسحها في أي وقت.";

  // Load chat history
  useEffect(() => {
    const saved = localStorage.getItem("shifaa_ai_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages([]);
      }
    }
  }, []);

  // Save chat history
  useEffect(() => {
    localStorage.setItem("shifaa_ai_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Clear history
  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("shifaa_ai_chat_history");
    setFileContent("");
    setFileType("external");
  };

  // Handle file upload ✅ مُصحح
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setFileContent("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);

    try {
      const res = await fetch("http://localhost:3001/api/ai/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      setFileContent(data.fileContent || "");

      const typeLabel = data.fileType === "medical" ? "🏥 ملف طبي" : "📄 ملف خارجي";

      setMessages((prev) => [
        ...prev,
        { role: "user", content: `تم رفع ملف: ${file.name} (${typeLabel})` },
        { role: "assistant", content: `✅ تم تحليل هذا الملف (${typeLabel}).\nيمكنك الآن سؤالي عن محتواه مباشرة.` },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ فشل في رفع أو تحليل الملف." },
      ]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Send message ✅ مُصحح
  const sendMessage = async () => {
    if (!input.trim() || isSending) return;

    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("http://localhost:3001/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          fileContent: fileContent || "",
          fileType,
        }),
      });
      const { response, actionUrl } = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response, actionUrl },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "حدث خطأ، من فضلك جرّبي مرة أخرى لاحقًا." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const getPageLabel = (url) => {
    const labels = {
      "/": "الصفحة الرئيسية 🏠",
      "/services": "الخدمات 🏥",
      "/doctors": "الأطباء 👨‍⚕️",
      "/about": "من نحن / About ℹ️",
      "/contact": "التواصل 📞",
      "/login": "تسجيل الدخول 🔐",
      "/signup": "إنشاء حساب ✅",
      "/booking/:serviceId": "حجز خدمة 🎯",
      "/patient": "ملفي الشخصي 💙",
      "/appointments": "مواعيدي 📅",
      "/patient-prescriptions": "وصفاتي الطبية 💊",
      "/doctor-records": "سجلاتي الطبية عند الطبيب ⚕️",
      "/settings": "إعداداتي ⚙️",
    };
    return labels[url] || "الانتقال إلى هذه الصفحة ➡️";
  };

  return (
    <>
      {!isOpen && (
        <button className="shifaa-ai-chat-launcher" onClick={() => setIsOpen(true)}>
          ✨
        </button>
      )}

      {isOpen && (
        <div className="shifaa-ai-chat-container">
          {/* Header */}
          <div className="shifaa-ai-chat-header">
            <div className="shifaa-ai-chat-title">
              <span className="shifaa-ai-chat-icon">✨</span>
              <span className="shifaa-ai-chat-text">Shifaa AI Assistant</span>
            </div>
            <button className="shifaa-ai-chat-close" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          {/* Messages Body */}
          <div className="shifaa-ai-chat-messages">
            {messages.length === 0 && (
              <>
                <div className="shifaa-ai-chat-empty-state">
                  أهلاً! أنا Shifaa AI Assistant، جاهز لمساعدتك في:
                  <br />
                  - فهم ملفاتك الطبية أو الخارجية.
                  <br />
                  - التوجيه لصفحات مسموح لك بها مثل: مواعيدك، وصفاتك، ملفك الشخصي، الإعدادات، الخدمات، الأطباء، حجز الخدمة، وغيرها.
                </div>
                <div className="shifaa-ai-chat-privacy-notice">
                  {privacyNotice}
                </div>
              </>
            )}

            {messages.map((m, i) => (
              <div key={i} className="shifaa-ai-chat-message">
                <div className="shifaa-ai-chat-message-bubble">
                  <div
                    className={`shifaa-ai-chat-avatar ${
                      m.role === "user" ? "shifaa-ai-chat-avatar-user" : "shifaa-ai-chat-avatar-ai"
                    }`}
                  >
                    {m.role === "user" ? "U" : "✨"}
                  </div>
                  <div className="shifaa-ai-chat-content">
                    {m.content}

                    {m.actionUrl && (
                      <button
                        className="shifaa-ai-chat-navigate-btn"
                        onClick={() => {
                          setIsOpen(false);
                          navigate(m.actionUrl);
                        }}
                      >
                        {getPageLabel(m.actionUrl)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="shifaa-ai-chat-message">
                <div className="shifaa-ai-chat-message-bubble">
                  <div className="shifaa-ai-chat-avatar shifaa-ai-chat-avatar-ai">
                    ✨
                  </div>
                  <div className="shifaa-ai-chat-content shifaa-ai-chat-sending">
                    جاري الرد ... ⏳
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer ✅ مُصحح كامل */}
          <div className="shifaa-ai-chat-footer">
            <div className="shifaa-ai-file-type-toggle">
              <button
                className={`shifaa-ai-type-btn ${fileType === "medical" ? "active" : ""}`}
                onClick={() => setFileType("medical")}
              >
                🏥 ملف طبي
              </button>
              <button
                className={`shifaa-ai-type-btn ${fileType === "external" ? "active" : ""}`}
                onClick={() => setFileType("external")}
              >
                📄 ملف خارجي
              </button>
            </div>

            <div className="shifaa-ai-chat-input-wrapper">
              {/* Upload File ✅ ظاهر وواضح */}
              <div className="shifaa-ai-chat-upload-wrapper" style={{ marginBottom: "8px" }}>
                <input
                  id="upload-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="shifaa-ai-chat-upload-input"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  style={{
                    display: "block",
                    width: "100%",
                    opacity: 0,
                    position: "absolute",
                    height: "44px",
                    cursor: "pointer",
                    zIndex: 10
                  }}
                />
                <label 
                  htmlFor="upload-file"
                  className="shifaa-ai-chat-upload-label"
                  style={{
                    display: "block",
                    padding: "12px 16px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    borderRadius: "10px",
                    textAlign: "center",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    border: "2px dashed rgba(255,255,255,0.3)",
                    transition: "all 0.3s ease",
                    minHeight: "44px",
                    lineHeight: "1.4"
                  }}
                >
                  {uploading ? "⏳ جاري الرفع..." : "📎 رفع ملف (PDF / صور)"}
                </label>
              </div>

              {/* Text Input */}
              <div className="shifaa-ai-chat-textarea-wrapper">
                <textarea
                  className="shifaa-ai-chat-textarea"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب رسالتك هنا أو أرفق ملفك ..."
                  rows="1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button
                  className={`shifaa-ai-chat-send-btn ${
                    input.trim() && !isSending ? "shifaa-ai-chat-send-btn-active" : ""
                  }`}
                  onClick={sendMessage}
                  disabled={!input.trim() || isSending}
                >
                  <svg
                    className="shifaa-ai-chat-send-icon"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    height="20"
                    width="20"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>

              {/* Clear History Button */}
              <button className="shifaa-ai-chat-clear-btn" onClick={clearHistory}>
                مسح المحادثة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}