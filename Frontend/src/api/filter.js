import mockFilters from "../mocks/filters.json";

export async function getAllFilters() {
    // TODO Change this to an actual API call
    const { companies, departments, locations, titles, skills } = mockFilters;

    const parsedSkills = skills.reduce((acc, { skillLabel, categoryLabel }) => {
        const skillId = `${categoryLabel}:::${skillLabel}`;
        acc[categoryLabel] = !acc[categoryLabel]
            ? [skillId]
            : acc[categoryLabel].concat(skillId);
        return acc;
    }, {});
    // We are currently using text names (e.g. Vancouver) as ids
    // so we don't need to set the general byId redux field
    // If in the future, if we decide to store filters by non-text names (i.e. some numeric id or UUID)
    // we then need to populate the general byId field so that lookup skills from it with some skill id
    return {
        companyAllId: companies,
        departmentAllId: departments,
        locationAllId: locations,
        titleAllId: titles,
        skillAllId: parsedSkills,
    };
}
