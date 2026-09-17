import { log } from '@clack/prompts'

import { setup } from './setup.ts'

const client = await setup()

await client.connect()

log.success(`Signed in as: ${(await client.getMe()).username}`)