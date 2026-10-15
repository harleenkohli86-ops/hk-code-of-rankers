import type { Request, Response, NextFunction, RequestHandler } from 'express';

export const ah =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

export const ipOf = (req: Request) => req.ip || req.socket.remoteAddress || 'unknown';

/** Trim + length-limit a string field from user input. */
export function str(v: unknown, max = 200): string {
  if (v === undefined || v === null) return '';
  return String(v).trim().slice(0, max);
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public extra?: Record<string, unknown>
  ) {
    super(message);
  }
}

export const bad = (message: string, extra?: Record<string, unknown>) => new HttpError(400, message, extra);
export const notFound = (message = 'Record not found.') => new HttpError(404, message);
export const conflict = (message: string) => new HttpError(409, message);
