FROM nginx:alpine

COPY gemini-outpaint-prepper.html /usr/share/nginx/html/index.html
COPY gemini-watermark-remover.html /usr/share/nginx/html/gwr/index.html
COPY gemini-the-overlayer.html /usr/share/nginx/html/gto/index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 6622
