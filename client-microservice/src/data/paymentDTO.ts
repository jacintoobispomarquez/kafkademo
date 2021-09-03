import { IsInt, IsBoolean } from 'class-validator';

export class PaymentDTO {

  @IsInt()
  id: number
  @IsInt()
  operation: number;
  @IsInt()
  period: number;
  @IsInt()
  amount: number;
  @IsBoolean()
  payed: number;
  @IsInt()
  transactionID: number;

}