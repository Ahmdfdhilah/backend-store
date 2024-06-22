import { Body, Controller, Get, Param, Post, Put, Req,  UnauthorizedException,  UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  getMe(@Headers('Authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authorization.replace('Bearer ', '');
    const userId = this.authService.getUserIdFromToken(token);
    return { userId };
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Req() req) {
    const user = req.user;
    return { accessToken: this.authService.getJwtToken(user) };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto) ;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('validate-token')
  async validateToken(@Req() req) {
    const user = req.user;
    return { message: 'Token is valid', user };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

 
}
