import React, { useState, useEffect } from 'react';
import { Search, QrCode, Calendar, CheckCircle2, ArrowRight, BookOpen, User, RefreshCw } from 'lucide-react';
import { transactionsAPI } from '../../api/api';

export const IssueBookForm = ({
  books = [],
  students = [],
  onIssueSuccess,
  preselectedBook = null
}) => {
  const [selectedStudent, setSelectedStudent] = useState(students[0] || null);
  const [selectedBook, setSelectedBook] = useState(preselectedBook || books[0] || null);

  const [studentInput, setStudentInput] = useState(students[0]?.student_code || '22401');
  const [studentName, setStudentName] = useState(students[0]?.name || 'Karie Berlinn');

  const [bookIdInput, setBookIdInput] = useState(preselectedBook ? String(preselectedBook.id) : (books[0] ? String(books[0].id) : '1'));
  const [bookTitle, setBookTitle] = useState(preselectedBook ? preselectedBook.title : (books[0]?.title || 'The Silent Patient'));

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDue = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [issueDate, setIssueDate] = useState(todayStr);
  const [returnDueDate, setReturnDueDate] = useState(defaultDue);

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    if (preselectedBook) {
      setSelectedBook(preselectedBook);
      setBookIdInput(String(preselectedBook.id));
      setBookTitle(preselectedBook.title);
    }
  }, [preselectedBook]);

  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0]);
      setStudentInput(students[0].student_code);
      setStudentName(students[0].name);
    }
    if (books.length > 0 && !selectedBook) {
      setSelectedBook(books[0]);
      setBookIdInput(String(books[0].id));
      setBookTitle(books[0].title);
    }
  }, [students, books]);

  // Handle student search/selection
  const handleStudentSearch = () => {
    const found = students.find(
      s => s.student_code.toLowerCase() === studentInput.toLowerCase() ||
           s.name.toLowerCase().includes(studentInput.toLowerCase()) ||
           String(s.id) === studentInput
    );
    if (found) {
      setSelectedStudent(found);
      setStudentName(found.name);
      setStudentInput(found.student_code);
      setFeedback({ type: 'success', message: `Found student: ${found.name}` });
    } else {
      setFeedback({ type: 'error', message: 'No student matches that ID or name' });
    }
  };

  // Handle book selection
  const handleBookSelect = (bookId) => {
    const found = books.find(b => String(b.id) === String(bookId) || b.isbn === bookId);
    if (found) {
      setSelectedBook(found);
      setBookIdInput(String(found.id));
      setBookTitle(found.title);
    }
  };

  const handleClear = () => {
    setStudentInput('');
    setStudentName('');
    setSelectedStudent(null);
    setBookIdInput('');
    setBookTitle('');
    setSelectedBook(null);
    setIssueDate(todayStr);
    setReturnDueDate(defaultDue);
    setFeedback({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedBook) {
      setFeedback({ type: 'error', message: 'Please select both an active student and an available book' });
      return;
    }

    if (selectedBook.available_copies <= 0 && selectedBook.status === 'Issued') {
      setFeedback({ type: 'error', message: 'This book has 0 available copies right now' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const payload = {
        student_id: selectedStudent.id,
        student_code: selectedStudent.student_code,
        student_name: selectedStudent.name,
        book_id: selectedBook.id,
        book_title: selectedBook.title,
        issue_date: issueDate,
        return_due_date: returnDueDate,
        notes: 'Library desk issue'
      };

      const res = await transactionsAPI.issue(payload);
      if (res.data?.success) {
        const newTrans = res.data.data;
        setRecentTransactions(prev => [newTrans, ...prev.slice(0, 4)]);
        setFeedback({ type: 'success', message: `Book issued successfully! Transaction #${newTrans.transaction_code}` });
        if (onIssueSuccess) onIssueSuccess(newTrans);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to issue book. Please check details.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3D3E] font-serif tracking-tight uppercase">
          BOOK ISSUE & RETURN FORM
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Issue catalog books to enrolled students with automatic inventory and return tracking.
        </p>
      </div>

      {feedback.message && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
          feedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="cursor-pointer text-slate-400 hover:text-slate-600">×</button>
        </div>
      )}

      {/* Main Grid: Form on Left + Side Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Transaction Form Card */}
        <div className="lg:col-span-8 academic-card p-6 sm:p-7 bg-white border border-[#C5A25A]/40 shadow-sm relative">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-4 bg-[#0F3D3E] rounded-full inline-block" />
              New Transaction Details
            </h2>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-semibold text-slate-500 hover:text-[#0F3D3E] cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Clear Fields
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Student ID & Student Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Student ID
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={studentInput}
                    onChange={(e) => {
                      setStudentInput(e.target.value);
                      const found = students.find(s => s.student_code === e.target.value);
                      if (found) {
                        setSelectedStudent(found);
                        setStudentName(found.name);
                      }
                    }}
                    placeholder="Enter Student ID (e.g. 22401)"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A25A] focus:border-[#C5A25A] focus:bg-white transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={handleStudentSearch}
                    className="absolute right-2 p-1.5 text-slate-400 hover:text-[#0F3D3E] cursor-pointer rounded-md hover:bg-slate-200/60"
                    title="Search student record"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Student Name or searchable"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-100/80 border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* Row 2: Select Book ID & Select Book Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Book ID
                </label>
                <div className="relative flex items-center">
                  <select
                    value={bookIdInput}
                    onChange={(e) => handleBookSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A25A] focus:border-[#C5A25A] focus:bg-white transition-all appearance-none pr-10 cursor-pointer"
                  >
                    {books.map(b => (
                      <option key={b.id} value={b.id}>
                        #{b.id} - {b.title} ({b.status})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 pointer-events-none text-slate-400">
                    <QrCode className="w-4 h-4 text-[#0F3D3E]" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Book Title
                </label>
                <input
                  type="text"
                  value={bookTitle}
                  readOnly
                  placeholder="Select Book Title"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-100/80 border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none truncate"
                />
              </div>
            </div>

            {/* Row 3: Issue Date & Return Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Issue Date
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A25A] focus:border-[#C5A25A] cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Return Due Date
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    value={returnDueDate}
                    onChange={(e) => setReturnDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A25A] focus:border-[#C5A25A] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Submit Transaction Button matching Screenshot 2 */}
            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#0F3D3E] hover:bg-[#165355] text-[#DFC27D] font-extrabold text-xs sm:text-sm rounded-xl border border-[#C5A25A]/60 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center gap-2 hover:scale-102"
              >
                <span>{isSubmitting ? 'Processing Issue...' : 'Submit Transaction'}</span>
                <ArrowRight className="w-4 h-4 text-[#C5A25A]" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Side Preview Card matching Screenshot 2 */}
        <div className="lg:col-span-4">
          <div className="academic-card p-5 bg-white border border-[#0F3D3E]/30 rounded-2xl shadow-md overflow-hidden space-y-4">
            
            {/* Header pill */}
            <div className="bg-[#0F3D3E] text-white px-4 py-2 rounded-xl text-center shadow-inner">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#DFC27D]">
                Side Preview
              </h3>
            </div>

            {/* Student Preview Card */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Student Profile</div>
              {selectedStudent ? (
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-[#C5A25A] bg-slate-200 shrink-0">
                    <img
                      src={selectedStudent.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={selectedStudent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{selectedStudent.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">Student - ID: <span className="text-[#0F3D3E] font-bold">{selectedStudent.student_code}</span></p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      {selectedStudent.department || 'Enrolled'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">
                  Select student to view record
                </div>
              )}
            </div>

            {/* Book Preview Card */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Book Selection</div>
              {selectedBook ? (
                <div className="flex gap-3">
                  <div className="w-16 aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                    <img
                      src={selectedBook.cover_url}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2">{selectedBook.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{selectedBook.author}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                        selectedBook.status === 'Available'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}>
                        {selectedBook.status}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {selectedBook.available_copies ?? 4} copies
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">
                  Select book to view details
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Active Issue List Section matching Screenshot 2 */}
      <div className="academic-card p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-4 bg-[#C5A25A] rounded-full inline-block" />
              Active Issue List
            </h3>
            <p className="text-xs text-slate-400">Real-time checkout records processed in current session</p>
          </div>

          <button
            onClick={() => setRecentTransactions([])}
            className="px-3.5 py-1.5 border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Clear Form
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold bg-slate-50/60">
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Book</th>
                <th className="py-2.5 px-4">Issue Date</th>
                <th className="py-2.5 px-4">Return Date</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((tx) => (
                  <tr key={tx.id || tx.transaction_code} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">{tx.student_name}</td>
                    <td className="py-3 px-4 text-slate-700">{tx.book_title}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-xs">{tx.issue_date}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-xs">{tx.return_due_date}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full uppercase tracking-wider">
                        {tx.status || 'Recent'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800">Karie Berlinn</td>
                  <td className="py-3 px-4 text-slate-700">The Silent Patient</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-xs">02/03/2023</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-xs">06/07/2023</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 bg-teal-100 text-teal-800 font-bold text-[10px] rounded-full uppercase tracking-wider">
                      Recent
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
