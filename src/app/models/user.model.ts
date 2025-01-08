export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateUserDTO {
  firstName: string;
  lastName: string;
  username: string;
}

export interface UpdatePasswordDTO {
  currentPassword: string;
  newPassword: string;
}