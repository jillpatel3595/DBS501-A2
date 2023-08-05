import axios from 'axios';

const fetchEmployeeData = async () => {
    const apiUrl = 'http://localhost:3000/employeeAllInfo';
    const response = await axios.get(apiUrl, {timeout: 10000});
    return response.data;
  };

export default fetchEmployeeData;