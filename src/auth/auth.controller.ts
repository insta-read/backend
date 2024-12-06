import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RegisterRequestDto } from './dto/RegisterRequestDTO';
import { LoginRequestDto } from './dto/LoginRequestDTO';
import { Request, Response } from 'express';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Public()
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    @Post('login')
    async login(
        @Res({ passthrough: true }) response: Response,
        @Body() loginBody: LoginRequestDto,
    ): Promise<void> {
        const { access_token, refresh_token } = await this.authService.login(loginBody);
        response.cookie('access_token', access_token, {
            httpOnly: true, // Prevents client-side JavaScript access
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
            // sameSite: 'strict', // Prevents cross-site request forgery (CSRF)
            maxAge: this.configService.get('JWT_EXPIRES_IN') ?? 3600 * 1000, // Optional: Cookie expiration in milliseconds
        });

        response.cookie('refresh_token', access_token, {
            httpOnly: true, // Prevents client-side JavaScript access
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
            // sameSite: 'strict', // Prevents cross-site request forgery (CSRF)
            maxAge: this.configService.get('REFRESH_JWT_EXPIRES_IN') ?? 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }

    @Get('logout')
    async logout(@Res() res: Response, @Req() req: Request) {
        const accessToken = req.cookies?.accessToken;
        const payload = await this.jwtService.verifyAsync(accessToken, {
            secret: this.configService.get('JWT_SECRET'),
        });
        this.authService.logout(payload);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.send({ message: 'Logout successful' });
    }

    @Post('register')
    async register(@Body() registerBody: RegisterRequestDto): Promise<BadRequestException | void> {
        await this.authService.register(registerBody);
        // return ApiCreatedResponse({message: 'User registered sucessfully'})
    }

    @Post('refresh-token')
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies?.refreshJwt;
        if (!refreshToken) {
            throw new HttpException('Refresh token not found', HttpStatus.FORBIDDEN);
        }

        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('REFRESH_JWT_SECRET'),
            });

            const isValid = await this.authService.validateRefreshToken(
                payload.userId,
                refreshToken,
            );
            if (!isValid) {
                throw new HttpException('Invalid refresh token', HttpStatus.FORBIDDEN);
            }

            const newAccessToken = this.authService.generateAccessToken({
                userId: payload.userId,
                username: payload.username,
            });

            res.cookie('jwt', newAccessToken, {
                httpOnly: true,
                secure: true,
                maxAge: this.configService.get('JWT_EXPIRES_IN') ?? 3600 * 1000, // Optional: Cookie expiration in milliseconds
            });

            res.send({ message: 'Access token refreshed' });
        } catch (err) {
            throw new HttpException('Invalid refresh token', HttpStatus.FORBIDDEN);
        }
    }
}
