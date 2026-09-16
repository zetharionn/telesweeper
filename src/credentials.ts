interface Credentials {
	session: string
	api_id: string
	api_hash: string
}

const service = 'telesweeper'
const names = ['session', 'api_id', 'api_hash'] as const

export const getCredentials = async () => {
	const credentials: Credentials = Object.fromEntries(
		await Promise.all(names.map(async name => [name, await Bun.secrets.get({ service, name })]))
	)

	if (!credentials?.session || !credentials?.api_id || !credentials?.api_hash) return null
	return credentials
}

export const setCredentials = async (session: string, api_id: string, api_hash: string) => {
	const values = [session, api_id, api_hash] as const
	const pairs = names.map((name, index) => ({ name, value: values[index]! }))
	await Promise.all(
		pairs.map(async ({ name, value }) => await Bun.secrets.set({ service, name, value }))
	)
}