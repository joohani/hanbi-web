'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function QuoteWritePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let fileUrl = null;

    // 1. 첨부파일이 있다면 Storage에 먼저 업로드
    if (attachedFile) {
      const fileExt = attachedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('inquiries').upload(fileName, attachedFile);
      
      if (uploadError) {
        alert('파일 업로드에 실패했습니다.');
        setLoading(false);
        return;
      }
      
      const { data: publicUrlData } = supabase.storage.from('inquiries').getPublicUrl(fileName);
      fileUrl = publicUrlData.publicUrl;
    }

    // 2. 입력받은 정보들을 inquiries DB에 삽입 (type은 'quote'로 고정)
    const { error: dbError } = await supabase.from('inquiries').insert([{
      type: 'quote',
      title,
      author_name: authorName,
      contact,
      email,
      password,
      content,
      file_url: fileUrl
    }]);

    if (dbError) {
      alert('등록 중 오류가 발생했습니다: ' + dbError.message);
    } else {
      alert('견적 의뢰가 성공적으로 접수되었습니다. 담당자 확인 후 연락드리겠습니다.');
      // 등록 완료 후 목록 페이지로 이동
      router.push('/quote');
    }
    setLoading(false);
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

      <main className="max-w-3xl mx-auto px-6 pt-16">
        <h1 className="text-3xl font-black mb-6">견적 의뢰 작성</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">작성자명 / 회사명 *</label>
              <input className="w-full border p-3 rounded" required value={authorName} onChange={e => setAuthorName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">연락처 *</label>
              <input className="w-full border p-3 rounded" placeholder="010-0000-0000" required value={contact} onChange={e => setContact(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">이메일 *</label>
              <input type="email" className="w-full border p-3 rounded" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">비밀번호 (4자리) *</label>
              <input type="password" maxLength={4} placeholder="글 확인 시 필요합니다" className="w-full border p-3 rounded tracking-widest font-bold" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">제목 *</label>
            <input className="w-full border p-3 rounded" placeholder="어떤 제품의 견적을 원하시나요?" required value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">문의 내용 *</label>
            <textarea className="w-full border p-3 rounded h-40" placeholder="사용 환경, 적용 나사, 필요 수량 등을 자세히 적어주시면 더 정확한 견적이 가능합니다." required value={content} onChange={e => setContent(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">도면 / 사진 첨부 (선택)</label>
            <input type="file" className="w-full border p-2 rounded bg-gray-50" onChange={e => setAttachedFile(e.target.files ? e.target.files[0] : null)} />
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Link href="/quote" className="flex-1 text-center bg-gray-200 text-gray-800 font-bold py-4 rounded hover:bg-gray-300 transition">취소</Link>
            <button type="submit" disabled={loading} className="flex-[2] bg-blue-700 text-white font-bold py-4 rounded hover:bg-blue-800 transition disabled:bg-gray-400">
              {loading ? '등록 중...' : '견적 의뢰 등록하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}