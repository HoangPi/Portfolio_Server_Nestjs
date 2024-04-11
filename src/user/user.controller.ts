import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from 'src/auth/strategies/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { RolesGuard } from 'src/auth/strategies/roles.guard';
import { Roles } from 'src/auth/strategies/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return req.user
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(['admin','user'])
  getInfo(@Request() req) {
    return req.user
  }

  @Get('getAllProfiles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  findAll(@Request() req) {
    return this.userService.findAll();
  }

  @Patch(':fullname')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin','user'])
  update(@Param('fullname') fullname: string, @Request() req) {
    return this.userService.update(fullname, req.user.userId, req.user.role);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  removeSelf(@Request() req) {
    return this.userService.remove(req.user.userId);
  }

  @Delete(':id&:p')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  remove(@Request() req,@Param('id') id: string,@Param('p') password: string) {
    console.log(`id: ${id} and p: ${password}`)
    return this.userService.removeOther(id,password)
  }
}
