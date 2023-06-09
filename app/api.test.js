import { describe, before, after, it } from 'node:test'
import { deepStrictEqual, ok, strictEqual } from 'node:assert'
import { INVALID_TOKEN, USER_INVALID_ERROR } from './error/login_errors.js'
import { BASE_URL, DEFAULT_USER } from './config.js'
import { WELCOME } from './success/index.js'

let _global_token= ''

// E2E Test
describe('API Workflow', () => {

  let _server = {}
  
  // before each test
  before(async () => {
    _server = (await import('./api.js')).app
    await new Promise(resolve => _server.once('listening', resolve))
  })

  // after each test
  after(done => _server.close(done))
  

  
  it ('should receive not authorized given wrong user and password', async () => {
    
    const data = {
      user: 'Wrong Username',
      password: 'Wrong Password'
    }

    const request = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(data)
    })


    deepStrictEqual(request.status, 401) 
    const response = await request.json();
    deepStrictEqual(response, USER_INVALID_ERROR)
  })


  it('Should Login Successfully', async () => {

    const request = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(DEFAULT_USER)
    })

    strictEqual(request.status, 200)
    const response = await request.json()
    ok(response.token, 'Token should be present')
    _global_token = response.token
  })

  it('Should not be able to access private data without a token', async () => {
    const headers = {
      authorization:''
    }

    const request = await fetch(`${BASE_URL}`, {headers})
    
    deepStrictEqual(request.status, 400)
    const response =  await request.json()
    deepStrictEqual(response, INVALID_TOKEN)
  })

  it ("Should be allowed to access private data with a valid token", async () => {
    const request = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: { authorization: _global_token }
    })

    deepStrictEqual(request.status, 200)
    const response = await request.json()
    deepStrictEqual(response, WELCOME)
  })
})
