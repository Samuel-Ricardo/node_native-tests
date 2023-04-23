import {createServer} from 'node:http'

async function handler(request, response) {
  response.end('Hello Wolrd :D')
} 

const app = createServer(handler)
  .listen(3000, () => console.log('Listening at 3000'))

export {app}
