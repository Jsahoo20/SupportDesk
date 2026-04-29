import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Paperclip, 
  Clock, 
  Download, 
  Send, 
  ShieldCheck, 
  UserPlus,
  Loader2,
  Calendar
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useFetch from '../hooks/useFetch';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import cn from '../utils/cn';

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isSupport } = useAuth();
  const { data: ticket, loading: ticketLoading, refetch: refetchTicket } = useFetch(ENDPOINTS.TICKETS.BY_ID(id));
  const { data: comments, loading: commentsLoading, refetch: refetchComments } = useFetch(ENDPOINTS.COMMENTS.BY_TICKET(id));
  
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      await api.post(ENDPOINTS.COMMENTS.BASE, {
        ticketId: id,
        message: newComment,
        isInternal
      });
      setNewComment('');
      setIsInternal(false);
      refetchComments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.put(ENDPOINTS.TICKETS.STATUS(id), { status: newStatus });
      refetchTicket();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignToMe = async () => {
    try {
      await api.put(ENDPOINTS.TICKETS.ASSIGN(id), { assignedTo: user._id });
      refetchTicket();
    } catch (err) {
      console.error(err);
    }
  };

  if (ticketLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-brand-primary" size={32} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>

        <div className="flex items-center gap-3">
          {(isAdmin || isSupport) && (
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
              {['In Progress', 'Resolved', 'Closed'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusUpdate(s)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    ticket.status === s ? 'bg-brand-primary text-white shadow-lg' : 'text-white/40 hover:text-white'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Content */}
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <span className="text-sm font-mono text-brand-primary font-bold">{ticket.ticketId}</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">{ticket.subject}</h1>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest",
                ticket.priority === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-white/50'
              )}>
                {ticket.priority}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 text-white/80 leading-relaxed whitespace-pre-wrap min-h-[200px]">
              {ticket.description}
            </div>

            {ticket.attachments?.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Attachments</p>
                <div className="flex flex-wrap gap-3">
                  {ticket.attachments.map((file, i) => (
                    <a 
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 glass-card bg-white/5 border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
                    >
                      <Paperclip size={18} className="text-brand-primary" />
                      <span className="text-sm text-white/70">{file.originalName}</span>
                      <Download size={14} className="text-white/20 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <MessageSquare size={22} className="text-brand-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
              Conversation
            </h3>

            <div className="space-y-4">
              {commentsLoading ? (
                <p className="text-white/30 text-center py-8">Loading messages...</p>
              ) : comments?.length > 0 ? (
                comments.map((comment) => (
                  <div 
                    key={comment._id} 
                    className={cn(
                      "p-4 rounded-2xl border transition-all duration-300",
                      comment.isInternal ? 'bg-brand-primary/5 border-brand-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.05)]' : 'bg-white/5 border-white/10',
                      comment.userId?._id === user?._id ? 'ml-12 border-l-brand-primary/30' : 'mr-12'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{comment.userId?.name}</span>
                        {comment.isInternal && (
                          <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded uppercase font-black tracking-tighter flex items-center gap-1">
                            <ShieldCheck size={10} /> Internal
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/30 font-medium">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 whitespace-pre-wrap">{comment.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 glass border-dashed rounded-2xl">
                  <p className="text-sm text-white/30 font-medium">No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            {/* Post Comment */}
            <form onSubmit={handlePostComment} className="glass-card p-6 space-y-4 mt-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your message..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/5 transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                {(isAdmin || isSupport) ? (
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                    />
                    <div className={cn(
                      "w-4 h-4 rounded border transition-all flex items-center justify-center",
                      isInternal ? 'bg-brand-primary border-brand-primary' : 'border-white/20 bg-white/5'
                    )}>
                      {isInternal && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <span className="text-xs text-white/40 group-hover:text-white transition-colors font-medium">Internal note</span>
                  </label>
                ) : <div />}
                
                <button
                  disabled={loading || !newComment.trim()}
                  type="submit"
                  className="btn-primary flex items-center gap-2 py-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Send Message</>}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Metadata</h4>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-white/40 font-medium flex items-center gap-2">
                  <Calendar size={14} /> Created
                </span>
                <span className="text-sm text-white font-semibold">
                  {new Date(ticket.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-white/40 font-medium flex items-center gap-2">
                  <Clock size={14} /> SLA Deadline
                </span>
                <span className={cn(
                  "text-sm font-bold",
                  ticket.slaBreached ? 'text-red-500' : 'text-white'
                )}>
                  {new Date(ticket.slaDeadline).toLocaleString()}
                </span>
              </div>

              <div className="flex h-px bg-white/5 w-full" />

              <div className="flex flex-col gap-2">
                <span className="text-xs text-white/40 font-medium flex items-center gap-2">
                  <UserPlus size={14} /> Requester
                </span>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-xs">
                    {ticket.raisedBy?.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{ticket.raisedBy?.name}</p>
                    <p className="text-[10px] text-white/40">{ticket.raisedBy?.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs text-white/40 font-medium flex items-center gap-2">
                  <ShieldCheck size={14} /> Assigned To
                </span>
                {ticket.assignedTo ? (
                   <div className="flex items-center gap-3 p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                    <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-brand-primary/20">
                      {ticket.assignedTo?.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{ticket.assignedTo?.name}</p>
                      <p className="text-[10px] text-white/40">Support Specialist</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-white/5 rounded-xl text-center">
                    <p className="text-xs text-white/20 font-medium italic">Not assigned yet</p>
                    {(isSupport || isAdmin) && (
                      <button 
                        onClick={handleAssignToMe}
                        className="w-full text-xs py-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary hover:text-white rounded-lg font-bold transition-colors"
                      >
                        Assign to Me
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
