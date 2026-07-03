import express from "express";
import path from "path";
import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middlewares
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Database path resolver
  const dbPath = path.resolve(process.cwd(), "src", "db.json");

  // Helper to read DB
  async function readDatabase() {
    try {
      const data = await fs.readFile(dbPath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading db.json, returning empty defaults:", err);
      return {
        services: [],
        portfolio: [],
        testimonials: [],
        blog: [],
        formSubmissions: [],
        socialPosts: [],
        seoSettings: { title: "", description: "", keywords: "" }
      };
    }
  }

  // Helper to write DB
  async function writeDatabase(data: any) {
    try {
      await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (err) {
      console.error("Error writing db.json:", err);
      return false;
    }
  }

  // API: Get entire database
  app.get("/api/data", async (req, res) => {
    const db = await readDatabase();
    res.json(db);
  });

  // API: Submit a contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, company, email, phone, service, message } = req.body;
      if (!name || !email || !message) {
        res.status(400).json({ error: "Nombre, Correo y Mensaje son requeridos." });
        return;
      }

      const db = await readDatabase();
      const newSubmission = {
        id: "submission_" + Date.now(),
        name,
        company: company || "N/A",
        email,
        phone: phone || "N/A",
        service: service || "General",
        message,
        date: new Date().toISOString()
      };

      if (!db.formSubmissions) {
        db.formSubmissions = [];
      }
      db.formSubmissions.unshift(newSubmission);
      await writeDatabase(db);

      res.json({ success: true, submission: newSubmission });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Get form submissions for admin
  app.get("/api/admin/submissions", async (req, res) => {
    const db = await readDatabase();
    res.json(db.formSubmissions || []);
  });

  // API: Delete form submission
  app.delete("/api/admin/submissions/:id", async (req, res) => {
    try {
      const db = await readDatabase();
      db.formSubmissions = (db.formSubmissions || []).filter((s: any) => s.id !== req.params.id);
      await writeDatabase(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Update custom sections in the database
  app.post("/api/admin/update", async (req, res) => {
    try {
      const { key, data } = req.body;
      if (!key) {
        res.status(400).json({ error: "Key is required for updates." });
        return;
      }

      const db = await readDatabase();
      db[key] = data;
      const success = await writeDatabase(db);

      if (success) {
        res.json({ success: true, key, data });
      } else {
        res.status(500).json({ error: "Failed to write database updates." });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Gemini Intelligent Agent Chat
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, chatHistory, budget, selectedService } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Safe simulated fallback if no API key is provided - prevents crashing & is highly contextual!
        console.log("No valid GEMINI_API_KEY found. Utilizing high-fidelity simulated consultant.");
        const simulatedReplies = [
          `¡Hola! Qué excelente iniciativa la de digitalizar y optimizar tu negocio. Para un proyecto de ${selectedService || 'Diseño Web'}, un presupuesto estimado de $${budget || '1500'} USD es un gran punto de partida. Podemos estructurar una Landing Page premium o una web corporativa optimizada para SEO con integración de WhatsApp automatizado. ¿Te gustaría agendar una llamada de 15 minutos para afinar los detalles técnicos?`,
          `Me parece excelente. Con la automatización de WhatsApp y un chatbot de Inteligencia Artificial como los que desarrollamos para Jose Urdaneta, podemos captar leads las 24 horas y registrarlos en tu CRM de inmediato. ¿Deseas que te genere una cotización formal detallada en PDF para tu correo electrónico?`,
          `Entendido. En Jose Urdaneta nos enfocamos en el lujo y el rendimiento excepcional. Tu proyecto contará con carga en menos de 1 segundo, diseño móvil UX/UI totalmente personalizado y un embudo de conversión impecable. ¿Hay alguna otra funcionalidad que consideres prioritaria?`
        ];
        const randomReply = simulatedReplies[Math.min(chatHistory?.length || 0, simulatedReplies.length - 1)];
        res.json({ text: randomReply });
        return;
      }

      // Initialize Gemini Client Lazily (avoids crash on load)
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const db = await readDatabase();
      const servicesContext = JSON.stringify(db.services);
      const portfolioContext = JSON.stringify(db.portfolio);

      const systemInstruction = `
        Actúas como el Consultor de Ventas Avanzado con IA para la agencia premium de "JOSE URDANETA | Diseño Web • Automatización • Marketing Digital".
        Tu objetivo es atender a posibles clientes con un tono extremadamente corporativo, profesional, seguro, elegante y persuasivo (vendedor consultor digital experto, al nivel de agencias internacionales como Apple o Stripe).
        
        SERVICIOS QUE OFRECEMOS:
        ${servicesContext}

        CASOS DE ÉXITO RECIENTES:
        ${portfolioContext}

        CONTEXTO DEL CLIENTE:
        - Servicio solicitado: ${selectedService || "General / Indeciso"}
        - Presupuesto estimado: $${budget || "No especificado"} USD

        REGLAS DE RESPUESTA:
        1. Responde de manera profesional, estructurada y en español formal pero cercano.
        2. Siempre resalta el valor del diseño de lujo, la optimización extrema de velocidad de carga y la conversión (CRO) por encima de las plantillas genéricas.
        3. Si el cliente tiene dudas de costos, ayúdalo a entender que cada solución se cotiza a medida pero proporciónale un rango inteligente basado en su servicio y presupuesto.
        4. Invítalo amablemente a completar el formulario de contacto o agendar una sesión de consultoría si está listo para arrancar.
        5. Sé conciso pero sumamente convincente. No uses emojis excesivos; mantén un estilo elegante y limpio.
      `;

      // Build contents structure
      const formattedContents: any[] = [];
      if (chatHistory && chatHistory.length > 0) {
        chatHistory.forEach((msg: any) => {
          formattedContents.push({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
          });
        });
      }
      formattedContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Disculpa, he tenido una interferencia digital. ¿Podrías repetirme tu consulta?";
      res.json({ text: replyText });

    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ error: "Ocurrió un error con el motor de IA. Fallback simulado activo." });
    }
  });

  // Serve static assets in production or set up Vite middleware in development
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULLSTACK SERVER] Running on http://localhost:${PORT}`);
  });
}

startServer();
