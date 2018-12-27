function* createUsers (from, count) {
	let id = from | 0
	let i = 0

	const names = [
		'Петр', 'Василий', 'Глеб', 'Павел', 'Алексей', 'Владимир', 'Александр', 'Вячеслав'
	]

	const companies = 'Navitel,Google,Amazone,Facebook,Tweeter,Microsoft,2Gis,Tesla,Space X,Frontire Developers'.split(',')

  while (i < count) {
		yield {
			id: id++,
			name: `${names[id % names.length]}`,
			age: Math.random() * 100 | 0,
			active: Boolean(Math.round(Math.random())),
			admin: Boolean(Math.round(Math.random())),
			company: `${companies[id % companies.length]}`,
		}
		i++
	}
}

export default class DataSource {
  constructor(options = { delay: 1000 }) {
		const { delay } = options
		this.delay = delay
  }

  async getData (from, count) {
		await new Promise(r => setTimeout(r, this.delay))
		return [...createUsers(from, count)]
  }
}
