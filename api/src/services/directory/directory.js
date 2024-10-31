// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  directoryDataValidator,
  directoryPatchValidator,
  directoryQueryValidator,
  directoryResolver,
  directoryExternalResolver,
  directoryDataResolver,
  directoryPatchResolver,
  directoryQueryResolver
} from './directory.schema.js'
import { DirectoryService, getOptions } from './directory.class.js'
import { checkDirectoryName } from '../../hooks/check-directory-name.js'
import { checkParentId } from '../../hooks/check-parent-id.js'
import { authenticateFolderOwner } from '../../hooks/authenticate-folder-owner.js'
import { populateDirectoryPath } from '../../hooks/populate-directory-path.js'
import { filterByUser } from '../../hooks/filter-by-user.js'

export const directoryPath = 'directory'
export const directoryMethods = ['find', 'get', 'create', 'patch', 'remove', 'update', 'duplicate']

export * from './directory.class.js'
export * from './directory.schema.js'

// Una función de configuración que registra el servicio y sus ganchos z
export const directory = (app) => {
  // Registra nuestro servicio en la aplicación Feathers
  app.use(directoryPath, new DirectoryService(getOptions(app)), {
    //Una lista de todos los métodos que este servicio expone externamente
    methods: directoryMethods,
    //Puedes agregar eventos personalizados adicionales para enviar a los clientes aquí
    events: []
  })
  // Initialize hooks
  app.service(directoryPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(directoryExternalResolver),
        schemaHooks.resolveResult(directoryResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(directoryQueryValidator),
        schemaHooks.resolveQuery(directoryQueryResolver)
      ],
      find: [filterByUser()],
      get: [],
      create: [
        schemaHooks.validateData(directoryDataValidator),
        schemaHooks.resolveData(directoryDataResolver),
        checkDirectoryName()
      ],
      patch: [
        schemaHooks.validateData(directoryPatchValidator),
        schemaHooks.resolveData(directoryPatchResolver),
        checkParentId(),
        checkDirectoryName()
      ],
      remove: []
    },
    after: {
      all: [],
      get: [authenticateFolderOwner()]
    },
    error: {
      all: []
    }
  })
}
