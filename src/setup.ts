import { intro, log, outro, password, text } from '@clack/prompts'
import { Logger, TelegramClient } from 'teleproto'
import { LogLevel } from 'teleproto/extensions/Logger'
import { StringSession } from 'teleproto/sessions'

import { setCredentials } from './credentials.ts'
import { ask } from './utils/ask.ts'

export const setup = async (): Promise<void> => {
	intro("Let's set everything up")

	log.message(
		"We need to get API credentials, if you haven't already got them, visit my.telegram.org"
	)

	const api_id = await ask(async () => text({ message: 'API ID', placeholder: '00000000' }))
	const api_hash = await ask(
		async () => await text({ message: 'API HASH', placeholder: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
	)

	try {
		log.message('Authorize using phone number linked to your Telegram account')

		const client = new TelegramClient(new StringSession(''), Number(api_id), api_hash, {
			baseLogger: new Logger(LogLevel.NONE)
		})

		await client.start({
			phoneNumber: async () =>
				ask(async () =>
					text({
						message: 'Phone number',
						placeholder: '+0000000000'
					})
				),
			phoneCode: async () =>
				ask(async () =>
					password({
						message: 'Login code',
						mask: '*'
					})
				),
			password: async hint =>
				ask(async () =>
					password({
						message: `2FA password ${hint ? `(${hint})` : ''}`,
						mask: '*'
					})
				),
			onError: err => console.error(err)
		})

		await setCredentials([client.session.save(), api_id, api_hash])

		await client.disconnect()

		outro('Everything is up')
	} catch (error) {
		log.error(String(error))
		outro('Please try again')
	}
}