'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function QuoteListPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 비밀번호 확인 모달 상태
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [inputPassword, setInputPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const fetchInquiries = async () => {
      const { data } = await supabase
        .from('inquiries')
        .select('*')
        .eq('type', 'quote') // 'quote' 타입만 가져오기
        .order('created_at', { ascending: false });
      
      if (data) setInquiries(data);
      setLoading(false);
    };
    fetchInquiries();
  }, []);

  // 글 클릭 시 모달 열기
  const handleRowClick = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setInputPassword('');
    setIsUnlocked(false);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedInquiry(null);
    setInputPassword('');
    setIsUnlocked(false);
  };

  // 비밀번호 확인 로직
  const checkPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === selectedInquiry.password) {
      setIsUnlocked(true); // 비밀번호 일치 시 내용 잠금 해제
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* 상단 네비게이션 */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-3xl font-black text-blue-700 tracking-tighter">HANBI</Link>
          <div className="hidden md:flex space-x-10 font-bold text-gray-700">
            <Link href="/about" className="hover:text-blue-600 transition">회사 소개</Link>
            <Link href="/quote" className="text-blue-600 transition">견적의뢰</Link>
            <Link href="/materials" className="hover:text-blue-600 transition">자료실</Link>
            <Link href="/as" className="hover:text-blue-600 transition">A/S의뢰</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">견적 의뢰</h1>
            <p className="text-gray-600">제품 및 시스템 도입에 대한 견적을 문의해 주시면 신속하게 답변해 드립니다.</p>
          </div>
          <Link href="/quote/write" className="bg-blue-700 text-white font-bold px-6 py-3 rounded hover:bg-blue-800 transition">
            + 견적 의뢰하기
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700">
                <th className="p-4 font-bold text-center w-20">상태</th>
                <th className="p-4 font-bold">제목</th>
                <th className="p-4 font-bold text-center w-32">작성자</th>
                <th className="p-4 font-bold text-center w-32">등록일</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-bold">데이터를 불러오는 중입니다...</td></tr>
              ) : inquiries.length > 0 ? (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} onClick={() => handleRowClick(inquiry)} className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                    <td className="p-4 text-center">
                      {inquiry.is_answered ? (
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">답변완료</span>
                      ) : (
                        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded">접수대기</span>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-800 flex items-center gap-2">
                      🔒 {inquiry.title}
                    </td>
                    {/* 작성자 이름 마스킹 처리 (예: 이*한) */}
                    <td className="p-4 text-center text-gray-600">
                      {inquiry.author_name.replace(/(?<=^.)./, '*')}
                    </td>
                    <td className="p-4 text-center text-sm text-gray-500">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">등록된 견적 의뢰가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* --- 비밀번호 확인 및 내용 보기 모달 --- */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">견적 의뢰 상세 확인</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-500 font-bold text-xl">✕</button>
            </div>

            <div className="p-6">
              {!isUnlocked ? (
                // 잠금 상태: 비밀번호 입력 폼
                <form onSubmit={checkPassword} className="text-center py-6">
                  <div className="text-4xl mb-4">🔒</div>
                  <p className="font-bold text-gray-700 mb-4">작성 시 입력한 4자리 비밀번호를 입력해 주세요.</p>
                  <input 
                    type="password" 
                    maxLength={4}
                    className="border-2 border-gray-300 p-3 rounded text-center text-xl tracking-widest w-32 mx-auto focus:border-blue-500 outline-none mb-4"
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    autoFocus
                  />
                  <div>
                    <button type="submit" className="bg-blue-700 text-white font-bold px-6 py-2 rounded hover:bg-blue-800">확인</button>
                  </div>
                </form>
              ) : (
                // 잠금 해제 상태: 상세 내용 표시
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold border-b pb-2">{selectedInquiry.title}</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded border">
                    <div><span className="font-bold text-gray-600">작성자:</span> {selectedInquiry.author_name}</div>
                    <div><span className="font-bold text-gray-600">연락처:</span> {selectedInquiry.contact}</div>
                    <div className="col-span-2"><span className="font-bold text-gray-600">이메일:</span> {selectedInquiry.email}</div>
                  </div>
                  <div className="bg-white border p-4 rounded min-h-[150px] whitespace-pre-wrap text-gray-800">
                    {selectedInquiry.content}
                  </div>
                  {selectedInquiry.file_url && (
                    <div className="border-t pt-4">
                      <span className="font-bold text-gray-600 mr-2">첨부파일:</span>
                      <a href={selectedInquiry.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">
                        다운로드
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}