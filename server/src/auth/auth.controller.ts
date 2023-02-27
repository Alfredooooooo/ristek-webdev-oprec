import { User } from 'common/decorators/user.decorator';
import { LoginDTO, RegisterDTO, UserRequestDTO } from '@dto/auth.DTO';
import { ImageFileFilter } from '@filters/image-file.filter';
import { ResponseInterface } from '@interfaces/global.interface';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard, RefreshTokenGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      fileFilter: ImageFileFilter,
    }),
  )
  public async register(
    @UploadedFile()
    profilePicture: Express.Multer.File,
    @Body() body: RegisterDTO,
  ): Promise<ResponseInterface> {
    await this.authService.register(body, profilePicture);
    return {
      code: 201,
      message: 'Account Created!',
      success: true,
      content: null,
    };
  }

  @Post('login')
  public async login(@Body() body: LoginDTO): Promise<ResponseInterface> {
    const { userId, token } = await this.authService.login(body);
    return {
      code: 200,
      message: 'Login Successful!',
      success: true,
      content: {
        userId: userId,
        token: token,
      },
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  public async refresh(
    @User() { sub, email, refreshToken }: UserRequestDTO,
  ): Promise<ResponseInterface> {
    const access_token = await this.authService.refresh(
      sub,
      email,
      refreshToken,
    );
    return {
      code: 200,
      message: 'Refresh Successful!',
      success: true,
      content: {
        access_token: access_token,
      },
    };
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  public async logout(@User() user: UserRequestDTO) {
    await this.authService.logout(user.sub); // Fill by user Id later

    return {
      code: 200,
      message: 'Logout Successful!',
      success: true,
      content: null,
    };
  }
}
