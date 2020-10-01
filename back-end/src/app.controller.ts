import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {UrlPair} from './inferfaces/url-pair.interface';
import { CreateUrlDto } from './dto/create-url.dto'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
    getAll(): Promise<UrlPair[]> {
      return this.appService.getAll();
  }

  @Post()
  async shortenUrl(@Body() createUrlDto: CreateUrlDto): Promise<UrlPair> | null {
      return await this.appService.shortenUrl(createUrlDto);

  }

  @Get('count')
  async getCount(): Promise<number> {
    return await this.appService.getCount();
  }

}
