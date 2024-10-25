// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  fileDataValidator,
  filePatchValidator,
  fileQueryValidator,
  fileResolver,
  fileExternalResolver,
  fileDataResolver,
  filePatchResolver,
  fileQueryResolver
} from './file.schema.js'
import { FileService, getOptions } from './file.class.js'

import { checkDirectoryName } from '../../hooks/check-directory-name.js'
import { validateExtensions } from '../../hooks/validate-extensions.js'
import { checkSharedTrash } from '../../hooks/check-shared-trash.js'
import { filterByUser } from '../../hooks/filter-by-user.js'

export const filePath = 'file'
export const fileMethods = ['find', 'get', 'create', 'patch', 'remove', 'update', 'duplicate']

export * from './file.class.js'
export * from './file.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const file = (app) => {
  // Register our service on the Feathers application
  app.use(filePath, new FileService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: fileMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(filePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(fileExternalResolver),
        schemaHooks.resolveResult(fileResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(fileQueryValidator), schemaHooks.resolveQuery(fileQueryResolver)],
      find: [filterByUser()],
      get: [],
      create: [
        schemaHooks.validateData(fileDataValidator),
        schemaHooks.resolveData(fileDataResolver),
        validateExtensions(),
        checkDirectoryName({ isFile: true })
      ],
      patch: [
        schemaHooks.validateData(filePatchValidator),
        schemaHooks.resolveData(filePatchResolver),
        validateExtensions(),
        checkDirectoryName({ isFile: true }),
        checkSharedTrash()
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
