import { Link } from "react-router-dom";
import { HOME_PATH } from "@/app/paths";

interface ProjectHeaderProps {
    title: string;
    description: string;
    tags: string[];
}

// 상세 화면 상단의 제목, 설명, 태그를 공통 형태로 묶는다.
function ProjectHeader({ title, description, tags }: ProjectHeaderProps) {
    return (
        <header className="project-header panel">
            <div className="project-header-main">
                <Link className="project-back-link" to={HOME_PATH}>
                    대시보드로
                </Link>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>

            <div className="project-tag-list" aria-label="프로젝트 태그">
                {tags.map((tag) => (
                    <span className="project-tag" key={tag}>
                        {tag}
                    </span>
                ))}
            </div>
        </header>
    );
}

export { ProjectHeader };
