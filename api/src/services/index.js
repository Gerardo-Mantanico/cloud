import { file } from './file/file.js'

import { directory } from './directory/directory.js'

import { user } from './users/users.js'

export const services = (app) => {
  app.configure(file)

  app.configure(directory)

  app.configure(user)

  // All services will be registered here
}
