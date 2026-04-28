import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { HOME_PATH } from "@/app/paths";
import "./styles.css";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    // 인증 후 돌아갈 경로 (기본값은 홈)
    const from = location.state?.from?.pathname || HOME_PATH;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        login(email, password);
    };

    const handleGuestLogin = async () => {
        // 환경 변수에서 데모 계정 정보를 가져옵니다.
        const demoEmail = import.meta.env.VITE_DEMO_EMAIL as string;
        const demoPassword = import.meta.env.VITE_DEMO_PASSWORD as string;

        if (!demoEmail || !demoPassword) {
            setError("데모 계정 설정이 되어 있지 않습니다.");
            return;
        }

        setEmail(demoEmail);
        setPassword(demoPassword);
        login(demoEmail, demoPassword);
    };

    const login = async (emailStr: string, passwordStr: string) => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: emailStr,
                password: passwordStr,
            });

            if (error) throw error;

            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || "로그인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card panel">
                <div className="login-header">
                    <h1 className="login-title">Drama Admin CMS</h1>
                    <p className="login-subtitle">
                        워크스페이스에 접근하기 위해 로그인하세요.
                    </p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div className="shortcut-section">
                    <div className="divider">
                        <span>또는</span>
                    </div>
                    <button
                        type="button"
                        className="guest-login-btn"
                        onClick={handleGuestLogin}
                        disabled={loading}
                    >
                        데모 계정으로 바로 시작하기
                    </button>
                </div>

                <div className="login-footer">
                    <p>계정이 없으신가요? 관리자에게 문의하세요.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
