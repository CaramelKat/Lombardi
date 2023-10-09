import crypto from 'node:crypto';
import { IncomingHttpHeaders } from 'node:http';
import { createChannel, createClient, Metadata } from 'nice-grpc';
import { ParsedQs } from 'qs';
import crc32 from 'crc/crc32';
import { ParamPack } from '@/types/common/param-pack';
import { config } from '@/config-manager';
import { Token } from '@/types/common/token';

import { AccountClient, AccountDefinition } from 'pretendo-grpc-ts/dist/account/account_service';
import { GetUserDataResponse } from 'pretendo-grpc-ts/dist/account/get_user_data_rpc';

// * nice-grpc doesn't export ChannelImplementation so this can't be typed
const gRPCAccountChannel = createChannel(`${config.grpc.account.ip}:${config.grpc.account.port}`);
const gRPCAccountClient: AccountClient = createClient(AccountDefinition, gRPCAccountChannel);

export function decodeParamPack(paramPack: string): ParamPack {
	const values: string[] = Buffer.from(paramPack, 'base64').toString().split('\\');
	const entries: string[][] = values.filter(value => value).reduce((entries: string[][], value: string, index: number) => {
		if (0 === index % 2) {
			entries.push([value]);
		} else {
			entries[Math.ceil(index / 2 - 1)].push(value);
		}

		return entries;
	}, []);

	return Object.fromEntries(entries);
}

export function getPIDFromServiceToken(token: string): number {
	try {
		const decryptedToken: Buffer = decryptToken(Buffer.from(token, 'base64'));

		if (!decryptedToken) {
			return 0;
		}

		const unpackedToken: Token = unpackToken(decryptedToken);

		return unpackedToken.pid;
	} catch (e) {
		console.error(e);
		return 0;
	}
}

export function decryptToken(token: Buffer): Buffer {
	const iv: Buffer = Buffer.alloc(16);

	const expectedChecksum: number = token.readUint32BE();
	const encryptedBody: Buffer = token.subarray(4);

	const decipher: crypto.Decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(config.aes_key, 'hex'), iv);

	const decrypted: Buffer = Buffer.concat([
		decipher.update(encryptedBody),
		decipher.final()
	]);

	if (expectedChecksum !== crc32(decrypted)) {
		throw new Error('Checksum did not match. Failed decrypt. Are you using the right key?');
	}

	return decrypted;
}

export function unpackToken(token: Buffer): Token {
	return {
		system_type: token.readUInt8(0x0),
		token_type: token.readUInt8(0x1),
		pid: token.readUInt32LE(0x2),
		expire_time: token.readBigUInt64LE(0x6),
		title_id: token.readBigUInt64LE(0xE),
		access_level: token.readInt8(0x16)
	};
}

export function getUserAccountData(pid: number): Promise<GetUserDataResponse> {
	return gRPCAccountClient.getUserData({
		pid: pid
	}, {
		metadata: Metadata({
			'X-API-Key': config.grpc.account.api_key
		})
	});
}

export function getValueFromQueryString(qs: ParsedQs, key: string): string[] {
	const property: string | string[] | undefined = qs[key] as string | string[];

	if (property) {
		if (Array.isArray(property)) {
			return property;
		} else {
			return [property];
		}
	}

	return [];
}

export function getValueFromHeaders(headers: IncomingHttpHeaders, key: string): string | undefined {
	let header: string | string[] | undefined = headers[key];
	let value: string | undefined;

	if (header) {
		if (Array.isArray(header)) {
			header = header[0];
		}

		value = header;
	}

	return value;
}

export function mapToObject(map: Map<any, any>): object {
	return Object.fromEntries(Array.from(map.entries(), ([k, v]) => v instanceof Map ? [k, mapToObject(v)] : [k, v]));
}