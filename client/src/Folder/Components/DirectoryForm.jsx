import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import { validate, validators } from 'validate-redux-form';
import { createDirectory } from '../actions';
import { InputField } from 'src/components/AppInput';
import { fileNameRegexValidator } from 'src/utils/validators';

const validateForm = (values) => {
  return validate(values, {
    name: validators.exists()("Campo requerido"),
  });
}

export const DirectoryModal = ({ toggle, isOpen, className = "", loadData = () => { } }) => {

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Crear directorio</ModalHeader>
        <ModalBody>
          <Form
            validate={validateForm}
            onSubmit={(data) => {
              createDirectory(data, loadData)
              toggle()
            }}
            render={({ handleSubmit, form, submitting, values }) => (
              <div className="d-flex flex-column justify-content-center align-items-center col-12">
                <form onSubmit={handleSubmit} className="w-100">
                  <div className="row mb-3">
                    <div className="col-12">
                      <Field
                        name='name'
                        render={InputField}
                        placeholder="directorio"
                        label="Directorio"
                        validate={fileNameRegexValidator}
                      />
                    </div>
                  </div>
                  <Button
                    color="primary"
                    type="submit"
                    disabled={submitting}
                    className="w-25"
                  >
                    Crear
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
