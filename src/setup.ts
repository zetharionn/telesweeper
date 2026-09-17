import { log, password, text } from '@clack/prompts'
import { TelegramClient } from 'teleproto'
import { StringSession } from 'teleproto/sessions'

import { getCredentials, setCredentials } from './credentials.ts'
import { ask } from './utils/ask.ts'
import { logger } from './utils/logger.ts'

export const setup = async () => {
	const credentials = await getCredentials()

	if (!credentials) {
		log.message(
			"We need to get API credentials, if you haven't already got them, visit my.telegram.org"
		)

		const api_id = await ask(() => text({ message: 'API ID', placeholder: '00000000' }))
		const api_hash = await ask(() =>
			text({ message: 'API HASH', placeholder: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
		)

		const client = new TelegramClient(new StringSession(''), Number(api_id), api_hash, {
			baseLogger: logger
		})

		await client.start({
			phoneNumber: () =>
				ask(() =>
					text({
						message: 'Phone number',
						placeholder: '+0000000000'
					})
				),
			phoneCode: () =>
				ask(() =>
					password({
						message: 'Login code',
						mask: '*'
					})
				),
			password: hint =>
				ask(() =>
					password({
						message: `2FA password ${hint ? `(${hint})` : ''}`,
						mask: '*'
					})
				),
			onError: err => console.error(err)
		})

		await setCredentials({ session: client.session.save(), api_id, api_hash })

		return client
	}

	return new TelegramClient(
		new StringSession(credentials?.session),
		Number(credentials?.api_id),
		credentials?.api_hash,
		{
			baseLogger: logger
		}
	)
}