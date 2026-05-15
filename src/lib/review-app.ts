const configuredReviewAppUrl = import.meta.env.VITE_REVIEW_APP_URL?.trim();

const reviewAppBaseUrl = configuredReviewAppUrl
    ? configuredReviewAppUrl.replace(/\/+$/, "")
    : import.meta.env.DEV
      ? "http://localhost:8081"
      : "";

export function buildReviewAppPreviewUrl(
    dramaId: string | undefined,
) {
    if (!reviewAppBaseUrl || !dramaId) return null;

    return new URL(`/drama/${dramaId}`, reviewAppBaseUrl).toString();
}

export function getReviewAppBaseUrl() {
    return reviewAppBaseUrl;
}
