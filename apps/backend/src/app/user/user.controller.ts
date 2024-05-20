import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Roles } from 'nest-keycloak-connect';

@Controller('users')
export class UserController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  @Roles({ roles: ['admin', 'other'] })
  async getUsers() {
    return this.prismaService.user.findMany();
  }
}
