import { describe, before, after, it } from 'node:test'
import { deepStrictEqual, strictEqual } from 'node:assert'
import { USER_INVALID_ERROR } from './error/login_errors.js'

const BASE_URL = 'http://localhost:3000'

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
      user: 'Wrong Username'
      password: 'Wrong Password'
    }

    const request = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      body: JSON.stringfy(data)
    })

    strictEqual(request.status, 401) 
  
    const response = await request.json();

    deepStrictEqual(response, USER_INVALID_ERROR)

  })

})
