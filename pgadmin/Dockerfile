FROM dpage/pgadmin4:5.5

ENV POSTGRES_HOST="database"
ENV POSTGRES_PORT="5432"
#ENV POSTGRES_DB="db"
ENV POSTGRES_USER="admin"
ENV POSTGRES_PASSWORD="admin"

ENV PGADMIN_DEFAULT_EMAIL="admin@admin.com"
ENV PGADMIN_DEFAULT_PASSWORD="admin"

ENV PGADMIN_HOME="/pgadmin4"
ENV PGADMIN_SERVERFILE="${PGADMIN_HOME}/servers.json"
ENV PGADMIN_PASSFILE="/pgpass"

# Install template server-file
COPY servers.json.temp "${PGADMIN_SERVERFILE}.temp"

# Install entrypoint
COPY passfile_entrypoint.sh /passfile_entrypoint.sh

USER root
RUN touch "${PGADMIN_SERVERFILE}" \
    && chown pgadmin:pgadmin "${PGADMIN_SERVERFILE}"
USER pgadmin

ENTRYPOINT [ "/passfile_entrypoint.sh" ]
