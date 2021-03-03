WITH es AS (
    SELECT
        "EmployeeNumber",
        string_agg("SkillCategory"."Label" || ': ' || "Skill"."Label", ', ') AS skills
    FROM
        "EmployeeSkills",
        "Skill",
        "SkillCategory"
    WHERE
        "EmployeeSkills"."SkillId" = "Skill"."SkillId"
        AND "EmployeeSkills"."SkillCategoryId" = "SkillCategory"."SkillCategoryId"
        AND "Skill"."SkillCategoryId" = "SkillCategory"."SkillCategoryId"
    GROUP BY
        "EmployeeNumber"
)
SELECT
    "Employee".*,
    es.skills
FROM
    "Employee"
    LEFT JOIN es ON "Employee"."EmployeeNumber" = es."EmployeeNumber"
WHERE
    "Employee"."FirstName" = :p1 AND "Employee"."LastName" = :p2