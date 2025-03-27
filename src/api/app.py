from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re

app = Flask(__name__)
CORS(app)

# Load dataset
data = pd.read_csv('coursera_data.csv')

# Clean data
data = data.dropna(subset=['course_skills', 'course_difficulty', 'course_time'])
data['course_skills'] = data['course_skills'].str.lower()
data['course_difficulty'] = data['course_difficulty'].str.lower()
data['course_time'] = data['course_time'].str.lower()

# Duration mapping
DURATION_MAP = {
    'short': r'week|1-4|1\s*-\s*4|0-4',
    'medium': r'month|1-3|1\s*-\s*3|3-6',
    'long': r'month|3\+|3\s*\+|6\+|specialization'
}

@app.route('/api/recommend', methods=['POST'])
def recommend_courses():
    try:
        request_data = request.json
        skill = request_data.get('interests', '').lower().strip()
        level = request_data.get('skillLevel', '').lower().strip()
        duration = request_data.get('duration', '').lower().strip()

        # Validate inputs
        if not all([skill, level, duration]):
            return jsonify({
                'success': False,
                'error': 'Missing required parameters'
            }), 400

        # Step 1: Exact matching
        duration_pattern = DURATION_MAP.get(duration, duration)
        filtered = data[
            (data['course_skills'].str.contains(skill, regex=False)) &
            (data['course_difficulty'] == level) &
            (data['course_time'].str.contains(duration_pattern, regex=True))
        ].sort_values('course_rating', ascending=False)

        # Step 2: Fallback to partial matches
        if filtered.empty:
            filtered = data[
                (data['course_skills'].str.contains(skill, regex=False)) |
                (data['course_difficulty'] == level) |
                (data['course_time'].str.contains(duration_pattern, regex=True))
            ].sort_values(['course_rating', 'course_students_enrolled'], ascending=False)

        # Prepare results
        results = filtered.head(20).to_dict('records')
        
        return jsonify({
            'success': True,
            'count': len(results),
            'recommendations': results
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)