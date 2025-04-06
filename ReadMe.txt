## Video Walkthrough
For a detailed walkthrough of the project and its features, please refer to the following video:  
[Project Walkthrough Video](https://drive.google.com/file/d/13txjPW3fiAU8d59tU4DdT9yGEFYQP_-6/view?usp=drive_link)
Team Name:NEXUS_HUNTERS
MEMBERS:
1)Nishant
2)Vinay Kumar Yadav
3)Naman Chopra

# Crime Reporting Web App

## Overview
The Crime Reporting Web App is a platform that allows users to report crimes, view submitted crime data on an interactive map, and enable law enforcement to filter and analyze the reports. It integrates various technologies like Firebase, React, TypeScript, Google Maps, and Leaflet for location tracking and heatmap generation.

The web app enables users to:
- Report crimes with descriptions and image uploads.
- View a heatmap of crime locations.
- Filter and analyze reported crimes.
- Access a dashboard for law enforcement agencies to manage crime data.

## Features
- **User Reporting**: Allows users to submit crime reports with location, description, and image.
- **Crime Map**: Displays a heatmap of crime locations, where users can hover over each point for more details.
- **Law Enforcement Dashboard**: Features filtering of crime reports by time, category-based crime filtering, and detailed analysis of crime reports.
- **Firebase Integration**: Stores and fetches crime data from Firebase Realtime Database.
- **Location Autocomplete**: Uses Nominatim API for location suggestions while filling out crime reports.
- **Responsive Design**: UI components are responsive and adapt to various screen sizes, with smooth animations for the sidebar and other elements.

## Technologies Used
- **Frontend**:
  - React
  - TypeScript
  - Leaflet (for map rendering)
  - Firebase (for real-time data storage)
  - Lucide Icons (for UI components)
  - Nominatim API (for location autocomplete)

- **Backend**:
  - Firebase Realtime Database

## Features Walkthrough
1. **Crime Reporting**:
   - Users can submit a crime by entering details like type, description, and location.
   - The image upload feature allows users to upload photos related to the crime.
   
2. **Crime Heatmap**:
   - All reported crimes are shown on a map using Leaflet, displayed as a heatmap with details such as time and description.
   
3. **Law Enforcement Dashboard**:
   - Crime reports are displayed in a card layout, with filtering options based on time and category.
   - Law enforcement officers can view detailed descriptions and access data for analysis.

4. **Location Autocomplete**:
   - As users type in the location field, the app suggests locations using the Nominatim API, providing accurate suggestions for crime report submission.

5. **Firebase Realtime Database**:
   - Crime reports are saved and fetched in real-time from Firebase, ensuring that all users have access to the most up-to-date information.


## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/VnkyBeast/crime-reporting-web-app.git
   cd crime-reporting-web-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Create a Firebase project.
   - Add Firebase credentials to your project (refer to Firebase documentation for setup instructions).
   - Replace the Firebase config in your project with your own credentials.

4. **Run the App**:
   ```bash
   npm start
   ```

5. **Access the App**:
   Open your browser and go to `http://localhost:3000` to start using the Crime Reporting Web App.

## Contributions
Feel free to contribute to this project by submitting issues or pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
