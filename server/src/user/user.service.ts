import { CloudinaryService } from '@cloudinary/cloudinary.service';
import {
  PartialUserInterface,
  UserInterface,
} from '@interfaces/user.interface';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  public async findUser(id: string): Promise<PartialUserInterface[]> {
    const usersData = await this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
      },
      orderBy: {
        fullName: 'asc',
      },
      where: {
        NOT: {
          id: id,
        },
      },
    });

    return usersData;
  }

  public async findUserById(id: string): Promise<UserInterface> {
    const userData = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        bookmarks: {
          include: {
            posts: {
              include: {
                user: true,
              },
            },
          },
        },
        posts: {
          include: {
            Bookmarks: true,
          },
        },
      },
    });

    if (!!!userData) throw new NotFoundException('User not found');

    userData.posts.sort(
      (prev, current) => current.createdAt.getTime() - prev.createdAt.getTime(),
    );

    return userData;
  }

  public async changeUserData(
    id: string,
    bio: string,
    profilePicture: Express.Multer.File,
  ): Promise<UserInterface> {
    const cloudinaryImage = profilePicture
      ? await this.cloudinary.uploadImage(profilePicture)
      : undefined;

    let response: UserInterface;

    if (!!cloudinaryImage && !!bio) {
      response = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          bio: bio,
          profilePicture: cloudinaryImage.secure_url,
        },
        include: {
          bookmarks: {
            include: {
              posts: {
                include: {
                  user: true,
                },
              },
            },
          },
          posts: {
            include: {
              Bookmarks: true,
            },
          },
        },
      });
    } else if (!!cloudinaryImage) {
      response = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          profilePicture: cloudinaryImage.secure_url,
        },
        include: {
          bookmarks: {
            include: {
              posts: {
                include: {
                  user: true,
                },
              },
            },
          },
          posts: {
            include: {
              Bookmarks: true,
            },
          },
        },
      });
    } else if (!!bio) {
      response = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          bio: bio,
        },
        include: {
          bookmarks: {
            include: {
              posts: {
                include: {
                  user: true,
                },
              },
            },
          },
          posts: {
            include: {
              Bookmarks: true,
            },
          },
        },
      });
    } else {
      throw new BadRequestException('At least change 1 value.');
    }

    return response;
  }

  public async closeFriend(userId: string, friendId: string): Promise<boolean> {
    if (userId === friendId)
      throw new BadRequestException(
        "You can't add yourself to your close friend!",
      );
    const { closeFriend } = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        closeFriend: true,
      },
    });

    if (!closeFriend.includes(friendId)) {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          closeFriend: {
            push: friendId,
          },
        },
      });
    } else {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          closeFriend: {
            set: closeFriend.filter((id: string) => id !== friendId),
          },
        },
      });
    }
    return !closeFriend.includes(friendId);
  }
}
