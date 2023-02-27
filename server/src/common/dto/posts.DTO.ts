import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { Type } from '@nestjs/class-transformer';

export class PostsDTO {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @Type(() => String)
  @IsOptional()
  images?: string;

  @IsString()
  isCloseFriend: string;
}

export class UpdatePostsDTO {
  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  isCloseFriend: string;
}
