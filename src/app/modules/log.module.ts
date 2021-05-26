/** @format */

import { Module } from '@nestjs/common';
import LogController from '../controllers/log.controller';
import LogService from '../services/log.service';
@Module({
	providers: [LogService],
	exports: [],
	controllers: [LogController],
})
export class LogModule {}
