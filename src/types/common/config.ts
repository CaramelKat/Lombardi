export interface Config {
	http: {
		port: number;
	};
	grpc: {
		account: {
			ip: string;
			port: number;
			api_key: string;
		};
	};
	aes_key: string;
}