import { BookmarkInterface } from '@interfaces/bookmark.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  public async toggleBookmark(
    userId: string,
    postId: string,
  ): Promise<BookmarkInterface> {
    const post = await this.prisma.posts.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException('Post not found!');

    const checkBookmark = await this.prisma.bookmarks.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!checkBookmark) {
      return await this.prisma.bookmarks.create({
        data: {
          postId: postId,
          userId: userId,
        },
        include: {
          posts: {
            include: {
              user: true,
            },
          },
        },
      });
    } else {
      await this.prisma.bookmarks.delete({
        where: {
          id: checkBookmark.id,
        },
      });
      return null;
    }
  }
}
