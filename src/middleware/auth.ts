import express from 'express';
//import { z } from 'zod';
//import { GetUserDataResponse } from 'pretendo-grpc-ts/dist/account/get_user_data_rpc';
//import { getUserAccountData, getValueFromHeaders, decodeParamPack, getPIDFromServiceToken } from '@/util';
//import { ParamPack } from '@/types/common/param-pack';

/*const ParamPackSchema = z.object({
	title_id: z.string(),
	access_key: z.string(),
	platform_id: z.string(),
	region_id: z.string(),
	language_id: z.string(),
	country_id: z.string(),
	area_id: z.string(),
	network_restriction: z.string(),
	friend_restriction: z.string(),
	rating_restriction: z.string(),
	rating_organization: z.string(),
	transferable_id: z.string(),
	tz_name: z.string(),
	utc_offset: z.string(),
	remaster_version: z.string().optional()
});*/

async function auth(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
	return next();
}

/*function badAuth(response: express.Response, errorCode: number, message: string): void {
	response.type('application/xml');
	response.status(400);

	response.send({
		result: {
			has_error: 1,
			version: 1,
			code: 400,
			error_code: errorCode,
			message: message
		}
	});
}*/

export default auth;
