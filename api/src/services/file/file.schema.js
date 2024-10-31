// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'
import { setDefault } from '../../utils/setDefault.js'
// Main data model schema
export const fileSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    name: Type.RegEx(/^[a-zA-Z0-9_-]+(\(\d+\))*$/),
    extension: Type.String(),
    content: Type.Union([
      Type.String(), // Para texto
      Type.Any() // Para archivos binarios
    ]),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    parent_id: Type.Optional(ObjectIdSchema()),
    owner: Type.Optional(ObjectIdSchema()),
    is_trash: Type.Optional(Type.Boolean()),

    // For shared files
    is_shared: Type.Optional(Type.Boolean()),
    sharedBy: Type.Optional(ObjectIdSchema()),
    sharedAt: Type.Optional(Type.Number())
  },
  { $id: 'File', additionalProperties: false }
)
export const fileValidator = getValidator(fileSchema, dataValidator)
export const fileResolver = resolve({})

export const fileExternalResolver = resolve({})

// Schema for creating new entries
export const fileDataSchema = Type.Pick(
  fileSchema,
  [
    'name',
    'is_trash',
    'owner',
    'parent_id',
    'is_shared',
    'sharedBy',
    'sharedAt',
    'extension',
    'content',
    'owner'
  ],
  {
    $id: 'FileData'
  }
)
export const fileDataValidator = getValidator(fileDataSchema, dataValidator)
export const fileDataResolver = resolve({
  createdAt: async () => {
    return Date.now()
  },
  updatedAt: async () => {
    return Date.now()
  },
  is_trash: setDefault(false),
  owner: virtual(async (items, context) => {
    const { owner } = items
    const user = { ...context.params.user }
    return owner ?? user._id
  })
})

// Esquema para actualizar entradas existentes
export const filePatchSchema = Type.Partial(fileSchema, {
  $id: 'FilePatch'
})
export const filePatchValidator = getValidator(filePatchSchema, dataValidator)
export const filePatchResolver = resolve({})

//Esquema para propiedades de consulta permitidas
export const fileQueryProperties = Type.Pick(fileSchema, [
  '_id',
  'name',
  'parent_id',
  'extension',
  'is_trash',
  'is_shared',
  'owner'
])
export const fileQuerySchema = Type.Intersect(
  [
    querySyntax(fileQueryProperties, {
      name: {
        $regex: Type.String(),
        $options: Type.String()
      },
      parent_id: {
        $exists: Type.Boolean()
      }
    }),

    // Agregue propiedades de consulta adicionales aquí
    Type.Object(
      {
        keepParent: Type.Optional(Type.Boolean())
      },
      { additionalProperties: false }
    )
  ],
  { additionalProperties: false }
)
export const fileQueryValidator = getValidator(fileQuerySchema, queryValidator)
export const fileQueryResolver = resolve({})
