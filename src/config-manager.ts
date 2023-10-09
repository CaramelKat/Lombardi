import dotenv from 'dotenv';
import { LOG_INFO, LOG_ERROR } from '@/logger';
import { Config } from '@/types/common/config';

dotenv.config();

LOG_INFO('Loading config');

export const config: Config = {
	http: {
		port: Number(process.env.PN_ACCOUNT_SETTINGS_CONFIG_HTTP_PORT || '')
	},
	grpc: {
		account: {
			ip: process.env.PN_ACCOUNT_SETTINGS_CONFIG_GRPC_ACCOUNT_IP || '',
			port: Number(process.env.PN_ACCOUNT_SETTINGS_CONFIG_GRPC_ACCOUNT_PORT || ''),
			api_key: process.env.PN_ACCOUNT_SETTINGS_CONFIG_GRPC_ACCOUNT_API_KEY || ''
		}
	},
	aes_key: process.env.PN_ACCOUNT_SETTINGS_CONFIG_AES_KEY || ''
};

LOG_INFO('Config loaded, checking integrity');

if (!config.http.port) {
	LOG_ERROR('Failed to find HTTP port. Set the PN_ACCOUNT_SETTINGS_CONFIG_HTTP_PORT environment variable');
	process.exit(0);
}

if (!config.grpc.account.ip) {
	LOG_ERROR('Failed to find account server gRPC ip. Set the PN_ACCOUNT_SETTINGS_CONFIG_GRPC_ACCOUNT_IP environment variable');
	process.exit(0);
}

if (!config.grpc.account.port) {
	LOG_ERROR('Failed to find account server gRPC port. Set the PN_ACCOUNT_SETTINGS_CONFIG_GRPC_ACCOUNT_PORT environment variable');
	process.exit(0);
}

if (!config.grpc.account.api_key) {
	LOG_ERROR('Failed to find account server gRPC API key. Set the PN_ACCOUNT_SETTINGS_CONFIG_GRPC_ACCOUNT_API_KEY environment variable');
	process.exit(0);
}

if (!config.aes_key) {
	LOG_ERROR('Token AES key is not set. Set the PN_ACCOUNT_SETTINGS_CONFIG_AES_KEY environment variable to your AES-256-CBC key');
	process.exit(0);
}