export const filterTypeEnum = {
    LOCATION: "location",
    TITLE: "title",
    SKILL: "skill",
};

export const mockLocationFilters = {
    byId: {
        Vancouver: { type: filterTypeEnum.LOCATION },
        Calgary: { type: filterTypeEnum.LOCATION },
        Toronto: { type: filterTypeEnum.LOCATION },
        Montreal: { type: filterTypeEnum.LOCATION },
        Edmonton: { type: filterTypeEnum.LOCATION },
        Victoria: { type: filterTypeEnum.LOCATION },
        "Quebec City": { type: filterTypeEnum.LOCATION },
    },
    allId: [
        "Vancouver",
        "Calgary",
        "Toronto",
        "Montreal",
        "Edmonton",
        "Victoria",
        "Quebec City",
    ],
};

export const mockTitleFilters = {
    byId: {
        CEO: { type: filterTypeEnum.TITLE },
        COO: { type: filterTypeEnum.TITLE },
        "Manager-Sales": { type: filterTypeEnum.TITLE },
        "Manager-Engineering": { type: filterTypeEnum.TITLE },
        Engineer: { type: filterTypeEnum.TITLE },
        Worker: { type: filterTypeEnum.TITLE },
    },
    allId: [
        "CEO",
        "COO",
        "Manager-Sales",
        "Manager-Engineering",
        "Engineer",
        "Worker",
    ],
};

export const mockSkillFilters = {
    byId: {
        Auditing: { type: filterTypeEnum.SKILL, category: "Accounting" },
        Reconciling: { type: filterTypeEnum.SKILL, category: "Accounting" },
        "Transaction Processing": {
            type: filterTypeEnum.SKILL,
            category: "Accounting",
        },
        Fertilizing: { type: filterTypeEnum.SKILL, category: "Agriculture" },
        Harvesting: { type: filterTypeEnum.SKILL, category: "Agriculture" },
        "Soil Preparation": {
            type: filterTypeEnum.SKILL,
            category: "Agriculture",
        },
        "Customer Service": {
            type: filterTypeEnum.SKILL,
            category: "Marketing Sales",
        },
        "Preparing Marketing Materials": {
            type: filterTypeEnum.SKILL,
            category: "Marketing Sales",
        },
    },
    allId: [
        "Auditing",
        "Reconciling",
        "Transaction Processing",
        "Fertilizing",
        "Harvesting",
        "Soil Preparation",
        "Customer Service",
        "Preparing Marketing Materials",
    ],
};
