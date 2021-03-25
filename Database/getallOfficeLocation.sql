SELECT lo."Label"
From "LocationOffice" lo, "LocationCompany" lc
Where lo."CompanyCode" = lc."CompanyCode" AND lc."Label" = :p0