import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { CLogger } from '@app/loggers/logger.service';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: CLogger,
      gracefulShutdownTimeoutMs: 1000,
    }),
    HttpModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
