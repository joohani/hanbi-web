'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* --- 상단 네비게이션 --- */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-3xl font-black text-blue-700 tracking-tighter">HANBI</Link>
          <div className="hidden md:flex space-x-10 font-bold text-gray-700">
            <Link href="/about" className="text-blue-600 transition">회사 소개</Link>
            <Link href="/quote" className="hover:text-blue-600 transition">견적의뢰</Link>
            <Link href="/materials" className="hover:text-blue-600 transition">자료실</Link>
            <Link href="/as" className="hover:text-blue-600 transition">A/S의뢰</Link>
          </div>
        </div>
      </nav>

      {/* --- 히어로 섹션 --- */}
      <section className="bg-blue-900 py-24 px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            산업 자동화의 미래를 연결하는 <br className="hidden md:block" />
            <span className="text-blue-300">한비(HANBI) 시스템</span>
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed opacity-90">
            우리는 최고의 정밀도와 내구성을 자랑하는 파스너 솔루션을 통해 <br />
            고객사의 생산 공정 혁신을 지원합니다.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-20 space-y-32">
        
        {/* --- 1. 비전 (Vision) --- */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Our Vision</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-10 border rounded-2xl bg-gray-50">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-3">최고의 품질</h3>
              <p className="text-gray-600 text-sm leading-relaxed">검증된 글로벌 브랜드와의 파트너십을 통해 타협하지 않는 품질을 제공합니다.</p>
            </div>
            <div className="p-10 border rounded-2xl bg-gray-50">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3">고객 신뢰</h3>
              <p className="text-gray-600 text-sm leading-relaxed">단순한 판매를 넘어 철저한 사후 관리와 기술 지원으로 고객의 성공을 돕습니다.</p>
            </div>
            <div className="p-10 border rounded-2xl bg-gray-50">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-3">기술 혁신</h3>
              <p className="text-gray-600 text-sm leading-relaxed">변화하는 산업 현장에 맞춘 최적화된 자동화 체결 솔루션을 지속적으로 연구합니다.</p>
            </div>
          </div>
        </section>

        {/* --- 2. 회사 연혁 (History) --- */}
        <section className="bg-gray-50 -mx-6 px-6 py-20 rounded-3xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 mb-12 flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-600 inline-block"></span>
              연혁 (History)
            </h2>
            <div className="space-y-12 border-l-2 border-blue-200 ml-4 pl-10 relative">
              <div className="relative">
                <span className="absolute -left-[49px] top-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></span>
                <h4 className="text-2xl font-bold text-blue-700 mb-2">2026 ~ Present</h4>
                <p className="text-gray-700 font-medium text-lg">홈페이지 리뉴얼 및 통합 솔루션 시스템 구축</p>
                <p className="text-gray-500 text-sm mt-1">산업용 너트런너 및 토크관리 프로그램 공급 확대</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[49px] top-1 w-4 h-4 bg-blue-300 rounded-full border-4 border-white"></span>
                <h4 className="text-2xl font-bold text-gray-800 mb-2">2020</h4>
                <p className="text-gray-700 font-medium text-lg">OHTAKE, CEDAR, URAWA 공식 대리점 체결</p>
                <p className="text-gray-500 text-sm mt-1">정밀 나사공급기 및 토크측정기 국내 시장 점유율 1위 달성</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[49px] top-1 w-4 h-4 bg-blue-300 rounded-full border-4 border-white"></span>
                <h4 className="text-2xl font-bold text-gray-800 mb-2">2015</h4>
                <p className="text-gray-700 font-medium text-lg">한비 시스템(HANBI System) 설립</p>
                <p className="text-gray-500 text-sm mt-1">산업용 전동드라이버 및 소모품 공급 시작</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. 조직도 (Organization) --- */}
        <section>
          <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">Organization</h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              {/* 대표이사 */}
              <div className="bg-gray-900 text-white px-10 py-4 rounded shadow-md font-bold text-xl mb-12 relative">
                대표이사 (CEO)
                <div className="absolute left-1/2 -bottom-12 w-0.5 h-12 bg-gray-300"></div>
              </div>
              {/* 중간 선 */}
              <div className="w-full h-0.5 bg-gray-300 relative mb-12">
                <div className="absolute left-0 -bottom-12 w-0.5 h-12 bg-gray-300"></div>
                <div className="absolute left-1/3 -bottom-12 w-0.5 h-12 bg-gray-300"></div>
                <div className="absolute left-2/3 -bottom-12 w-0.5 h-12 bg-gray-300"></div>
                <div className="absolute left-full -bottom-12 w-0.5 h-12 bg-gray-300"></div>
              </div>
              {/* 부서들 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-center">
                <div className="bg-white border-2 border-gray-200 p-4 rounded-xl font-bold text-gray-700 shadow-sm">경영지원팀</div>
                <div className="bg-white border-2 border-gray-200 p-4 rounded-xl font-bold text-blue-700 shadow-sm">기술영업팀</div>
                <div className="bg-white border-2 border-gray-200 p-4 rounded-xl font-bold text-blue-700 shadow-sm">기술지원(A/S)팀</div>
                <div className="bg-white border-2 border-gray-200 p-4 rounded-xl font-bold text-gray-700 shadow-sm">생산물류팀</div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* --- 공통 푸터 (레이아웃 파일에서 제공되지만 확인용으로 구조만 유지) --- */}
    </div>
  );
}