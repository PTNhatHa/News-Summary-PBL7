from logging.config import fileConfig
import os

from sqlalchemy import create_engine, pool
from alembic import context
from app.database import Base
from dotenv import load_dotenv
from urllib.parse import quote_plus

from app.models.models import Article, Summary, Feedback

# Load .env file
load_dotenv()

# Alembic Config object
config = context.config

# Configure logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata for 'autogenerate' support
target_metadata = Base.metadata

# Get DB connection details from environment
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DB")

DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{quote_plus(MYSQL_PASSWORD or '')}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

print("DATABASE_URL:", DATABASE_URL)



def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    engine = create_engine(DATABASE_URL, poolclass=pool.NullPool)

    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
