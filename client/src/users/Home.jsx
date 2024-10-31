export const Home = () => {
  return (
    <div className="mt-5 d-flex flex-column align-items-center justify-content-center text-center">
      <h1 className="text-3xl font-bold mb-4"> Bienvenido a Cloud-Grafile</h1>
      <img
        src="logo.png"
        alt="logo"
        style={{ width: "300px", height: "200px" }}
        className="mb-4"
      />
      <div
        className="bg-gray-100 p-4 rounded-lg shadow-md"
        style={{ width: "500px", height: "200px" }}
      >
        <p className="text-lg text-gray-700 h-full flex items-center justify-center">
          Accede, comparte y protege tus archivos en un solo lugar.
          <strong>Cloud GraFile</strong>
          es la solución en la nube que permite a los equipos de
          <strong>Ediciones Gráficas</strong>
          colaborar de manera segura y eficiente desde cualquier sitio.
        </p>
      </div>
    </div>
  );
};
