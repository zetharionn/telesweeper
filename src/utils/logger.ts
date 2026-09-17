import { log } from '@clack/prompts'
import { Logger } from 'teleproto'
import { LogLevel } from 'teleproto/extensions/Logger'

export const logger = new Logger()
logger.handler = ({ level, message }) => {
	switch (level) {
		case LogLevel.WARN:
			log.warn(message)
			return
		case LogLevel.ERROR:
			log.error(message)
			break
		default:
			return
	}
}