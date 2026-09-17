import { select, text } from '@clack/prompts'
import type { TelegramClient } from 'teleproto'

import { ask } from './utils/ask.ts'
import { sweep } from './utils/sweep.ts'

export const menu = async (client: TelegramClient) => {
	const option = await select({
		message: 'Menu',
		maxItems: 1,
		options: [
			{
				value: 'sweep',
				label: 'Sweep messages in exact chat',
				hint: 'Clears all messages in specified chat'
			},
			{ value: 'exit', label: 'Exit' }
		]
	})

	switch (option) {
		case 'sweep':
			const entity = await ask(() => text({ message: 'Link/Tag/ID' }))
			await sweep(client, entity)
			await menu(client)
			break
		case 'exit':
			await client.disconnect()
			break
		default:
			break
	}
}