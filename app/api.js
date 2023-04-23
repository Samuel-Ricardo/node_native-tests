import { once } from 'node:events'
import {createServer} from 'node:http'
import { DEFAULT_USER, JWT_KEY } from './config.js'
import { INVALID_TOKEN, USER_INVALID_ERROR } from './error/index.js'
import JWT from 'jsonwebtoken'
import { WELCOME } from './success/index.js'

async function loginRoute(request, response){
  const {user, password} = JSON.parse(await once(request, 'data'))

  if (user !== DEFAULT_USER.user || password !== DEFAULT_USER.password) {
    response.writeHead(401)
    response.end(JSON.stringify(USER_INVALID_ERROR))
    return;
  }


  const token = JWT.sign({user, message: 'Hello World :D'}, JWT_KEY)

  response.end(JSON.stringify({token}))
}


function isHeadersValid(headers) {
  try{
    const auth = headers.authorization.replace(/bearer\s/ig, '')
    JWT.verify(auth, JWT_KEY)
    
    return true
  }catch(error){
    console.log({error})
    return false
  }
}

async function handler(request, response) {
    
  if(request.url === '/login' && request.method === 'POST') {
    return loginRoute(request, response)
  }

  if(!isHeadersValid(request.headers)) {
    response.writeHead(400)
    return response.end(JSON.stringify(INVALID_TOKEN))
  }

  response.end(JSON.stringify(WELCOME))
} 

const app = createServer(handler)
  .listen(3000, () => console.log('Listening at 3000'))

export {app}
