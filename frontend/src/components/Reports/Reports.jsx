import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { FileDown, Printer, Mail, TrendingUp, AlertTriangle, CheckCircle, BookOpen, Users, Calendar, Download } from 'lucide-react';
import { reportsAPI } from '../../api/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Reports = ({ transactions = [], books = [], stats }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailStatus, setEmailStatus] = useState({ sent: false, count: 0 });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await reportsAPI.getAnalytics();
        if (res.data?.success) {
          setReportData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load reports API data, using fallback state:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Compute stats if backend reports are loading or offline
  const totalLoans = stats?.issuedBooks || 12105;
  const overdueLoans = stats?.overdueBooks || 319;
  const activeMembers = stats?.activeStudents || 8940;

  // Monthly trends chart data
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Books Issued',
        data: [820, 950, 1100, 980, 1250, 1050, 890, 1120, 1340, 1205],
        backgroundColor: '#0F3D3E',
        borderRadius: 6
      },
      {
        label: 'Books Returned',
        data: [790, 910, 1040, 960, 1210, 1020, 870, 1080, 1290, 1180],
        backgroundColor: '#C5A25A',
        borderRadius: 6
      },
      {
        label: 'Overdue Incidents',
        data: [30, 40, 60, 20, 40, 30, 20, 40, 50, 25],
        backgroundColor: '#DC2626',
        borderRadius: 6
      }
    ]
  };

  // Category distribution chart data
  const genreData = {
    labels: ['Fiction', 'Non-Fiction', 'History', 'Science', 'Others'],
    datasets: [
      {
        data: [35, 28, 18, 14, 5],
        backgroundColor: ['#0F3D3E', '#C5A25A', '#165355', '#DFC27D', '#94A3B8'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = ['Issue ID', 'Student Name', 'Book Title', 'Issue Date', 'Due Date', 'Status', 'Fine Amount'];
    const rows = transactions.map(t => [
      t.transaction_code || `100000${t.id}`,
      `"${t.student_name || 'Student'}"`,
      `"${t.book_title || 'Book'}"`,
      t.issue_date,
      t.return_due_date,
      t.status,
      `$${Number(t.fine_amount || 0).toFixed(2)}`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Academic_Hub_Circulation_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print / PDF handler
  const handlePrint = () => {
    window.print();
  };

  // Send Email Notification simulation
  const handleSendOverdueReminders = () => {
    const overdueTotal = transactions.filter(t => t.status === 'Overdue').length || 4;
    setEmailStatus({ sent: true, count: overdueTotal });
    setTimeout(() => {
      setEmailStatus({ sent: false, count: 0 });
    }, 5000);
  };

  const topBooks = [
    { title: 'The Silent Patient', author: 'Alex Michaelides', borrows: 142, copies: 6, demand: 'High Demand' },
    { title: 'Atomic Habits', author: 'James Clear', borrows: 128, copies: 12, demand: 'High Demand' },
    { title: 'Dune', author: 'Frank Herbert', borrows: 115, copies: 8, demand: 'Popular' },
    { title: '1984', author: 'George Orwell', borrows: 98, copies: 7, demand: 'Popular' },
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', borrows: 89, copies: 10, demand: 'Steady' }
  ];

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3D3E] font-serif tracking-tight">
            Library Analytics & Administrative Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Audit circulation volumes, evaluate collection demand, and generate certified reports.
          </p>
        </div>

        {/* Action Controls: Export CSV, Print PDF, Send Email */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer hover:border-[#C5A25A]"
          >
            <Download className="w-3.5 h-3.5 text-[#0F3D3E]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer hover:border-[#C5A25A]"
          >
            <Printer className="w-3.5 h-3.5 text-[#0F3D3E]" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleSendOverdueReminders}
            className="px-4 py-2 bg-[#0F3D3E] hover:bg-[#165355] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer hover:scale-102"
          >
            <Mail className="w-3.5 h-3.5 text-[#C5A25A]" />
            <span>Send Overdue Notices</span>
          </button>
        </div>
      </div>

      {/* Reminder notification toast */}
      {emailStatus.sent && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Email reminders successfully dispatched to {emailStatus.count} students with overdue borrowings.</span>
        </div>
      )}

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="academic-card p-4 sm:p-5 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Total Circulation</span>
            <BookOpen className="w-4 h-4 text-[#0F3D3E]" />
          </div>
          <div className="text-2xl font-extrabold text-[#0F3D3E] mt-2">{Number(totalLoans).toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">▲ 12% vs last quarter</p>
        </div>

        <div className="academic-card p-4 sm:p-5 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Active Borrowers</span>
            <Users className="w-4 h-4 text-[#C5A25A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#0F3D3E] mt-2">{Number(activeMembers).toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">▲ 5% newly registered</p>
        </div>

        <div className="academic-card p-4 sm:p-5 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Return Compliance</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">98.4%</div>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">Average loan period: 14.2 days</p>
        </div>

        <div className="academic-card p-4 sm:p-5 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Overdue Incident Rate</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-extrabold text-red-600 mt-2">{overdueLoans}</div>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">Down by 3% this month</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Activity Bar Chart (Span 8) */}
        <div className="lg:col-span-8 academic-card p-5 sm:p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">Circulation & Return Trends</h3>
              <p className="text-xs text-slate-500">Monthly breakdown of borrow requests, check-ins, and delinquent loans</p>
            </div>
            <span className="text-[11px] font-bold text-[#0F3D3E] bg-slate-100 px-2.5 py-1 rounded-md">
              Current Academic Year
            </span>
          </div>

          <div className="h-72 w-full">
            <Bar
              data={monthlyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: { boxWidth: 12, font: { size: 11 } }
                  }
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { color: '#f1f5f9' }, beginAtZero: true }
                }
              }}
            />
          </div>
        </div>

        {/* Category Share Doughnut Chart (Span 4) */}
        <div className="lg:col-span-4 academic-card p-5 sm:p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">Subject Distribution</h3>
            <p className="text-xs text-slate-500">Circulation percentage by category</p>
          </div>

          <div className="h-56 w-full my-auto flex items-center justify-center">
            <Doughnut
              data={genreData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { boxWidth: 10, font: { size: 11 } }
                  }
                },
                cutout: '65%'
              }}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-xs font-semibold text-slate-600">
              Fiction & Non-Fiction drive <strong className="text-[#0F3D3E]">63%</strong> of total borrowings.
            </span>
          </div>
        </div>

      </div>

      {/* Most Borrowed Books Table */}
      <div className="academic-card p-5 sm:p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">Most Borrowed Titles</h3>
            <p className="text-xs text-slate-500">Highest circulation assets in the academic library catalog</p>
          </div>
          <span className="text-xs font-bold text-[#C5A25A] uppercase tracking-wider">Top 5 Titles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Author</th>
                <th className="py-2.5 px-3 text-center">Total Loans</th>
                <th className="py-2.5 px-3 text-center">Inventory Size</th>
                <th className="py-2.5 px-3 text-center">Demand Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topBooks.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-400">#{index + 1}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{item.title}</td>
                  <td className="py-3 px-3 text-slate-600">{item.author}</td>
                  <td className="py-3 px-3 text-center font-bold text-[#0F3D3E]">{item.borrows}</td>
                  <td className="py-3 px-3 text-center text-slate-600">{item.copies} copies</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.demand === 'High Demand'
                        ? 'bg-amber-100 text-amber-800'
                        : item.demand === 'Popular'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.demand}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
