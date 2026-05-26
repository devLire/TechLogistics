export interface GetUserResponse {
  status: string;
  message: string;
  data: UserData;
}

export interface UserData {
  id_usuario: number;
  nombre: string;
  rol: string;
  email: string;
}
