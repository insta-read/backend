import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
    @ApiProperty({ description: 'Email of the user' })
    email: string;

    @ApiProperty({ description: 'Password for the user' })
    password: string;
}
