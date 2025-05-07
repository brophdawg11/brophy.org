FROM node:22-alpine as build
WORKDIR /brophy.org
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine as production
WORKDIR /brophy.org
COPY --from=build /brophy.org/package.json /brophy.org/package-lock.json ./
COPY --from=build /brophy.org/node_modules ./node_modules
RUN npm prune --omit=dev
COPY --from=build /brophy.org/build ./build
COPY --from=build /brophy.org/posts ./posts
COPY --from=build /brophy.org/public ./public
ENV IS_FLY=true
CMD npm run start
