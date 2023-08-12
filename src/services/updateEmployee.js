import axios from 'axios';

const updateEmployee = async (payload) => {
    const apiUrl = 'http://localhost:3000/update-employee';
    console.log(payload);
    const response = await axios.put(apiUrl, payload);
    return response.data;
  };

export default updateEmployee;