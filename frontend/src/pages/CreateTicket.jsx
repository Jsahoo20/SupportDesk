import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Send, Paperclip, X, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { DEPARTMENTS, TICKET_PRIORITIES } from '../constants/app';

export default function CreateTicket() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      alert('Max 5 files allowed');
      return;
    }
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('category', data.category);
    formData.append('subject', data.subject);
    formData.append('description', data.description);
    formData.append('priority', data.priority);
    
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      await api.post(ENDPOINTS.TICKETS.BASE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Create New Ticket</h1>
        <p className="text-white/50">Describe your issue and we'll connect you with the right team</p>
      </div>

      <div className="glass-card p-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Category</label>
              <select
                {...register('category', { required: 'Category is required' })}
                defaultValue=""
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all appearance-none"
              >
                <option value="" disabled className="bg-black">Choose a category</option>
                {DEPARTMENTS.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Priority</label>
              <select
                {...register('priority', { required: 'Priority is required' })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all appearance-none"
              >
                {TICKET_PRIORITIES.map(p => (
                  <option key={p} value={p} className="bg-black capitalize">{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Subject</label>
            <input
              {...register('subject', { required: 'Subject is required', minLength: { value: 5, message: 'Too short' } })}
              type="text"
              placeholder="e.g. Printer not working in Marketing Wing"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all"
            />
            {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Description</label>
            <textarea
              {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'Please provide more detail' } })}
              rows={5}
              placeholder="Provide a detailed description of the problem..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all resize-none"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-white/70 block">Attachments (Max 5)</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col items-center justify-center w-32 h-32 rounded-2xl border-2 border-dashed border-white/10 hover:border-brand-primary/50 hover:bg-brand-primary/5 cursor-pointer transition-all group">
                <Paperclip className="text-white/30 group-hover:text-brand-primary transition-colors" size={24} />
                <span className="text-[10px] font-bold text-white/30 group-hover:text-brand-primary uppercase mt-2">Add File</span>
                <input type="file" multiple onChange={handleFileChange} className="hidden" />
              </label>

              {files.map((file, i) => (
                <div key={i} className="relative w-32 h-32 rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col justify-between overflow-hidden group">
                  <button 
                    type="button" 
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                  <Paperclip size={20} className="text-brand-primary" />
                  <p className="text-[10px] text-white/70 truncate font-medium">{file.name}</p>
                  <p className="text-[8px] text-white/30 uppercase font-bold">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl border border-white/10 text-white/70 font-medium hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              type="submit"
              className="btn-primary flex items-center gap-2 min-w-[140px] justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Submit Ticket</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
