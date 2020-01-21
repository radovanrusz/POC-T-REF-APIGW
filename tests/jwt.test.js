/* eslint-disable prefer-destructuring */
/* eslint-disable indent-legacy */
/* eslint-disable dot-location */
/* eslint-disable indent */
const supertest = require('supertest')


const serverUrl = 'http://localhost:3000'
const server = supertest.agent(serverUrl);

describe('Test login api', () => {
   
	test('It should response 403 to login request', async () => {
        const response = await server
			// eslint-disable-next-line dot-location
			.post('/login')
			.send({
				name: 'janko',
				password: 'jankow'
			})
		// console.log(`Test response: ${JSON.stringify(response)}`)
        expect(response.status).toBe(403);
	});
	
	test('It should response 403 to login request', async () => {
        const response = await server
			// eslint-disable-next-line dot-location
			.post('/login')
			.send({
				name: 'jankow',
				password: 'janko'
			})
		// console.log(`Test response: ${JSON.stringify(response)}`)
        expect(response.status).toBe(403);
	});
	
	test('It should response 400 to login request', async () => {
        const response = await server
			// eslint-disable-next-line dot-location
			.post('/login')
			.send({
				name: '',
				password: ''
			})
		// console.log(`Test response: ${JSON.stringify(response)}`)
        expect(response.status).toBe(400);
	});
	
	test('It should response 400 to login request', async () => {
        const response = await server
			// eslint-disable-next-line dot-location
			.post('/login')
			.send({
				
				password: ''
			})
		// console.log(`Test response: ${JSON.stringify(response)}`)
        expect(response.status).toBe(400);
	});
	
	test('It should response 400 to login request', async () => {
        const response = await server
			// eslint-disable-next-line dot-location
			.post('/login')
			.send({
				name: ''
			})
		// console.log(`Test response: ${JSON.stringify(response)}`)
        expect(response.status).toBe(400);
	});
	
	test('It should response 400 to login request', async () => {
        const response = await server
			// eslint-disable-next-line dot-location
			.post('/login')
			.send({
				
			})
		// console.log(`Test response: ${JSON.stringify(response)}`)
        expect(response.status).toBe(400);
    });
})

let token = ''

describe('Test jwt token using verify api', () => {
    test('It should response 200 to login request', async () => {
        const response = await server
			// eslint-disable-next-line dot-location
			.post('/login')
			.send({
				name: 'janko',
				password: 'janko'
			})
		// console.log(`Test response: ${JSON.stringify(response)}`)
        expect(response.status).toBe(200);
	});

	test('It should response 200 to login request and contain all attributes', async () => {
        const res = await server
			// eslint-disable-next-line dot-location
			.post('/login')
			.send({
				name: 'janko',
				password: 'janko'
			})
		// console.log(`Test response: ${JSON.stringify(res)}`)
		expect(res.status).toBe(200);
		const resText = JSON.parse(res.text)
		expect(resText).toHaveProperty('token')
		expect(resText).toHaveProperty('statusCase')
		expect(resText).toHaveProperty('id')
		expect(resText).toHaveProperty('email')
		expect(resText).toHaveProperty('role')

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

	test('It should response 403 to bad token verify request ', async () => {
        const res = await server
			// eslint-disable-next-line dot-location
			.get('/login/verify')
			.set('ibm-sec-token', token += '-badToken')
		// console.log(`Test response: ${JSON.stringify(res)}`)
		expect(res.status).toBe(403);
		
	});

	test('It should response 403 to missing token header verify request ', async () => {
        const res = await server
			// eslint-disable-next-line dot-location
			.get('/login/verify')
			
		// console.log(`Test response: ${JSON.stringify(res)}`)
		expect(res.status).toBe(403);
		
	});

	test('It should response 403 to empty token header verify request ', async () => {
        const res = await server
			// eslint-disable-next-line dot-location
			.get('/login/verify')
			.set('ibm-sec-token', '')
		// console.log(`Test response: ${JSON.stringify(res)}`)
		expect(res.status).toBe(403);
		
	});

})

