import {
    mockLocationFilters,
    mockSkillFilters,
    mockTitleFilters,
} from "./mocks/filter";

export const filterTypeEnum = {
    LOCATION: "location",
    TITLE: "title",
    SKILL: "skill",
};

export const defaultFilterState = {
    byId: {},
    allId: [],
};

export const mockFilterState = {
    byId: {
        ...mockLocationFilters.byId,
        ...mockTitleFilters.byId,
        ...mockSkillFilters.byId,
    },
    allId: [].concat(
        mockLocationFilters.allId,
        mockTitleFilters.allId,
        mockSkillFilters.allId
    ),
};
