import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import Dropdown from "../../shared/Dropdown";
import updateJob from '../../services/updateEmployee';
import getAllJobsData from './../../services/getAllJobsData';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

function Jobs() {
  const [id, setId] = useState(null);
  const [job, setJob] = useState({});
  const [description, setDescription] = useState(null);
  const [title, setTitle] = useState(null);
  const [minSalary, setMinSalary] = useState(null);
  const [maxSalary, setMaxSalary] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [newJob, setNewJob] = useState(false)

  const transformData = (old) => {
    return old?.map(employee => {
      const id = employee.id
      const description = employee.description;
      const title = employee.title;
      const minSalary = employee.minSalary;
      const maxSalary = employee.maxSalary;
  
      return {
        label: `${title}, ${description}, ${minSalary}, ${maxSalary}`,
        description,
        title,
        minSalary,
        maxSalary,
        id
      };
    });
  };

  const getJobsData = async () => {
    const jobsData = await getAllJobsData().catch((reason) => {setError(reason.message)});
    setJobs(jobsData)
    const conversion = transformData(jobsData)
    setData(conversion)
  };

  useEffect(()=> {
    console.log(error)
    if (!jobs && !error){
      getJobsData();
    }
  }, [jobs, data, error])

  const handleSubmit = (e) => {
    e.preventDefault();
    updateJob({})
  };

  const handleCancel = () => {
    setJob({});
  };

  useEffect(() => {
    if (job && job.label) {
      setId(job.id);
      setDescription(job.description);
      setTitle(job.title);
      setMinSalary(job.minSalary);
      setMaxSalary(job.maxSalary);
    } else {
      setSelectionNull();
    }
  }, [job]);

  const setSelectionNull = () => {
    setId(null)
    setDescription(null);
    setTitle(null);
    setMinSalary(null);
    setMaxSalary(null);
    setJob({})
  }

  const updateNewJob = () => {
    if(!newJob){
      setSelectionNull();
    }
    setNewJob(!newJob);
  }

  return (
    <>
      <Stack spacing={2} direction="row" sx={{ marginBottom: 0 }}>
        <h2>Jobs</h2>
        <div style={{height: "10px", marginTop: "18px"}}>
          <IconButton aria-label="add" size="md" color="primary" onClick={updateNewJob}>
            {!newJob ? <AddBoxIcon fontSize="inherit" /> :
            <DisabledByDefaultIcon fontSize="inherit" />}
          </IconButton>
        </div>
      </Stack>
      {data ? <>
      {!newJob && <Dropdown data={data} label={"Jobs"} fullWidth selection={job} setSelection={setJob} />}
      {(job && job.label) || newJob ? (
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Job ID"
              onChange={(e) => setId(e.target.value)}
              value={id || ""}
              fullWidth
              required
            />
            <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              fullWidth
              required
            />
          </Stack>
          <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description || ""}
              fullWidth
              required
              sx={{ mb: 4 }}
            />
          <TextField
            type="text"
            variant="outlined"
            color="secondary"
            label="Min Salary"
            onChange={(e) => setMinSalary(e.target.value)}
            value={minSalary || ""}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <TextField
              type="text"
              variant="outlined"
              color="secondary"
              label="Max Salary"
              onChange={(e) => setMaxSalary(e.target.value)}
              value={maxSalary || ""}
              fullWidth
              required
              sx={{ mb: 4 }}
            />
          <Stack spacing={2} sx={{ marginBottom: 4, justifyContent: "center"}}>
            <Button variant="contained" color="primary" type="submit">
              {newJob ? "Add" : "Update"}
            </Button>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          </Stack>
        </form>
      ) : (<></>)
      }
      </>: !error ? <CircularProgress /> : <Dropdown data={[]} label={"Jobs"} fullWidth selection={job} setSelection={setJob} />}
    </>
  );
}

export default Jobs;
