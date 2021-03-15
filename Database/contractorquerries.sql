
SELECT "PhysicalLocationId"
FROM "LocationPhysical"
WHERE "Label" = 'Vancouver'


SELECT "CompanyCode"
FROM "LocationCompany"
WHERE "Label" = 'Acme Seeds Inc.'

SELECT "OfficeCode"
FROM "LocationOffice"
WHERE "Label" = 'Corporate' AND "CompanyCode" = '01'

SELECT "GroupCode"
FROM "LocationGroup"
WHERE "Label" = 'Marketing' AND "CompanyCode" = '01' AND "OfficeCode" = '01'