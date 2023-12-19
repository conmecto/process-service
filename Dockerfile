FROM node:18.18.1
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install 
COPY . ./ 
EXPOSE 8080
CMD ["npm", "run", "start"]