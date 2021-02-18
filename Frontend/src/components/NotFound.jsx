import React from "react";
import { PageContainer } from './common/PageContainer';
import "./NotFound.css";

export default function NotFound() {
    return (
        <PageContainer className="NotFound text-center">
            <h3>Sorry, page not found!</h3>
        </PageContainer>
    );
}
