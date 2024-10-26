import { checkContext, getItems } from 'feathers-hooks-common'
import { BadRequest } from '@feathersjs/errors'

const EXTENSIONS = ['html', 'txt','png','jpg']

export const validateExtensions =
  (options = {}) =>
  async (context) => {
    checkContext(context, 'before', ['create', 'update', 'patch'])
    const items = getItems(context)
    const { extension } = items
    if (!extension) return context

    if (!EXTENSIONS.includes(extension)) throw new BadRequest('Extensión inválida')
    return context
  }
