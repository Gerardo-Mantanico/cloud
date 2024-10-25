import { ListComponent } from "src/components/ListComponent"
import { userService } from "src/config/apiClient";

export const ListUsers = () => {
  const transformResults = (data) => {
    return data.map((u) => ({ ...u, type: u.is_admin ? "Administrador" : null }));
  }

  const getUsers = (page) => {
    return userService.find({
      $skip: (page - 1) * 10
    })
  }

  const deleteUser = (id) => {
    return userService.remove(id)
  }

  const fields = [
    { label: 'Usuario', key: 'email' },
    { label: 'Nombre', key: 'first_name' },
    { label: 'Apellido', key: 'last_name' },
    { label: 'Tipo', key: 'type' },
  ];
  return <ListComponent title="Usuarios" fields={fields} urlEdit="/usuarios/:id" urlCreate="/usuarios/nuevo" getData={getUsers} deleteItem={deleteUser} transformResults={transformResults} />
}