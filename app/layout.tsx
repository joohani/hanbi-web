import type { Metadata } from 'next';
import './globals.css';
import Sidebar from './Sidebar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'HANBISYSTEM - 파스너 및 조립 자동화 솔루션 전문 기업',
  description: 'OHTAKE 나사공급기, 자동화 체결기 등 최고 품질의 산업용 솔루션을 제공합니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
        
        {/* --- 공통 상단 네비게이션 --- */}
        {/* ★ 변경점: max-w-[1440px]로 넓혀서 좌우 여백을 줄임 */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="text-3xl font-black text-blue-700 tracking-tighter">HANBI</Link>
            <div className="hidden md:flex space-x-10 font-bold text-gray-700">
              <Link href="/about" className="hover:text-blue-600 transition">회사 소개</Link>
              <Link href="/quote" className="hover:text-blue-600 transition">견적의뢰</Link>
              <Link href="/materials" className="hover:text-blue-600 transition">자료실</Link>
              <Link href="/as" className="hover:text-blue-600 transition">A/S의뢰</Link>
              <Link href="/admin" className="text-gray-400 hover:text-gray-900 transition text-sm flex items-center">⚙️ 관리자</Link>
            </div>
          </div>
        </nav>

        {/* --- 메인 레이아웃: 좌측 메뉴(트리) + 우측 콘텐츠 --- */}
        {/* ★ 변경점: max-w-[1440px] 적용 및 사이드바와의 간격(gap) 조절 */}
        <div className="max-w-[1440px] w-full mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 pt-8 px-6 lg:px-8 flex-1 bg-white">
          
          <Sidebar />

          {/* min-w-0을 주어 콘텐츠가 화면 밖으로 넘치는 것을 방지 */}
          <main className="flex-1 pb-20 bg-white min-w-0">
            {children}
          </main>

        </div>

        {/* --- 전역 푸터 --- */}
        <footer className="bg-gray-900 text-gray-400 py-12 px-6 lg:px-8 mt-auto">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-2xl font-black text-white mb-4 tracking-tighter">HANBI</div>
              <p className="text-sm leading-relaxed mb-2 text-gray-400">
                <span className="font-bold text-gray-300">상호명:</span> (주)한비시스템 <br />
                <span className="font-bold text-gray-300">주소:</span> 서울시 구로구 경인로 53길 32 미래에코타워 406호 <br />
                <span className="font-bold text-gray-300">대표자:</span> 최영석 &nbsp;|&nbsp; <span className="font-bold text-gray-300">사업자등록번호:</span> 113-14-47079
              </p>
              <p className="text-sm leading-relaxed text-gray-400">
                <span className="font-bold text-gray-300">TEL:</span> 02)2069-2871  &nbsp;|&nbsp; <span className="font-bold text-gray-300">FAX:</span> 02)2069-2872 <br />
                <span className="font-bold text-gray-300">EMAIL:</span> contact@hanbi-tech.co.kr
              </p>
            </div>
            <div className="md:text-right flex flex-col justify-end">
              <div className="flex gap-4 md:justify-end mb-4 text-sm font-bold text-gray-300">
                <Link href="/about" className="hover:text-white transition">회사소개</Link>
                <Link href="#" className="hover:text-white transition">이용약관</Link>
                <Link href="#" className="hover:text-white transition">개인정보처리방침</Link>
              </div>
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} HANBI Tech Co., Ltd. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}