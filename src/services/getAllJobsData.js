import axios from 'axios';

const getAllJobsData = async () => {
    // const apiUrl = 'http://localhost:3000/employeeAllInfo';
    // const response = await axios.get(apiUrl, {timeout: 10000});
    // return response.data;
    return [
      {id: 1, title: "FI_ACCOUNT", description: "Acountant", minSalary: 8500, maxSalary: 15000},
      {id: 2, title: "FI_ACCOUNT2", description: "Acountant2", minSalary: 8500, maxSalary: 15000},
      {id: 3, title: "FI_ACCOUNT3", description: "Acountant3", minSalary: 8500, maxSalary: 15000},
      {id: 4, title: "FI_ACCOUNT4", description: "Acountant4", minSalary: 8500, maxSalary: 15000}
    ]
  };

export default getAllJobsData;