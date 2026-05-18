import { Suspense, lazy, useEffect, type ReactNode } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { HOME_PATH, ROUTES } from "@/app/paths";
import { AuthGuard, PageShell, SiteHeader } from "@/components/layout";
import { useAuthStore, useThemeStore } from "@/app/store";
import { GlobalModal } from "@/components/common";
import { GlobalToast } from "@/components/common";

const HomePage = lazy(() => import("@/pages/home/HomePage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const ContentImportPage = lazy(
    () => import("@/pages/content-import/ContentImportPage"),
);
const ApplicationReviewPage = lazy(
    () => import("@/pages/application-review/ApplicationReviewPage"),
);
const ApplicationReviewDetailPage = lazy(
    () => import("@/pages/application-review/ApplicationReviewDetailPage"),
);
const MetadataReviewPage = lazy(
    () => import("@/pages/metadata-review/MetadataReviewPage"),
);
const MetadataReviewDetailPage = lazy(
    () => import("@/pages/metadata-review/MetadataReviewDetailPage"),
);
const ReviewCurationPage = lazy(
    () => import("@/pages/review-curation/ReviewCurationPage"),
);

// 라우트가 바뀔 때마다 새 화면의 시작 지점으로 스크롤을 맞춘다.
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname]);

    return null;
}

function RouteFallback() {
    return (
        <div
            style={{
                minHeight: "40vh",
                display: "grid",
                placeItems: "center",
                color: "var(--ink-soft)",
            }}
        >
            페이지를 불러오는 중...
        </div>
    );
}

function RouteSuspense({ children }: { children: ReactNode }) {
    return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

// 공통 레이아웃 안에서 각 화면 페이지만 교체한다.
function AppLayout() {
    return (
        <AuthGuard>
            <PageShell>
                <ScrollToTop />
                <div className="site-shell">
                    <SiteHeader />
                    <RouteSuspense>
                        <Outlet />
                    </RouteSuspense>
                </div>
            </PageShell>
        </AuthGuard>
    );
}

// 홈과 상세 화면을 표준 React Router 경로로 분기한다.
function App() {
    const initializeAuth = useAuthStore((state) => state.initialize);
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    // 테마 변경 시 body 클래스 토글
    useEffect(() => {
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [theme]);

    return (
        <>
            <GlobalModal />
            <GlobalToast />
            <Routes>
                {/* 인증이 필요 없는 라우트 */}
                <Route
                    path={ROUTES.auth}
                    element={
                        <RouteSuspense>
                            <LoginPage />
                        </RouteSuspense>
                    }
                />

                {/* 인증이 필요한 라우트들 */}
                <Route element={<AppLayout />}>
                    <Route path={HOME_PATH} element={<HomePage />} />
                    <Route
                        path={ROUTES["content-import"]}
                        element={<ContentImportPage />}
                    />
                    <Route
                        path={ROUTES["application-review"]}
                        element={<ApplicationReviewPage />}
                    />
                    <Route
                        path={ROUTES["application-review-detail"]}
                        element={<ApplicationReviewDetailPage />}
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
