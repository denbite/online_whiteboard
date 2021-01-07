FROM nginx:1.19.0-alpine

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx

RUN nginx -t

EXPOSE 80