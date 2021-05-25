import { Injectable } from '@nestjs/common';
import IPermsResponse from '../../interfaces/perms-response.interface';
import EMessages from '../../constants/messages.constant';
import CampaignEntity from '../../../db/entities/campaign.entity';
import CampaignURLEntity from '../../../db/entities/campaign-url.entity';
import CampaignCredentialEntity from '../../../db/entities/campaign-credential.entity';

@Injectable()
class CampaignURLPermissionService {
  public async canCreateURLs(
    campaignId: string,
    credentialId: string
  ): Promise<IPermsResponse> {
    const credentialEntity = await CampaignCredentialEntity.findOne({
      where: { campaignId, id: credentialId },
    });
    if (!credentialEntity) {
      return {
        success: false,
        error: EMessages.LINKEDIN_CREDENTIALS_DOES_NOT_EXISTS_FOR_THIS_CAMPAIGN,
        httpCode: 400,
      };
    }
    return {
      success: true,
      error: '',
      httpCode: 0,
    };
  }

  // todo needs update with credId in schema
  public async canUpdateURL(
    id: string,
    campaignId: string
  ): Promise<IPermsResponse> {
    const campaignURLEntity = await CampaignURLEntity.findOne(id);
    if (!campaignURLEntity) {
      return {
        success: false,
        error: EMessages.INVALID_ID,
        httpCode: 400,
      };
    }
    if (campaignId) {
      const campaignEntity = await CampaignEntity.findOne({
        where: {
          id: campaignId,
        },
      });
      if (!campaignEntity) {
        return {
          success: false,
          error: EMessages.INVALID_CAMPAIGN_ID,
          httpCode: 400,
        };
      }
    }

    return {
      success: true,
      error: '',
      httpCode: 0,
    };
  }
}

export default CampaignURLPermissionService;
