import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { HOME_PATH, ROUTES } from "@/app/paths";
import { PageShell, SiteHeader } from "@/components/layout";
import { HomePage } from "@/pages/home";
import { ContentImportPage } from "@/pages/content-import";
import {
    MetadataReviewPage,
    MetadataReviewDetailPage,
} from "@/pages/metadata-review";
import { ReviewCurationPage } from "@/pages/review-curation";
import "./layout.css";

// 라우트가 바뀔 때마다 새 화면의 시작 지점으로 스크롤을 맞춘다.
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname]);

    return null;
}

// 공통 레이아웃 안에서 각 화면 페이지만 교체한다.
function AppLayout() {
    return (
        <PageShell>
            <ScrollToTop />
            <div className="site-shell">
                <SiteHeader />
                <Outlet />
            </div>
        </PageShell>
    );
}

// 홈과 상세 화면을 표준 React Router 경로로 분기한다.
function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path={HOME_PATH} element={<HomePage />} />
                <Route
                    path={ROUTES["content-import"]}
                    element={<ContentImportPage />}
                />
                <Route
                    path={ROUTES["metadata-review"]}
                    element={<MetadataReviewPage />}
                />
                <Route
                    path={ROUTES["metadata-review-detail"]}
                    element={<MetadataReviewDetailPage />}
                />
                <Route
                    path={ROUTES["review-curation"]}
                    element={<ReviewCurationPage />}
                />
                <Route path="*" element={<Navigate replace to={HOME_PATH} />} />
            </Route>
        </Routes>
    );
}

export default App;
