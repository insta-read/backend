import { ApiProperty } from "@nestjs/swagger";

export class RegisterRequestDto {
  @ApiProperty({ description: 'First name of the user' })
  firstname: string;

  @ApiProperty({ description: 'Last name of the user' })
  lastname: string;

  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @ApiProperty({ description: 'Password for the user' })
  password: string;
}