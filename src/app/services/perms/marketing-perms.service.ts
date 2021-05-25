import { Injectable } from '@nestjs/common';
import IPermsResponse from '../../interfaces/perms-response.interface';
import EMessages from '../../constants/messages.constant';
import CampaignCredentialEntity from '../../../db/entities/campaign-credential.entity';

@Injectable()
class MarketingPermissionService {
  public async canRegisterUser(credId: string): Promise<IPermsResponse> {
    const credEntity = await CampaignCredentialEntity.findOne(credId);
    if (!credEntity) {
      return {
        success: false,
        httpCode: 400,
        error: EMessages.INVALID_ID,
      };
    }

    if (!credEntity.isDeployed) {
      return {
        success: false,
        httpCode: 400,
        error: EMessages.DEPLOYMENT_IS_NOT_LIVE_FOR_THIS_CREDENTIAL,
      };
    }

    return {
      success: true,
      error: '',
      httpCode: 0,
    };
  }
}

export default MarketingPermissionService;
