import { MongoDBService } from '@feathersjs/mongodb'

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class DirectoryService extends MongoDBService {
  async remove(id, params) {
    const { query } = params
    const { keepParent = false } = query

    const { fileService } = this.options
    const data = await this.patch(id, {
      is_trash: true
    })

    if (!keepParent) {
      delete data.parent_id
      await this.update(id, data)
    }

    const children = await this.find({
      paginate: false,
      query: {
        parent_id: id,
        is_trash: false
      }
    })

    const fileChildren = await fileService.find({
      paginate: false,
      query: {
        parent_id: id,
        is_trash: false
      }
    })

    // Delete sub directories
    for (let child of children) {
      await this.remove(child._id, { query: { keepParent: true } })
    }

    // Delete files inside
    for (let child of fileChildren) {
      await fileService.remove(child._id, { query: { keepParent: true } })
    }

    return { message: 'deleted' }
  }

  async duplicate(data, params) {
    const { id, parent_id = null } = data

    const instance = id ? await this.get(id) : null
    if (!instance) throw new BadRequest(`El directorio no existe id: ${id}`)

    const { fileService } = this.options

    delete instance._id
    delete instance.createdAt
    delete instance.updatedAt

    const newData = {
      ...instance
    }

    if (parent_id) newData.parent_id = parent_id

    const duplicated = await this.create(newData, params)

    const children = await this.find({
      paginate: false,
      query: {
        parent_id: id
      }
    })

    const fileChildren = await fileService.find({
      paginate: false,
      query: {
        parent_id: id
      }
    })

    for (let child of children) {
      await this.duplicate(
        {
          id: child._id,
          parent_id: duplicated._id
        },
        params
      )
    }

    for (let child of fileChildren) {
      await fileService.duplicate(
        {
          id: child._id,
          parent_id: duplicated._id
        },
        params
      )
    }

    return duplicated
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('directory')),
    fileService: app.service('file')
  }
}
