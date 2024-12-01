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
        const payload = { email: user.email, id: user.id };
        return { access_token: this.jwtService.sign(payload) };
    }
    async register(user: RegisterRequestDto): Promise<AccessToken> { 
        const existingUser = await this.userService.findOneByEmail(user.email);
        if (existingUser) {
            throw new BadRequestException('email already exists');
        }
        const hashedPassword: string = await bcrypt.hash(user.password, 10);
        const newUser: UserEntity = await this.userService.create({ ...user, password: hashedPassword });
        return
    }
}
