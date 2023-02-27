import { LoginInterface, RegisterInterface } from '@interfaces/auth.interface';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CloudinaryService } from '@cloudinary/cloudinary.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserInterface, UserLoginInterface } from '@interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private async hashItem(str: string): Promise<string> {
    return hash(str);
  }

  private async getTokens(
    userId: string,
    email: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: this.config.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES'),
        },
      ),
      this.jwt.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: this.config.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES'),
        },
      ),
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, newRefreshToken: string) {
    const hashedNewRefreshToken = await this.hashItem(newRefreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        currentToken: hashedNewRefreshToken,
      },
    });
    await this.prisma.tokens.updateMany({
      where: {
        userId: userId,
        tokenStatus: 'ENABLED',
      },
      data: {
        tokenStatus: 'DISABLED',
      },
    });
    await this.prisma.tokens.create({
      data: {
        token: newRefreshToken,
        userId: userId,
      },
    });
  }

  public async register(
    { ...body }: RegisterInterface,
    profilePicture: Express.Multer.File,
  ): Promise<void> {
    const isUserExist = !!(await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    }));

    if (isUserExist)
      throw new BadRequestException(
        'User with the same email has already been registered.',
      );

    const newProfilePicture = profilePicture
      ? await this.cloudinary.uploadImage(profilePicture)
      : undefined;

    const hashedPassword = await this.hashItem(body.password);
    await this.prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
        currentToken: null,
        profilePicture: !!newProfilePicture ? newProfilePicture.secure_url : '',
      },
    });
  }

  public async login({
    email,
    password,
  }: LoginInterface): Promise<UserLoginInterface> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!!!user) throw new BadRequestException('User does not exist.');

    // Compare user password with current password
    const comparePassword = await verify(user.password, password);

    if (!comparePassword)
      throw new BadRequestException('Password is incorrect.');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { userId: user.id, token: tokens.refreshToken };
  }

  public async refresh(
    sub: string,
    email: string,
    refreshToken: string,
  ): Promise<string> {
    const checkToken = await this.prisma.tokens.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (checkToken.tokenStatus === 'DISABLED')
      throw new ForbiddenException('Token has already been disabled');

    const { currentToken } = await this.prisma.user.findUnique({
      where: {
        id: sub,
      },
    });

    if (!!!currentToken) throw new ForbiddenException('Access Denied.');

    const compareRefresh = verify(currentToken, refreshToken);

    if (!compareRefresh) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(sub, email);

    return tokens.accessToken;
  }

  public async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        currentToken: null,
      },
    });
    await this.prisma.tokens.updateMany({
      where: {
        userId: userId,
        tokenStatus: 'ENABLED',
      },
      data: {
        tokenStatus: 'DISABLED',
      },
    });
  }
}
