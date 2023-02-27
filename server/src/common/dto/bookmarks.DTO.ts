import { IsNotEmpty, IsString } from 'class-validator';

export class BookmarkDTO {
  @IsString()
  @IsNotEmpty()
  postId: string;
}
