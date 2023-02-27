export interface PostsInterface {
  id: string;
  content: string;
  createdAt: Date;
  image?: Express.Multer.File;
  isCloseFriend: boolean;
}

export interface PostDataInterface {
  id: string;
  content: string;
  createdAt: Date;
  image?: string;
  isCloseFriend: boolean;
}
