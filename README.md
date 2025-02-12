How to Set Up the GeneticExam Project (Frontend and Backend)

Clone the Repository: Clone the entire repository to your local machine: git clone https://github.com/josefineweine/GeneticExam.git

Install Dependencies for the Frontend: Navigate to the frontend directory and install the required dependencies: cd frontend npm install

Install Dependencies for the Backend: Navigate to the backend directory and install the required dependencies: cd ../geneticexam npm install

Set Up the Environment: Create an .env file in the root of the project and include your metadata CID and contract address: METADATA_CID=QmQmpXJBCos24nPQ9FtPoiqFAFNSswuqRaP5yNfE2AMUdg (this is to be used on the Register Donor page when you are connected) CONTRACT_ADDRESS=0x0b54FAD894c1EFC7B190cE92D122F5E93704D04B

Run the Project: If there are separate scripts for running the frontend and backend, run them as follows:

For Frontend: cd frontend npm start

Access the Project: Open your browser and go to the URL specified in the project (e.g., http://localhost:3000 for frontend and backend ports) to access the application.

Main Contract Handling Donor Registration and Usage Tracking:
Register New Donors:

Users can register new donors by providing metadata (e.g., CID) and a maximum usage limit.
Each donor is assigned a unique ID and the registering user is recorded as the owner.
Track Donor Usage:

Donor usage is tracked with a usageCount, which is incremented each time the donor is used.
Enforce Usage Limits:

Each donor has a maxUsage limit.
If a donor’s usage reaches the limit, the donor’s status is set to inactive, preventing further usage.
Manage Donor Status:

Donor status (isActive) is updated based on usage, automatically deactivating the donor once the usage limit is reached.
