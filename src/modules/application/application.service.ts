import { Application } from '@app/entities/application.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}
  async store(payload: any): Promise<Application[]> {
    return this.applicationRepository.create(payload);
  }

  async update(uuid: string, payload: any): Promise<UpdateResult> {
    return this.applicationRepository.update(uuid, payload);
  }

  async delete(uuid: string): Promise<DeleteResult> {
    return this.applicationRepository.delete(uuid);
  }

  async list(): Promise<Application[]> {
    return this.applicationRepository.find();
  }

  async show(uuid: string): Promise<Application | null> {
    return this.applicationRepository.findOne({ where: { uuid } });
  }
}
