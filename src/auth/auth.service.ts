import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserEntity } from 'src/models/users/entity/user.entity';
import { AccessToken } from 'src/types/auth/AccessToken';
import { RegisterRequestDto } from './dto/RegisterRequestDTO';
import { CreateUser } from 'src/models/users/dtos/create.dto';
import { UserService } from 'src/models/users/user.service';
import { LoginRequestDto } from './dto/LoginRequestDTO';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    generateAccessToken(payload: any): string {
        return this.jwtService.sign(payload, { secret: process.env.ACCESS_TOKEN_SECRET });
      }
    
    generateRefreshToken(payload: any): string {
        return this.jwtService.sign(payload, { secret: process.env.REFRESH_TOKEN_SECRET });
    }

    async saveRefreshToken(userId: number, token: string): Promise<void> {
        // Save the hashed token in the database
        const hashedToken = await bcrypt.hash(token, 10);
        await this.userService.update(userId, {id: userId, resetToken: hashedToken });
    }
    
    async validateRefreshToken(userId: number, token: string): Promise<boolean> {
        const user = await this.userService.findOneById(userId);
        if (!user || !user.resetToken) return false;
        return bcrypt.compare(token, user.resetToken);
    }


    async validateUser(email: string, password: string): Promise<UserEntity> {
        const user: UserEntity = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const isMatch: boolean = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Password does not match');
        }
        return user;
    }

    async login(model: LoginRequestDto): Promise<AccessToken> {
        const user = await this.userService.findOneByEmail(model.email)
        if(!user) {
            throw new NotFoundException(`user not found`)
        }
        const accessToken = this.generateAccessToken({ userId: user.id, email: user.email });
        const refreshToken = this.generateRefreshToken({ userId: user.id, email: user.email });

        await this.saveRefreshToken(user.id, refreshToken);
    
        return { access_token: accessToken, refresh_token: refreshToken };
    }
    async register(user: RegisterRequestDto): Promise<void> { 
        const existingUser = await this.userService.findOneByEmail(user.email);
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }
        const hashedPassword: string = await bcrypt.hash(user.password, 10);
        const newUser: UserEntity = await this.userService.create({ ...user, password: hashedPassword });
    }

    async logout (payload: any) {
        const user = await this.userService.findOneById(payload.id);
        if (!user) {
            throw new NotFoundException(`user not found`)
        }
        await this.userService.update(user.id, {id: user.id, resetToken: null });
    }
}
