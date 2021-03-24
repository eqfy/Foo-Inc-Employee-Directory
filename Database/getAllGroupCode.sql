SELECT lg."Label"
FROM "LocationOffice" lo, "LocationCompany" lc, "LocationGroup" lg
WHERE lg."CompanyCode" = lc."CompanyCode" AND lg."OfficeCode" = lo."OfficeCode" AND lc."Label" = :p0 and lo."Label" = :p1