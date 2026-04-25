import { Link, useLocation } from "react-router-dom";
import { HOME_PATH, ROUTES } from "@/app/paths";

export function SiteHeader() {
    const { pathname } = useLocation();

    return (
        <header className="site-header">
            <Link className="site-brand" to={HOME_PATH}>
                <div className="site-brand-mark">C</div>
                <div className="site-brand-copy">
                    <strong>Cine-Admin CMS</strong>
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
        </header>
    );
}
