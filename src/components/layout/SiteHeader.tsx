import { Link, useLocation } from "react-router-dom";
import { HOME_PATH, ROUTES } from "@/app/paths";
import { useAuthStore } from "@/app/store/use-auth-store";
import { useModalStore } from "@/app/store/use-modal-store";
import { useThemeStore } from "@/app/store/use-theme-store";

export function SiteHeader() {
    const { pathname } = useLocation();
    const { user, signOut } = useAuthStore();
    const { confirm } = useModalStore();
    const { theme, toggleTheme } = useThemeStore();

    const handleLogout = async () => {
        const isConfirmed = await confirm({
            title: "로그아웃",
            message: "정말 로그아웃 하시겠습니까?",
            confirmText: "로그아웃",
            cancelText: "취소"
        });

        if (isConfirmed) {
            await signOut();
        }
    };

    return (
        <header className="site-header">
            <Link className="site-brand" to={HOME_PATH}>
                <div className="site-brand-mark">C</div>
                <div className="site-brand-copy">
                    <strong>중드 달글 CMS</strong>
                </div>
            </Link>

            <nav className="site-nav">
                <Link
                    className={pathname === HOME_PATH ? "is-active" : ""}
                    to={HOME_PATH}
                >
                    대시보드
                </Link>
                <Link
                    className={
                        pathname.startsWith(ROUTES["content-import"])
                            ? "is-active"
                            : ""
                    }
                    to={ROUTES["content-import"]}
                >
                    콘텐츠 등록
                </Link>
                <Link
                    className={
                        pathname.startsWith(ROUTES["metadata-review"])
                            ? "is-active"
                            : ""
                    }
                    to={ROUTES["metadata-review"]}
                >
                    데이터 검토
                </Link>
                <Link
                    className={
                        pathname.startsWith(ROUTES["review-curation"])
                            ? "is-active"
                            : ""
                    }
                    to={ROUTES["review-curation"]}
                >
                    리뷰 큐레이션
                </Link>
            </nav>

            <div className="site-header-actions">
                <button 
                    className="theme-toggle-btn" 
                    onClick={toggleTheme}
                    title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
                >
                    {theme === 'dark' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                </button>
                {user && (
                    <div className="user-info">
                        <span className="user-email">{user.email}</span>
                        <button className="logout-btn" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
