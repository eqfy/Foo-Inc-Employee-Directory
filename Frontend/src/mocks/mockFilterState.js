export const filterTypeEnum = {
    LOCATION: "location",
    TITLE: "title",
    SKILL: "skill",
};

export const mockLocationFilters = {
    byId: {
        "Vancouver:": { type: filterTypeEnum.LOCATION, label: "Vancouver" },
        "Calgary:": { type: filterTypeEnum.LOCATION, label: "Calgary" },
        "Toronto:": { type: filterTypeEnum.LOCATION, label: "Toronto" },
        "Montreal:": { type: filterTypeEnum.LOCATION, label: "Montreal" },
        "Edmonton:": { type: filterTypeEnum.LOCATION, label: "Edmonton" },
        "Victoria:": { type: filterTypeEnum.LOCATION, label: "Victoria" },
        "Quebec City:": { type: filterTypeEnum.LOCATION, label: "Quebec City" },
    },
    allId: [
        "Vancouver:",
        "Calgary:",
        "Toronto:",
        "Montreal:",
        "Edmonton:",
        "Victoria:",
        "Quebec City:",
    ],
};

export const mockTitleFilters = {
    byId: {
        "CEO:": { type: filterTypeEnum.TITLE, label: "CEO" },
        "COO:": { type: filterTypeEnum.TITLE, label: "COO" },
        "Manager-Sales:": {
            type: filterTypeEnum.TITLE,
            label: "Manager-Sales",
        },
        "Manager-Engineering:": {
            type: filterTypeEnum.TITLE,
            label: "Manager-Engineering",
        },
        "Engineer:": { type: filterTypeEnum.TITLE, label: "Engineer" },
        "Worker:": { type: filterTypeEnum.TITLE, label: "Worker" },
    },
    allId: [
        "CEO:",
        "COO:",
        "Manager-Sales:",
        "Manager-Engineering:",
        "Engineer:",
        "Worker:",
    ],
};

export const mockSkillFilters = {
    byId: {
        "Auditing:Accounting": {
            type: filterTypeEnum.SKILL,
            label: "Auditing",
            category: "Accounting",
        },
        "Reconciling:Accounting": {
            type: filterTypeEnum.SKILL,
            label: "Reconciling",
            category: "Accounting",
        },
        "Transaction Processing:Accounting": {
            type: filterTypeEnum.SKILL,
            label: "Transaction Processing",
            category: "Accounting",
        },
        "Fertilizing:Agriculture": {
            type: filterTypeEnum.SKILL,
            label: "Fertilizing",
            category: "Agriculture",
        },
        "Harvesting:Agriculture": {
            type: filterTypeEnum.SKILL,
            label: "Harvesting",
            category: "Agriculture",
        },
        "Soil Preparation:Agriculture": {
            type: filterTypeEnum.SKILL,
            label: "Soil Preparation",
            category: "Agriculture",
        },
        "Customer Service:Marketing Sales": {
            type: filterTypeEnum.SKILL,
            label: "Customer Service",
            category: "Marketing Sales",
        },
        "Preparing Marketing Materials:Marketing Sales": {
            type: filterTypeEnum.SKILL,
            label: "Preparing Marketing Materials",
            category: "Marketing Sales",
        },
    },
    allId: [
        "Auditing:Accounting",
        "Reconciling:Accounting",
        "Transaction Processing:Accounting",
        "Fertilizing:Agriculture",
        "Harvesting:Agriculture",
        "Soil Preparation:Agriculture",
        "Customer Service:Marketing Sales",
        "Preparing Marketing Materials:Marketing Sales",
    ],
    categoryById: {
        Accounting: [
            "Auditing:Accounting",
            "Reconciling:Accounting",
            "Transaction Processing:Accounting",
        ],
        Agriculture: [
            "Fertilizing:Agriculture",
            "Harvesting:Agriculture",
            "Soil Preparation:Agriculture",
        ],
        "Marketing Sales": [
            "Customer Service:Marketing Sales",
            "Preparing Marketing Materials:Marketing Sales",
        ],
    },
};
