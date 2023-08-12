import axios from 'axios';

const getAllManagers = async () => {
    try{
        const apiUrl = 'http://localhost:3000/manager';
        const response = await axios.get(apiUrl, {timeout: 100000});
        return response.data;
    }
    catch(error){
        return [];
    }
}

export default getAllManagers;