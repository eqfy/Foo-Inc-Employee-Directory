import {
    mockLocationFilters,
    mockTitleFilters,
    mockSkillFilters,
} from "mocks/mockFilterState";

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
