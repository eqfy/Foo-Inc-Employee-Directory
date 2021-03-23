CREATE TABLE "LocationCompany" (
    "CompanyCode" varchar(2) PRIMARY KEY NOT NULL,
    "Label" varchar(20) NOT NULL
);

CREATE TABLE "ManagerLocationCompany"(
    "ManagerEmployeeNumber" varchar(10) NOT NULL,
    "CompanyCode" varchar(2) PRIMARY KEY NOT NULL
);

CREATE TABLE "LocationOffice" (
    "CompanyCode" varchar(2) NOT NULL,
    "OfficeCode" varchar(2) NOT NULL,
    "Label" varchar(20) NOT NULL,
    PRIMARY KEY ("CompanyCode", "OfficeCode")
);

CREATE TABLE "ManagerLocationOffice"(
    "OfficeCode" varchar(2) NOT NULL,
    "CompanyCode" varchar(2) NOT NULL,
    "ManagerEmployeeNumber" varchar(10) NOT NULL,
    PRIMARY KEY ("CompanyCode", "OfficeCode")
);

CREATE TABLE "LocationGroup" (
    "CompanyCode" varchar(2) NOT NULL,
    "OfficeCode" varchar(2) NOT NULL,
    "GroupCode" varchar(2) NOT NULL,
    "Label" varchar(20) NOT NULL,
    PRIMARY KEY ("CompanyCode", "OfficeCode", "GroupCode")
);

CREATE TABLE "ManagerLocationGroup"(
    "CompanyCode" varchar(2) NOT NULL,
    "OfficeCode" varchar(2) NOT NULL,
    "GroupCode" varchar(2) NOT NULL,
    "ManagerEmployeeNumber" varchar(10) NOT NULL,
    PRIMARY KEY ("CompanyCode", "OfficeCode", "GroupCode")
);

CREATE TABLE "LocationPhysical" (
    "PhysicalLocationId" varchar(20) PRIMARY KEY NOT NULL,
    "Label" varchar(100) NOT NULL,
    "SortValue" varchar(100) NOT NULL
);

CREATE TABLE "SkillCategory" (
    "SkillCategoryId" varchar(20) PRIMARY KEY NOT NULL,
    "Label" varchar(100) NOT NULL,
    "SortValue" varchar(10) NOT NULL
);

CREATE TABLE "Skill" (
    "SkillCategoryId" varchar(32) NOT NULL,
    "SkillId" varchar(32) NOT NULL,
    "Label" varchar(100) NOT NULL,
    "SortValue" varchar(10) NOT NULL,
    PRIMARY KEY ("SkillCategoryId", "SkillId")
);

CREATE TABLE "Employee" (
    "EmployeeNumber" varchar(10) PRIMARY KEY NOT NULL,
    "CompanyCode" varchar(2) NOT NULL,
    "OfficeCode" varchar(2) NOT NULL,
    "GroupCode" varchar(2) NOT NULL,
    "LastName" varchar(50),
    "FirstName" varchar(25),
    "EmploymentType" varchar(10),
    "Title" varchar(50),
    "HireDate" date,
    "TerminationDate" date,
    "SupervisorEmployeeNumber" varchar(10) NOT NULL,
    "YearsPriorExperience" numeric(3,1),
    "Email" varchar(50),
    "WorkPhone" varchar(24),
    "WorkCell" varchar(24),
    "PhysicalLocationId" varchar(20) NOT NULL,
    "PhotoUrl" varchar(255),
    "isContractor" boolean NOT NULL DEFAULT false
);

CREATE SEQUENCE "public".contractorseq;

CREATE TABLE "EmployeeSkills" (
    "EmployeeNumber" varchar(10) NOT NULL,
    "SkillCategoryId" varchar(32) NOT NULL,
    "SkillId" varchar(32) NOT NULL,
    PRIMARY KEY ("EmployeeNumber", "SkillCategoryId", "SkillId")
);



ALTER TABLE "ManagerLocationOffice" ADD FOREIGN KEY ("OfficeCode", "CompanyCode") REFERENCES "LocationOffice" ("OfficeCode", "CompanyCode");

ALTER TABLE "LocationOffice" ADD FOREIGN KEY ("CompanyCode") REFERENCES "LocationCompany" ("CompanyCode");

ALTER TABLE "Employee" ADD FOREIGN KEY ("PhysicalLocationId") REFERENCES "LocationPhysical" ("PhysicalLocationId");

ALTER TABLE "Employee" ADD FOREIGN KEY ("GroupCode", "OfficeCode", "CompanyCode") REFERENCES "LocationGroup" ("GroupCode", "OfficeCode", "CompanyCode");

ALTER TABLE "Employee" ADD FOREIGN KEY ("SupervisorEmployeeNumber") REFERENCES "Employee" ("EmployeeNumber");

ALTER TABLE "ManagerLocationCompany" ADD FOREIGN KEY ("CompanyCode") REFERENCES "LocationCompany" ("CompanyCode");

ALTER TABLE "ManagerLocationGroup" ADD FOREIGN KEY ("GroupCode", "OfficeCode", "CompanyCode") REFERENCES "LocationGroup" ("GroupCode", "OfficeCode", "CompanyCode");

ALTER TABLE "LocationGroup" ADD FOREIGN KEY ("OfficeCode", "CompanyCode") REFERENCES "LocationOffice" ("OfficeCode", "CompanyCode");

ALTER TABLE "Skill" ADD FOREIGN KEY ("SkillCategoryId") REFERENCES "SkillCategory" ("SkillCategoryId");

ALTER TABLE "EmployeeSkills" ADD FOREIGN KEY ("SkillCategoryId") REFERENCES "SkillCategory" ("SkillCategoryId");

ALTER TABLE "EmployeeSkills" ADD FOREIGN KEY ("SkillId", "SkillCategoryId") REFERENCES "Skill" ("SkillId", "SkillCategoryId");

ALTER TABLE "EmployeeSkills" ADD FOREIGN KEY ("EmployeeNumber") REFERENCES "Employee" ("EmployeeNumber");





INSERT INTO "LocationCompany" ("CompanyCode", "Label") VALUES ('01', 'Acme Seeds Inc.');
INSERT INTO "LocationCompany" ("CompanyCode", "Label") VALUES ('02', 'Acme Planting Ltd.');
INSERT INTO "LocationCompany" ("CompanyCode", "Label") VALUES ('03', 'Acme Harvesting Ltd.');

INSERT INTO "LocationOffice" ("CompanyCode", "OfficeCode", "Label") VALUES ('01', '01', 'Corporate');
INSERT INTO "LocationOffice" ("CompanyCode", "OfficeCode", "Label") VALUES ('02', '01', 'Vancouver');
INSERT INTO "LocationOffice" ("CompanyCode", "OfficeCode", "Label") VALUES ('02', '02', 'Victoria');
INSERT INTO "LocationOffice" ("CompanyCode", "OfficeCode", "Label") VALUES ('03', '03', 'Kelowna');
INSERT INTO "LocationOffice" ("CompanyCode", "OfficeCode", "Label") VALUES ('03', '04', 'Prince George');



INSERT INTO "LocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "Label") VALUES ('01', '01', '01', 'Administration');
INSERT INTO "LocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "Label") VALUES ('01', '01', '02', 'Marketing');
INSERT INTO "LocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "Label") VALUES ('01', '01', '03', 'Sales');
INSERT INTO "LocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "Label") VALUES ('01', '01', '04', 'Accounting');
INSERT INTO "LocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "Label") VALUES ('01', '01', '05', 'Human Resources');

INSERT INTO "LocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "Label") VALUES ('02', '01', '02', 'Administration');
INSERT INTO "LocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "Label") VALUES ('02', '01', '03', 'Marketing');
INSERT INTO "LocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "Label") VALUES ('02', '02', '04', 'Sales');
INSERT INTO "LocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "Label") VALUES ('02', '02', '05', 'Service');

INSERT INTO "LocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "Label") VALUES ('03', '03', '03', 'Administration');
INSERT INTO "LocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "Label") VALUES ('03', '03', '04', 'Marketing & Sales');
INSERT INTO "LocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "Label") VALUES ('03', '03', '05', 'Distribution');
INSERT INTO "LocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "Label") VALUES ('03', '04', '08', 'Operations');

INSERT INTO "LocationPhysical" ("PhysicalLocationId", "Label", "SortValue") VALUES ('GHHDT1H7', 'Vancouver', 'A');
INSERT INTO "LocationPhysical" ("PhysicalLocationId", "Label", "SortValue") VALUES ('TH8LF9', 'Victoria', 'B');
INSERT INTO "LocationPhysical" ("PhysicalLocationId", "Label", "SortValue") VALUES ('LDFS8F3DDS', 'Kelowna', 'C');
INSERT INTO "LocationPhysical" ("PhysicalLocationId", "Label", "SortValue") VALUES ('JGH7T', 'Prince George', 'D');

INSERT INTO "SkillCategory" ("SkillCategoryId", "Label", "SortValue") VALUES ('1', 'Agriculture', 'A');
INSERT INTO "SkillCategory" ("SkillCategoryId", "Label", "SortValue") VALUES ('2', 'Accounting', 'A');
INSERT INTO "SkillCategory" ("SkillCategoryId", "Label", "SortValue") VALUES ('3', 'Management', 'A');
INSERT INTO "SkillCategory" ("SkillCategoryId", "Label", "SortValue") VALUES ('4', 'Marketing & Sales', 'A');

INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('1', '1', 'Planting', 'B');
INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('1', '2', 'Harvesting', 'E');
INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('1', '3', 'Fertilizing', 'C');
INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('1', '4', 'Irrigating', 'D');
INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('1', '5', 'Soil Preparation', 'A');

INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('2', '1', 'Transaction Processing', 'A');
INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('2', '2', 'Reconciling', 'A');
INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('2', '3', 'Auditing', 'A');

INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('3', '1', 'Planning', 'A');
INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('3', '2', 'Budgeting', 'A');
INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('3', '3', 'Performance Reviews', 'A');

INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('4', '1', 'Preparing Marketing Materials', 'A');
INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('4', '2', 'Customer Service', 'A');
INSERT INTO "Skill" ("SkillCategoryId", "SkillId", "Label", "SortValue") VALUES ('4', '3', 'Marketing Strategies', 'A');

INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('10001', '01', '01', '01', 'Acme', 'Susan', 'Salary', 'President and CEO', '1995-06-01', NULL,
                      '10001', 11.2, 'acmes@acme.ca', '604-123-4567', '604-123-7654', 'GHHDT1H7', 'some-url/acmes.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('10002', '01', '01', '01', 'Johnson', 'Jill', 'Salary', 'COO', '1997-02-15', NULL,
                      '10001', 2.0, 'johnsonj@acme.ca', '604-123-5678', '604-123-8765', 'GHHDT1H7', 'some-url/johnsonj.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('10003', '01', '01', '02', 'Sampson', 'Saul', 'Salary', 'Manager-Marketing', '1999-10-01', NULL,
                      '10002', 0.0, 'sampsons@acme.ca', '604-123-4567', '604-123-7654', 'GHHDT1H7', 'some-url/sampsons.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('10004', '01', '01', '03', 'Da Silva', 'Gregore', 'Salary', 'Manager-Sales', '1998-02-01', NULL,
                      '10002', 2.1, 'dasilvag@acme.ca', '604-123-4567', '604-123-7654', 'GHHDT1H7', 'some-url/dasilvag.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('10005', '01', '01', '05', 'Conner', 'Connie', 'Salary', 'Manager-HR/Accounting', '1997-05-28', NULL,
                      '10002', 3.2, 'connerc@acme.ca', '604-123-4567', '604-123-7654', 'GHHDT1H7', 'some-url/connerc.jpg');

INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('20006', '02', '01', '02', 'Broadfoot', 'Brad', 'Salary', 'General Manager', '2001-05-28', NULL,
                      '10002', 3.2, 'broadfootb@acme.ca', '604-123-4567', '604-123-7654', 'GHHDT1H7', 'some-url/broadfootb.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('20002', '02', '01', '02', 'Smithers', 'Sam', 'Salary', 'Operations Manager', '2002-05-28', NULL,
                      '20006', 3.2, 'smitherss@acme.ca', '604-123-4567', '604-123-7654', 'TH8LF9', 'some-url/smitherss.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('20003', '02', '01', '03', 'Jones', 'Owen', 'Salary', 'Manager-Marketing', '2003-05-28', NULL,
                      '20006', 3.2, 'joneso@acme.ca', '604-123-4567', '604-123-7654', 'GHHDT1H7', 'some-url/joneso.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('20004', '02', '02', '04', 'Westerson', 'Wally', 'Salary', 'Manager-Sales', '2004-05-28', NULL,
                      '20006', 3.2, 'westersonw@acme.ca', '604-123-4567', '604-123-7654', 'TH8LF9', 'some-url/westersonw.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('20005', '02', '02', '05', 'Masters', 'Mark', 'Salary', 'Manager-Service', '2005-05-28', NULL,
                      '20006', 3.2, 'mastersm@acme.ca', '604-123-4567', '604-123-7654', 'TH8LF9', 'some-url/mastersm.jpg');

INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('30015', '03', '03', '03', 'Ameras', 'Annie', 'Salary', 'General Manager', '2011-05-28', NULL,
                      '10002', 3.2, 'amerasa@acme.ca', '604-123-4567', '604-123-7654', 'LDFS8F3DDS', 'some-url/amerasa.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('30008', '03', '03', '03', 'Lons', 'Lesley', 'Salary', 'Office Manager - Kelowna', '2012-05-28', NULL,
                      '30015', 3.2, 'lonsl@acme.ca', '604-123-4567', '604-123-7654', 'LDFS8F3DDS', 'some-url/lonsl.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('30012', '03', '03', '03', 'Pessur', 'Polly', 'Salary', 'Office Manager - Prince George', '2013-05-28', NULL,
                      '30015', 3.2, 'pessurp@acme.ca', '250-123-4567', '250-123-7654', 'JGH7T', 'some-url/pessurp.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('30023', '03', '03', '04', 'Robson', 'Rocky', 'Salary', 'Manager-Marketing & Sales', '2014-05-28', NULL,
                      '30008', 3.2, 'robsonr@acme.ca', '604-123-4567', '604-123-7654', 'LDFS8F3DDS', 'some-url/robsonr.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('30024', '03', '03', '05', 'Sanders', 'Sandy', 'Salary', 'Manager-Distribution', '2015-05-28', NULL,
                      '30008', 3.2, 'sanderss@acme.ca', '604-123-4567', '604-123-7654', 'LDFS8F3DDS', 'some-url/sanderss.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('30025', '03', '04', '08', 'Thompson', 'Tony', 'Salary', 'Manager-Operations', '2016-05-28', NULL,
                      '30012', 3.2, 'thompsont@acme.ca', '250-123-4567', '250-123-7654', 'JGH7T', 'some-url/thompsont.jpg');

INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('10101', '01', '01', '01', 'Employee01', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '10001', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'GHHDT1H7', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('10102', '01', '01', '01', 'Employee02', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '10002', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'GHHDT1H7', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('10103', '01', '01', '02', 'Employee03', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '10003', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'GHHDT1H7', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('10104', '01', '01', '03', 'Employee04', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '10004', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'GHHDT1H7', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('10105', '01', '01', '04', 'Employee05', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '10005', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'GHHDT1H7', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('10106', '01', '01', '05', 'Employee06', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '10005', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'GHHDT1H7', 'some-url/photo_default.jpg');

INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('20106', '02', '01', '02', 'Employee07', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '20006', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'GHHDT1H7', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('20102', '02', '02', '04', 'Employee08', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '20002', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'TH8LF9', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('20103', '02', '01', '03', 'Employee09', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '20003', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'TH8LF9', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('20104', '02', '02', '04', 'Employee10', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '20004', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'TH8LF9', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('20105', '02', '02', '05', 'Employee11', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '20005', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'TH8LF9', 'some-url/photo_default.jpg');

INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('30115', '03', '03', '03', 'Employee12', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '30015', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'LDFS8F3DDS', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('30112', '03', '03', '03', 'Employee13', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '30012', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'LDFS8F3DDS', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('30123', '03', '03', '04', 'Employee14', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '30023', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'LDFS8F3DDS', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('30124', '03', '03', '05', 'Employee15', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '30024', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'LDFS8F3DDS', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('30125', '03', '04', '08', 'Employee16', 'Name', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '30025', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'JGH7T', 'some-url/photo_default.jpg');

/* Terminated employees */

INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('19102', '01', '01', '01', 'TermEmployee01', 'Name', 'Salary', 'Some "Title"', '2015-01-01', '2018-06-01',
                      '10002', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'GHHDT1H7', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('29102', '02', '02', '04', 'TermEmployee02', 'Name', 'Salary', 'Some "Title"', '2016-01-01', '2019-06-01',
                      '20004', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'TH8LF9', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('39123', '03', '03', '04', 'TermEmployee03', 'Name', 'Salary', 'Some "Title"', '2017-01-01', '2020-06-01',
                      '30023', 0, 'something@acme.ca', '604-555-5555', '604-555-5555', 'LDFS8F3DDS', 'some-url/photo_default.jpg');

/* Edge case testing employees */

INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('50000', '03', '03', '05', 'West', 'Kanye', 'Salary', 'Some "Title"', '2020-01-01', NULL,
                      '30024', 1, 'something@acme.ca', '604-555-5555', '604-555-5555', 'LDFS8F3DDS', 'some-url/photo_default.jpg');
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl")
              VALUES ('50001', '03', '04', '08', 'West', 'Kanye', 'Salary', 'Some "Title"', '2020-01-03', NULL,
                      '30025', 2, 'something@acme.ca', '604-555-5555', '604-555-5555', 'JGH7T', 'some-url/photo_default.jpg');

/* Edge case testing contractors */

INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl", "isContractor")
              VALUES ('60001', '02', '01', '03', 'Aldrin', 'Buzz', 'Salary', 'Some "Title"', '2020-02-01', NULL,
                      '20003', 1, 'something@acme.ca', '604-555-5555', '604-555-5555', 'TH8LF9', 'some-url/photo_default.jpg', true);
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl", "isContractor")
              VALUES ('60002', '02', '02', '04', 'Aldrin', 'Buzz', 'Salary', 'Some "Title"', '2020-03-01', NULL,
                      '20004', 2, 'something@acme.ca', '604-555-5555', '604-555-5555', 'TH8LF9', 'some-url/photo_default.jpg', true);
INSERT INTO "Employee" ("EmployeeNumber", "CompanyCode", "OfficeCode", "GroupCode", "LastName", "FirstName", "EmploymentType", "Title", "HireDate", "TerminationDate",
                      "SupervisorEmployeeNumber", "YearsPriorExperience", "Email", "WorkPhone", "WorkCell", "PhysicalLocationId", "PhotoUrl", "isContractor")
              VALUES ('60003', '02', '02', '05', 'Armstrong', 'Neil', 'Salary', 'Some "Title"', '2020-04-01', NULL,
                      '20005', 3, 'something@acme.ca', '604-555-5555', '604-555-5555', 'TH8LF9', 'some-url/photo_default.jpg', true);


INSERT INTO "EmployeeSkills" ("EmployeeNumber", "SkillCategoryId", "SkillId") VALUES ('30015', '2', '2');
INSERT INTO "EmployeeSkills" ("EmployeeNumber", "SkillCategoryId", "SkillId") VALUES ('30015', '3', '1');
INSERT INTO "EmployeeSkills" ("EmployeeNumber", "SkillCategoryId", "SkillId") VALUES ('30015', '3', '3');

INSERT INTO "EmployeeSkills" ("EmployeeNumber", "SkillCategoryId", "SkillId") VALUES ('10105', '2', '1');
INSERT INTO "EmployeeSkills" ("EmployeeNumber", "SkillCategoryId", "SkillId") VALUES ('10105', '2', '2');
INSERT INTO "EmployeeSkills" ("EmployeeNumber", "SkillCategoryId", "SkillId") VALUES ('10105', '2', '3');
INSERT INTO "EmployeeSkills" ("EmployeeNumber", "SkillCategoryId", "SkillId") VALUES ('10105', '3', '2');

INSERT INTO "EmployeeSkills" ("EmployeeNumber", "SkillCategoryId", "SkillId") VALUES ('30125', '1', '2');
INSERT INTO "EmployeeSkills" ("EmployeeNumber", "SkillCategoryId", "SkillId") VALUES ('30125', '1', '3');
INSERT INTO "EmployeeSkills" ("EmployeeNumber", "SkillCategoryId", "SkillId") VALUES ('30125', '1', '5');

INSERT INTO "EmployeeSkills" ("EmployeeNumber", "SkillCategoryId", "SkillId") VALUES ('20004', '4', '1');
INSERT INTO "EmployeeSkills" ("EmployeeNumber", "SkillCategoryId", "SkillId") VALUES ('20004', '4', '2');
INSERT INTO "EmployeeSkills" ("EmployeeNumber", "SkillCategoryId", "SkillId") VALUES ('20004', '3', '1');


INSERT INTO "ManagerLocationCompany" ("CompanyCode","ManagerEmployeeNumber") VALUES ('01', '10001');
INSERT INTO "ManagerLocationCompany" ("CompanyCode","ManagerEmployeeNumber") VALUES ('02', '20006');
INSERT INTO "ManagerLocationCompany" ("CompanyCode","ManagerEmployeeNumber") VALUES ('03', '30015');

INSERT INTO "ManagerLocationOffice"("CompanyCode", "OfficeCode", "ManagerEmployeeNumber") VALUES('01', '01',  '10001');
INSERT INTO "ManagerLocationOffice"("CompanyCode", "OfficeCode", "ManagerEmployeeNumber") VALUES('02', '01',  '20006');
INSERT INTO "ManagerLocationOffice"("CompanyCode", "OfficeCode", "ManagerEmployeeNumber") VALUES('02', '02',  '20002');
INSERT INTO "ManagerLocationOffice"("CompanyCode", "OfficeCode", "ManagerEmployeeNumber") VALUES('03', '03',  '30008');
INSERT INTO "ManagerLocationOffice"("CompanyCode", "OfficeCode", "ManagerEmployeeNumber") VALUES('03', '04',  '30012');

INSERT INTO "ManagerLocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "ManagerEmployeeNumber") VALUES ('01', '01', '01', '10002');
INSERT INTO "ManagerLocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "ManagerEmployeeNumber") VALUES ('01', '01', '02', '10003');
INSERT INTO "ManagerLocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "ManagerEmployeeNumber") VALUES ('01', '01', '03', '10004');
INSERT INTO "ManagerLocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "ManagerEmployeeNumber") VALUES ('01', '01', '04', '10005');
INSERT INTO "ManagerLocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "ManagerEmployeeNumber") VALUES ('01', '01', '05', '10005');

INSERT INTO "ManagerLocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "ManagerEmployeeNumber") VALUES ('02', '01', '02', '20006');
INSERT INTO "ManagerLocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "ManagerEmployeeNumber") VALUES ('02', '01', '03', '20003');
INSERT INTO "ManagerLocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "ManagerEmployeeNumber") VALUES ('02', '02', '04', '20004');
INSERT INTO "ManagerLocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "ManagerEmployeeNumber") VALUES ('02', '02', '05', '20005');

INSERT INTO "ManagerLocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "ManagerEmployeeNumber") VALUES ('03', '03', '03', '30012');
INSERT INTO "ManagerLocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "ManagerEmployeeNumber") VALUES ('03', '03', '04', '30023');
INSERT INTO "ManagerLocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "ManagerEmployeeNumber") VALUES ('03', '03', '05', '30024');
INSERT INTO "ManagerLocationGroup" ("CompanyCode", "OfficeCode", "GroupCode", "ManagerEmployeeNumber") VALUES ('03', '04', '08', '30025');
