import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { StoreDto } from './dto/application.dto';
import { Roles } from '@app/decorators/roles.decorator';

@Controller('application')
export class ApplicationController {
  constructor(private service: ApplicationService) {}

  @HttpCode(HttpStatus.OK)
  @Roles('Admin')
  @Get('list')
  async list() {
    return this.service.list();
  }

  @HttpCode(HttpStatus.CREATED)
  @Roles('Admin')
  @Post('show/:uuid')
  async show(@Param('uuid') uuid: string) {
    return this.service.show(uuid);
  }

  @HttpCode(HttpStatus.OK)
  @Roles('Admin')
  @Post('store')
  async store(@Body() payload: StoreDto) {
    return this.service.store(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Roles('Admin')
  @Post('update/:uuid')
  async update(@Body() payload: StoreDto, @Param('uuid') uuid: string) {
    return this.service.update(uuid, payload);
  }

  @HttpCode(HttpStatus.OK)
  @Roles('Admin')
  @Post('delete/:uuid')
  async delete(@Param('uuid') uuid: string) {
    return this.service.delete(uuid);
  }
}
