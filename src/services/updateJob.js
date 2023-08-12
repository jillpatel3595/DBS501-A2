import axios from 'axios';

const updateJob = async (payload) => {
    const apiUrl = 'http://localhost:3000/update-job';
    console.log(payload)
    const response = await axios.put(apiUrl, payload);
    return response.data;
  };

export default updateJob;