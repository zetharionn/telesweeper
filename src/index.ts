import { log } from '@clack/prompts'

import { menu } from './menu.ts'
import { setup } from './setup.ts'

const client = await setup()

await client.connect()

log.message(`Signed in as: ${(await client.getMe()).username}`)

await menu(client)