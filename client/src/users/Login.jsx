import { Form, Field } from "react-final-form";
import { Button } from "reactstrap";
import { validate, validators } from "validate-redux-form";
import { useDispatch, useSelector } from "react-redux";
import { SmallContainer } from "src/components/Container";
import { InputField } from "src/components/AppInput";
import { login } from "src/store/user";
import logo from "src/assets/logo.png";
import { emailRegexValidator } from "src/utils/validators";

const validateForm = (values) => validate(values, {
  email: validators.exists()("Ingrese su usuario"),
  password: validators.exists()("Ingrese su contraseña")
})

export const Login = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.user.status);


  const onSubmit = (data) => {
    dispatch(login({ credentials: data }));
  };

  // useEffect(() => {
  //   dispatch(clearStatus());
  // }, [dispatch]);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center login-background"
    >
      <div className="login-background--blur" />
      <SmallContainer loading={status === "loading"} className="container-login">
        <div className="d-flex flex-column justify-content-center align-items-center p-4 col-10 col-md-6 col-lg-4 mx-auto rounded bg-white shadow">
          <img src={logo} alt="logo" width="200px" className="logo-cloud" />
          <Form
            onSubmit={onSubmit}
            validate={validateForm}
            render={({ handleSubmit, form, submitting, pristine }) => (
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-12">
                    <Field
                      name="email"
                      render={InputField}
                      type="text"
                      placeholder="email@example.com"
                      label="Email"
                      validate={emailRegexValidator}
                    />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-12">
                    <Field
                      name="password"
                      render={InputField}
                      type="password"
                      placeholder="Contraseña"
                      label="Contraseña"
                    />
                  </div>
                </div>
                {status === "failed" && pristine ? (
                  <div className="text-danger mb-4  ">Usuario y/o contraseña incorrectos</div>
                ) : null}
                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    color="dark"
                    type="submit"
                    disabled={submitting}
                    block
                  >
                    Ingresar
                  </Button>
                </div>
              </form>
            )}
          />
        </div>
      </SmallContainer>
    </div>
  );
};
