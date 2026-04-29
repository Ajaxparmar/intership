import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/apply", async (req, res) => {
    try {
      const data = req.body;
      
      // Basic validation
      if (!data.name || !data.email) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if DATABASE_URL is set
      if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost")) {
        console.warn("Using mock response as DATABASE_URL is not configured for a real MongoDB instance.");
        return res.json({ 
          success: true, 
          message: "Application received (Development Mock)",
          applicationId: "mock_id_" + Math.random().toString(36).substr(2, 9)
        });
      }

      const application = await prisma.application.create({
        data: {
          name: data.name,
          fatherName: data.fatherName,
          address: data.address,
          gender: data.gender,
          phone: data.phone,
          email: data.email,
          academicClass: data.academicClass,
          yearSemester: data.yearSemester,
          rollNo: data.rollNo,
          collegeName: data.collegeName,
          universityName: data.universityName,
          duration: data.duration,
          domain: data.domain,
          amount: parseFloat(data.amount),
        },
      });

      res.status(201).json({ success: true, applicationId: application.id });
    } catch (error) {
      console.error("Application error:", error);
      res.status(500).json({ error: "Failed to submit application. Ensure MongoDB is connected and Prisma is generated." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server startup error:", err);
});
