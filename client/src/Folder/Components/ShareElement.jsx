import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import { validate, validators } from 'validate-redux-form';
import { userService } from 'src/config/apiClient';
import { shareItem } from '../actions';
import { useUser } from 'src/utils/useUser';
import { InputAsyncSelect } from 'src/components/AppInput';

const validateForm = (values) => {
  return validate(values, {
    user: validators.exists()("Campo requerido"),
  });
}

export const ShareElementModal = ({ toggle, isOpen, className = "", item }) => {

  const user = useUser()

  const getUsers = async (search) => {
    try {
      const result = await userService.find({
        query: {
          $limit: 50,
          email: { $regex: search, $options: 'i' },
          _id: { $ne: user._id }
        }
      })
      return result.data.map(u => ({ ...u, label: u.email, value: u._id }))
    } catch (error) {
      return []
    }
  }

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Compartir {item.name} {item.isFile ? `.${item.extension}` : ""}</ModalHeader>
        <ModalBody>
          <Form
            validate={validateForm}
            onSubmit={(data) => {
              const { _id } = data.user;
              shareItem({ from: user._id, to: _id, file: item._id })
              toggle()
            }}
            render={({ handleSubmit, form, submitting, values }) => (
              <div className="d-flex flex-column justify-content-center align-items-center col-12">
                <form onSubmit={handleSubmit} className="w-100">
                  <div className="row mb-3">
                    <div className="col-12 col-md-8">
                      <Field
                        name='user'
                        render={InputAsyncSelect}
                        placeholder="Usuario..."
                        label="Usuario"
                        searchText="Buscar usuario"
                        loadOptions={getUsers}
                      />
                    </div>
                  </div>
                  <Button
                    color="primary"
                    type="submit"
                    disabled={submitting}
                    className="w-25"
                  >
                    Compartir
                  </Button>
                </form>
              </div>
            )}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
