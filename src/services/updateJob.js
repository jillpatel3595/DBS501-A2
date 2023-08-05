import axios from 'axios';

const updateJob = async (payload) => {
    const apiUrl = 'http://localhost:3000/update-job';
    try {
      const response = await axios.post(apiUrl, payload);
      return response.data;
    } catch (error) {
      console.error('Error sending data:', error.message);
      return null;
    }
  };

export default updateJob;