/** @format */

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import ConfigService from '../services/config.service';
import AuthModule from './auth.module';
import ConfigModule from './config.module';
import { LogModule } from './log.module';
import { PostModule } from './post.module';
import { UserModule } from './user.module';

@Module({
	imports: [
		ConfigModule,
		TypeOrmModule.forRootAsync({
			useFactory: (config: ConfigService) => {
				return config.getTypeORMConfig();
			},
			inject: [ConfigService],
		}),
		ScheduleModule.forRoot(),
		AuthModule,
		UserModule,
		PostModule,
		LogModule,
	],
	providers: [],
	exports: [],
})
export class AppModule {}
