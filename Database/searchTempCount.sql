WITH es AS (
    SELECT
        "EmployeeNumber",
        string_agg(sc."Label" || ':::' || s."Label", '||| ') AS skills
    FROM
        "EmployeeSkills" as es,
        "Skill" as s,
        "SkillCategory" as sc
    WHERE
        es."SkillId" = s."SkillId"
        AND es."SkillCategoryId" = sc."SkillCategoryId"
        AND s."SkillCategoryId" = sc."SkillCategoryId"
    GROUP BY
        "EmployeeNumber"
),
    ol AS (
        SELECT
                string_agg(lo."Label" , ' ||| ') AS officeLocations,
                e."EmployeeNumber"
        FROM
            "Employee" as e,
            "LocationGroup" as lg,
            "LocationOffice" as lo
        WHERE
            e."OfficeCode" = lg."OfficeCode" AND e."GroupCode" = lg."GroupCode" AND e."CompanyCode" = lg."CompanyCode" 
            AND lg."OfficeCode" = lo."OfficeCode"
        GROUP BY
            e."EmployeeNumber"
    ),
    ed AS (
        SELECT 
        e."FirstName",
        e."LastName",
        e."PhotoUrl",
        pl."Label" AS location,
        lg."Label" AS division,
        lc."Label" AS companyname,
        e."Title",
        e."HireDate",
        e."TerminationDate",
        e."SupervisorEmployeeNumber",
        e."YearsPriorExperience",
        e."Email",
        e."WorkPhone",
        e."WorkCell",
        e."isContractor",
        e."EmployeeNumber",
        e."EmploymentType"
    FROM
        "LocationPhysical" as pl,
        "Employee" as e,
        "LocationGroup" as lg,
        "LocationCompany" as lc
    WHERE
        pl."PhysicalLocationId" = e."PhysicalLocationId"
        AND e."OfficeCode" = lg."OfficeCode" AND e."GroupCode" = lg."GroupCode" AND e."CompanyCode" = lg."CompanyCode" 
        AND lg."CompanyCode" = lc."CompanyCode"
    )
SELECT 
    COUNT(*)
FROM
    ed
    LEFT JOIN es ON ed."EmployeeNumber" = es."EmployeeNumber"
    LEFT JOIN ol on ed."EmployeeNumber" = ol."EmployeeNumber"