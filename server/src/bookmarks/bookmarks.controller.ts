import { User } from '@decorators/user.decorator';
import { UserRequestDTO } from '@dto/auth.DTO';
import { BookmarkDTO } from '@dto/bookmarks.DTO';
import { ResponseInterface } from '@interfaces/global.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'auth/auth.guard';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @UseGuards(AccessTokenGuard)
  @Patch('')
  public async toggleBookmark(
    @User() user: UserRequestDTO,
    @Body() { postId }: BookmarkDTO,
  ): Promise<ResponseInterface> {
    const bookmark = await this.bookmarksService.toggleBookmark(
      user.sub,
      postId,
    );

    return {
      code: bookmark ? 201 : 204,
      content: bookmark ? bookmark : null,
      message: bookmark ? 'Bookmark created!' : 'Bookmark deleted!',
      success: true,
    };
  }
}
