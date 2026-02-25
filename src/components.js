import React from 'react';
import { X, Plus } from 'lucide-react';

export const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-xl text-slate-800">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 max-h-[75vh] overflow-y-auto">{children}</div>
    </div>
  </div>
);

export const SectionHeader = ({ title, onAdd, icon: Icon }) => (
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
      {Icon && <Icon className="w-8 h-8 text-indigo-600" />}
      {title}
    </h2>
    {onAdd && (
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
      >
        <Plus className="w-5 h-5" /> Add New
      </button>
    )}
  </div>
);
