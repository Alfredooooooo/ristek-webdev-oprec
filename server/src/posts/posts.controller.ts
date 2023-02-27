import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsDTO, UpdatePostsDTO } from '@dto/posts.DTO';
import { ImageFileFilter } from '@filters/image-file.filter';
import { ResponseInterface } from '@interfaces/global.interface';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'auth/auth.guard';
import { User } from '@decorators/user.decorator';
import { UserRequestDTO } from '@dto/auth.DTO';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AccessTokenGuard)
  @Get('')
  async getPosts(@User() user: UserRequestDTO): Promise<any> {
    const postsData = await this.postsService.getPosts(user.sub);

    return {
      code: 200,
      success: true,
      message: 'Get Data',
      content: postsData,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Post('')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: ImageFileFilter,
    }),
  )
  async createPosts(
    @User() user: UserRequestDTO,
    @UploadedFile()
    image: Express.Multer.File,
    @Body() body: PostsDTO,
  ): Promise<ResponseInterface> {
    const { content, isCloseFriend } = body;
    const parsedIsCloseFriend = isCloseFriend === 'true' ? true : false;
    const data = await this.postsService.createPosts(
      { content: content, image: image, isCloseFriend: parsedIsCloseFriend },
      user.sub,
    );

    return {
      code: 201,
      success: true,
      message: 'Post created!',
      content: data,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: ImageFileFilter,
    }),
  )
  async updatePosts(
    @User() user: UserRequestDTO,
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: UpdatePostsDTO,
  ): Promise<ResponseInterface> {
    const { content, isCloseFriend } = body;
    const parsedIsCloseFriend =
      isCloseFriend === 'true'
        ? true
        : isCloseFriend === undefined
        ? (undefined as unknown as boolean)
        : false;

    const data = await this.postsService.updatePosts(
      id,
      content,
      image,
      user.sub,
      parsedIsCloseFriend,
    );
    return {
      code: 200,
      success: true,
      message: 'Post Updated!',
      content: data,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deletePosts(
    @User() user: UserRequestDTO,
    @Param('id') id: string,
  ): Promise<ResponseInterface> {
    await this.postsService.deletePosts(id, user.sub);
    return {
      code: 204,
      success: true,
      message: 'Post deleted!',
      content: null,
    };
  }
}
