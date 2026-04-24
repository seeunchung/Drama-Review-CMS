import { Link, useLocation } from "react-router-dom";
import { HOME_PATH, projectPathMap } from "@/app/paths";

export function SiteHeader() {
    const { pathname } = useLocation();

    return (
        <header className="site-header">
            <Link className="site-brand" to={HOME_PATH}>
                <div className="site-brand-mark">C</div>
                <div className="site-brand-copy">
                    <strong>Cine-Admin CMS</strong>
                    <small>Content Management System</small>
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
                        pathname.startsWith(projectPathMap["content-import"])
                            ? "is-active"
                            : ""
                    }
                    to={projectPathMap["content-import"]}
                >
                    콘텐츠 등록
                </Link>
                <Link
                    className={
                        pathname.startsWith(projectPathMap["metadata-review"])
                            ? "is-active"
                            : ""
                    }
                    to={projectPathMap["metadata-review"]}
                >
                    데이터 검토
                </Link>
            </nav>
        </header>
    );
}
