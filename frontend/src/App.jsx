import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { GeometricDecorations } from './components/GeometricDecorations';
import { Dashboard } from './components/Dashboard/Dashboard';
import { BookCatalog } from './components/BookCatalog/BookCatalog';
import { IssueBookForm } from './components/IssueBook/IssueBookForm';
import { StudentPortal } from './components/StudentPortal/StudentPortal';
import { Reports } from './components/Reports/Reports';
import { AuthModal } from './components/Auth/AuthModal';
import { NotificationsModal } from './components/NotificationsModal';
import { booksAPI, studentsAPI, transactionsAPI, reportsAPI } from './api/api';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

function LibraryApp() {
  const { user, isLoginModalOpen, setIsLoginModalOpen } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [preselectedBook, setPreselectedBook] = useState(null);

  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Show auto-dismissing toast notifications
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Load backend data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksRes, studentsRes, transRes, statsRes] = await Promise.allSettled([
        booksAPI.getAll(),
        studentsAPI.getAll(),
        transactionsAPI.getAll(),
        reportsAPI.getStats()
      ]);

      if (booksRes.status === 'fulfilled' && booksRes.value?.data?.success) {
        setBooks(booksRes.value.data.data);
      }
      if (studentsRes.status === 'fulfilled' && studentsRes.value?.data?.success) {
        setStudents(studentsRes.value.data.data);
      }
      if (transRes.status === 'fulfilled' && transRes.value?.data?.success) {
        setTransactions(transRes.value.data.data);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value?.data?.success) {
        setStats(statsRes.value.data.data);
      }
    } catch (err) {
      console.warn('Backend offline or initializing; using built-in seed state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // When user clicks Search from Dashboard Hero
  const handleSearchSubmit = () => {
    setActiveTab('catalog');
  };

  // When user clicks "Request Book" or "Issue This Book"
  const handleQuickIssue = (book) => {
    setPreselectedBook(book);
    setActiveTab('issue-book');
    showToast('info', `Selected "${book.title}" for issue transaction.`);
  };

  // Handle successful book issuance
  const handleIssueSuccess = (newTransaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
    // Update local book availability
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === newTransaction.book_id) {
          const avail = Math.max(0, (b.available_copies ?? 1) - 1);
          return {
            ...b,
            available_copies: avail,
            status: avail === 0 ? 'Issued' : 'Available'
          };
        }
        return b;
      })
    );
    // Refresh stats
    reportsAPI.getStats().then((res) => {
      if (res.data?.success) setStats(res.data.data);
    }).catch(() => {});

    showToast('success', `Book successfully checked out to ${newTransaction.student_name}!`);
  };

  // Handle book return
  const handleReturnBook = async (transactionId) => {
    try {
      const res = await transactionsAPI.returnBook(transactionId, { condition: 'Good' });
      if (res.data?.success) {
        const updated = res.data.data;
        setTransactions((prev) =>
          prev.map((t) => (t.id === transactionId ? updated : t))
        );
        // Restock copy
        setBooks((prev) =>
          prev.map((b) => {
            if (b.id === updated.book_id) {
              const avail = (b.available_copies ?? 0) + 1;
              return { ...b, available_copies: avail, status: 'Available' };
            }
            return b;
          })
        );
        reportsAPI.getStats().then((res) => {
          if (res.data?.success) setStats(res.data.data);
        }).catch(() => {});

        showToast('success', `Transaction #${updated.transaction_code} returned & copy restocked.`);
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to process return.');
    }
  };

  // Handle book renewal
  const handleRenewBook = async (transactionId, additionalDays = 14) => {
    try {
      const res = await transactionsAPI.renewBook(transactionId, { additionalDays });
      if (res.data?.success) {
        const updated = res.data.data;
        setTransactions((prev) =>
          prev.map((t) => (t.id === transactionId ? updated : t))
        );
        showToast('success', `Due date extended to ${updated.return_due_date}!`);
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to renew book loan.');
    }
  };

  // Handle adding new book (librarian only)
  const handleAddBook = async (bookData) => {
    const res = await booksAPI.create(bookData);
    if (res.data?.success) {
      setBooks((prev) => [res.data.data, ...prev]);
      showToast('success', `Added "${res.data.data.title}" to catalog repository!`);
    }
  };

  const overdueList = transactions.filter((t) => t.status === 'Overdue');
  const overdueCount = overdueList.length || stats?.overdueBooks || 4;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 relative selection:bg-[#C5A25A]/30 selection:text-[#0F3D3E]">
      {/* Background Graphic Lines and Dot Grids matching reference screenshots */}
      <GeometricDecorations />

      {/* Sticky Top Academic Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        overdueCount={overdueCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Toast Feedback Notification Banner */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold ${
            toast.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : toast.type === 'error'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : 'bg-[#0F3D3E] text-amber-100 border-[#C5A25A]'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Sparkles className="w-4 h-4 text-[#C5A25A] shrink-0" />}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-300 hover:text-white cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Module 1: Dashboard (Matches Screenshot 2) */}
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            books={books}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            onSelectBook={handleQuickIssue}
          />
        )}

        {/* Module 2: Book Catalog (Matches Screenshot 4) */}
        {activeTab === 'catalog' && (
          <BookCatalog
            books={books}
            onAddBook={handleAddBook}
            onQuickIssue={handleQuickIssue}
          />
        )}

        {/* Module 3: Issue Book (Matches Screenshot 1) */}
        {activeTab === 'issue-book' && (
          <IssueBookForm
            books={books}
            students={students}
            onIssueSuccess={handleIssueSuccess}
            preselectedBook={preselectedBook}
          />
        )}

        {/* Module 4: Student Portal (Matches Screenshot 3) */}
        {activeTab === 'student-portal' && (
          <StudentPortal
            transactions={transactions}
            stats={stats}
            onReturnBook={handleReturnBook}
            onRenewBook={handleRenewBook}
          />
        )}

        {/* Module 5: Reports */}
        {activeTab === 'reports' && (
          <Reports
            transactions={transactions}
            books={books}
            stats={stats}
          />
        )}
      </main>

      {/* Auth Modal (Login / Register / JWT) */}
      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Overdue Notifications & Notice Dispatch Drawer */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        overdueTransactions={overdueList}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LibraryApp />
    </AuthProvider>
  );
}
