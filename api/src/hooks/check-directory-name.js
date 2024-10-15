import { checkContext, getItems, replaceItems } from 'feathers-hooks-common'

export const checkDirectoryName =
  (options = {}) =>
  async (context) => {
    const { isFile = false } = options
    const { id, service } = context
    const instance = id ? await service.get(id) : {}

    checkContext(context, 'before', ['create', 'update', 'patch'])

    const items = getItems(context)

    if (isFile && !items.extension && !items.name) return context

    if (!isFile && !items.name) return context

    const name = items.name ?? instance.name
    const parent_id = items.parent_id ?? instance.parent_id

    const queryFile = {}
    if (isFile) queryFile.extension = items.extension ?? instance.extension

    const existingItem = await context.service.find({
      paginate: false,
      query: {
        name,
        _id: { $ne: context.id },
        parent_id: parent_id ?? { $exists: false },
        owner: items.owner,
        ...queryFile
      }
    })

    if (existingItem.length > 0) {
      let copyNumber = 1
      let newName = `${name}(${copyNumber})`
      const similarItems = await context.service.find({
        paginate: false,
        query: {
          name: { $regex: name.replaceAll('(', `\\(`).replaceAll(')', `\\)`) },
          _id: { $ne: context.id },
          parent_id: parent_id ?? { $exists: false },
          owner: items.owner,
          ...queryFile
        }
      })

      while (similarItems.length > 0 && similarItems.some((item) => item.name === newName)) {
        copyNumber++
        newName = `${name}(${copyNumber})`
      }

      // Reemplaza el nombre en los items
      items.name = newName
      replaceItems(context, items)
    }

    return context
  }
