import { IsString, IsDate, IsInt, IsDecimal } from 'class-validator';

export class OperationDTO {

  @IsInt()
  id: number
  @IsInt()
  operation: number;
  @IsString()
  rut: string;
  @IsDecimal()
  tax: number;
  @IsInt()
  periods: number;
  @IsInt()
  cadency: number;
  @IsDate()
  initDate: Date;
  @IsInt()
  amount: number;
  @IsInt()
  transactionID: number;

}