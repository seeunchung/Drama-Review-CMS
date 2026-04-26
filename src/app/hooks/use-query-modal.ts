import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * URL Query Parameter를 사용하여 모달의 열림/닫힘 상태를 관리하는 훅입니다.
 * 브라우저 뒤로가기 버튼으로 모달을 닫을 수 있는 UX를 제공합니다.
 * 
 * @param key URL에서 사용할 파라미터 키 (예: 'preview', 'edit')
 * @returns { isOpen, open, close, value }
 */
export function useQueryModal(key: string) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 해당 키가 존재하면 열린 것으로 간주
  const value = searchParams.get(key);
  const isOpen = value !== null;

  /**
   * 모달 열기
   * @param val 파라미터에 담을 값 (기본값 'y')
   */
  const open = useCallback((val: string = 'y') => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.set(key, val);
    navigate(`?${newParams.toString()}`);
  }, [key, navigate]);

  /**
   * 모달 닫기 (히스토리 뒤로가기)
   */
  const close = useCallback(() => {
    if (isOpen) {
      navigate(-1);
    }
  }, [isOpen, navigate]);

  return { isOpen, open, close, value };
}
