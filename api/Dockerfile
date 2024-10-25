# Establece la imagen base de Node.js
FROM node:18.17.1

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto al directorio de trabajo del contenedor
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Expone el puerto en el que la app escuchará
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["node", "src/index.js"]
