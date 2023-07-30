import { Box, Button, Stack, TextField } from "@mui/material";
import Dropdown from "../../shared/Dropdown"
import { useEffect, useState } from "react";


const Newhire = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [hireDate, setHireDate] = useState(new Date().toJSON().slice(0, 10))
    const [job, setJob] = useState('')
    const [manager, setManager] = useState('')
    const [department, setDepartment] = useState('')

    const handleSubmit = () => {
        console.log("firstName", firstName)
        console.log("lastName", lastName)
        console.log("email", email)
        console.log("hireDate", hireDate)
        console.log("job", job.label)
        console.log("manager", manager.label)
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
    
    const data1 = [
        {label: "IT Admin"},
        {label: "IT Manager"},
        {label: "Social Media Manager"},
        {label: "CEO"},
        {label: "HR"}
    ]

    const data2 = [
        {label: "Jim Brown"},
        {label: "John Smith"},
        {label: "Mark Bok"},
        {label: "Jogn Snow"},
    ]

    const data3 = [
        {label: "Sales"},
        {label: "Marketing"},
        {label: "System Integration"},
        {label: "Software Deployment"},
    ]

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
                <TextField
                    type="date"
                    variant='outlined'
                    color='secondary'
                    label="Hire Date"
                    onChange={e => setHireDate(e.target.value)}
                    value={hireDate}
                    fullWidth={true}
                    required={true}
                    sx={{mb: 4}}
                />
                <Dropdown data={data1} label={"Jobs"} fullWidth required selection={job} setSelection={setJob}/>
                <Dropdown data={data2} label={"Manager"} fullWidth selection={manager} setSelection={setManager}/>
                <Dropdown data={data3} label={"Department"} fullWidth selection={department} setSelection={setDepartment}/>
                <Stack spacing={2} sx={{marginBottom: 4, justifyContent:"center"}}>
                    <Button variant="contained" color="primary" type="submit">Hire</Button>
                    <Button variant="outlined" color="error" onClick={handleCancel}>Cancel</Button>
                </Stack>
            </form>
    </>
    );
};

export default Newhire;