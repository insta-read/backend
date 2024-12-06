import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { PrismaService } from 'src/common/prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUser } from './dtos/create.dto';
import { UserQueryDto } from './dtos/query.dto';
import { UpdateUser } from './dtos/update.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserEntity } from './entity/user.entity';
import { GetUserType } from 'src/common/types';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly prisma: PrismaService) {}

    @ApiBearerAuth()
    @ApiCreatedResponse({ type: UserEntity })
    @Post()
    create(@Body() createUserDto: CreateUser) {
        return this.prisma.user.create({ data: createUserDto });
    }

    @ApiOkResponse({ type: [UserEntity] })
    @Get()
    findAll(@Query() { skip, take, order, sortBy }: UserQueryDto) {
        return this.prisma.user.findMany({
            ...(skip ? { skip: +skip } : null),
            ...(take ? { take: +take } : null),
            ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
        });
    }

    @ApiOkResponse({ type: UserEntity })
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    @ApiOkResponse({ type: UserEntity })
    @ApiBearerAuth()
    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUser) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }

    @ApiBearerAuth()
    @Delete(':id')
    async remove(@Param('id') id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return this.prisma.user.delete({ where: { id } });
    }
}
