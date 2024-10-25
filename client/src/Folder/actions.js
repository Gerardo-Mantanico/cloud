import { directoryService, fileService } from "src/config/apiClient";
import { handleError } from "src/utils/handleError";
import Swal from "sweetalert2";

export const deleteItem = ({ _id, name, extension, isFile }, cb) => {
  const service = isFile ? fileService : directoryService;
  const message = isFile
    ? `¿Está seguro que desea eliminar el archivo ${name}.${extension}?`
    : `¿Está seguro que desea eliminar el directorio ${name}?`;

  Swal.fire({
    title: "Eliminar",
    text: message,
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: "Sí",
    confirmButtonColor: "#212529",
    denyButtonText: "No",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await service.remove(_id);
        Swal.fire({
          icon: "success",
          title: "Eliminado con éxito",
          showConfirmButton: false,
          timer: 500,
        });
      } catch (error) {
        handleError(error, "Oops...");
      } finally {
        cb();
      }
    }
  });
};

export const moveItem = (item, newParentId, cb) => {
  const { name, _id, extension, isFile } = item;
  const service = isFile ? fileService : directoryService;
  const message = isFile
    ? `¿Está seguro que desea mover el archivo ${name}.${extension}?`
    : `¿Está seguro que desea mover el directorio ${name}?`;

  Swal.fire({
    title: "Mover",
    text: message,
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: "Sí",
    confirmButtonColor: "#212529",
    denyButtonText: "No",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const body = {};
        if (newParentId) body.parent_id = newParentId;
        else {
          body.$unset = { parent_id: 1 };
        }

        await service.patch(_id, body);

        Swal.fire({
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (error) {
        handleError(error, "Oops...");
      } finally {
        cb();
      }
    }
  });
};

export const shareItem = async ({ from, to, file }) => {
  try {
    const dataFile = await fileService.get(file);

    delete dataFile._id;
    delete dataFile.createdAt;
    delete dataFile.updatedAt;

    await fileService.create({
      ...dataFile,
      owner: to,
      is_shared: true,
      sharedBy: from,
    });

    Swal.fire({
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    handleError(error, "Oops...");
  }
};

export const copyItem = async ({ _id, isFile }, cb) => {
  try {
    const service = isFile ? fileService : directoryService;

    await service.duplicate({
      id: _id,
    });

    Swal.fire({
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    handleError(error, "Oops...");
  } finally {
    cb();
  }
};

export const createDirectory = async (data, cb) => {
  try {
    await directoryService.create(data);

    Swal.fire({
      icon: "success",
      showConfirmButton: false,
      timer: 1000,
    });
  } catch (error) {
    handleError(error, "Oops...");
  } finally {
    cb();
  }
};

export const createFile = async (data, cb) => {
  try {
    await fileService.create(data);

    Swal.fire({
      icon: "success",
      showConfirmButton: false,
      timer: 1000,
    });
  } catch (error) {
    handleError(error, "Oops...");
  } finally {
    cb();
  }
};

export const updateFile = async (id, data, cb) => {
  console.log(data);
  try {
    const { name, content, extension } = data;
    await fileService.patch(id, { name, content, extension });

    Swal.fire({
      icon: "success",
      showConfirmButton: false,
      timer: 1000,
    });
  } catch (error) {
    handleError(error, "Oops...");
  } finally {
    cb();
  }
};
