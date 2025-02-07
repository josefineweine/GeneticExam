How to Use the GeneticExam Project

1. Clone the Repository:
   Clone this repository to your local machine:
   git clone https://github.com/josefineweine/GeneticExam.git

2. Install Dependencies:
   Navigate to the project directory and install the necessary dependencies:
   cd GeneticExam
   npm install

3. Set Up the Environment:
   Create an .env file in the root of the project and include your metadata CID and contract address:
   METADATA_CID=QmQmpXJBCos24nPQ9FtPoiqFAFNSswuqRaP5yNfE2AMUdg (this is to be used on the Register Donor page when you are connected)
   CONTRACT_ADDRESS=0x0b54FAD894c1EFC7B190cE92D122F5E93704D04B

4. Run the Project:
   Start the application locally:
   npm start

5. Access the Project:
   Open your browser and go to http://localhost:3000 (or the URL specified in the project) to access the application.

Sure! Here's a more concise summary of the contract's functionality:

### Main Contract Handling Donor Registration and Usage Tracking:

- **Register New Donors**: 
  - Users can register new donors by providing metadata (e.g., CID) and a maximum usage limit.
  - Each donor is assigned a unique ID and the registering user is recorded as the owner.

- **Track Donor Usage**:
  - Donor usage is tracked with a `usageCount`, which is incremented each time the donor is used.

- **Enforce Usage Limits**:
  - Each donor has a `maxUsage` limit.
  - If a donor’s usage reaches the limit, the donor’s status is set to inactive, preventing further usage.

- **Manage Donor Status**:
  - Donor status (`isActive`) is updated based on usage, automatically deactivating the donor once the usage limit is reached.
