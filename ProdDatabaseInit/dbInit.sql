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
