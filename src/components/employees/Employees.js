import React, { useEffect, useState } from "react";
import { Alert, Button, CircularProgress, Snackbar, Stack, TextField } from "@mui/material";
import Dropdown from "../../shared/Dropdown";
import fetchEmployeeData from "../../services/getAllEmployees";
import updateEmployee from '../../services/updateEmployee';

function Employees() {
  const [id, setId] = useState(null);
  const [employee, setEmployee] = useState({});
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(new Date().toJSON().slice(0, 10));
  const [salary, setSalary] = useState(null);
  const [employees, setEmployees] = useState(null);
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
    return;
    }

    setOpen(false);
  };

  const transformData = (old) => {
    return old?.map(employee => {
      const id = employee[0]
      const firstName = employee[1];
      const lastName = employee[2];
      const email = employee[3];
      const phone = employee[4];
      const salary = employee[6];
  
      return {
        label: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        phone,
        salary,
        id
      };
    });
  };

  const getEmployeeData = async () => {
    const employeeData = await fetchEmployeeData().catch((reason) => {setError(reason.message)});
    if (employeeData){
      setEmployees(employeeData.employees)
      const conversion = transformData(employeeData.employees)
      setData(conversion)
    }
  };

  useEffect(()=> {
    console.log(error)
    if (!employees && !error){
      getEmployeeData();
    }
  }, [employees, data, error])

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("")
    updateEmployee(
      {EMPLOYEE_ID: id, EMAIL: email, PHONE_NUMBER: phone, SALARY: salary}
    ).then((data) => {
      getEmployeeData();
      setMessage(data.message)
      setOpen(true);
      handleCancel();
    }).catch((error) => {
      setError(error.message)
      setMessage(error?.response?.data?.message ? error.response.data.message : error.message)
      setOpen(true);
    })
  };

  const handleCancel = () => {
    setEmployee({});
  };

  useEffect(() => {
    if (employee && employee.label) {
      setId(employee.id);
      setFirstName(employee.firstName);
      setLastName(employee.lastName);
      setEmail(employee.email);
      setPhone(employee.phone);
      setSalary(employee.salary);
    } else {
      setId(null)
      setFirstName(null);
      setLastName(null);
      setEmail(null);
      setPhone(null);
      setSalary(null);
    }
  }, [employee]);

  return (
    <>
      <h2>Employees Form</h2>
      {data ? <>
      <Dropdown data={data} label={"Employee"} fullWidth selection={employee} setSelection={setEmployee} />
      {employee && employee.label ? (
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName || ""}
              fullWidth
              disabled
            />
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName || ""}
              fullWidth
              disabled
            />
          </Stack>
          <TextField
            type="email"
            variant="outlined"
            color="secondary"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email || ""}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Phone"
              onChange={(e) => setPhone(e.target.value)}
              value={phone || ""}
              fullWidth
              required
            />
          <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Salary"
              onChange={(e) => setSalary(e.target.value)}
              value={salary || ""}
              fullWidth
              required
              sx={{marginTop: "32px"}}
            />
          <Stack spacing={2} sx={{ marginBottom: 4, justifyContent: "center", paddingTop: "24px" }}>
            <Button variant="contained" color="primary" type="submit">
              Update
            </Button>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          </Stack>
        </form>
      ) : (<></>)
      }
      </>: !error ? <CircularProgress /> : <Dropdown data={[]} label={"Employee"} fullWidth selection={employee} setSelection={setEmployee} />}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert severity={error && error !== "" ? "error" : "success"} sx={{ width: '100%' }}>
              {message}
          </Alert>
      </Snackbar>
    </>
  );
}

export default Employees;
