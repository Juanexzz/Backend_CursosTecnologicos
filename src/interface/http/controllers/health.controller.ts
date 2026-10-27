import { Request, Response } from "express";

export class HealthController {
  check = (_req: Request, res: Response): void => {
    res.status(200).json({
      status: "ok",
      service: "NexTech Academy API",
      timestamp: new Date().toISOString()
    });
  };
}
