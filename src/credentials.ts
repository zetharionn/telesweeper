interface Credentials {
	session: string
	api_id: string
	api_hash: string
}

const service = 'telesweeper'
const names = ['session', 'api_id', 'api_hash'] as const

export const setCredentials = async (
	values: [session: string, api_id: string, api_hash: string]
): Promise<void> => {
	const [session, api_id, api_hash] = values
	const [sessionName, apiIdName, apiHashName] = names
	const pairs = [
		{ name: sessionName, value: session },
		{ name: apiIdName, value: api_id },
		{ name: apiHashName, value: api_hash }
	]
	await Promise.all(
		pairs.map(async ({ name, value }) => await Bun.secrets.set({ service, name, value }))
	)
}

export const getCredentials = async (): Promise<Credentials | null> => {
	const credentials: Credentials = Object.fromEntries(
		await Promise.all(names.map(async name => [name, await Bun.secrets.get({ service, name })]))
	)

	if (!credentials.session || !credentials.api_id || !credentials.api_hash) return null

	return credentials
}