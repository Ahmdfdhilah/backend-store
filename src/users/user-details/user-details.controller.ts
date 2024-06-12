import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFile, NotFoundException } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { CreateUserDetailsDto } from './dto/create-user-details.dto';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller('users/details-user')
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) {}

  @Get(':userId')
  async findOneByUserId(@Param('userId') userId: string) {
    return await this.userDetailsService.findByUserId(userId);
  }

  @Post(':userId')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = 'public/upload/users';
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async create(
    @Param('userId') userId: string, 
    @UploadedFile() file, 
    @Body() createUserDetailsDto: CreateUserDetailsDto
  ) {

    let imageUrl = null;

    if (file) {
      imageUrl = `http://localhost:3000/public/upload/users/${file.filename}`;
    }
    
    try {
      const userDetails = await this.userDetailsService.create(userId, createUserDetailsDto, imageUrl);
      return { message: 'User details created and image uploaded successfully', userDetails, imageUrl };
    } catch (error) {
      console.error('Error creating user details:', error); // More detailed error logging
      return { message: 'Failed to create user details', error };
    }
 
  }

  @Put(':userId')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = 'public/upload/users';
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async update(
    @Param(':userId') userId: string, 
    @UploadedFile() file, 
    @Body() updateUserDetailsDto: UpdateUserDetailsDto
  ) {
    let imageUrl = null;

    if (file) {
      imageUrl = `http://localhost:3000/public/upload/users/${file.filename}`;
    }

    try {
      const userDetails = await this.userDetailsService.update(userId, updateUserDetailsDto, imageUrl);
      return { message: 'User details updated successfully', userDetails, imageUrl };
    } catch (error) {
      console.error('Error updating user details:', error); 
      return { message: 'Failed to update user details', error };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userDetailsService.remove(id);
  }
}