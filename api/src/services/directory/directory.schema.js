// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'
import { setDefault } from '../../utils/setDefault.js'

// Main data model schema
export const directorySchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    name: Type.RegEx(/^[a-zA-Z0-9_-]+(\(\d+\))*$/),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    is_trash: Type.Optional(Type.Boolean()),
    owner: Type.Optional(ObjectIdSchema()),
    parent_id: Type.Optional(ObjectIdSchema())
  },
  { $id: 'Directory', additionalProperties: true }
)
export const directoryValidator = getValidator(directorySchema, dataValidator)
export const directoryResolver = resolve({})

export const directoryExternalResolver = resolve({})

// Schema for creating new entries
export const directoryDataSchema = Type.Pick(directorySchema, ['name', 'is_trash', 'owner', 'parent_id'], {
  $id: 'DirectoryData'
})
export const directoryDataValidator = getValidator(directoryDataSchema, dataValidator)
export const directoryDataResolver = resolve({
  createdAt: async () => {
    return Date.now()
  },
  updatedAt: async () => {
    return Date.now()
  },
  is_trash: setDefault(false),
  owner: virtual(async (_message, context) => {
    const user = { ...context.params.user }
    delete user.password
    return user._id
  })
})

// Schema for updating existing entries
export const directoryPatchSchema = Type.Partial(directorySchema, {
  $id: 'DirectoryPatch'
})
export const directoryPatchValidator = getValidator(directoryPatchSchema, dataValidator)
export const directoryPatchResolver = resolve({
  updatedAt: async () => {
    return Date.now()
  }
})

// Schema for allowed query properties
export const directoryQueryProperties = Type.Pick(directorySchema, [
  '_id',
  'name',
  'parent_id',
  'owner', //due;o
  'is_trash' // es basura
])
export const directoryQuerySchema = Type.Intersect(
  [
    querySyntax(directoryQueryProperties, {
      name: {
        $regex: Type.String(),
        $options: Type.String()
      },
      parent_id: {
        $exists: Type.Boolean()
      }
    }),
    // Add additional query properties here
    Type.Object(
      {
        keepParent: Type.Optional(Type.Boolean())
      },
      { additionalProperties: false }
    )
  ],
  { additionalProperties: false }
)
export const directoryQueryValidator = getValidator(directoryQuerySchema, queryValidator)
export const directoryQueryResolver = resolve({})
