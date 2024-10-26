// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express'
import configuration from '@feathersjs/configuration'
import { configurationValidator } from './configuration.js'
import { logger } from './logger.js'
import { logError } from './hooks/log-error.js'
import { mongodb } from './mongodb.js'

import { authentication } from './authentication.js'

import { services } from './services/index.js'

const app = express(feathers())

// cargar la configuración de la aplicación
app.configure(configuration(configurationValidator))
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
// Aloja la carpeta pública
app.use('/', serveStatic(app.get('public')))

// Configurar servicios y funcionalidad en tiempo real
app.configure(rest())

app.configure(mongodb)

app.configure(authentication)

app.configure(services)

// Configurar un middleware para 404 y el controlador de errores
app.use(notFound())
app.use(errorHandler({ logger }))

//Registra ganchos que se ejecutan en todos los métodos de servicio
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
//Registre los ganchos de configuración y desmontaje de la aplicación aquí
app.hooks({
  setup: [],
  teardown: []
})

export { app }
