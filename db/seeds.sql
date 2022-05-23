INSERT INTO department (name)
VALUES
('Marketing'),
('Finance'),
('Operations'),
('HR'),
('IT');

INSERT INTO role (title, salary, department_id)
VALUES
('SEO Specialist', 48000, 1),
('Marketing Analyst', 58000, 1),
('Social Media Manager', 52000, 1),
('Project Manager', 65000, 1),
('Accountant', 52000, 2),
('Chief Finance Officer', 140000, 2),
('Financial Analyst', 62000, 2),
('Auditor', 60000, 2),
('Operations Manager', 68000, 3),
('Logistician', 53000, 3),
('Operations Analyst', 59000, 3),
('Maintenace Tech', 48000, 3),
('HR Director', 90000, 4),
('Recruiting Manager', 77000, 4),
('Payroll Administrator', 53000, 4),
('Chief Diversity Officer', 129000, 4),
('Chief Information Officer', 169000, 5),
('Software Engineer', 87000, 5),
('Cybersecurity Specialist', 98000, 5),
('Helpdesk Support Specialist', 46000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Bill', 'Gates', 1, 3),
('Tom', 'Cruise', 7, NULL),
('Melanie', 'Safka', 13, 4),
('Tom', 'Holland', 8, NULL),
('Josh', 'Brolin', 15, 4),
('James', 'Franco', 5, NULL),
('Seth', 'Rogen', 11, 6),
('Will', 'Smith', 9, NULL),
('Aubrey', 'Graham', 7, 2),
('Elon', 'Musk', 4, NULL);