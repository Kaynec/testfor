export type UserProfileName = 'student' | 'teacher' | 'admin';

export type UserRoles = string[];

export type Token = string;

export type LoginDocuments = {
  username: string;
  password: string;
};

export type UserDocuments = {
  _id?: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  orientation: string;
  point: number;
  biddingCode: string;
  profileImage: string;
  gender: string;
  birthdate: Date;
  nationalId: number;
};
