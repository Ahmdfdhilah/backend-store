import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { AuthPayloadDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async validateUser({ username, password }: AuthPayloadDto): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      this.logger.log(`User not found: ${username}`);
      return null;
    }

    this.logger.log(`Comparing passwords for user: ${username}`);
    this.logger.log(`Plain password: ${password}`);
    this.logger.log(`Hashed password: ${user.password}`);

    if(await bcrypt.compare(password, user.password)) return user;

    this.logger.log("Password comparison failed");
    return null;
  }

  getJwtToken(user: any) {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }
  async createUser(createUserDto: CreateUserDto): Promise<any> {
    var salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const user = await this.userService.create({ ...createUserDto, password: hashedPassword });
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { user, accessToken };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.userService.update(id, updateUserDto);
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { user, accessToken };
  }
}