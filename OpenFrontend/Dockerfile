FROM node:18
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object
RUN npm run build
ENV REACT_APP_DEV=production
EXPOSE 3000
CMD [ "npx", "serve", "-s", "build" ]