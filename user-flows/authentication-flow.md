1. Authentication Flow (The Entry Point)
Since this is a closed system, the flow starts differently than a standard app.

Step 1: User lands on the Login Page.

Step 2: User enters User ID and Password (provided offline by Admin).

Step 3: System validates credentials.

If Valid: Redirect to role-specific Dashboard (Admin/Teacher/Student).

If Invalid: Show error message "Invalid Credentials. Contact Administrator."

Step 4 (Optional Security): If it is the first login, force the user to "Change Password."