interface Credentials {
	session: string
	api_id: string
	api_hash: string
}

const service = 'telesweeper'

export const getCredentials = async () => {
	const names = ['session', 'api_id', 'api_hash'] as const
	const { session, api_id, api_hash } = Object.fromEntries(
		await Promise.all(names.map(async name => [name, await Bun.secrets.get({ service, name })]))
	)

	if (!session || !api_id || !api_hash) return null
	return { session, api_id, api_hash }
}

export const setCredentials = async (credentials: Credentials) => {
	await Promise.all(
		Object.entries(credentials).map(
			async ([name, value]) => await Bun.secrets.set({ service, name, value })
		)
	)
}