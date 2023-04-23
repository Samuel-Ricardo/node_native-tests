import { once } from 'node:events'
import {createServer} from 'node:http'
import { DEFAULT_USER } from './config.js'
import { USER_INVALID_ERROR } from './error/index.js'


async function loginRoute(request, response){
  const {user, password} = JSON.parse(await once(request, 'data'))

  if (user !== DEFAULT_USER.user || password !== DEFAULT_USER.password) {
    response.writeHead(401)
    response.end(JSON.stringify(USER_INVALID_ERROR))
    return;
  }

  response.end('ok')
}


async function handler(request, response) {
    
  if(request.url === '/login' && request.method === 'POST') {
    return loginRoute(request, response)
  }
  response.end('Hello Wolrd :D')
} 

const app = createServer(handler)
  .listen(3000, () => console.log('Listening at 3000'))

export {app}
