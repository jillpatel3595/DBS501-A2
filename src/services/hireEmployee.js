import axios from 'axios';

const HireEmployee = async (payload) => {
    const apiUrl = 'http://localhost:3000/newEmployee';
    console.log(payload)
    const response = await axios.post(apiUrl, payload);
    return response.data;
  };

export default HireEmployee;