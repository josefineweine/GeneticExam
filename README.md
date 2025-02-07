How to Set Up the GeneticExam Project (Frontend and Backend)

1. Clone the Repository:
   Clone the entire repository to your local machine:
   git clone https://github.com/josefineweine/GeneticExam.git

2. Install Dependencies for the Frontend:
   Navigate to the frontend directory and install the required dependencies:
   cd frontend
   npm install

3. Install Dependencies for the Backend:
   Navigate to the backend directory and install the required dependencies:
   cd ../geneticexam
   npm install

4. Set Up the Environment:
   Create an .env file in the root of the project and include your metadata CID and contract address:
METADATA_CID=QmQmpXJBCos24nPQ9FtPoiqFAFNSswuqRaP5yNfE2AMUdg (this is to be used on the Register Donor page when you are connected)   CONTRACT_ADDRESS=0x0b54FAD894c1EFC7B190cE92D122F5E93704D04B

5. Run the Project:
   If there are separate scripts for running the frontend and backend, run them as follows:
   
   For Frontend:
   cd frontend
   npm start
   


6. Access the Project:
   Open your browser and go to the URL specified in the project (e.g., http://localhost:3000 for frontend and backend ports) to access the application.
