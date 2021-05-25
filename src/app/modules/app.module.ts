/** @format */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import ConfigService from '../services/config.service';
import ConfigModule from './config.module';
import AuthModule from './auth.module';
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
	],
	providers: [],
	exports: [],
})
export class AppModule {}
