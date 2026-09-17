import { select } from '@clack/prompts'
import type { TelegramClient } from 'teleproto'

export const menu = async (client: TelegramClient) => {
	const option = await select({
		message: 'Menu',
		maxItems: 1,
		options: [{ value: 'exit', label: 'Exit' }]
	})

	switch (option) {
		case 'exit':
			await client.disconnect()
			process.exit(0)
		default:
			break
	}
}