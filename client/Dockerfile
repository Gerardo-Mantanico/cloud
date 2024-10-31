# Etapa de construcción
FROM node:18.17.1 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Compila el proyecto
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copia los archivos de la etapa de construcción
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto por defecto de Nginx
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]