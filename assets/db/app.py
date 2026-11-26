#!/usr/bin/env python3
"""Flask API for INTUCH.PARTY — visitor counter and guestbook.

Endpoints:
- GET  /api/count         -> unique visitor count (SQLite)
- GET  /api/guestbook     -> list guestbook entries (SQLite)
- POST /api/guestbook     -> add guestbook entry (SQLite)

SQLite database stores:
- visitors table: unique IPs
- guestbook table: anonymous messages
"""

import os
import sqlite3
from flask import Flask, request, jsonify, abort

app = Flask(__name__)

# Path to SQLite database (relative to this file)
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "site.db")


def get_db():
    """Get a database connection, creating tables if needed."""
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS visitors (
            ip TEXT PRIMARY KEY,
            first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS guestbook (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    return conn


# Initialize database on import
get_db()


@app.route("/api/count", methods=["GET"])
def get_count():
    """Return unique visitor count from SQLite."""
    try:
        conn = get_db()
        count = conn.execute("SELECT COUNT(*) FROM visitors").fetchone()[0]
        return jsonify({"count": count, "type": "unique_visitors"})
    except Exception as e:
        return jsonify({"error": "Database unavailable", "detail": str(e)}), 500


@app.route("/api/visit", methods=["POST"])
def register_visit():
    """Register a new visitor (by IP) via SQLite."""
    ip = request.remote_addr or "unknown"
    try:
        conn = get_db()
        conn.execute(
            "INSERT OR IGNORE INTO visitors (ip) VALUES (?)",
            (ip,),
        )
        conn.commit()
        count = conn.execute("SELECT COUNT(*) FROM visitors").fetchone()[0]
        return jsonify({"count": count, "registered": True})
    except Exception as e:
        return jsonify({"error": "Database unavailable", "detail": str(e)}), 500


@app.route("/api/guestbook", methods=["GET"])
def get_guestbook():
    """Return all guestbook entries from SQLite, newest first (limit 50)."""
    try:
        conn = get_db()
        entries = conn.execute(
            "SELECT ip, message, created_at FROM guestbook ORDER BY created_at DESC LIMIT 50"
        ).fetchall()
        result = [
            {"ip": row[0], "message": row[1], "created_at": row[2]}
            for row in entries
        ]
        return jsonify({"entries": result})
    except Exception as e:
        return jsonify({"error": "Database unavailable", "detail": str(e)}), 500


@app.route("/api/guestbook", methods=["POST"])
def add_guestbook_entry():
    """Add a new guestbook entry (anonymous) via SQLite."""
    data = request.get_json()

    if not data or not data.get("message"):
        abort(400, description="Message is required")

    ip = request.remote_addr or "unknown"
    message = data["message"].strip()

    if not message:
        abort(400, description="Message cannot be empty")

    try:
        conn = get_db()
        conn.execute(
            "INSERT INTO guestbook (ip, message) VALUES (?, ?)",
            (ip, message),
        )
        conn.commit()
        return jsonify({"success": True, "message": message}), 201
    except Exception as e:
        return jsonify({"error": "Database unavailable", "detail": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)