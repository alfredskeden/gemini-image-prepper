FROM nginx:alpine

# Copy the HTML file to nginx html directory
COPY "gemini-outpaint-prepper.html" /usr/share/nginx/html/index.html

# Expose port 6622
EXPOSE 6622

# nginx runs automatically when container starts
