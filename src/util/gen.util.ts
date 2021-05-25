/** @format */

import CampaignCredentialEntity from '../db/entities/campaign-credential.entity';
import EScraperErrorCode from '../app/enum/scraper-error-code.enum';
import CampaignDeploymentEntity from '../db/entities/campaign-deployments.entity';
import ECampaignDeploymentStatus from '../app/enum/campaign-deployment-status.enum';
import Logger from '../lib/Logger';

const logger = new Logger('GenUtil');
class GenUtil {
	public static getNumbericToken(): number {
		return Math.floor(Math.random() * 10000);
	}

	public static async loginFailureCheck(credEntity: CampaignCredentialEntity, httpCode: number) {
		if (httpCode === EScraperErrorCode.LOGIN_FIRST) {
			logger.error(`Credential not logged in, could not scrap url id: ${credEntity.id}`);
			credEntity.isLoggedin = false;
			await credEntity.save();
		}
	}

	public static shuffleArray(array) {
		array.sort(() => Math.random() - 0.5);
		return array;
	}

	public static async scraperConnectionRefusedCheck(
		e,
		deploymentEntity: CampaignDeploymentEntity,
		credId: string
	) {
		console.log(e, deploymentEntity);
		if (e.code === 'ECONNREFUSED' && deploymentEntity) {
			logger.error(
				`Could not scrap url , either connection refused or no active deployment found, credId: ${credId}`
			);
			deploymentEntity.status = ECampaignDeploymentStatus.UNAVAILABLE;
			await deploymentEntity.save();
			return true;
		}
	}

	public static async scraperConnectionTimeoutCheck(
		e,
		deploymentEntity: CampaignDeploymentEntity,
		credId: string
	) {
		console.log(e, deploymentEntity);
		if (e.code === 'ETIMEDOUT' && deploymentEntity) {
			logger.error(
				`Could not scrap url , either connection timeout or no active deployment found, credId: ${credId}`
			);
			deploymentEntity.status = ECampaignDeploymentStatus.UNAVAILABLE;
			await deploymentEntity.save();
			return true;
		}
	}
	public static isWordPresent(word, str) {
		const allowedSeparator = '\\s,;"\'|';

		const regex = new RegExp(
			`(^.*[${allowedSeparator}]${word}$)|(^${word}[${allowedSeparator}].*)|(^${word}$)|(^.*[${allowedSeparator}]${word}[${allowedSeparator}].*$)`,

			// Case insensitive
			'i'
		);

		return regex.test(str);
	}

	public static sleep(milliseconds) {
		const date = Date.now();
		let currentDate = null;
		do {
			currentDate = Date.now();
		} while (currentDate - date < milliseconds);
	}

	public static async getDeployment(
		credId: string
	): Promise<{
		success: boolean;
		baseURL: string;
		apikey: string;
		deploymentEntity: CampaignDeploymentEntity;
	}> {
		const apiKey = 'UUxCPjQlOa7qi1OVsw&%#@^6O4A9inXPNcmryz7J6xusEF*D&S*HhjsafPKSjCuqI7tLOlmZPoV';
		let baseURL: string;
		let deploymentEntity: CampaignDeploymentEntity;
		if (process.env.NODE_ENV === 'production') {
			deploymentEntity = await CampaignDeploymentEntity.findOne({
				where: {
					credentialId: credId,
					runnerRegistered: true,
					status: ECampaignDeploymentStatus.ACTIVE,
				},
			});
			if (!deploymentEntity) {
				return {
					success: false,
					baseURL: '',
					apikey: '',
					deploymentEntity,
				};
			}
			baseURL = 'http://' + deploymentEntity.publicIp + ':3002';
		} else {
			baseURL = 'http://localhost:3002';
		}
		// baseURL = 'http://localhost:3002';

		return {
			success: true,
			baseURL,
			apikey: apiKey,
			deploymentEntity,
		};
	}
}

export default GenUtil;
