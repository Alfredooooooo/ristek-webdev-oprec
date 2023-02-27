export interface PartialUserInterface {
  id: string;
  fullName: string;
}

export interface UserInterface {
  id: string;
  email: string;
  fullName: string;
  profilePicture: string;
  bio: string;
}

export interface UserLoginInterface {
  userId: string;
  token: string;
}
