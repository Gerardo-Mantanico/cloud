import { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { validate, validators } from 'validate-redux-form';
import Swal from 'sweetalert2';
import { InputField, InputNumberField, InputSelect } from 'src/components/AppInput';
import { SmallContainer } from 'src/components/Container';
import { AppButtonDanger } from 'src/components/AppButton';
import { useUser } from 'src/utils/useUser';
import { usernameRegexValidator, dpiRegexValidator, emailRegexValidator } from 'src/utils/validators';
import { handleError } from 'src/utils/handleError';
import { userService } from 'src/config/apiClient';



export const FormUsers = () => {
  const navigate = useNavigate();
  const user = useUser();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({ is_admin: false });
  const [loading, setLoading] = useState(false);


  const validateForm = (values) => validate(values, {
    email: validators.exists()("Campo requerido"),
    first_name: validators.exists()("Campo requerido"),
    last_name: validators.exists()("Campo requerido"),
    password: id ? undefined : validators.exists()("Campo requerido"),
    // is_admin: validators.exists()("Campo requerido"),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await userService.get(id)
          setInitialValues(data);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          });
          setInitialValues({ is_admin: false });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, user]);

  const onSubmit = async (data) => {
    setLoading(true);
    if (id) {
      try {
        const { email, first_name, last_name, is_admin } = data;
        await userService.patch(id, { email, first_name, last_name, is_admin })
        Swal.fire({
          icon: 'success',
          title: 'Guardado con éxito',
          showConfirmButton: false,
          timer: 1500
        })
        navigate('/usuarios');
      } catch (error) {
        handleError(error, 'Oops...');
      }
    } else {
      try {
        const response = await userService.create(data);
        Swal.fire({
          icon: 'success',
          title: 'Creado con éxito',
          text: `${response.username} - ${response.password}`,
          showConfirmButton: true,
        })
        navigate('/usuarios');
      } catch (error) {
        handleError(error, 'Oops...');
      }
    }
    setLoading(false);
  };

  return (
    <SmallContainer className="mt-5 d-flex flex-column align-items-center justify-content-center " loading={loading}>
      <h3>{`${id ? "Editar" : "Crear"} usuario`} </h3>
      <Form
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, values }) => (
          <div className="d-flex flex-column justify-content-center align-items-center pb-4 col-12 col-md-10 col-lg-8 mx-auto mt-2">
            <form onSubmit={handleSubmit} className="w-50">
              <div className="row mb-3">
                <div className="col-12">
                  <Field
                    name="email"
                    render={InputField}
                    type="text"
                    placeholder="email@example.com"
                    label="Email"
                    validate={emailRegexValidator}
                    readOnly={!!id}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <Field
                    name="first_name"
                    render={InputField}
                    type="text"
                    placeholder="Nombre"
                    label="Nombre"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <Field
                    name="last_name"
                    render={InputField}
                    type="text"
                    placeholder="Apellido"
                    label="Apellido"
                  />
                </div>
              </div>
              {!id ? (
                <div className="row mb-3">
                  <div className="col-12">
                    <Field
                      name="password"
                      render={InputField}
                      type="text"
                      label="Contraseña"
                    />
                  </div>
                </div>
              ) : null}

              <div className="row mb-3">
                <div className="col-12">
                  <Field
                    name="is_admin"
                    render={InputSelect}
                    placeholder="Tipo"
                    label="Tipo de usuario"
                    options={[{ value: true, label: 'Administrador' }, { value: false, label: "Empleado" }]}
                  />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center">
                <Button
                  color="dark"
                  type="submit"
                  disabled={submitting}
                  block
                >
                  {id ? "Editar" : "Agregar"}
                </Button>
              </div>
            </form>
          </div>

        )}
      />
    </SmallContainer>
  );
};
