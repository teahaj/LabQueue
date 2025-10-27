from flask import Flask, render_template, request, jsonify
from collections import deque
from threading import Lock
import time

app = Flask(__name__)
queue = deque()
lock = Lock()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/instructor')
def instructor():
    return render_template('instructor.html')

@app.route('/join', methods=['POST'])
def join():
    data = request.get_json(silent=True) or request.form
    student_id = data.get('student_id') if data else None
    if not student_id or not str(student_id).isdigit():
        return jsonify({'error': 'student_id required and must be numeric'}), 400
    sid = int(student_id)
    with lock:
        if any(item['id'] == sid for item in queue):
            return jsonify({'error': 'already in queue'}), 400
        entry = {'id': sid, 'ts': time.time()}
        queue.append(entry)
    return jsonify({'ok': True, 'queued': entry})

@app.route('/queue')
def get_queue():
    with lock:
        q = list(queue)
    return jsonify({'next': q[0] if q else None, 'rest': q[1:] if len(q) > 1 else (q[1:] if q else [])})

@app.route('/pop', methods=['POST'])
def pop():
    with lock:
        if not queue:
            return jsonify({'error': 'queue is empty'}), 400
        popped = queue.popleft()
    return jsonify({'ok': True, 'popped': popped})

if __name__ == '__main__':
    # For local testing only. In production run with a proper WSGI server.
    app.run(host='0.0.0.0', port=8000, debug=True)
