import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import Dropdown from "../../shared/Dropdown"
import { useEffect, useState } from "react";
import getAllManagers from '../../services/getAllManagers'
import getAllDepartments from '../../services/getAllDepartments'
import getAllJobsData from "../../services/getAllJobsData";
import HireEmployee from "../../services/hireEmployee";


const Newhire = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [salary, setSalary] = useState('')
    const [email, setEmail] = useState('')
    const [hireDate, setHireDate] = useState(new Date().toJSON().slice(0, 10))
    const [job, setJob] = useState('')
    const [manager, setManager] = useState('')
    const [department, setDepartment] = useState('')
    const [managers, setManagers] = useState([])
    const [departments, setDepartments] = useState([])
    const [jobs, setJobs] = useState([])
    const [error, setError] = useState(null)
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleClick = () => {
        setOpen(true);
      };
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("")
        console.log(manager)
        const payload = {
            p_first_name: firstName,
            p_last_name: lastName,
            p_email: email,
            p_hire_date: hireDate,
            p_salary: salary,
            p_job_id: job.id,
            p_manager_id: manager.id,
            p_department_id: department.id
        }
        HireEmployee(payload).then((data) => {
            console.log("there")
            setOpen(true)
            setMessage(data.message)
            handleCancel();
        }).catch((error) => {
            console.log(error)
            console.log(error.error)
            console.log("here")
            setOpen(true)
            setError(error?.response?.data?.error ? error.response.data.error : error.message)
            setMessage(error?.response?.data?.error ? error.response.data.error : error.message)
        })
    };

    const handleCancel = () => {
        setFirstName('')
        setLastName('')
        setEmail('')
        setHireDate(new Date().toJSON().slice(0, 10))
        setJob('')
        setManager('')
        setDepartment('')
    };

    const transformJobsData = (old) => {
        return old?.map(job => {
          const id = job[0]
          const label = `${job[1]}`;
      
          return {
            label: label,
            id: id
          };
        });
      };


    const getJobsData = async () => {
        const jobsData = await getAllJobsData();
        if (jobsData){
            const conversion = transformJobsData(jobsData.jobs)
            setJobs(conversion)
        }
      };

    useEffect(() => {
        if (!jobs || jobs.length === 0){
            getJobsData();
        }
    }, [jobs])

    const transformManagerData = (old) => {
        return old?.map(manager => {
          const id = manager[0]
          const label = `${manager[1]} ${manager[2]}`;
      
          return {
            label: label,
            id: id
          };
        });
      };


    const getManagerData = async () => {
        const managersData = await getAllManagers();
        const conversion = transformManagerData(managersData)
        setManagers(conversion)
      };

    useEffect(() => {
        if (!managers || managers.length === 0){
            getManagerData();
        }
    }, [managers])

    const transformDepartments = (old) => {
        return old?.map(departments => {
          const id = departments[0]
          const label = `${departments[1]}`;
      
          return {
            label: label,
            id: id
          };
        });
      };


    const getDepartments = async () => {
        const departmentsData = await getAllDepartments();
        const conversion = transformDepartments(departmentsData)
        setDepartments(conversion)
      };

    useEffect(() => {
        if (!departments || departments.length === 0){
            getDepartments();
        }
    }, [departments])

    useEffect(()=>{
        
    }, [job, department, manager, department])

    return (
    <>
        <h2>Newhire Form</h2>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                    <TextField
                        type="text"
                        variant='outlined'
                        color='secondary'
                        label="First Name"
                        onChange={e => setFirstName(e.target.value)}
                        value={firstName}
                        fullWidth
                        required
                    />
                    <TextField
                        type="text"
                        variant='outlined'
                        color='secondary'
                        label="Last Name"
                        onChange={e => setLastName(e.target.value)}
                        value={lastName}
                        fullWidth
                        required
                    />
                </Stack>
                <TextField
                    type="email"
                    variant='outlined'
                    color='secondary'
                    label="Email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    fullWidth
                    required
                    sx={{mb: 4}}
                />
                <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                    <TextField
                        type="date"
                        variant='outlined'
                        color='secondary'
                        label="Hire Date"
                        onChange={e => setHireDate(e.target.value)}
                        value={hireDate}
                        fullWidth={true}
                        required={true}
                    />
                    <TextField
                        type="text"
                        variant='outlined'
                        color='secondary'
                        label="Salary"
                        onChange={e => setSalary(e.target.value)}
                        value={salary}
                        fullWidth
                        required
                    />
                </Stack>
                <Dropdown data={jobs || []} label={"Jobs"} fullWidth  selection={job} setSelection={setJob}/>
                <Dropdown data={managers || []} label={"Manager"} fullWidth selection={manager} setSelection={setManager}/>
                <Dropdown data={departments || []} label={"Department"} fullWidth selection={department} setSelection={setDepartment}/>
                <Stack spacing={2} sx={{marginBottom: 4, justifyContent:"center"}}>
                    <Button variant="contained" color="primary" type="submit">Hire</Button>
                    <Button variant="outlined" color="error" onClick={handleCancel}>Cancel</Button>
                </Stack>
            </form>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert severity={error && error !== "" ? "error" : "success"} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
    </>
    );
};

export default Newhire;