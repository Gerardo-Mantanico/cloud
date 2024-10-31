# Establece la imagen base para la API
FROM node:18.17.1

# Establece el directorio de trabajo dentro del contenedor
WORKDIR .

# Copia los archivos del proyecto de la API al directorio de trabajo del contenedor
COPY package.json package-lock.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto de la API al directorio de trabajo del contenedor
COPY . .

# Expone el puerto que usará la API
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
