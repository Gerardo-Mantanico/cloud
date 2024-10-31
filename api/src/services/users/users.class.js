import { MongoDBService } from '@feathersjs/mongodb'

//UserService es una clase que extiende MongoDBService. Esto permite que el servicio herede los métodos estándar de Feathers para realizar operaciones en la base de datos, como find, get, create, update, patch, y remove. 
export class UserService extends MongoDBService {}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('users'))
  }
}
