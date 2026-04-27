import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { HOME_PATH, ROUTES } from "@/app/paths";
import { PageShell, SiteHeader } from "@/components/layout";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { useAuthStore } from "@/app/store/use-auth-store";
import { GlobalModal } from "@/components/common/Modal/GlobalModal";
import { GlobalToast } from "@/components/common/Toast/GlobalToast";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/auth";
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
        <AuthGuard>
            <PageShell>
                <ScrollToTop />
                <div className="site-shell">
                    <SiteHeader />
                    <Outlet />
                </div>
            </PageShell>
        </AuthGuard>
    );
}

// 홈과 상세 화면을 표준 React Router 경로로 분기한다.
function App() {
    const initializeAuth = useAuthStore((state) => state.initialize);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <>
            <GlobalModal />
            <GlobalToast />
            <Routes>
                {/* 인증이 필요 없는 라우트 */}
                <Route path={ROUTES.auth} element={<LoginPage />} />

                {/* 인증이 필요한 라우트들 */}
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
        </>
    );
}

export default App;
