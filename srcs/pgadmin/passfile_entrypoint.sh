#!/bin/sh

set -e

POSTGRES_DB="*"

PGADMIN_HOME='/var/lib/pgadmin'

# This replaces special characters with underscores
special2underscore()
{
	str="$1"

	echo "$str" | sed -e 's/[^a-zA-Z0-9\-\.]/_/g' 
}

# This gets the pgadmin user's storage directory
getuserdir()
{
	user_email="$1"

	user_name=$(special2underscore "$user_email")
	echo "$PGADMIN_HOME/storage/$user_name"
}

# This gets a sed substitution expression string
getsubststring()
{
	while [ ! -z "$1" ]; do
		var="$1"
		val="$2"

		shift 2	

		printf -- '-e s|$%s|%s|g ' "${var}" "$val"
	done
}

# This replaces a variable by its value using sed
subst()
{
	src="$1"
	dst="$2"

	shift 2

	substitutions="$(getsubststring $@)"

	sed $substitutions "${src}" >> "${dst}"
}

# This creates a pass-file with the right permissions
mkpassfile()
{
	user_email="$1"

	user_dir=$(getuserdir "$user_email")

	echo "Writing pass-file for '$POSTGRES_USER@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB' to '$user_dir'..."
	mkdir -p "$user_dir"

	file_path="$user_dir/$PGADMIN_PASSFILE"

	rm -f "$file_path"
	touch "$file_path"
	chmod 0600 "$file_path"

	echo "$POSTGRES_HOST:$POSTGRES_PORT:$POSTGRES_DB:$POSTGRES_USER:$POSTGRES_PASSWORD" >> "$file_path"
}


# This entrypoint generates a pass-file for pgadmin
# Tested on dpage/pgadmin:5.5

# Create pass-file from environment
mkpassfile "$PGADMIN_DEFAULT_EMAIL"

# Write to server-file if it is empty
if [ ! -s "$PGADMIN_SERVERFILE" ]; then
	echo "Writing server-file..."
	subst "$PGADMIN_SERVERFILE.temp" "$PGADMIN_SERVERFILE" \
		"PGADMIN_PASSFILE"  "$PGADMIN_PASSFILE"\
		"POSTGRES_USER"     "$POSTGRES_USER"\
		"POSTGRES_HOST"     "$POSTGRES_HOST"\
		"POSTGRES_PORT"     "$POSTGRES_PORT"
fi

# Call the original entrypoint
exec  /entrypoint.sh "$@"
