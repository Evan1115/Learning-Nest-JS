import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configSchemaValidation } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      //when we import ConfigModule, nestjs will automaically export ConfigService  so we can inject it to other class that import ConfigModule
      envFilePath: [`config/.env.stage.${process.env.STAGE}`],
      validationSchema: configSchemaValidation
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({ // shortform instead of specify return
          type: 'postgres',
          autoLoadEntities: true, //every entity registered through the forFeature() method will be automatically added to the entities array of the configuration object.
          synchronize: true,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
      }),
    }),
    AuthModule,
  ],
})
export class AppModule {}
