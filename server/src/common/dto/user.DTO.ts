import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDTO {
  @IsOptional()
  @IsString()
  bio: string;
}

export class CloseFriendDTO {
  @IsNotEmpty()
  @IsString()
  friendId: string;
}
