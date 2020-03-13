export class MockUtils {
	getRandomInt (max: number) {
		return Math.floor(Math.random() * Math.floor(max))
	}

	getStatusFromProgress (input: number) {
		const xMax = 5
		const xMin = 0
	
		const yMax = 100
		const yMin = 0
	
		const percent = (input - yMin) / (yMax - yMin)
		const outputX = percent * (xMax - xMin) + xMin
		return Math.round(outputX)
	};
}

export const mockUtils = new MockUtils()
