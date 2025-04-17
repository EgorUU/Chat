export interface ICurrentAccount {
    id: number | null,
    name: string,
    email: string;
    password: string;
  }
  
export interface ILoginState {
    email: string;
    password: string;
}


export interface IRegisterState {
  name: string,
  email: string;
  password: string;
}