# Campaign Media Planning

Welcome to the Campaign Media Planning application! This tool is designed to help you optimize ad spend across various platforms like Google, Meta, and Amazon, ensuring the total campaign budget remains within the approved amount.

## Features
- Optimize ad spend using the Goal Seek algorithm.
- Calculate the maximum budget for a specific ad while accounting for agency fees, third-party tool fees, and fixed costs.
- Interactive user interface for easy input and output handling.

## Getting Started

### Prerequisites
- .NET 6.0 SDK or later
- Node.js and npm

### Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/yagizharman/Campaign-Budget-Optimizer.git
    cd Campaign-Budget-Optimizer
    ```

2. **Set up the Backend**


    - Restore the dependencies and build the project:
      ```bash
      dotnet restore
      dotnet build
      ```
    - Run the backend server:
      ```bash
      dotnet run
      ```

3. **Set up the Frontend**

    - Navigate to the `client` directory:
      ```bash
       cd .\client\
      ```
    - Install the dependencies:
      ```bash
      npm install
      ```
    - Start the frontend application
      ```bash
      npm run dev
      ```
### Usage

1. **Access the Application**
    - Open your web browser and navigate to `http://localhost:3000`.

2. **Input the Campaign Details**
    - Enter the total campaign budget (`Z`).
    - Provide the budgets for other ads as a comma-separated list.
    - Set the agency fee percentage.
    - Set the third-party tool fee percentage.
    - Enter the fixed cost for agency hours.

3. **Calculate the Maximum Budget for the Specific Ad**
    - Click the "Calculate" button.
    - The application will display the maximum budget for the target ad, along with the calculated total ad budget, agency fee, third-party fee, hourly cost, and remaining budget.
### API Reference

The backend API provides an endpoint to calculate the maximum budget for the target ad.

- **POST `/campaign/calculate`**
    - **Request Body:**
      ```json
      {
        "totalBudgetZ": 1000.0,
        "adBudgets": [100.0, 200.0, 150.0],
        "agencyFeePercentage": 10.0,
        "thirdPartyFeePercentage": 5.0,
        "fixedAgencyHoursCost": 50.0
      }
      ```
    - **Response:**
      ```json
      {
        "maxBudgetForTargetAd": 400.0,
        "totalBudget": 950.0,
        "remainingBudget": 50.0
      }
      ```
### Test Cases
To demonstrate the functionality with different target values and initial guesses, refer to the provided test case images and the descriptions below:

-Test Case 1:
![alt text](https://github.com/yagizharman/Campaign-Budget-Optimizer/blob/main/test_case_1.PNG)
-Test Case 2:
![alt text](https://github.com/yagizharman/Campaign-Budget-Optimizer/blob/main/test_case_2.PNG)
-Test Case 3:
![alt text](https://github.com/yagizharman/Campaign-Budget-Optimizer/blob/main/test_case_3.PNG)
-Test Case 4:
![alt text](https://github.com/yagizharman/Campaign-Budget-Optimizer/blob/main/test_case_4.PNG)
