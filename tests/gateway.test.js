/* eslint-disable prefer-destructuring */
/* eslint-disable indent-legacy */
/* eslint-disable dot-location */
/* eslint-disable indent */
const supertest = require('supertest')


const serverUrl = 'http://localhost:3000'
const server = supertest.agent(serverUrl);

describe('Test gateway api', () => {
   let token = ''
    test('It should response 200 to login request', async () => {
        const res = await server
			// eslint-disable-next-line dot-location
			.post('/login')
			.send({
				name: 'janko',
				password: 'janko'
			})
		// console.log(`Test response: ${JSON.stringify(response)}`)
		expect(res.status).toBe(200);
		const resText = JSON.parse(res.text)
		token = resText.token
	});

	test('It should response 200 to token verify request ', async () => {
        const res = await server
			// eslint-disable-next-line dot-location
			.get('/login/verify')
			.set('ibm-sec-token', token)
		// console.log(`Test response: ${JSON.stringify(res)}`)
		expect(res.status).toBe(200);
		
	});

	test('It should response 200 and get material array for remote GET request to MMS service ', async () => {
        const res = await server
			// eslint-disable-next-line dot-location
			.get('/gateway/mms')
			.set('ibm-sec-token', token)
		// console.log(`Test response: ${JSON.stringify(res)}`)
		expect(res.status).toBe(200);
		const resText = JSON.parse(res.text)
		console.log(`Test response: ${JSON.stringify(resText)}`)
		expect(resText).toHaveProperty('materials')
		expect(resText.materials.length).toBeGreaterThan(0)
	});

	test('It should response 200 and get empty material array  for remote GET request to MMS service ', async () => {
        const res = await server
			// eslint-disable-next-line dot-location
			.get('/gateway/mms?kmat=hraskoa')
			.set('ibm-sec-token', token)
		// console.log(`Test response: ${JSON.stringify(res)}`)
		expect(res.status).toBe(200);
		const resText = JSON.parse(res.text)
		console.log(`Test response: ${JSON.stringify(resText)}`)
		expect(resText).toHaveProperty('materials')
		expect(resText.materials.length).toEqual(0)
	});

	test('It should response 200 and get material array with one item for remote GET request to MMS service ', async () => {
        const res = await server
			// eslint-disable-next-line dot-location
			.get('/gateway/mms?kmat=hrasko')
			.set('ibm-sec-token', token)
		// console.log(`Test response: ${JSON.stringify(res)}`)
		expect(res.status).toBe(200);
		const resText = JSON.parse(res.text)
		console.log(`Test response: ${JSON.stringify(resText)}`)
		expect(resText).toHaveProperty('materials')
		expect(resText.materials.length).toEqual(1)
	});

	test('It should return 404 for wrong URL path of remote GET request to MMS service ', async () => {
        const res = await server
			// eslint-disable-next-line dot-location
			.get('/err-gateway/mm?kmat=hrasko')
			.set('ibm-sec-token', token)
		// console.log(`Test response: ${JSON.stringify(res)}`)
		expect(res.status).toBe(404);
		
	});

	test('It should return 403 for remote GET request to MMS service without token ', async () => {
        const res = await server
			// eslint-disable-next-line dot-location
			.get('/gateway/mms?kmat=hrasko')
			
		// console.log(`Test response: ${JSON.stringify(res)}`)
		expect(res.status).toBe(403);
		
	});

	test('It should return 403 for remote GET request to MMS service with invalid token ', async () => {
        const res = await server
			// eslint-disable-next-line dot-location
			.get('/gateway/mms?kmat=hrasko')
			.set('ibm-sec-token', 'token')
		// console.log(`Test response: ${JSON.stringify(res)}`)
		expect(res.status).toBe(403);
		
	});

	test('It should return 501 for remote GET request to unknown/unimplemented service with invalid token ', async () => {
        const res = await server
			// eslint-disable-next-line dot-location
			.get('/gateway/wip?kmat=hrasko')
			.set('ibm-sec-token', token)
		// console.log(`Test response: ${JSON.stringify(res)}`)
		expect(res.status).toBe(501);
		
	});
})

