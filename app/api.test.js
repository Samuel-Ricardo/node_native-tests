import { describe, before, after, it } from 'node:test'

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

})
