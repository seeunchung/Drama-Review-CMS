import { supabase } from "@/lib/supabase";
import { STATUS_LABELS } from "@/app/project-meta";

/**
 * 개발 및 테스트를 위한 데이터 시딩 API
 */
export const debugApi = {
    /**
     * 전체 데이터 초기화 및 재시딩 (무결성 준수)
     */
    seedAllData: async () => {
        console.log("시딩 시작...");

        // 1. 기존 데이터 삭제 (역순으로 삭제하여 FK 제약 조건 준수)
        await supabase
            .from("activities")
            .delete()
            .neq("id", "00000000-0000-0000-0000-000000000000");
        await supabase
            .from("drama_comments")
            .delete()
            .neq("id", "00000000-0000-0000-0000-000000000000");
        await supabase.from("episodes").delete().neq("id", 0);
        await supabase
            .from("import_batches")
            .delete()
            .neq("id", "00000000-0000-0000-0000-000000000000");

        // 2. 드라마 배치 생성 (import_batches)
        const dramas = [
            {
                title: "장상사 (Lost You Forever)",
                status: "completed",
                file: "장상사_시즌1_메타데이터.xlsx",
            },
            {
                title: "투나망월 (The Double)",
                status: "completed",
                file: "투나망월_전회차.xlsx",
            },
            {
                title: "경여년 2 (Joy of Life 2)",
                status: "completed",
                file: "경여년_시즌2_최종.xlsx",
            },
            {
                title: "신조협려 2024",
                status: "pending",
                file: "신조협려_검토용.xlsx",
            },
            {
                title: "유리미인살",
                status: "completed",
                file: "유리미인살_재업로드.xlsx",
            },
            {
                title: "삼생삼세 십리도화",
                status: "failed",
                file: "삼생삼세_데이터오류.xlsx",
            },
        ];

        for (const d of dramas) {
            const { data: batch, error: bError } = await supabase
                .from("import_batches")
                .insert({
                    drama_title: d.title,
                    file_name: d.file,
                    status: d.status,
                    poster_url: `https://picsum.photos/seed/${encodeURIComponent(d.title)}/300/450`,
                })
                .select()
                .single();

            if (bError) throw bError;

            // 3. 회차 데이터 생성 (episodes) - 각 드라마당 12회차씩
            const episodesData = Array.from({ length: 12 }).map((_, i) => ({
                batch_id: batch.id,
                seq: i + 1,
                title: d.title,
                distributor: i % 2 === 0 ? "Tencent" : "iQIYI",
                rating: "15",
                episode: i + 1,
                subtitle: `${i + 1}화 에피소드`,
                running_time: "45:00",
                summary: `${d.title}의 ${i + 1}번째 이야기입니다. 흥미진진한 전개가 이어집니다.`,
                status: "uploaded",
            }));

            const { error: eError } = await supabase
                .from("episodes")
                .insert(episodesData);
            if (eError) throw eError;

            // 4. 리뷰 데이터 생성 (drama_comments) - 승인 완료(completed)된 드라마에만 생성
            if (d.status === "completed") {
                // 드라마별로 리뷰 개수를 다르게 설정 (통계 차트를 위해)
                const reviewCounts: Record<string, number> = {
                    "장상사 (Lost You Forever)": 45,
                    "투나망월 (The Double)": 32,
                    "경여년 2 (Joy of Life 2)": 28,
                    유리미인살: 15,
                };

                const count = reviewCounts[d.title] || 10;
                const nicknames = [
                    "중드덕후",
                    "시엔",
                    "드라마조아",
                    "망붕렌즈",
                    "무협팬",
                    "OTT수집가",
                ];
                const comments = [
                    "진짜 인생작입니다ㅠㅠ",
                    "여주 연기 미쳤네요",
                    "남주 비주얼 실화인가요",
                    "원작보다 잘 만든듯",
                    "다음 화 언제 나와요",
                    "방금 다 봤는데 여운이 가시질 않음",
                    "스토리 전개가 좀 느리지만 볼만함",
                    "배경 음악이 너무 좋아요",
                ];

                const commentsData = Array.from({ length: count }).map(() => ({
                    drama_id: batch.id,
                    episode_no: Math.floor(Math.random() * 12) + 1,
                    user_nickname:
                        nicknames[Math.floor(Math.random() * nicknames.length)],
                    content:
                        comments[Math.floor(Math.random() * comments.length)],
                    rating: Math.floor(Math.random() * 2) + 4, // 4~5점
                    is_spoiler: Math.random() > 0.8,
                    is_best: Math.random() > 0.9,
                    created_at: new Date(
                        Date.now() - Math.random() * 1000000000,
                    ).toISOString(),
                }));

                const { error: cError } = await supabase
                    .from("drama_comments")
                    .insert(commentsData);
                if (cError) throw cError;
            }

            // 5. 활동 로그 기록
            const statusLabel = STATUS_LABELS[d.status] || "등록";
            await supabase.from("activities").insert({
                type: d.status === "completed" ? "review" : "upload",
                message: `'${d.title}' 데이터가 ${statusLabel} 되었습니다.`,
                batch_id: batch.id,
            });
        }

        console.log("시딩 완료!");
        return { success: true };
    },
};
