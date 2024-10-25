import { checkContext, getItems } from 'feathers-hooks-common'
import { BadRequest } from '@feathersjs/errors'

export default function (options = {}) {
  return async (context) => {
    checkContext(context, 'before', ['create', 'update', 'patch'])

    const items = getItems(context)
    const email = items.email

    const existingUser = await context.app.service('users').find({ paginate: false, query: { email } })

    if (existingUser.length) {
      throw new BadRequest('El correo electrónico ya está en uso')
    }

    return context
  }
}
