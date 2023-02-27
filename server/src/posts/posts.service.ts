import { CloudinaryService } from '@cloudinary/cloudinary.service';
import { PostDataInterface, PostsInterface } from '@interfaces/posts.interface';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Posts } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  private async checkIfPostExist(id: string): Promise<Posts> {
    const post = await this.prisma.posts.findUnique({
      where: {
        id: id,
      },
    });
    if (!!!post) throw new NotFoundException('Post not found!');

    return post;
  }

  private async checkIfAuthor(authorId: string, currentUserId: string) {
    if (authorId !== currentUserId)
      throw new ForbiddenException(
        'You dont have the permission to change this post.',
      );
  }

  private async findPublicPosts(): Promise<PostDataInterface[]> {
    const posts = await this.prisma.posts.findMany({
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
            id: true,
            profilePicture: true,
          },
        },
        Bookmarks: true,
      },
      where: {
        isCloseFriend: false,
      },
    });

    return posts;
  }

  private async findCloseFriendPosts(
    userId: string,
  ): Promise<PostDataInterface[]> {
    let usersId = await this.prisma.user.findMany({
      select: {
        id: true,
      },
      where: {
        closeFriend: {
          has: userId,
        },
      },
    });

    usersId = [{ id: userId }, ...usersId];

    const posts = [];

    for (const user of usersId) {
      const post = await this.prisma.posts.findMany({
        include: {
          user: {
            select: {
              email: true,
              fullName: true,
              id: true,
              profilePicture: true,
            },
          },
          Bookmarks: true,
        },
        where: {
          userId: user.id,
          isCloseFriend: true,
        },
      });
      posts.push(...post);
    }

    return posts;
  }

  async getPosts(userId: string): Promise<PostDataInterface[]> {
    const publicPosts = await this.findPublicPosts();
    const closeFriendPosts = await this.findCloseFriendPosts(userId);

    const posts = [...publicPosts, ...closeFriendPosts];
    posts.sort(
      (prev, current) => current.createdAt.getTime() - prev.createdAt.getTime(),
    );
    return posts;
  }

  async createPosts(
    { content, image, isCloseFriend }: Omit<PostsInterface, 'id' | 'createdAt'>,
    userId: string,
  ): Promise<PostDataInterface> {
    const cloudinaryImage = image
      ? await this.cloudinary.uploadImage(image)
      : undefined;

    const response = await this.prisma.posts.create({
      data: {
        content: content,
        image: !!cloudinaryImage ? cloudinaryImage.secure_url : '',
        userId: userId,
        isCloseFriend: isCloseFriend,
      },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
            id: true,
            profilePicture: true,
          },
        },
        Bookmarks: true,
      },
    });

    return response;
  }

  async updatePosts(
    id: string,
    content: string,
    image: Express.Multer.File,
    userId: string,
    isCloseFriend: boolean,
  ): Promise<PostDataInterface> {
    const post = await this.checkIfPostExist(id);

    await this.checkIfAuthor(post.userId, userId);

    const cloudinaryImage = image
      ? await this.cloudinary.uploadImage(image)
      : undefined;
    let response: PostDataInterface;

    const validateIsCloseFriend = isCloseFriend !== undefined ? true : false;

    if (!!cloudinaryImage && !!content && !!validateIsCloseFriend) {
      response = await this.prisma.posts.update({
        where: {
          id: id,
        },
        data: {
          content: content,
          image: cloudinaryImage.secure_url,
          isCloseFriend: isCloseFriend,
        },
        include: {
          user: {
            select: {
              email: true,
              fullName: true,
              id: true,
              profilePicture: true,
            },
          },
        },
      });
    } else if (!!cloudinaryImage && !!validateIsCloseFriend) {
      response = await this.prisma.posts.update({
        where: {
          id: id,
        },
        data: {
          image: cloudinaryImage.secure_url,
          isCloseFriend: isCloseFriend,
        },
        include: {
          user: {
            select: {
              email: true,
              fullName: true,
              id: true,
              profilePicture: true,
            },
          },
        },
      });
    } else if (!!content && !!validateIsCloseFriend) {
      response = await this.prisma.posts.update({
        where: {
          id: id,
        },
        data: {
          content: content,
          isCloseFriend: isCloseFriend,
        },
        include: {
          user: {
            select: {
              email: true,
              fullName: true,
              id: true,
              profilePicture: true,
            },
          },
        },
      });
    } else if (!!cloudinaryImage && !!content) {
      response = await this.prisma.posts.update({
        where: {
          id: id,
        },
        data: {
          content: content,
          image: cloudinaryImage.secure_url,
        },
        include: {
          user: {
            select: {
              email: true,
              fullName: true,
              id: true,
              profilePicture: true,
            },
          },
        },
      });
    } else if (!!cloudinaryImage) {
      response = await this.prisma.posts.update({
        where: {
          id: id,
        },
        data: {
          image: cloudinaryImage.secure_url,
        },
        include: {
          user: {
            select: {
              email: true,
              fullName: true,
              id: true,
              profilePicture: true,
            },
          },
        },
      });
    } else if (!!content) {
      response = await this.prisma.posts.update({
        where: {
          id: id,
        },
        data: {
          content: content,
        },
        include: {
          user: {
            select: {
              email: true,
              fullName: true,
              id: true,
              profilePicture: true,
            },
          },
        },
      });
    } else if (!!validateIsCloseFriend) {
      response = await this.prisma.posts.update({
        where: {
          id: id,
        },
        data: {
          isCloseFriend: isCloseFriend,
        },
        include: {
          user: {
            select: {
              email: true,
              fullName: true,
              id: true,
              profilePicture: true,
            },
          },
        },
      });
    } else {
      throw new BadRequestException('At least change 1 value.');
    }

    return response;
  }

  async deletePosts(id: string, userId: string): Promise<void> {
    const post = await this.checkIfPostExist(id);

    await this.checkIfAuthor(post.userId, userId);

    await this.prisma.bookmarks.deleteMany({
      where: {
        postId: id,
      },
    });

    await this.prisma.posts.delete({
      where: {
        id: id,
      },
    });
  }
}
