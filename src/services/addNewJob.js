import axios from 'axios';

const addNewJob = async (payload) => {
    const apiUrl = 'http://localhost:3000/new-job';
    console.log(payload)
    const response = await axios.post(apiUrl, payload);
    return response.data;
  };

export default addNewJob;