const express = require("express");
const bodyParser = require("body-parser");
const oracledb = require("oracledb");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));

let conn;
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionString: process.env.DB_CONNECTION_STRING,
};

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

oracledb
  .getConnection(config)
  .then((connection) => {
    console.log("Connected to the DBS501 Oracle DB");
    conn = connection;
  })
  .catch((err) => {
    console.error(err.message);
  });

app.get("/employee-menu", (req, res) => {
  let sql = `SELECT * FROM HR_EMPLOYEES`;

  conn
    .execute(sql)
    .then((result) => {
      res.render("employee-menu", { employee: result.rows });
    })
    .catch((err) => {
      console.error(err.message);
    });
});
/*
app.get("/employeeAllInfo", (req, res) => {
  let sql = `
        SELECT 
            e.employee_id, e.first_name, e.last_name, e.email, e.phone_number, e.hire_date, e.salary, e.commission_pct
            m.first_name as manager_first_name, m.last_name as manager_last_name,
            j.job_title, j.min_salary, j.max_salary,
            d.department_name,
            l.street_address, l.postal_code, l.city, l.state_province,
            c.country_name,
            r.region_name
        FROM 
            hr_employees e
            LEFT JOIN hr_employees m ON e.manager_id = m.employee_id
            JOIN hr_jobs j ON e.job_id = j.job_id
            JOIN hr_departments d ON e.department_id = d.department_id
            JOIN hr_locations l ON d.location_id = l.location_id
            JOIN hr_countries c ON l.country_id = c.country_id
            JOIN hr_regions r ON c.region_id = r.region_id
            
      `;

  conn
    .execute(sql)
    .then((result) => {
      res.render("employee-all", { employee: result.rows });
    })
    .catch((err) => {
      console.error(err.message);
    });
});
*/
app.get("/employeeAllInfo", (req, res) => {
  let sql3 = `BEGIN :ret := get_employee_info(); END;`;

  conn
    .execute(sql3, { ret: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } })
    .then((result) => {
      // Fetch rows from the REF CURSOR.
      result.outBinds.ret.getRows(100, function (err, rows) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log(rows);
        res.json(rows);
        //res.render("employee-all", { employee: rows });
        result.outBinds.ret.close(function (err) {
          if (err) console.error(err.message);
        });
      });
    })
    .catch((err) => {
      console.error(err.message);
    });
});
app.post("/update-employee", (req, res) => {
  const { e_id, e_salary, e_phone, e_email } = req.body;

  let sql = `BEGIN updateEmployee(:e_id, :e_salary, :e_phone, :e_email); END;`;

  conn
    .execute(sql, { e_id, e_salary, e_phone, e_email }, { autoCommit: true })
    .then(() => {
      console.log("Employee updated successfully");
      res.send("Success");
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).send("Error updated employee");
    });
});

app.listen(3000, function () {
  console.log("Server is listening on port 3000");
});
