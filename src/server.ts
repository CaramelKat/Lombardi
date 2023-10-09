process.title = 'Pretendo - Miiverse';

import express from 'express';
import morgan from 'morgan';
import path from 'path';
//import ejs from  'ejs';
import { LOG_INFO, LOG_SUCCESS } from '@/logger';
import auth from '@/middleware/auth';

import services from '@/services/';

import { config } from '@/config-manager';

const { http: { port } } = config;
const app = express();

app.set('etag', false);
app.disable('x-powered-by');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Create router
LOG_INFO('Setting up Middleware');
app.use(morgan('dev'));
app.use(express.json());

app.use(express.urlencoded({
	extended: true,
	limit: '5mb',
	parameterLimit: 100000
}));
app.use(auth);

// import the servers into one
app.use(services);

// 404 handler
LOG_INFO('Creating 404 status handler');
app.use((_request: express.Request, response: express.Response) => {
	response.type('application/text');
	response.sendStatus(404);
});

// non-404 error handler
LOG_INFO('Creating non-404 status handler');
app.use((error: any, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
	response.type('application/text');
	response.sendStatus(404);
});

async function main(): Promise<void> {
	// Starts the server
	LOG_INFO('Starting server');

	app.listen(port, () => {
		LOG_SUCCESS(`Server started on port ${port}`);
	});
}

main().catch(console.error);