import { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form, Field } from "react-final-form";
import { validate, validators } from "validate-redux-form";
import { createFile, updateFile } from "../actions";
import {
  InputField,
  InputFieldCode,
  InputSelect,
} from "src/components/AppInput";
import { fileNameRegexValidator } from "src/utils/validators";
import { fileService } from "src/config/apiClient";

const validateForm = (values) => {
  return validate(values, {
    name: validators.exists()("Campo requerido"),
    content: validators.exists()("Campo requerido"),
    extension: validators.exists()("Campo requerido"),
  });
};

export const FileFormModal = ({
  toggle,
  isOpen,
  className = "",
  loadData = () => {},
  edit = false,
  view = false,
  id,
}) => {
  const [initialValues, setInitialValues] = useState({ extension: "txt" });

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const result = id ? await fileService.get(id) : {};
        setInitialValues(result);
      } catch (error) {
        setInitialValues({ extension: "html" });
      }
    })();
  }, [id, isOpen]);

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle} className={className} size="lg">
        <ModalHeader toggle={toggle}>Archivos</ModalHeader>
        <ModalBody>
          <Form
            initialValues={initialValues}
            validate={validateForm}
            onSubmit={(data) => {
              if (id) {
                updateFile(id, data, loadData);
              } else {
                createFile(data, loadData);
              }
              toggle();
            }}
            render={({ handleSubmit, form, submitting, values = {} }) => (
              <div className="d-flex flex-column justify-content-center align-items-center col-12">
                <form onSubmit={handleSubmit} className="w-75">
                  <div className="row mb-3">
                    <div className="col-6">
                      <Field
                        name="name"
                        render={InputField}
                        placeholder="directorio"
                        label="Directorio"
                        validate={fileNameRegexValidator}
                        readOnly={view}
                      />
                    </div>
                    <div className="col-6">
                      <Field
                        name="extension"
                        render={InputSelect}
                        placeholder="html"
                        label="Extensión"
                        options={[
                          { label: "html", value: "html" },
                          { label: "png", value: "png" },
                          { label: "jpg", value: "jpg" },
                          { label: "txt", value: "txt" },
                        ]}
                        disabled={view}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-12">
                      {["png", "jpg"].includes(values.extension) ? (
                        // Mostrar input de archivo solo si la extensión es png o jpg
                        <Field
                          name="content"
                          render={({ input, meta }) => (
                            <div>
                              <label>Cargar Imagen</label>
                              <input
                                type="file"
                                accept=".png, .jpg"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    input.onChange(file.name); // Guarda el nombre del archivo
                                  }
                                }}
                                readOnly={view}
                              />
                              {meta.error && meta.touched && (
                                <span className="error">{meta.error}</span>
                              )}
                            </div>
                          )}
                        />
                      ) : (
                        // Mostrar campo de texto enriquecido si la extensión no es png o jpg
                        <Field
                          name="content"
                          render={InputFieldCode}
                          placeholder="Ingrese el texto"
                          label="Contenido"
                          readOnly={view}
                        />
                      )}
                    </div>
                  </div>
                  <Button
                    color="primary"
                    type="submit"
                    disabled={submitting || view}
                    className="w-25"
                  >
                    Guardar
                  </Button>
                </form>
              </div>
            )}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
