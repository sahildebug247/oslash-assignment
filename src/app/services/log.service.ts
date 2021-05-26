/** @format */

import { Injectable } from '@nestjs/common';
import ReturnVal from '../../lib/ReturnVal';
import LogEntity from '../../db/entities/log.entity';
import { ELogAction, ELogType } from '../enum/log.enum';
import ETable from '../enum/table.enum';
import IAuthDetail from '../interfaces/authdetail.interface';
import ConfigService from './config.service';

@Injectable()
export default class LogService {
	constructor(private readonly configService: ConfigService) {}

	public async createLog(
		authDetail: IAuthDetail,
		refId: string,
		logType: ELogType,
		logAction: ELogAction,
		refTable: ETable
	): Promise<{
		success: boolean;
		entity?: LogEntity;
		err?: any;
	}> {
		try {
			const logEntity = LogEntity.create({
				userId: authDetail.currentUser.id,
				refId,
				logType,
				logAction,
				refTable,
			});
			await logEntity.save();
			return {
				success: true,
				entity: logEntity,
			};
		} catch (e) {
			return {
				success: false,
				err: e,
			};
		}
	}
	public async getLogs(
		page: number,
		logTypeFilter: ELogType,
		logActionFilter: ELogAction,
		userIdFilter: string,
		authDetail: IAuthDetail
	): Promise<ReturnVal> {
		const { currentUser } = authDetail;
		const filters = this.getFilters(logActionFilter, logTypeFilter, userIdFilter);
		const offset: number = --page * +this.configService.getEntityFetchLimit();

		const logs = await LogEntity.findAndCount({
			skip: offset,
			take: Number(this.configService.getEntityFetchLimit()),
			where: filters,
			order: {
				updatedAt: 'DESC',
			},
		});
		const logEntities: LogEntity[] = logs[0];
		const logCount: number = logs[1];
		const logMap = [];
		for (const log of logEntities) {
			logMap.push({ ...log.toJSON(currentUser.timezone) });
		}
		return ReturnVal.success({
			logs: logMap,
			count: logCount,
		});
	}

	private getFilters(logActionFilter: ELogAction, logTypeFilter: ELogType, userIdFilter: string) {
		const filters = {};
		if (logActionFilter) {
			filters['logAction'] = logActionFilter;
		}
		if (logTypeFilter) {
			filters['logType'] = logActionFilter;
		}
		if (userIdFilter) {
			filters['userId'] = userIdFilter;
		}

		return filters;
	}
}
