import express from 'express';
import subdomain from 'express-subdomain';
import { LOG_INFO } from '@/logger';

import settingsHandlers from '@/services/routes/settings';

// Main router for endpoints
const router = express.Router();

// Router to handle the subdomain restriction
const settings = express.Router();

// Create subdomains
LOG_INFO('[ACCOUNT] Creating \'settings\' subdomain');
router.use(subdomain('account', settings));

// Setup routes
settings.use('/v1/account-settings/ui', settingsHandlers);

export default router;