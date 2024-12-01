import { User } from '@prisma/client';
import { IsDate, IsString, IsInt, IsOptional } from 'class-validator';
import { RestrictProperties } from 'src/common/utils/general';

export class UserEntity {
    id: number;
    firstname: string; // User's name
    lastname: string; // User's name
    email: string;
    password: string; // Hashed password

    @IsOptional()
    createdAt: Date;
    @IsOptional()
    updatedAt: Date;

    @IsOptional()
    resetToken: string;
    @IsOptional()
    resetTokenExpiry: Date; // Expiration time for the reset token
}
