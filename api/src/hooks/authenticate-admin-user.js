import { BadRequest } from '@feathersjs/errors'

export const authenticateAdminUser =
  (options = {}) =>
  async (context, next) => {
    const { user } = context.params
    if (!user.is_admin) throw new BadRequest('Se requiere un usuario administrador')
    await next()
  }
