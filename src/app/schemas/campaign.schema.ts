/** @format */

import Joi from '@hapi/joi';
import { ECampaignProfileApproval, ECampaignStatus, ECampaignType } from '../enum/campaign.enum';
import { UrlSchema } from './global.schema';
import ECampaignCredentialsStatus from '../enum/campaign-credentials-status.enum';
import ECampaignURLType from '../enum/campaign-url-type.enum';
import ECampaignDeploymentStatus from '../enum/campaign-deployment-status.enum';
import ECampaignURLStatus, { EBlacklistURLStatus } from '../enum/campaign-url-status.enum';
import ECloseLeadStatus from '../enum/close-lead-status.enum';
import EScheduledFollowupStatus from '../enum/scheduled-followup.enum';
let designationSchema = Joi.object().keys({
	displayValue: Joi.string().required(),
	value: Joi.array().unique().required(),
});
const CreateCampaignSchema = Joi.object({
	name: Joi.string().min(5).max(30).required(),
	connectionsPerURL: Joi.number().min(1).max(3).required(),
	managers: Joi.array().unique(),
	marqueeContactEmail: Joi.string().email({ minDomainSegments: 2 }).required(),
	whitelistedDesignation: Joi.array().unique().items(designationSchema).required(),
	blacklistedDesignation: Joi.array().unique().items(designationSchema).required(),
	isProfileApprovalReq: Joi.boolean(),
	isWhitelistApplied: Joi.boolean().required(),
});
const CreateInternalCampaignSchema = Joi.object({
	name: Joi.string().min(5).max(30).required(),
	email: Joi.string().min(5).max(30).required(),
	credProfileName: Joi.string().min(5).max(30).required(),
	password: Joi.string().min(5).max(30).required(),
	closeId: Joi.string().uuid().required(),
	twoFaSecret: Joi.string().min(5),
});

const CreateCategorySchema = Joi.object({
	name: Joi.string().min(5).max(30).required(),
});
const CreateCloseIoUserSchema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	email: Joi.string().min(5).max(30).required(),
	timezone: Joi.string().min(5).max(20).required(),
	calendly: Joi.string().min(5).max(100),
	closeId: Joi.string().min(5).max(50).required(),
});
const CreateCloseIoCredentialRelSchema = Joi.object({
	closeId: Joi.string().uuid().required(),
	credentialIds: Joi.array().required(),
});

const CreateCampaignManagersSchema = Joi.object({
	userId: Joi.string().uuid().required(),
	campaignIds: Joi.array().unique().required(),
});

const UpdateCampaignSchema = Joi.object({
	name: Joi.string().min(5).max(30),
	connectionsPerURL: Joi.number().min(1).max(3),
	marqueeContactEmail: Joi.string().email({ minDomainSegments: 2 }),
	isInternal: Joi.boolean(),
	status: Joi.string().valid(...Object.values(ECampaignStatus)),
	whitelistedDesignation: Joi.array().unique().items(designationSchema),
	blacklistedDesignation: Joi.array().unique().items(designationSchema),
	isProfileApprovalReq: Joi.boolean(),
	isWhitelistApplied: Joi.boolean(),
});

const CreateURLSchema = Joi.object({
	credentialId: Joi.string().uuid().required(),
	fileName: Joi.string().min(3).max(20),
	urls: Joi.array().required(),
	type: Joi.string().valid(
		...[ECampaignURLType.SALES_SEARCH__ACCOUNT, ECampaignURLType.SALES_SEARCH__LEAD]
	),
	targetPaginationNumber: Joi.number().min(1).max(100),
});
const CreateBlacklistURLSchema = Joi.object({
	campaignId: Joi.string().uuid().required(),
	urls: Joi.array().required(),
	isGlobal: Joi.boolean().required(),
});
const RespondToThreadSchema = Joi.object({
	id: Joi.string().required(),
	text: Joi.string().required(),
});
const UpdateThreadStatusSchema = Joi.object({
	id: Joi.string().required(),
	status: Joi.string(),
	notes: Joi.string(),
	followUpDate: Joi.number(),
});
const AddToCloseSchema = Joi.object({
	id: Joi.string().required(),
	statusId: Joi.string()
		.valid(...Object.values(ECloseLeadStatus))
		.required(),
});

const CreateScraperURLSchema = Joi.object({
	campaignId: Joi.string().uuid().required(),
	credentialId: Joi.string().uuid().required(),
	urls: Joi.array().items(UrlSchema).unique().required(),
	secret: Joi.string().required(),
});

const CreateCredentialSchema = Joi.object({
	email: Joi.string().email({ minDomainSegments: 2 }).required(),
	password: Joi.string().required(),
	name: Joi.string().max(15).min(3).required(),
	calendlyURL: Joi.string(),
	campaignId: Joi.string().uuid().required(),
	twoFaSecret: Joi.string(),
	urlScrapLimit: Joi.number().min(10).max(100).required(),
	connectionSendLimit: Joi.number().min(10).max(40).required(),
});
const CredentialPasswordUpdateSchema = Joi.object({
	password: Joi.string().required(),
});

const UpdateCredentialSchema = Joi.object({
	email: Joi.string().email({ minDomainSegments: 2 }),
	urlScrapLimit: Joi.number().min(10).max(100),
	calendlyURL: Joi.string(),
	name: Joi.string(),
	twoFaSecret: Joi.string(),
	status: Joi.string().valid(...Object.values(ECampaignCredentialsStatus)),
	connectionSendLimit: Joi.number().min(10).max(40),
});

const CredentialsFilterByStatusSchema = Joi.string().valid(...Object.values(ECampaignCredentialsStatus));

const CreateFollowUpSchema = Joi.object({
	campaignId: Joi.string().uuid().required(),
	content: Joi.string().required(),
	priority: Joi.number().min(0).required(),
});

const UpdateFollowUpSchema = Joi.object({
	// campaignId: Joi.string(),
	// name: Joi.string(),
	content: Joi.string(),
	// priority: Joi.number().min(1),
});

const UpdateScheduledFollowUpSchema = Joi.object({
	status: Joi.string().valid(...Object.values(EScheduledFollowupStatus)),
	content: Joi.string(),
	timestamp: Joi.number(),
});

const CreateScheduledFollowUpSchema = Joi.object({
	threadId: Joi.string().required(),
	content: Joi.string().required(),
	timestamp: Joi.number().min(0).required(),
});

const CreateDeploymentSchema = Joi.object({
	// campaignId: Joi.string().uuid().required(),
	credentialId: Joi.string().uuid().required(),
	// instanceId: Joi.string().required(),
	// ipV4: Joi.string().uri().required(),
	// apiKey: Joi.string().required(),
	// elasticIp: Joi.string().uri().required(),
	// instanceType: Joi.string().required(),
	// availabilityZone: Joi.string().required(),
	// securityGroup: Joi.string().required(),
});
const CreatePostSchema = Joi.object({
	credentialId: Joi.string().uuid().required(),
	content: Joi.string().required(),
	title: Joi.string().required(),
});
const CreatePostFeedAllInternalSchema = Joi.object({
	content: Joi.string().required(),
	title: Joi.string().required(),
});
const CreateGroupPostSchema = Joi.object({
	credentialId: Joi.string().uuid().required(),
	groupId: Joi.string().uuid().required(),
	content: Joi.string().required(),
	title: Joi.string().required(),
});
const CreateGroupSchema = Joi.object({
	name: Joi.string().required(),
	url: Joi.string().uri().required(),
});
const CreateGroupCredentialsSchema = Joi.object({
	groupId: Joi.string().uuid().required(),
	credential: Joi.string().required(),
});
const UpdateGroupCredentialsSchema = Joi.object({
	credential: Joi.string().required(),
});
const UpdateGroupSchema = Joi.object({
	name: Joi.string(),
	url: Joi.string().uri(),
});
const UpdateThreadTrackingSchema = Joi.object({
	notes: Joi.string(),
	followUpAction: Joi.boolean(),
});
const ThreadTrackingLoginSchema = Joi.object({
	email: Joi.string().required(),
	password: Joi.string().required(),
});
const UpdateDeploymentSchema = Joi.object({
	campaignId: Joi.string().uuid(),
	credentialId: Joi.string().uuid(),
	apiKey: Joi.string(),
	instanceId: Joi.string(),
	ipV4: Joi.string().uri(),
	elasticIp: Joi.string().uri(),
	instanceType: Joi.string(),
	availabilityZone: Joi.string(),
	securityGroup: Joi.string(),
	status: Joi.string().valid(...Object.values(ECampaignDeploymentStatus)),
});

const URLFilterByTypeSchema = Joi.string().valid(...Object.values(ECampaignURLType));
const ProfileFilterByApprovalSchema = Joi.string().valid(...Object.values(ECampaignProfileApproval));
const URLFilterByStatusSchema = Joi.string().valid(...Object.values(ECampaignURLStatus));
const BlacklistURLFilterByStatusSchema = Joi.string().valid(...Object.values(EBlacklistURLStatus));
const CampaignFilterByTypeSchema = Joi.string().valid(...Object.values(ECampaignType));
const CampaignFilterByNameSchema = Joi.string();
export {
	CreateCampaignSchema,
	UpdateCampaignSchema,
	CreateURLSchema,
	CreateCredentialSchema,
	UpdateCredentialSchema,
	CredentialsFilterByStatusSchema,
	URLFilterByTypeSchema,
	ProfileFilterByApprovalSchema,
	CampaignFilterByNameSchema,
	CampaignFilterByTypeSchema,
	CreateFollowUpSchema,
	UpdateFollowUpSchema,
	CreateDeploymentSchema,
	CredentialPasswordUpdateSchema,
	UpdateDeploymentSchema,
	CreateScraperURLSchema,
	URLFilterByStatusSchema,
	RespondToThreadSchema,
	CreatePostSchema,
	CreateGroupCredentialsSchema,
	UpdateGroupCredentialsSchema,
	CreateGroupSchema,
	UpdateGroupSchema,
	CreateInternalCampaignSchema,
	CreateCategorySchema,
	CreateGroupPostSchema,
	AddToCloseSchema,
	UpdateThreadTrackingSchema,
	ThreadTrackingLoginSchema,
	UpdateThreadStatusSchema,
	CreateScheduledFollowUpSchema,
	UpdateScheduledFollowUpSchema,
	BlacklistURLFilterByStatusSchema,
	CreateCampaignManagersSchema,
	CreateBlacklistURLSchema,
	CreatePostFeedAllInternalSchema,
	CreateCloseIoUserSchema,
	CreateCloseIoCredentialRelSchema,
};
