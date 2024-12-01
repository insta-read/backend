import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
    controllers: [UsersController],
    imports: [PrismaModule],
    providers: [UserService],
    exports: [UserService],
})
export class UsersModule {}
