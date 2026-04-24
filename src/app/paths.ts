// 앱 전역에서 쓰는 화면 경로를 한곳에 모아둔다.
const HOME_PATH = "/" as const;

const projectPathMap = {
    "content-import": "/content-import",
    "metadata-review": "/metadata-review",
    "metadata-review-detail": "/metadata-review/:batchId",
} as const;

type ProjectRouteId = keyof typeof projectPathMap;
type ProjectPath = (typeof projectPathMap)[ProjectRouteId];

export { HOME_PATH, projectPathMap, type ProjectPath, type ProjectRouteId };
