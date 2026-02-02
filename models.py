import sqlite3

DB = "calendar.db"

def create_table():
    con = sqlite3.connect(DB)
    cur = con.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            title TEXT NOT NULL,
            members TEXT,
            start_time TEXT NOT NULL
        )
    """)
    con.commit()
    con.close()

def add_date_column():
    con = sqlite3.connect(DB)
    cur = con.cursor()
    try:
        cur.execute("ALTER TABLE events ADD COLUMN date TEXT NOT NULL DEFAULT ''")
        con.commit()
    except sqlite3.OperationalError:
        pass  
    con.close()

create_table()
add_date_column()  