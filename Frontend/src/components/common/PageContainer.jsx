import styled from "styled-components";

export const PageContainer = styled.div`
    padding: 25px;
`;

export const CenteredPageContainer = styled(PageContainer)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 70px);
    margin: 0;
    overflow: hidden;
`;
