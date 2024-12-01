import { BadRequestException, Body, Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginResponseDTO } from './dto/LoginResponseDTO';
import { RegisterRequestDto } from './dto/RegisterRequestDTO';
import { RegisterResponseDTO } from './dto/RegisterResponseDTO';
import { LoginRequestDto } from './dto/LoginRequestDTO';
import { Response } from 'express';

@Public()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    
    @Post('login')
    async login(  @Res({ passthrough: true }) response: Response, @Body() loginBody: LoginRequestDto): Promise<void> {

        const {access_token} =  await this.authService.login(loginBody);
        response.cookie('access_token', access_token, {
            httpOnly: true, // Prevents client-side JavaScript access
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
            sameSite: 'strict', // Prevents cross-site request forgery (CSRF)
            maxAge: 3600 * 1000, // Optional: Cookie expiration in milliseconds
          });
    }

    @Post('register')
    async register(
        @Body() registerBody: RegisterRequestDto,
    ): Promise<RegisterResponseDTO | BadRequestException> {
        return await this.authService.register(registerBody);
    }
}
