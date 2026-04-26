import { Link, useLocation } from "react-router-dom";
import { HOME_PATH, ROUTES } from "@/app/paths";
import { useAuthStore } from "@/app/store/use-auth-store";
import { useModalStore } from "@/app/store/use-modal-store";

export function SiteHeader() {
    const { pathname } = useLocation();
    const { user, signOut } = useAuthStore();
    const { confirm } = useModalStore();

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
