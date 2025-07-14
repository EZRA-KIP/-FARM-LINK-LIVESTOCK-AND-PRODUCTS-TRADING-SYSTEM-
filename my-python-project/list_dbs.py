import sqlite3
import psycopg2
import mysql.connector

def connect_to_sqlite(db_file):
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        return None

def connect_to_postgresql(host, database, user, password):
    try:
        conn = psycopg2.connect(host=host, database=database, user=user, password=password)
        return conn
    except psycopg2.Error as e:
        print(f"PostgreSQL error: {e}")
        return None

def connect_to_mysql(host, database, user, password):
    try:
        conn = mysql.connector.connect(host=host, database=database, user=user, password=password)
        return conn
    except mysql.connector.Error as e:
        print(f"MySQL error: {e}")
        return None

def list_databases(conn, db_type):
    if db_type == 'sqlite':
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        return [table[0] for table in tables]
    
    elif db_type == 'postgresql':
        cursor = conn.cursor()
        cursor.execute("SELECT datname FROM pg_database;")
        databases = cursor.fetchall()
        return [db[0] for db in databases]
    
    elif db_type == 'mysql':
        cursor = conn.cursor()
        cursor.execute("SHOW DATABASES;")
        databases = cursor.fetchall()
        return [db[0] for db in databases]

def print_databases(databases):
    if databases:
        print("Databases:")
        for db in databases:
            print(f"- {db}")
    else:
        print("No databases found.")

if __name__ == "__main__":
    # Example usage for SQLite
    sqlite_conn = connect_to_sqlite('example.db')
    if sqlite_conn:
        sqlite_dbs = list_databases(sqlite_conn, 'sqlite')
        print_databases(sqlite_dbs)
        sqlite_conn.close()

    # Example usage for PostgreSQL
    pg_conn = connect_to_postgresql('localhost', 'your_database', 'your_user', 'your_password')
    if pg_conn:
        pg_dbs = list_databases(pg_conn, 'postgresql')
        print_databases(pg_dbs)
        pg_conn.close()

    # Example usage for MySQL
    mysql_conn = connect_to_mysql('localhost', 'your_database', 'your_user', 'your_password')
    if mysql_conn:
        mysql_dbs = list_databases(mysql_conn, 'mysql')
        print_databases(mysql_dbs)
        mysql_conn.close()