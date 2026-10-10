import React from 'react';
import { BookOpen, CheckCircle, AlertTriangle, Users, TrendingUp, TrendingDown } from 'lucide-react';

export const StatCards = ({ stats }) => {
  const defaultStats = {
    totalBooks: stats?.totalBooks || 48512,
    totalBooksChange: stats?.totalBooksChange || '+12%',
    issuedBooks: stats?.issuedBooks || 12105,
    issuedBooksChange: stats?.issuedBooksChange || '+8% active',
    overdueBooks: stats?.overdueBooks || 319,
    overdueBooksChange: stats?.overdueBooksChange || '-3%',
    activeStudents: stats?.activeStudents || 8940,
    activeStudentsChange: stats?.activeStudentsChange || '+5% new',
  };

  const cardList = [
    {
      title: 'Total Books',
      value: Number(defaultStats.totalBooks).toLocaleString(),
      change: defaultStats.totalBooksChange,
      isPositive: true,
      icon: BookOpen,
      iconBg: 'bg-[#0F3D3E]',
      iconColor: 'text-[#DFC27D]',
      changeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Issued Books',
      value: Number(defaultStats.issuedBooks).toLocaleString(),
      change: defaultStats.issuedBooksChange,
      isPositive: true,
      icon: CheckCircle,
      iconBg: 'bg-[#C5A25A]',
      iconColor: 'text-white',
      changeBg: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Overdue Books',
      value: Number(defaultStats.overdueBooks).toLocaleString(),
      change: defaultStats.overdueBooksChange,
      isPositive: false,
      icon: AlertTriangle,
      iconBg: 'bg-red-600',
      iconColor: 'text-white',
      changeBg: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      title: 'Active Students',
      value: Number(defaultStats.activeStudents).toLocaleString(),
      change: defaultStats.activeStudentsChange,
      isPositive: true,
      icon: Users,
      iconBg: 'bg-[#165355]',
      iconColor: 'text-[#C5A25A]',
      changeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  return (
    <div className="flex flex-col gap-3.5 h-full justify-between">
      {cardList.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="academic-card p-4 sm:p-5 flex items-center justify-between border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor} shadow-md group-hover:scale-105 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F3D3E] tracking-tight mt-0.5">
                  {card.value}
                </h3>
              </div>
            </div>

            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${card.changeBg}`}>
              {card.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{card.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
