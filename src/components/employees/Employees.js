import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import Dropdown from "../../shared/Dropdown";

function Employees() {
  const [employee, setEmployee] = useState({});
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [hireDate, setHireDate] = useState(new Date().toJSON().slice(0, 10));
  const [job, setJob] = useState(null);
  const [manager, setManager] = useState(null);
  const [department, setDepartment] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("firstName", firstName);
    console.log("lastName", lastName);
    console.log("email", email);
    console.log("hireDate", hireDate);
    console.log("job", job?.label);
    console.log("manager", manager?.label);
    console.log("department", department?.label);
  };

  const handleCancel = () => {
    setEmployee({});
  };

  const data1 = [
    { label: "IT Admin" },
    { label: "IT Manager" },
    { label: "Social Media Manager" },
    { label: "CEO" },
    { label: "HR" },
  ];

  const data2 = [
    { label: "Jim Brown" },
    { label: "John Smith" },
    { label: "Mark Bok" },
    { label: "John Snow" },
  ];

  const data3 = [
    { label: "Sales" },
    { label: "Marketing" },
    { label: "System Integration" },
    { label: "Software Deployment" },
  ];

  const data4 = [
    { label: "Jim Hooks", firstName: "Jim", lastName: "Hooks", email: "jh@email.com", hireDate: "2023-07-20", job: "IT Admin", manager: "Jim Brown", department: "Sales" },
    { label: "Joe Roe", firstName: "Joe", lastName: "Roe", email: "jr@email.com", hireDate: "2023-07-20", job: "IT Admin", manager: "Jim Brown", department: "Sales" },
    { label: "Tim Rooks", firstName: "Tim", lastName: "Rooks", email: "tr@email.com", hireDate: "2023-07-20", job: "HR", manager: "Jim Brown", department: "Marketing" },
    { label: "John Doe", firstName: "John", lastName: "Doe", email: "jd@email.com", hireDate: "2023-07-20", job: "CEO", manager: "Jim Brown", department: "Software Deployment" },
  ];

  useEffect(() => {
    if (employee && employee.label) {
      setFirstName(employee.firstName);
      setLastName(employee.lastName);
      setEmail(employee.email);
      setHireDate(employee.hireDate);
      setJob({ label: employee.job });
      setManager({ label: employee.manager });
      setDepartment({ label: employee.department });
    } else {
      setFirstName(null);
      setLastName(null);
      setEmail(null);
      setHireDate(new Date().toJSON().slice(0, 10));
      setJob(null);
      setManager(null);
      setDepartment(null);
    }
  }, [employee]);

  return (
    <>
      <h2>Employees Form</h2>
      <Dropdown data={data4} label={"Employee"} fullWidth selection={employee} setSelection={setEmployee} />
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
              required
            />
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName || ""}
              fullWidth
              required
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
            type="date"
            variant="outlined"
            color="secondary"
            label="Hire Date"
            onChange={(e) => setHireDate(e.target.value)}
            value={hireDate}
            fullWidth={true}
            required={true}
            sx={{ mb: 4 }}
          />
          <Dropdown data={data1} label={"Jobs"} fullWidth required selection={job} setSelection={setJob} />
          <Dropdown data={data2} label={"Manager"} fullWidth selection={manager} setSelection={setManager} />
          <Dropdown data={data3} label={"Department"} fullWidth selection={department} setSelection={setDepartment} />
          <Stack spacing={2} sx={{ marginBottom: 4, justifyContent: "center" }}>
            <Button variant="contained" color="primary" type="submit">
              Update
            </Button>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          </Stack>
        </form>
      ) : (
        <></>
      )}
    </>
  );
}

export default Employees;
