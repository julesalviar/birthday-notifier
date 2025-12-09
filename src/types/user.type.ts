export interface User {
  firstName: string;
  lastName: string;
  birthDate: string;
  timezone: string;
}

export interface UserEntity extends User {
  userId: string;
  createdAt: string;
}