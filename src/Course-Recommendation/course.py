import requests
import os
import base64
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Udemy API endpoint
UDEMY_API_URL = "https://www.udemy.com/api-2.0/courses/"

# Load API credentials
UDEMY_CLIENT_ID = os.getenv("UDEMY_CLIENT_ID", "bTRd919L1Qw0VhZK11fQg1kBwGmhD9aAJKLHT1ts")
UDEMY_CLIENT_SECRET = os.getenv("UDEMY_CLIENT_SECRET", "g04hV7UXEPqBeVxE0iEegXWo0c8JJ0UzCtfkgfOUoq7bUjYPNRxuS7KLXDkXvyK0CzzN5BifOom8zoq9ya0KNtPYruZhqERlJWe87rYebiYCRt6hufgw9EBDtgj8pNZ1")

# Function to get course recommendations from Udemy API
def get_course_recommendations(query, page=1, page_size=10):
    # Basic authentication header
    credentials = f"{UDEMY_CLIENT_ID}:{UDEMY_CLIENT_SECRET}"
    encoded_credentials = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")

    headers = {
        "Authorization": f"Basic {encoded_credentials}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    params = {
        "search": query,
        "page": page,
        "page_size": page_size,
    }

    try:
        response = requests.get(UDEMY_API_URL, headers=headers, params=params)

        # Handle response
        if response.status_code == 200:
            return response.json().get("results", [])
        else:
            print(f"Failed to fetch courses. Status Code: {response.status_code}, Message: {response.text}")
            return []
    except Exception as e:
        print(f"Error fetching data from Udemy API: {str(e)}")
        return []

# Function to recommend similar courses using TF-IDF and cosine similarity
def recommend_similar_courses(courses, user_query):
    course_descriptions = [course["headline"] for course in courses]
    
    # Add the user's search query to the list of course descriptions
    course_descriptions.insert(0, user_query)

    # Vectorize the course descriptions using TF-IDF
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(course_descriptions)

    # Calculate the cosine similarity between the user's query and all courses
    similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    # Get the indices of courses sorted by similarity score
    similar_courses_indices = np.argsort(similarity_matrix)[::-1]

    # Display the top 3 similar courses with descriptions
    print("\nCourses similar to your search query:")
    for idx in similar_courses_indices[:3]:
        similar_course = courses[idx]
        title = similar_course.get("title", "No title available")
        price = similar_course.get("price", "Free")
        description = similar_course.get("headline", "No description available")
        url = f"https://www.udemy.com{similar_course.get('url', '')}"

        print(f"🔹 Title: {title}")
        print(f"📖 Description: {description}")
        print(f"💰 Price: {price}")
        print(f"🔗 Course Link: {url}\n")

# Function to display course recommendations
def display_course_recommendations(query):
    courses = get_course_recommendations(query)
    
    if courses:
        print(f"\nRecommended Courses for '{query}':\n")
        for course in courses:
            title = course.get("title", "No title available")
            instructor = course["visible_instructors"][0]["display_name"] if "visible_instructors" in course and course["visible_instructors"] else "Unknown"
            url = f"https://www.udemy.com{course.get('url', '')}"
            price = course.get("price", "Free")
            description = course.get("headline", "No description available")

            print(f"🔹 Title: {title}")
            print(f"👨‍🏫 Instructor: {instructor}")
            print(f"📖 Description: {description}")
            print(f"💰 Price: {price}")
            print(f"🔗 Course Link: {url}\n")
        
        # Use ML to recommend similar courses based on user query
        recommend_similar_courses(courses, query)
    else:
        print(f"No courses found for '{query}'.")

# Example usage
if __name__== "_main_":
    keyword = input("Enter a topic to get course recommendations: ")
    display_course_recommendations(keyword)