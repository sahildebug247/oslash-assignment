/** @format */

import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { oc } from 'ts-optchain';
import { IThreadTrackingAuthDetail } from '../../app/interfaces/authdetail.interface';
import CampaignCredentialEntity from '../../db/entities/campaign-credential.entity';

const ThreadTrackingAuthDetail = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): IThreadTrackingAuthDetail => {
		const request = ctx.switchToHttp().getRequest();
		const cred: CampaignCredentialEntity = request.cred;
		const ip: string =
			oc(request).headers['x-forwarded-for']() || oc<any>(request).connection.remoteAddress('');
		const jwtToken = oc<any>(request).headers.authorization('');
		if (!cred) {
			throw new UnauthorizedException();
		} else {
			return { cred: cred, currentIp: ip, jwtToken };
		}
	}
);

export default ThreadTrackingAuthDetail;
