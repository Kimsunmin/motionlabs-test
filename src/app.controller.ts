import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor() {}

  @Get('ping')
  @ApiResponse({ status: 200, description: 'pong' })
  ping(): string {
    return 'pong';
  }
}
