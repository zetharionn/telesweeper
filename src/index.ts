import { Logger, TelegramClient } from 'teleproto'
import { LogLevel } from 'teleproto/extensions/Logger'
import { StringSession } from 'teleproto/sessions'

import { getCredentials } from './credentials.ts'
import { setup } from './setup.ts'

let credentials = await getCredentials()

if (!credentials) {
	await setup()
	credentials = await getCredentials()
}

if (!credentials) {
	process.exit(1)
}

const client = new TelegramClient(
	new StringSession(credentials.session),
	Number(credentials.api_id),
	credentials.api_hash,
	{
		baseLogger: new Logger(LogLevel.NONE)
	}
)

await client.connect()

console.log('Signed in as', (await client.getMe()).username)