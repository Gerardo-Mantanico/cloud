import { BadRequest } from '@feathersjs/errors'
import { checkContext } from 'feathers-hooks-common'
export const checkSharedTrash =
  (options = {}) =>
  async (context) => {
    checkContext(context, 'before', ['patch'])
    const { id, service } = context
    const instance = await service.get(id)

    if (instance.is_shared || instance.is_trash) throw new BadRequest('No se puede editar este archivo')

    return context
  }
