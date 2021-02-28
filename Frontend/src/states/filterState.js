import {
    mockLocationFilters,
    mockTitleFilters,
    mockSkillFilters,
} from "mocks/mockFilterState";

export const defaultFilterState = {
    byId: {},
    allId: [],
    categoryById: {},
    locationAllId: [],
};

export const mockFilterState = {
    byId: {
        ...mockLocationFilters.byId,
        ...mockTitleFilters.byId,
        ...mockSkillFilters.byId,
    },
    allId: [
        ...mockLocationFilters.allId,
        ...mockTitleFilters.allId,
        ...mockSkillFilters.allId,
    ],
    categoryById: {
        ...mockSkillFilters.categoryById,
    },
    locationAllId: mockLocationFilters.allId,
    titleAllId: mockTitleFilters.allId,
};
