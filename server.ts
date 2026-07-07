import express from "express";
import path from "path";
import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import crypto from "crypto";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Helper to hash passwords
  function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  // Body parser middlewares
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Database path resolver
  const dbPath = path.resolve(process.cwd(), "src", "db.json");

  // Helper to read DB
  async function readDatabase() {
    try {
      const data = await fs.readFile(dbPath, "utf-8");
      const db = JSON.parse(data);
      if (!db.users) db.users = [];
      return db;
    } catch (err) {
      console.error("Error reading db.json, returning empty defaults:", err);
      return {
        services: [],
        portfolio: [],
        testimonials: [],
        blog: [],
        formSubmissions: [],
        socialPosts: [],
        seoSettings: { title: "", description: "", keywords: "" },
        users: []
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

  // API: Auth - Register a new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ error: "Nombre, Correo y Contraseña son requeridos." });
        return;
      }

      const normalizedEmail = email.toLowerCase().trim();
      const db = await readDatabase();

      // Check if user already exists
      const existingUser = db.users.find((u: any) => u.email.toLowerCase().trim() === normalizedEmail);
      if (existingUser) {
        res.status(400).json({ error: "El correo electrónico ya está registrado." });
        return;
      }

      // First user, or specific admin emails, get the "admin" role
      const isAdminEmail = 
        normalizedEmail === "josegregoriourdanetaguadama@gmail.com" || 
        normalizedEmail === "admin@joseurdaneta.com";
      const role = (db.users.length === 0 || isAdminEmail) ? "admin" : "student";

      const newUser = {
        id: "user_" + Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        role,
        activeMembership: {
          level: null,
          expiresAt: null
        },
        completedLessons: [],
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);
      await writeDatabase(db);

      // Return user without password hash
      const { passwordHash, ...userResponse } = newUser;
      res.json({ success: true, user: userResponse });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Auth - Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Correo y Contraseña son requeridos." });
        return;
      }

      const normalizedEmail = email.toLowerCase().trim();
      const db = await readDatabase();

      const user = db.users.find((u: any) => u.email.toLowerCase().trim() === normalizedEmail);
      if (!user) {
        res.status(400).json({ error: "Credenciales incorrectas o usuario no registrado." });
        return;
      }

      const hash = hashPassword(password);
      if (user.passwordHash !== hash) {
        res.status(400).json({ error: "Contraseña incorrecta." });
        return;
      }

      const { passwordHash, ...userResponse } = user;
      res.json({ success: true, user: userResponse });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Update lesson progress
  app.post("/api/users/update-progress", async (req, res) => {
    try {
      const { userId, lessonId, completed } = req.body;
      if (!userId || !lessonId) {
        res.status(400).json({ error: "ID de usuario y de clase son requeridos." });
        return;
      }

      const db = await readDatabase();
      const userIndex = db.users.findIndex((u: any) => u.id === userId);
      if (userIndex === -1) {
        res.status(404).json({ error: "Usuario no encontrado." });
        return;
      }

      let completedList = db.users[userIndex].completedLessons || [];
      if (completed) {
        if (!completedList.includes(lessonId)) {
          completedList.push(lessonId);
        }
      } else {
        completedList = completedList.filter((id: string) => id !== lessonId);
      }

      db.users[userIndex].completedLessons = completedList;
      await writeDatabase(db);

      res.json({ success: true, completedLessons: completedList });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Admin - Get all registered users
  app.get("/api/admin/users", async (req, res) => {
    try {
      const db = await readDatabase();
      // Map and exclude password hashes for security
      const safeUsers = db.users.map(({ passwordHash, ...user }: any) => user);
      res.json(safeUsers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Admin - Update user membership manually
  app.post("/api/admin/users/:id/membership", async (req, res) => {
    try {
      const { level } = req.body;
      const userId = req.params.id;

      const db = await readDatabase();
      const userIndex = db.users.findIndex((u: any) => u.id === userId);
      if (userIndex === -1) {
        res.status(404).json({ error: "Usuario no encontrado." });
        return;
      }

      db.users[userIndex].activeMembership = {
        level: level || null,
        expiresAt: level ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
      };

      await writeDatabase(db);
      const { passwordHash, ...userResponse } = db.users[userIndex];
      res.json({ success: true, user: userResponse });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Submit a contact form / payment request
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, company, email, phone, service, message, userId, requestedLevel, voucher, voucherImage, isPaymentRequest, status } = req.body;
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
        date: new Date().toISOString(),
        userId: userId || null,
        requestedLevel: requestedLevel || null,
        voucher: voucher || null,
        voucherImage: voucherImage || null,
        isPaymentRequest: !!isPaymentRequest,
        status: status || (isPaymentRequest ? "pending" : "none")
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

  // API: Admin - Approve payment / subscription request
  app.post("/api/admin/submissions/:id/approve", async (req, res) => {
    try {
      const submissionId = req.params.id;
      const db = await readDatabase();
      
      const subIndex = db.formSubmissions?.findIndex((s: any) => s.id === submissionId);
      if (subIndex === -1 || subIndex === undefined) {
        res.status(404).json({ error: "Solicitud no encontrada." });
        return;
      }
      
      const submission = db.formSubmissions[subIndex];
      submission.status = "approved";
      
      // Locate the user to activate membership
      let userIndex = -1;
      if (submission.userId) {
        userIndex = db.users.findIndex((u: any) => u.id === submission.userId);
      }
      if (userIndex === -1 && submission.email) {
        userIndex = db.users.findIndex((u: any) => u.email.toLowerCase().trim() === submission.email.toLowerCase().trim());
      }
      
      if (userIndex !== -1) {
        const level = submission.requestedLevel || "Principiante";
        db.users[userIndex].activeMembership = {
          level,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
        submission.message += `\n\n[SISTEMA - APROBADO] Membresía ${level} activada con éxito para ${db.users[userIndex].name}.`;
      } else {
        submission.message += `\n\n[SISTEMA - ALERTA] Aprobado pero no se encontró cuenta de usuario registrada con el correo de la solicitud.`;
      }
      
      await writeDatabase(db);
      res.json({ success: true, submission });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Admin - Reject payment / subscription request
  app.post("/api/admin/submissions/:id/reject", async (req, res) => {
    try {
      const submissionId = req.params.id;
      const db = await readDatabase();
      
      const subIndex = db.formSubmissions?.findIndex((s: any) => s.id === submissionId);
      if (subIndex === -1 || subIndex === undefined) {
        res.status(404).json({ error: "Solicitud no encontrada." });
        return;
      }
      
      const submission = db.formSubmissions[subIndex];
      submission.status = "rejected";
      submission.message += `\n\n[SISTEMA - RECHAZADO] Solicitud rechazada por el administrador.`;
      
      await writeDatabase(db);
      res.json({ success: true, submission });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Admin - Update user role manually
  app.post("/api/admin/users/:id/role", async (req, res) => {
    try {
      const { role } = req.body;
      const userId = req.params.id;
      if (role !== "admin" && role !== "student") {
        res.status(400).json({ error: "Rol no válido (debe ser 'admin' o 'student')." });
        return;
      }

      const db = await readDatabase();
      const userIndex = db.users.findIndex((u: any) => u.id === userId);
      if (userIndex === -1) {
        res.status(404).json({ error: "Usuario no encontrado." });
        return;
      }

      db.users[userIndex].role = role;
      await writeDatabase(db);
      const { passwordHash, ...userResponse } = db.users[userIndex];
      res.json({ success: true, user: userResponse });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Create Stripe Checkout Session (Optional integration - falls back to simulated if key missing)
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { membershipId, level, priceCop, priceUsd, name, email, phone, userId } = req.body;

      const stripeKey = process.env.STRIPE_SECRET_KEY;
      
      // Calculate USD amount in cents
      let usdAmount = 12; // default for Principiante
      if (level === "Intermedio") usdAmount = 25;
      else if (level === "Avanzado") usdAmount = 49;
      
      const amountInCents = usdAmount * 100;

      // Handle Database assignment helper
      const assignUserMembership = async (db: any) => {
        if (userId) {
          const userIndex = db.users.findIndex((u: any) => u.id === userId);
          if (userIndex !== -1) {
            db.users[userIndex].activeMembership = {
              level,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
            console.log(`Successfully assigned membership ${level} to user ${userId}`);
          }
        }
      };

      if (!stripeKey || stripeKey === "MY_STRIPE_SECRET_KEY" || stripeKey.trim() === "") {
        // Fallback to simulated payment response
        console.log("No valid STRIPE_SECRET_KEY found. Utilizing high-fidelity simulated checkout.");
        
        // Save the transaction to DB submissions as a registered purchase request
        const db = await readDatabase();
        const newSubmission = {
          id: "submission_pay_" + Date.now(),
          name,
          company: "Matrícula Pasarela (Simulada)",
          email,
          phone: phone || "N/A",
          service: `Suscripción ${level}`,
          message: `[PAGO SIMULADO - MODO DEMO]
Suscripción solicitada: Membresía ${level} (${priceCop} / $${usdAmount} USD)
Método de Pago: Pasarela de Pago Directa (Simulador de Tarjeta de Crédito)
Estado del Pago: COMPLETADO (Aprobado en modo Sandbox)
Fecha de Transacción: ${new Date().toLocaleString()}
(Configura STRIPE_SECRET_KEY en las variables de entorno para procesar cobros reales con tarjeta de crédito de forma internacional)`,
          date: new Date().toISOString()
        };

        if (!db.formSubmissions) {
          db.formSubmissions = [];
        }
        db.formSubmissions.unshift(newSubmission);
        
        // Also assign membership to user immediately in sandbox
        await assignUserMembership(db);
        
        await writeDatabase(db);

        // Find and return the updated user if possible to keep client in sync
        let updatedUser = null;
        if (userId) {
          const matched = db.users.find((u: any) => u.id === userId);
          if (matched) {
            const { passwordHash, ...safe } = matched;
            updatedUser = safe;
          }
        }

        res.json({
          simulated: true,
          success: true,
          message: "Payment authorized successfully in Sandbox/Demo mode.",
          user: updatedUser
        });
        return;
      }

      // Initialize Stripe lazily
      const stripe = new Stripe(stripeKey, {
        apiVersion: "2025-01-27.acacia" as any
      });

      // Create a Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Membresía Academia - Nivel ${level}`,
                description: `Suscripción mensual autoadministrable (${priceCop})`,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin || "http://localhost:3000"}/?payment=success&membershipId=${membershipId}&level=${level}&userId=${userId || ""}`,
        cancel_url: `${req.headers.origin || "http://localhost:3000"}/?payment=cancel`,
        customer_email: email,
        metadata: {
          membershipId,
          level,
          userId: userId || "",
          phone: phone || "",
        },
      });

      // Save a pending submission for tracking
      const db = await readDatabase();
      const newSubmission = {
        id: "submission_stripe_" + Date.now(),
        name,
        company: "Stripe Checkout (Pendiente)",
        email,
        phone: phone || "N/A",
        service: `Suscripción ${level}`,
        message: `[PAGO INICIADO - STRIPE CHECKOUT REAl]
Enlace de checkout generado con éxito. Esperando confirmación de fondos por Stripe.
Sesión ID: ${session.id}
Plan: Membresía ${level}`,
        date: new Date().toISOString()
      };
      if (!db.formSubmissions) {
        db.formSubmissions = [];
      }
      db.formSubmissions.unshift(newSubmission);

      // In development mode where webhook is not active, assign active membership right away for test experience
      await assignUserMembership(db);

      await writeDatabase(db);

      res.json({ simulated: false, url: session.url, id: session.id });
    } catch (err: any) {
      console.error("Stripe Session Error:", err);
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
