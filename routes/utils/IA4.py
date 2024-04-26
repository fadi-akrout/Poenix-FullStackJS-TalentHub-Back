import os
from flask import Flask, request, render_template, send_from_directory
from flask_cors import CORS
import PyPDF2
import re
import pandas as pd
import pickle

app = Flask(__name__, static_folder='./build', static_url_path='/')
CORS(app)

def extract_text_from_pdf(file_path):
    with open(file_path, 'rb') as file:
        pdf = PyPDF2.PdfReader(file)
        text = ''
        for page in pdf.pages:
            text += page.extract_text()
        return text

def extract_email(text):
    pattern = re.compile(r'Email:\s*([^\n]+)')
    match = re.search(pattern, text)
    if match:
        return match.group(1)
    return None

def extract_phone_number(text):
    pattern = re.compile(r'Phone:\s*([^\n]+)')
    match = re.search(pattern, text)
    if match:
        return match.group(1)
    return None

def extract_skills(text):
    pattern = re.compile(r'Skills\s*\n(.+)')
    match = re.search(pattern, text)
    if match:
        skills = match.group(1).split(',')
        return [skill.strip() for skill in skills]
    return []

def extract_languages(text):
    pattern = re.compile(r'Languages\s*\n(.+)')
    match = re.search(pattern, text)
    if match:
        languages = match.group(1).split(',')
        return [language.strip() for language in languages]
    return []

def process_resume(file_path):
    resume_text = extract_text_from_pdf(file_path)

    email = extract_email(resume_text)
    phone_number = extract_phone_number(resume_text)
    skills = extract_skills(resume_text)
    languages = extract_languages(resume_text)

    output_file_path = '/Users/Asus store/Desktop/4TWIN/4TWIN5/PI/IA/output.xlsx'

    # Check if the output file exists and is not empty
    if os.path.isfile(output_file_path) and os.path.getsize(output_file_path) > 0:
        # Read existing data from Excel file
        df = pd.read_excel(output_file_path)
    else:
        # Create an empty DataFrame if the file doesn't exist or is empty
        df = pd.DataFrame(columns=['Email Addresses', 'Phone Numbers', 'Skills', 'Languages'])

    # Create a new DataFrame for the new row
    new_row = {
        'Email Addresses': email,
        'Phone Numbers': phone_number,
        'Skills': ', '.join(skills),
        'Languages': ', '.join(languages)
    }

    # Append the new row to the DataFrame
    df = df._append(new_row, ignore_index=True)

    # Save the updated DataFrame to the Excel file
    df.to_excel(output_file_path, index=False)

    print(f"Data appended to {output_file_path}")

    return {
        'Email Addresses': email,
        'Phone Numbers': phone_number,
        'Skills': ', '.join(skills),
        'Languages': ', '.join(languages)
    }

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['resume']
    if file:
        file_path = os.path.join('uploads', file.filename)
        file.save(file_path)
        result = process_resume(file_path)
        return result

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)