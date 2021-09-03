import { IsString, IsEmail, IsInt } from 'class-validator';

export class ClientDTO {

  @IsInt()
  id: number
  @IsString()
  rut: string;
  @IsString()
  name: string;
  @IsString()
  firstname: string;
  @IsString()
  city: string;
  @IsString()
  region: string;
  @IsString()
  address: string;
  @IsEmail()
  email: string; 
}