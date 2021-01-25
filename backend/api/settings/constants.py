from os import getenv

# connection credentials
DB_URL = getenv("DB_URL", "postgresql+psycopg2://user:password@db:5432/db")
URL_PREFIX = "/api"

# date of birth format
POSTGRE_DATE_FORMAT = "%Y-%m-%d"
