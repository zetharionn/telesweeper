import { log } from '@clack/prompts'
import type { TelegramClient } from 'teleproto'
import type { EntityLike } from 'teleproto/define'

export const sweep = async (client: TelegramClient, entity: EntityLike) => {
	const ids = []
	for await (const message of client.iterMessages(entity, {
		fromUser: 'me'
	})) {
		ids.push(message.id)
	}
	if (ids.length) await client.deleteMessages(entity, ids, { revoke: true })
	log.message(`Deleted ${ids.length} messages`)
}