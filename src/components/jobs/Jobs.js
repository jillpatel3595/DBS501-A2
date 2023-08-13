import React, { useEffect, useState } from "react";
import { Alert, Button, CircularProgress, Snackbar, Stack, TextField } from "@mui/material";
import Dropdown from "../../shared/Dropdown";
import updateJob from '../../services/updateJob';
import getAllJobsData from './../../services/getAllJobsData';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import addNewJob from './../../services/addNewJob';

function Jobs() {
  const [id, setId] = useState(null);
  const [job, setJob] = useState({});
  const [description, setDescription] = useState(null);
  const [minSalary, setMinSalary] = useState(null);
  const [maxSalary, setMaxSalary] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [newJob, setNewJob] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
    return;
    }

    setOpen(false);
  };

  const transformData = (old) => {
    return old?.map(jobs => {
      const id = jobs[0]
      const description = jobs[1];
      const minSalary = jobs[2];
      const maxSalary = jobs[3];
  
      return {
        label: `${description}`,
        description,
        minSalary,
        maxSalary,
        id
      };
    });
  };

  const getJobsData = async () => {
    const jobsData = await getAllJobsData().catch((reason) => {setError(reason.message)});
    if (jobsData){
      setJobs(jobsData.jobs)
      const conversion = transformData(jobsData.jobs)
      setData(conversion)
    }
  };

  useEffect(()=> {
    console.log(error)
    if (!jobs && !error){
      getJobsData();
    }
  }, [jobs, data, error])

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("")
    if (newJob){
      addNewJob(
        {JOB_ID: id, JOB_TITLE: description, MIN_SALARY: minSalary, MAX_SALARY: maxSalary}
      ).then((data)=>{
        getJobsData();
        setMessage(data.message)
        setOpen(true);
      }).catch((error)=>{
        getJobsData();
        setError(error?.response?.data?.error ? error.response.data.error : error.message)
        setMessage(error?.response?.data?.error ? error.response.data.error : error.message)
        setOpen(true);
      })
    }
    else{
      updateJob(
        {JOB_ID: id, JOB_TITLE: description, MIN_SALARY: minSalary, MAX_SALARY: maxSalary}
      ).then((data)=>{
        getJobsData();
        setMessage(data.message)
        setOpen(true);
      }).catch((error)=>{
        getJobsData();
        setError(error?.response?.data?.error ? error.response.data.error : error.message)
        setMessage(error?.response?.data?.error ? error.response.data.error : error.message)
        setOpen(true);
      })
    }
  };

  const handleCancel = () => {
    setJob({});
  };

  useEffect(() => {
    if (!newJob){
      if (job && job.label) {
        setId(job.id);
        setDescription(job.description);
        setMinSalary(job.minSalary);
        setMaxSalary(job.maxSalary);
      } else {
        setSelectionNull();
      }
    }
  }, [job, newJob]);

  const setSelectionNull = () => {
    setId(null)
    setDescription(null);
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

  useEffect(()=>{},[jobs, data])

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
          <TextField
            type="text"
            variant="outlined"
            color="secondary"
            label="Job ID"
            onChange={(e) => setId(e.target.value)}
            value={id || ""}
            fullWidth
            required
            sx={{ mb: 4 }}
            disabled={newJob ? false : true}
          />
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
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert severity={error && error !== "" ? "error" : "success"} sx={{ width: '100%' }}>
              {message}
          </Alert>
      </Snackbar>
    </>
  );
}

export default Jobs;
