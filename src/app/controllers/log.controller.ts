/** @format */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import ReturnVal from '../../lib/ReturnVal';
import AuthDetail from '../../util/decorator/controller-Authdetail.decorator';
import HandleReturnVal from '../../util/decorator/handle-returnval.decorator';
import { ELogAction, ELogType } from '../enum/log.enum';
import { EUserRole } from '../enum/user.enum';
import AuthenticationGuard from '../guards/authentication.guard';
import RolesGuard from '../guards/roles.guard';
import IAuthDetail from '../interfaces/authdetail.interface';
import NumberValidationPipe from '../pipes/number-validation.pipe';
import StringValidationPipe from '../pipes/string-validation.pipe';
import { EntityIdFilterSchema, PageNumberSchema } from '../schemas/global.schema';
import { LogActionFilterSchema, LogTypeFilterSchema } from '../schemas/log.schema';
import LogService from '../services/log.service';

@Controller('log')
export default class LogController {
	constructor(private readonly logService: LogService) {}
	/*
        Get Routes
    */

	@Get('')
	@UseGuards(AuthenticationGuard, new RolesGuard([EUserRole.SUPER_ADMIN]))
	@HandleReturnVal
	public async getPosts(
		@Query('page', new NumberValidationPipe(PageNumberSchema)) page = 1,
		@Query('action', new StringValidationPipe(LogActionFilterSchema)) actionFilter: ELogAction,
		@Query('type', new StringValidationPipe(LogTypeFilterSchema)) typeFilter: ELogType,
		@Query('user', new StringValidationPipe(EntityIdFilterSchema)) userIdFilter: string,
		@AuthDetail() authDetail: IAuthDetail
	): Promise<ReturnVal> {
		return this.logService.getLogs(page, typeFilter, actionFilter, userIdFilter, authDetail);
	}
}
