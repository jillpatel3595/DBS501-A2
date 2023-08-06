const express = require('express');
const oracledb = require('oracledb');
require('dotenv').config();

const app = express();
const port = 3000;

const dbConfig = {
  user: process.env.user,
  password: process.env.password,
  connectString:process.env.connectString,
};

async function DBconnection() {
  try {
    await oracledb.createPool(dbConfig);
    console.log('Connected to Oracle DB');
  } catch (err) {
    console.error('Error connecting to Oracle DB:', err);
  }
}
DBconnection();
app.use(express.json());


app.post('/employee/hire', async (req, res) => {
  const {
    p_first_name,
    p_last_name,
    p_email,
    p_salary,
    p_hire_date,
    p_phone,
    p_job_id,
    p_manager_id,
    p_department_id,
  } = req.body;

  try {
    const connection = await oracledb.getConnection();
    const result = await connection.execute(
    
      `BEGIN
         Employee_hire_sp('${p_first_name}', '${p_last_name}', '${p_email}', ${p_salary}, TO_DATE('${p_hire_date}', 'YY-MM-DD'), '${p_phone}', '${p_job_id}', ${p_manager_id}, ${p_department_id});
       END;`,
      {},
      {
        autoCommit: true,
      }
    );

    connection.release();

    res.status(200).json({ message: 'Employee hired successfully.' });
  } catch (err) {
    console.error('Error inserting employee:', err);
    res.status(500).json({ error: 'Failed to hire employee.' });
  }

});

app.get('/job/title', async (req, res) => {
  try {
    const connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT * FROM hr_jobs`
    );

    connection.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'No jobs found.' });
    } else {
      res.status(200).json(result.rows);
    }
  } catch (err) {
    console.error('Error fetching job titles:', err);
    res.status(500).json({ error: 'Failed to fetch job titles.' });
  }
});


app.get('/department_id', async (req, res) => {
  try {
    const connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT * FROM hr_departments`
    );

    connection.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'No departments found.' });
    } else {
      res.status(200).json(result.rows);
    }
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ error: 'Failed to fetch departments.' });
  }
});


app.get('/manager', async (req, res) => {
  try {
    const connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT * FROM hr_employees WHERE employee_id IN (SELECT manager_id FROM hr_employees)`
    );

    connection.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'No managers found.' });
    } else {
      res.status(200).json(result.rows);
    }
  } catch (err) {
    console.error('Error fetching manager employees:', err);
    res.status(500).json({ error: 'Failed to fetch manager employees.' });
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});





