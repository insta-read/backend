import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['access_token'];
    if (token) {
      try {
        req[`user`] = this.jwtService.verify(token);
      } catch (e) {
        // Handle invalid token
      }
    }
    next();
  }
}
