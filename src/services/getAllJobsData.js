import axios from 'axios';

const getAllJobsData = async () => {
    try{
      const apiUrl = 'http://localhost:3000/jobs';
      const response = await axios.get(apiUrl, {timeout: 100000});
      return response.data;
    }
    catch(error){
      return [];
    }
  };

export default getAllJobsData;