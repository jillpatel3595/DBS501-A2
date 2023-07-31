CREATE OR REPLACE FUNCTION get_employee_info 
RETURN SYS_REFCURSOR 
AS 
  info_cursor SYS_REFCURSOR;
BEGIN
  OPEN info_cursor FOR
    SELECT 
        e.employee_id, e.first_name, e.last_name, e.email, e.phone_number, e.hire_date, e.salary, e.commission_pct,
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
        JOIN hr_regions r ON c.region_id = r.region_id;
  
  RETURN info_cursor;
END get_employee_info;







