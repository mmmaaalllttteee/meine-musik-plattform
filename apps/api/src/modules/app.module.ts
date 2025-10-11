import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { BoardsModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';
import { FilesModule } from './files/files.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TemplatesModule } from './templates/templates.module';
import { SharesModule } from './shares/shares.module';
import { SettingsModule } from './settings/settings.module';
import { HealthController } from '../common/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
        synchronize: false
      })
    }),
    AuthModule,
    ProjectsModule,
    BoardsModule,
    TasksModule,
    FilesModule,
    AnalyticsModule,
    TemplatesModule,
    SharesModule,
    SettingsModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
