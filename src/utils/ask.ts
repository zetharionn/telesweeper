import { type CANCEL_SYMBOL, cancel, isCancel } from '@clack/prompts'

export const ask = async <T>(prompt: () => Promise<T | typeof CANCEL_SYMBOL>): Promise<T> => {
	const value = await prompt()
	if (isCancel(value)) {
		cancel('Setup cancelled')
		process.exit(1)
	}
	return value
}