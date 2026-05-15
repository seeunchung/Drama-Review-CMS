import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProjectHeader } from "@/components/layout";
import {
    useApplicationDetail,
    useApproveApplication,
    useRejectApplication,
} from "@/network/hooks/use-application";
import { EpisodeReviewTable, StatusBadge } from "@/components/common";
import { toStandardEpisodesFromApplication } from "@/lib/adapters";
import {
    validateDramaRow,
    applyDramaCollectionValidation,
    extractNumbers,
    normalizeRunningTime,
    isNumeric,
    isValidRunningTime,
} from "@/lib/drama-validator";
import { StandardEpisode } from "@/app/types/drama";
import { useToastStore, useModalStore } from "@/app/store";
import "./styles.css";

export function ApplicationReviewDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToastStore();
    const { confirm } = useModalStore();

    const { data, isLoading } = useApplicationDetail(id || "");
    const approveMutation = useApproveApplication();
    const rejectMutation = useRejectApplication();

    const [episodes, setEpisodes] = useState<StandardEpisode[]>([]);

    useEffect(() => {
        if (data) {
            const standardEpisodes = toStandardEpisodesFromApplication(
                data.master,
                data.episodes,
            );

            const validated = standardEpisodes.map((ep) => {
                const errorMessages = validateDramaRow({
                    title: ep.title,
                    baseTitle: data.master.title,
                    rawEpisode: ep.episode,
                    rating: ep.rating,
                    summary: ep.summary,
                    runningTime: ep.runningTime,
                });
                return {
                    ...ep,
                    errorMessages,
                    status: errorMessages.length > 0 ? "error" : "valid",
                } as StandardEpisode;
            });

            setEpisodes(applyDramaCollectionValidation(validated));
        }
    }, [data]);

    const handleAutoClean = () => {
        const needsCleaning = episodes.some(
            (row) =>
                !isNumeric(row.episode) ||
                (row.rating && !isNumeric(row.rating)) ||
                (row.runningTime && !isValidRunningTime(row.runningTime)),
        );

        if (!needsCleaning) {
            toast.success("변환할 데이터가 없습니다.");
            return;
        }

        const updated = episodes.map((ep) => {
            const cleanedEpisode = extractNumbers(ep.episode);
            const cleanedRating = extractNumbers(ep.rating);
            const cleanedRunningTime = normalizeRunningTime(ep.runningTime);

            const errorMessages = validateDramaRow({
                title: ep.title,
                baseTitle: data?.master.title || "",
                rawEpisode: cleanedEpisode,
                rating: cleanedRating,
                summary: ep.summary,
                runningTime: cleanedRunningTime,
            });

            return {
                ...ep,
                episode: cleanedEpisode,
                rating: cleanedRating,
                runningTime: cleanedRunningTime,
                errorMessages,
                status: errorMessages.length > 0 ? "error" : "valid",
            } as StandardEpisode;
        });

        const validated = applyDramaCollectionValidation(updated);
        setEpisodes(validated);
        toast.success("자동변환되었습니다.");
    };

    const handleApprove = async () => {
        const hasError = episodes.some((ep) => ep.status === "error");
        if (hasError) {
            toast.error("오류가 있는 데이터는 승인할 수 없습니다.");
            return;
        }

        const isConfirmed = await confirm({
            title: "신청 승인",
            message: `'${data?.master.title}' 신청을 승인하시겠습니까?. 메타데이터 검수로 데이터가 이관됩니다.`,
            confirmText: "승인 및 이관",
        });

        if (isConfirmed) {
            try {
                await approveMutation.mutateAsync({
                    applicationId: id!,
                    dramaTitle: data!.master.title,
                    episodes: episodes,
                });
                toast.success(
                    "승인되었습니다. 메타데이터 검수 페이지로 이동해주세요.",
                );
                navigate("/application-review");
            } catch (error) {
                toast.error("승인 처리 중 오류가 발생했습니다.");
            }
        }
    };

    const handleReject = async () => {
        const isConfirmed = await confirm({
            title: "신청 거절",
            message: "이 신청을 거절하시겠습니까?",
            confirmText: "거절 처리",
        });

        if (isConfirmed) {
            try {
                await rejectMutation.mutateAsync({ id: id!, status: 'failed' });
                toast.success("신청이 거절되었습니다.");
                navigate("/application-review");
            } catch (error) {
                toast.error("처리 중 오류가 발생했습니다.");
            }
        }
    };

    if (isLoading) return <div className="loading-container">로딩 중...</div>;

    return (
        <main className="project-page review-detail-page">
            <ProjectHeader
                title="드라마 산청관리"
                description="사용자가 신청한 정보를 검토하고 메타데이터 검수에 반영합니다."
                tags={["상세 검토", "데이터 이관"]}
            />

            <div className="detail-toolbar panel">
                <div className="info-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <h2 style={{ margin: 0 }}>{data?.master.title}</h2>
                        <StatusBadge status={data?.master.status || 'pending'} />
                    </div>
                    <span
                        style={{ fontSize: "0.9rem", color: "var(--ink-soft)" }}
                    >
                        {data?.master.ott} | {data?.master.rating}세 관람가
                    </span>
                </div>
                <div className="action-group">
                    <button
                        className="btn-outline"
                        onClick={() => navigate("/application-review")}
                    >
                        목록으로
                    </button>
                    <button
                        className="btn-auto-clean"
                        onClick={handleAutoClean}
                        disabled={data?.master.status !== "pending"}
                    >
                        자동변환
                    </button>
                    <button
                        className="btn-reject"
                        onClick={handleReject}
                        disabled={
                            data?.master.status !== "pending" ||
                            rejectMutation.isPending
                        }
                    >
                        거절
                    </button>
                    <button
                        className="btn-approve"
                        onClick={handleApprove}
                        disabled={
                            data?.master.status !== "pending" ||
                            approveMutation.isPending
                        }
                    >
                        {approveMutation.isPending ? "처리 중..." : "승인"}
                    </button>
                </div>
            </div>

            <section className="episode-list-section panel">
                <div className="section-header">
                    <h2>회차 상세 내역 ({episodes.length})</h2>
                </div>
                <div className="episode-table-container">
                    <EpisodeReviewTable rows={episodes} />
                </div>
            </section>
        </main>
    );
}
