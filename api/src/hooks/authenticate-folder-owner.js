import { BadRequest } from '@feathersjs/errors'
import { checkContext } from 'feathers-hooks-common'

export const authenticateFolderOwner =
  (options = {}) =>
  async (context) => {
    checkContext(context, 'after', ['get'])

    const { user } = context.params

    if (!user) return context

    const instance = context.result

    const { owner } = instance

    if (JSON.stringify(user._id) !== JSON.stringify(owner) && (!instance.is_trash || !user.is_admin))
      throw new BadRequest('Usuario no permitido para este directorio')

    return context
  }
