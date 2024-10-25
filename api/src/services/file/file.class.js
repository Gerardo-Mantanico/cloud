import { MongoDBService } from '@feathersjs/mongodb'
import { BadRequest } from '@feathersjs/errors'

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class FileService extends MongoDBService {
  async remove(id, params) {
    const { query } = params
    const { keepParent = false } = query
    const instance = await this.get(id)
    if (instance.is_shared) return super.remove(id, params)

    let data = await this.patch(id, {
      is_trash: true
    })

    if (!keepParent) {
      delete data.parent_id
      data = await this.update(id, data)
    }

    return data
  }

  async duplicate(data, params) {
    const { id, parent_id = null } = data
    const instance = id ? await this.get(id) : null
    if (!instance) throw new BadRequest(`El archivo no existe id: ${id}`)

    delete instance._id
    delete instance.createdAt
    delete instance.updatedAt

    const newData = {
      ...instance
    }

    if (parent_id) newData.parent_id = parent_id

    return this.create(newData, params)
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('file'))
  }
}
