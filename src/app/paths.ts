// 앱 전역에서 쓰는 화면 경로를 한곳에 모아둔다.
const HOME_PATH = "/" as const;

const ROUTES = {
    "auth": "/login",
    "content-import": "/content-import",
    "metadata-review": "/metadata-review",
    "metadata-review-detail": "/metadata-review/:batchId",
    "review-curation": "/review-curation",
} as const;

type ProjectRouteId = keyof typeof ROUTES;
type ProjectPath = (typeof ROUTES)[ProjectRouteId];

export { HOME_PATH, ROUTES, type ProjectPath, type ProjectRouteId };
