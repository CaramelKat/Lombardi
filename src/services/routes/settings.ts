import express from 'express';
//import { GetUserDataResponse } from 'pretendo-grpc-ts/dist/account/get_user_data_rpc';
//import { getUserAccountData } from '@/util';

const router: express.Router = express.Router();

/* GET discovery server. */
router.get('/profile', async function (request: express.Request, response: express.Response): Promise<void> {
	response.render('index.ejs');
});

export default router;
