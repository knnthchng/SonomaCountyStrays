# Import necessary libraries
from flask import Flask, render_template, request
from collections import Counter
import sqlite3
from datetime import datetime
import calendar

# Create Flask app and define the database file
app = Flask(__name__)
DATABASE = '../Project3.db'

# Define the function to query the database
def query_database(query, args=()):
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Access results by column name
    cur = conn.cursor()
    cur.execute(query, args)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

# Define the function to count outcome types
def count_outcome_types(data):
    outcome_types = [row[13] for row in data if row[13] is not None]  # Extract outcome types from the data
    return dict(Counter(outcome_types))  # Count the occurrences of each outcome type and return as a dictionary

# Define the function to calculate age from date of birth
def calculate_age(dob):
    if dob is None:
        return None
    dob = datetime.strptime(dob, "%Y-%m-%d")
    now = datetime.now()
    age = now.year - dob.year - ((now.month, now.day) < (dob.month, dob.day))
    return age

# Define the Flask route for the dashboard
@app.route('/', methods=['GET', 'POST'])
def dashboard():
    selected_pet_type = ''  # Initialize selected pet type
    selected_primary_breed = ''  # Initialize selected primary breed
    breed_filter = request.args.get('breed_filter')  # Get selected primary breed from dropdown menu

    # Get the list of pet types
    pet_types = [row[0] for row in query_database("SELECT DISTINCT Type FROM project3")]

    # Get the default primary breed for the selected pet type
    default_primary_breed = query_database("SELECT DISTINCT PrimaryBreed FROM project3 WHERE Type = ?", (pet_types[0],))[0][0]

    if request.method == 'POST':
        # Process the selected options from the dropdown menus
        pet_type = request.form['pet_type']
        primary_breed = request.form['primary_breed']

        # Retrieve the matching data from the database
        data = query_database("SELECT ID, Name, Color, Sex, Size, DateOfBirth, ImpoundNumber, KennelNumber, AnimalID, IntakeDate, DaysInShelter, IntakeType, IntakeSubtype, OutcomeType, OutcomeSubtype, IntakeCondition, OutcomeCondition, IntakeJurisdiction, OutcomeJurisdiction, OutcomeZipCode, SecondaryBreed FROM project3 WHERE Type = ? AND PrimaryBreed = ?", (pet_type, primary_breed))

        # Count the occurrences of each outcome type
        outcome_types_distribution = count_outcome_types(data)

        # Set the selected options for the dropdown menus
        selected_pet_type = pet_type
        selected_primary_breed = primary_breed

        # Get the list of primary breeds for the selected pet type
        primary_breeds = [row[0] for row in query_database("SELECT DISTINCT PrimaryBreed FROM project3 WHERE Type = ?", (pet_type,))]

        # Calculate scatter_plot_data
        query = '''
            SELECT strftime('%Y', IntakeDate) as year, strftime('%m', IntakeDate) as month, COUNT(*) as count
            FROM project3
            WHERE Type = ? AND PrimaryBreed = ?
            GROUP BY year, month
            ORDER BY year, month
        '''
        result = query_database(query, (pet_type, primary_breed))
        scatter_plot_data = [
        {
            'age': calculate_age(row['DateOfBirth']),
            'daysInShelter': row['DaysInShelter'],
            'Sex': row['Sex'],
            'Name': row['Name'],
            'AnimalID': row['AnimalID'],
            'petType': pet_type,
            'primaryBreed': primary_breed
        } for row in data]
        
        return render_template('dashboard.html', pet_types=pet_types, primary_breeds=primary_breeds, selected_pet_type=selected_pet_type, selected_primary_breed=selected_primary_breed, data=data, outcome_types_distribution=outcome_types_distribution, scatter_plot_data=scatter_plot_data)
    else:
        # Get the list of primary breeds for the default pet type
        primary_breeds = [row[0] for row in query_database("SELECT DISTINCT PrimaryBreed FROM project3 WHERE Type = ?", (pet_types[0],))]
        
        # Retrieve the matching data from the database for the default pet type and primary breed
        data = query_database("SELECT ID, Name, Color, Sex, Size, DateOfBirth, ImpoundNumber, KennelNumber, AnimalID, IntakeDate, DaysInShelter, IntakeType, IntakeSubtype, OutcomeType, OutcomeSubtype, IntakeCondition, OutcomeCondition, IntakeJurisdiction, OutcomeJurisdiction, OutcomeZipCode, SecondaryBreed FROM project3 WHERE Type = ? AND PrimaryBreed = ?", (pet_types[0], primary_breeds[0]))

        # Calculate outcome_types_distribution
        outcome_types_distribution = count_outcome_types(data)

        # Calculate scatter_plot_data
        scatter_plot_data = [
            {
                'age': calculate_age(row['DateOfBirth']),
                'DaysinShelter': row['DaysInShelter'],
                'Sex': row['Sex'],
                'Name': row['Name'],
                'AnimalID': row['AnimalID']
            } for row in data
        ]

        # Render the form with the dropdown menus and scatter plot
        return render_template('dashboard.html', data=data, pet_types=pet_types, primary_breeds=primary_breeds,
                            selected_pet_type=selected_pet_type, selected_primary_breed=selected_primary_breed,
                            outcome_types_distribution=outcome_types_distribution, scatter_plot_data=scatter_plot_data)

# Run the Flask app in debug mode
if __name__ == '__main__':
    app.run(debug=True)