FROM postgres:15-alpine

# Copy custom configuration
COPY postgresql.conf /etc/postgresql/postgresql.conf

# Copy initialization scripts
COPY init/ /docker-entrypoint-initdb.d/

# Set environment variables
ENV POSTGRES_DB=hostel_db
ENV POSTGRES_USER=hostel_user
ENV POSTGRES_PASSWORD=hostel_password

# Expose port
EXPOSE 5432

# Use custom configuration
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
