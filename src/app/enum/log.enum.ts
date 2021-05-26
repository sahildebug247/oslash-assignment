/** @format */

export enum ELogType {
	CREATE = 'CREATE',
	UPDATE = 'UPDATE',
	DELETE = 'DELETE',
	APPROVAL = 'APPROVAL',
}

export enum ELogAction {
	CREATE_POST = 'CREATE_POST',
	CREATE_USER = 'CREATE_USER',
	UPDATE_USER = 'UPDATE_USER',
	UPDATE_PASSWORD = 'UPDATE_PASSWORD',
	DEACTIVE_USER = 'DEACTIVE_USER',
	DELETE_POST = 'DELETE_POST',
	UPDATE_POST = 'UPDATE_POST',
	UPDATE_POST_STATUS = 'UPDATE_POST_STATUS',
	APPROVE_POST_REQUEST = 'APPROVE_POST_REQUEST',
	APPROVE_POST_DELETE_REQUEST = 'APPROVE_POST_DELETE_REQUEST',
	APPROVE_POST_UNPUBLISH_REQUEST = 'APPROVE_POST_UNPUBLISH_REQUEST',
}