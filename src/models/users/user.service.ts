import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserEntity } from './entity/user.entity';
import { CreateUser } from './dtos/create.dto';
import { UpdateUser } from './dtos/update.dto';

@Injectable()
export class UserService {
  constructor( private readonly prisma: PrismaService
  ) {}

  findOneByEmail(email: string): Promise<UserEntity | null> {
    const user: UserEntity = this.prisma.user.findUnique({where: {email}}) as any 
    return Promise.resolve(user)
  }

  findOneById(id: number): Promise<UserEntity | null> {
    const user: UserEntity = this.prisma.user.findUnique({where: {id}}) as any
    return Promise.resolve(user)
  }

  create(createUser: CreateUser): Promise<UserEntity> {
    const user: UserEntity =  this.prisma.user.create({data: createUser}) as any
    return Promise.resolve(user)
  }

  update(userId: number, updateUser: UpdateUser): Promise<UserEntity> {
    const user: UserEntity = this.prisma.user.update({data: 
      updateUser,
      where: {id: userId}
    }) as any
    return Promise.resolve(user)
  }
}