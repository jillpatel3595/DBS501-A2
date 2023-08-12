const express = require("express");
const oracledb = require("oracledb");
var cors = require('cors');
require("dotenv").config();

const app = express();
const port = 3000;
app.use(cors());

const dbConfig = {
  user: process.env.user,
  password: process.env.password,
  connectString: process.env.connectString,
  // poolMin: 2, 
  // poolMax: 10, 
  // poolIncrement: 1, 
  // poolTimeout: 60, 
  queueTimeout: 120000
};

async function DBconnection() {
  try {
    await oracledb.createPool(dbConfig);
    //await oracledb.getPool("default");
    console.log("Connected to Oracle DB");
  } catch (err) {
    console.error("Error connecting to Oracle DB:", err);
  }
}
DBconnection();
app.use(express.json());
/*

*/

app.get("/job/title", async (req, res) => {
  try {
    const connection = await oracledb.getConnection();
    const result = await connection.execute(`SELECT * FROM hr_jobs`);

    connection.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: "No jobs found." });
    } else {
      res.status(200).json(result.rows);
    }
  } catch (err) {
    console.error("Error fetching job titles:", err);
    res.status(500).json({ error: "Failed to fetch job titles." });
  }
});

app.get("/department_id", async (req, res) => {
  try {
    const connection = await oracledb.getConnection();
    const result = await connection.execute(`SELECT * FROM hr_departments`);

    connection.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: "No departments found." });
    } else {
      res.status(200).json(result.rows);
    }
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ error: "Failed to fetch departments." });
  }
});

app.get("/manager", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT * FROM hr_employees WHERE employee_id IN (SELECT manager_id FROM hr_employees)`
    );
 
    connection.release();
 
    if (result.rows.length === 0) {
      res.status(404).json({ error: "No managers found." });
    } else {
      res.status(200).json(result.rows);
    }
  } catch (err) {
    console.error("Error fetching manager employees:", err);
    res.status(500).json({ error: "Failed to fetch manager employees." });
  } finally {
    // if (connection) {
    //   connection.release();
    // }
  }
});


//Sharmilenn's Code
app.post("/newEmployee", async (req, res) => {
    const {
      p_first_name,
      p_last_name,
      p_email,
      p_hire_date,
      p_salary,
      p_job_id,
      p_manager_id,
      p_department_id,
    } = req.body;
  
    let connection;
    try {
      connection = await oracledb.getConnection();
  
      const result = await connection.execute(
        `BEGIN
                 Employee_hire_sp3('${p_first_name}', '${p_last_name}', '${p_email}', TO_DATE('${p_hire_date}', 'YY-MM-DD'), ${p_salary}, '${p_job_id}', ${p_manager_id}, ${p_department_id});
               END;`,
        {},
        {
          autoCommit: true,
        }
      );
  
      res.status(200).json({ message: "Employee hired successfully." });
    } catch (err) {
      console.error("Error inserting employee:", err);
      if (err.errorNum && err.errorNum === 20100) {
        return res.status(404).json({
          error:
            "Failed to hire an employee due to an invalid parameter. Invalid salary",
        });
      } else if (err.errorNum && err.errorNum === 1841) {
        return res.status(404).json({
          error:
            "Failed to hire an employee invalid year or no hire date value entered.",
        });
      } else if (err.errorNum && err.errorNum === 1) {
        return res.status(404).json({
          error: "Failed to hire an employee. Unique constraint.",
        });
      }
      res.status(500).json({ error: "Failed to hire employee." });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  });
  app.get("/employeeAllInfo", async (req, res) => {
    let sql = `
            SELECT
                e.employee_id, e.first_name, e.last_name, e.email, e.phone_number, e.hire_date, e.salary, e.commission_pct,
                j.job_title, j.min_salary, j.max_salary,
                d.department_name,
                l.street_address, l.postal_code, l.city, l.state_province,
                c.country_name,
                r.region_name
            FROM
                hr_employees e
                JOIN hr_jobs j ON e.job_id = j.job_id
                JOIN hr_departments d ON e.department_id = d.department_id
                JOIN hr_locations l ON d.location_id = l.location_id
                JOIN hr_countries c ON l.country_id = c.country_id
                JOIN hr_regions r ON c.region_id = r.region_id
          `;
    const connection = await oracledb.getConnection();
    const result = await connection
      .execute(sql)
      .then((result) => {
        //res.render("employee-all", { employee: result.rows });
        res.json({ employees: result.rows });
      })
      .catch((err) => {
        console.error(err.message);
      });
  });

  app.put("/update-employee", async (req, res) => {
    const { EMPLOYEE_ID, SALARY, EMAIL, PHONE_NUMBER } = req.body;
    try {
      const sql6 = `
                UPDATE hr_employees SET
                EMAIL = :EMAIL,
                PHONE_NUMBER = :PHONE_NUMBER,
                SALARY = :SALARY
                WHERE EMPLOYEE_ID = :EMPLOYEE_ID
            `;
      const connection = await oracledb.getConnection();
      const result = await connection.execute(
        sql6,
        {
          EMAIL,
          PHONE_NUMBER,
          SALARY,
          EMPLOYEE_ID,
        },
        { autoCommit: true }
      );
      res.status(200).json({ message: "Employee updated successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update employee." });
    } finally{
      connection.release();
    }
  });
  
   
  
  app.put("/update-job", async (req, res) => {
  
    const { JOB_ID, JOB_TITLE, MIN_SALARY, MAX_SALARY } = req.body;
  
   
  
    try {
  
      const sql7 = `
  
                UPDATE hr_jobs SET
  
                JOB_TITLE = :JOB_TITLE,
  
                MIN_SALARY = :MIN_SALARY,
  
                MAX_SALARY = :MAX_SALARY
  
                WHERE JOB_ID = :JOB_ID
  
            `;
  
   
  
      const connection = await oracledb.getConnection();
  
      const result = await connection.execute(
  
        sql7,
  
        {
  
          JOB_TITLE,
  
          MIN_SALARY,
  
          MAX_SALARY,
  
          JOB_ID,
  
        },
  
        { autoCommit: true }
  
      );
  
   
  
      res.status(200).json({ message: "Job updated successfully." });
  
    } catch (err) {
  
      console.error(err);
  
      res.status(500).json({ error: "Failed to Job employee." });
  
    }
  
  });

app.get("/jobs", async (req, res) => {
  let sql4 = `SELECT * FROM HR_JOBS`;

  const connection = await oracledb.getConnection();
  const result = await connection
    .execute(sql4)
    .then((result) => {
      console.log(result.rows);
      //res.render("jobs", { jobs: result.rows });
      res.json({ jobs: result.rows });
    })
    .catch((err) => {
      console.error(err.message);
    });
});

app.post("/new-job", async (req, res) => {
  const { JOB_ID, JOB_TITLE, MIN_SALARY } = req.body;

  try {
    const sql9 = `BEGIN new_job(:JOB_ID, :JOB_TITLE, :MIN_SALARY); END;`;

    const connection = await oracledb.getConnection();
    const result = await connection.execute(
      sql9,
      {
        JOB_ID,
        JOB_TITLE,
        MIN_SALARY,
      },
      { autoCommit: true }
    );

    res.status(201).json({ message: "Job created successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create job." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
