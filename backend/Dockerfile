# NodeJS Version 16
FROM node:18-alpine
# Copy Dir
COPY . ./app

# Work to Dir
WORKDIR /app

# Install Node Package
RUN yarn

# Set Env
ENV NODE_ENV production
EXPOSE 8080
EXPOSE 8888
# Cmd script
CMD ["yarn", "start"]