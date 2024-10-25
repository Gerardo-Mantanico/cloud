import { checkContext } from 'feathers-hooks-common'

export const populateDirectoryPath =
  (options = {}) =>
  async (context) => {
    checkContext(context, 'after', ['get'])

    const { result, service, params } = context
    if (!result.parent_id) result.path = `root/${result.name}`
    else {
      const parent = await service.get(result.parent_id, params)
      result.path = `${parent.path}/${result.name}`
    }
    return context
  }
