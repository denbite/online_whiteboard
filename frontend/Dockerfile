FROM mhart/alpine-node:14.15

WORKDIR /app

RUN npm install --frozen-lockfile

EXPOSE 80

CMD ["npm", "run", "dev"]