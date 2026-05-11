import { processVolleyFrame } from "../services/geminiSlingShotService";
import { Request, Response } from "express";

/**
 * Grok-1.5 Vision API Gateway (Remix)
 * Routes incoming frame data to the Biomechanics Engine.
 */
export const handleVolleyProcess = async (req: Request, res: Response) => {
  const { image, mode, timestamp } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Missing image data" });
  }

  try {
    const analysis = await processVolleyFrame(image, mode || 'LIVE');
    
    // Response mapping for VolleyPro Biomechanical Schema
    res.json({
      success: true,
      timestamp,
      analysis: {
        ...analysis,
        metadata: {
          engine: "Grok-1.5-Vision-Bridge",
          latency: Date.now() - timestamp,
          precision: "ULTRA"
        }
      }
    });
  } catch (error: any) {
    console.error("API Gateway Fail:", error);
    res.status(500).json({ error: "High-speed inference failed", details: error.message });
  }
};
