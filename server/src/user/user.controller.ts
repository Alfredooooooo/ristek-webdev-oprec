import { User } from '@decorators/user.decorator';
import { UserRequestDTO } from '@dto/auth.DTO';
import { CloseFriendDTO, UserDTO } from '@dto/user.DTO';
import { ImageFileFilter } from '@filters/image-file.filter';
import { ResponseInterface } from '@interfaces/global.interface';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'auth/auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get('')
  public async findUser(
    @User() user: UserRequestDTO,
  ): Promise<ResponseInterface> {
    const usersData = await this.userService.findUser(user.sub);

    return {
      code: 200,
      message: 'Successfully get all user.',
      success: true,
      content: usersData,
    };
  }

  @Get(':id')
  public async findUserById(
    @Param('id') id: string,
  ): Promise<ResponseInterface> {
    const userData = await this.userService.findUserById(id);

    return {
      code: 200,
      message: 'Successfully get user.',
      success: true,
      content: userData,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Patch('')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      fileFilter: ImageFileFilter,
    }),
  )
  public async changeUserData(
    @User() user: UserRequestDTO,
    @UploadedFile() profilePicture: Express.Multer.File,
    @Body() { bio }: UserDTO,
  ): Promise<ResponseInterface> {
    const data = await this.userService.changeUserData(
      user.sub,
      bio,
      profilePicture,
    );

    return {
      code: 200,
      success: true,
      message: 'User Updated!',
      content: data,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Patch('close-friend')
  public async closeFriend(
    @User() user: UserRequestDTO,
    @Body() { friendId }: CloseFriendDTO,
  ): Promise<ResponseInterface> {
    const isCloseFriend = await this.userService.closeFriend(
      user.sub,
      friendId,
    );

    return {
      code: 200,
      success: true,
      message: isCloseFriend
        ? 'Added to your close friend!'
        : 'Removed from your close friend!',
      content: null,
    };
  }
}
