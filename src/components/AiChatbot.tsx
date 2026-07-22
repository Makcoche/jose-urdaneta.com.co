import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, Loader2, Bot, HelpCircle } from "lucide-react";
import officialLogoImg from "../assets/images/sinergia_official_logo_1784756544650.jpg";

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "¡Hola! Soy el asistente virtual de Sinergia Agencia Creativa. ¿Te gustaría saber cómo podemos automatizar tus ventas, diseñar una web de lujo o estructurar tu embudo comercial?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [budget, setBudget] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const presetQuestions = [
    "¿Cuánto cuesta una Landing Page?",
    "¿Cómo funcionan las automatizaciones de WhatsApp?",
    "Ver proyectos de e-commerce exitosos",
    "Quiero agendar una consultoría de ventas"
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Append user message
    const userMsg = { sender: "user" as const, text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          chatHistory: messages,
          budget,
          selectedService
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { sender: "bot", text: data.text }]);
        setIsTyping(false);
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Falling back to local chatbot rule-based responder:", err);
      // Fallback rule-based simulator
      setTimeout(() => {
        const query = text.toLowerCase();
        let reply = "¡Hola! Soy el asistente virtual de Sinergia Agencia Creativa. Puedo brindarte información sobre nuestros servicios de desarrollo web, automatizaciones y programas de formación.";
        
        if (query.includes("hola") || query.includes("buen") || query.includes("salud")) {
          reply = "¡Hola! Qué gusto saludarte. ¿En qué puedo ayudarte hoy en relación a los servicios de desarrollo web, automatización de procesos o la Academia de Sinergia Agencia Creativa?";
        } else if (query.includes("precio") || query.includes("planes") || query.includes("cost") || query.includes("suscrip") || query.includes("comprar") || query.includes("pago") || query.includes("pagar")) {
          reply = "Nuestros planes en pesos colombianos son: 'Landing Page' (desde $990.000 COP), 'Página Corporativa' ($1.980.000 COP) y 'Tienda Virtual' (¡En Promoción por $2.990.000 COP!). Adicionalmente, nuestra Academia LMS cuenta con contenido gratuito y niveles avanzados con suscripción. ¡Puedes realizar transferencias por Nequi o Bancolombia directamente!";
        } else if (query.includes("contacto") || query.includes("agenda") || query.includes("llamada") || query.includes("reun") || query.includes("asesor") || query.includes("escribir") || query.includes("correo")) {
          reply = "¡Excelente iniciativa! Puedes agendar una asesoría comercial completando el formulario de contacto de esta página web, o escribiendo de manera directa a nuestro equipo.";
        } else if (query.includes("curso") || query.includes("aprender") || query.includes("clase") || query.includes("lms") || query.includes("academia")) {
          reply = "La Academia de Sinergia Agencia Creativa ofrece lecciones y guías sobre desarrollo frontend, backend, automatizaciones e infraestructura. Regístrate de forma totalmente gratuita y accede al contenido de nivel Principiante de inmediato. Los niveles Intermedio y Avanzado se activan mediante suscripción.";
        } else if (query.includes("gracias") || query.includes("ok") || query.includes("perfecto") || query.includes("bueno") || query.includes("excelente")) {
          reply = "¡Con mucho gusto! Estoy aquí para apoyarte. No olvides revisar el portafolio y los testimonios interactivos de clientes satisfechos.";
        }
        
        setMessages(prev => [...prev, { sender: "bot", text: reply }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating conversational expander bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 230 }}
            className="w-[90vw] sm:w-[380px] h-[500px] bg-white dark:bg-[#051a1b] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col mb-4"
          >
            
            {/* Header section */}
            <div className="bg-primary dark:bg-black/40 px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-secondary/50 p-0.5 bg-gradient-to-br from-primary to-secondary shrink-0">
                  <img
                    src={officialLogoImg}
                    alt="Sinergia Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-sm text-white flex items-center gap-1">
                    Asistente Sinergia
                    <Sparkles size={12} className="text-secondary animate-pulse" />
                  </h4>
                  <span className="text-[10px] font-mono text-gray-300">Asesor Comercial 24/7</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/80 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat list viewport */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-[#051a1b]/40">
              
              {messages.map((msg, idx) => {
                const isBot = msg.sender === "bot";
                return (
                  <div key={idx} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isBot
                        ? "bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-800 dark:text-gray-200"
                        : "bg-primary text-white"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicators */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                    <Loader2 size={12} className="animate-spin text-primary dark:text-secondary" />
                    <span>Sinergia procesando consulta...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef}></div>

            </div>

            {/* Footer with Preset and typing field */}
            <div className="p-3 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#051a1b] shrink-0 space-y-3">
              
              {/* Preset suggestion chips */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pb-1">
                  {presetQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSendMessage(q)}
                      className="text-[10px] text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/50 dark:hover:border-secondary/50 px-2 py-1 rounded-md text-left transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Context modifiers */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <select
                  value={selectedService}
                  onChange={e => setSelectedService(e.target.value)}
                  className="px-2 py-1 border border-gray-100 dark:border-white/10 rounded bg-transparent dark:bg-[#051a1b] text-gray-500"
                >
                  <option value="">Servicio...</option>
                  <option value="Diseño Web">Diseño Web</option>
                  <option value="Tienda Virtual">Tienda Virtual</option>
                  <option value="Automatización">Automatización</option>
                  <option value="Branding">Branding</option>
                </select>
                <input
                  type="number"
                  placeholder="Presupuesto USD..."
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  className="px-2 py-1 border border-gray-100 dark:border-white/10 rounded bg-transparent text-gray-500"
                />
              </div>

              {/* Typing field */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleSendMessage(inputValue);
                  }}
                  placeholder="Escribe tu mensaje comercial..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs sm:text-sm bg-transparent text-black dark:text-white focus:outline-none focus:border-primary"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  className="p-2.5 rounded-xl bg-primary text-white hover:bg-opacity-95 transition-all"
                >
                  <Send size={14} />
                </button>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl relative cursor-pointer group"
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping group-hover:bg-primary/45 transition-all"></div>
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </motion.button>

    </div>
  );
}
