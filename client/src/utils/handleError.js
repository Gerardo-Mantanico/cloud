import Swal from "sweetalert2";

export const handleError = (error, title) => {
  if (error.message) {
    Swal.fire({
      icon: "error",
      title,
      text: error.message,
    });
  } else {
    Swal.fire({
      icon: "error",
      title,
      text: error,
    });
  }
};
