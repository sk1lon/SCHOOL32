from flask import Flask, render_template, request, jsonify, make_response, redirect
import sqlite3
from models import DB

app = Flask(__name__)

pas = {"admin": "123"}

@app.route('/')
def index():
    adm = request.cookies.get('adm')
    return render_template("index.html", show_admin=(adm == '1'))

@app.route('/admin')
def admin_page():
    if request.cookies.get('adm') != '1':
        return redirect('/')
    return render_template("admin.html")

@app.route('/auth', methods=['POST'])
def auth():
    username = request.form.get('login')
    password = request.form.get('pass')

    if username in pas and pas[username] == password:
        res = make_response(redirect('/admin'))
        res.set_cookie('adm', '1')
        return res
    else:
        res = make_response(redirect('/'))
        res.set_cookie('adm', '0')
        return res

@app.route("/add_event", methods=["POST"])
def add_event():
    if request.cookies.get("adm") != "1": 
        return jsonify({"error": "unauthorized"}), 401

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    date = data.get("date")  # Добавлено: дата
    title = data.get("title")
    members = data.get("members")
    start_time = data.get("start_time")

    if not date or not title or not start_time:  # Добавлено проверка date
        return jsonify({"error": "missing data"}), 400

    try:
        con = sqlite3.connect("calendar.db")
        cur = con.cursor()
        cur.execute(
            "INSERT INTO events (date, title, members, start_time) VALUES (?, ?, ?, ?)",  # Добавлено date
            (date, title, members, start_time)  # Добавлено date
        )
        con.commit()
    except Exception as e:
        print("DB ERROR:", e)
        return jsonify({"error": "DB error"}), 500
    finally:
        con.close()

    return jsonify({"ok": True})


@app.route("/get_events")
def get_events():
    con = sqlite3.connect("calendar.db")
    cur = con.cursor()
    cur.execute("SELECT date, title, members, start_time FROM events")
    rows = cur.fetchall()
    con.close()

    events = [
        {
            "date": r[0],
            "title": r[1],
            "members": r[2],
            "start_time": r[3]
        }
        for r in rows
    ]

    return jsonify(events)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

app.run()