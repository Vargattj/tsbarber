import { Request, Response, NextFunction } from 'express';

import { verify } from 'jsonwebtoken';
import auth from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}
export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Validação do token JWT
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('JWT is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, auth.jwt.secret);

    const { sub } = decoded as TokenPayload;
    req.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new Error('Invalid JWT token');
  }
}
