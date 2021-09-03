import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientDTO } from './data/clientDTO';

@Controller('services/operation')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createOperation(@Body() payload: ClientDTO) {
    const client = this.appService.createOperation(payload);
    return client;
  }

}