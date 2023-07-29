const express = require('express');
const oracledb = require('oracledb');
require('dotenv').config();


const app = express();
const port = 8000;

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
      // `BEGIN
      //    INSERT INTO hr_employees (EMPLOYEE_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE_NUMBER, HIRE_DATE, JOB_ID, SALARY, MANAGER_ID, DEPARTMENT_ID)
      //    VALUES (EMPLOYEES_SEQ.NEXTVAL, '${p_first_name}', '${p_last_name}', '${p_email}', '${p_phone}', TO_DATE('${p_hire_date}', 'YY-MM-DD'), '${p_job_id}', ${p_salary}, ${p_manager_id}, ${p_department_id});
      //    COMMIT;
      //  END;`,

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
