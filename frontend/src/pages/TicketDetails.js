import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  MessageSquare, 
  Send,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock3,
  Wrench,
  AlertCircle,
  MoreVertical,
  Paperclip
} from 'lucide-react';
import { getTicketById, addComment, deleteComment, updateTicket } from '../services/ticketService';
import { Button, Card, Badge, Textarea, Select } from '../components/ui';
import { StatusBadge, PriorityBadge } from '../components/tickets/TicketCard';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';

// Mock User for UI logic
const mockUser = {
  id: "user1",
  name: "Admin User",
  role: "ADMIN"
};

const StatusTimeline = ({ currentStatus }) => {
  const statuses = [
    { key: 'OPEN', label: 'Open', icon: AlertCircle, color: 'blue' },
    { key: 'IN_PROGRESS', label: 'In Progress', icon: Wrench, color: 'yellow' },
    { key: 'RESOLVED', label: 'Resolved', icon: CheckCircle2, color: 'green' },
    { key: 'CLOSED', label: 'Closed', icon: Clock3, color: 'gray' },
  ];

  const currentIndex = statuses.findIndex(s => s.key === currentStatus);

  return (
    <div className="relative flex justify-between items-start w-full px-2 py-8">
      {/* Connector Line */}
      <div className="absolute top-1/2 -translate-y-[18px] left-[10%] right-[10%] h-1 bg-slate-100 -z-0">
        <div 
          className="h-full bg-primary-500 transition-all duration-500 rounded-full"
          style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
        />
      </div>

      {statuses.map((s, idx) => {
        const Icon = s.icon;
        const isActive = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        
        return (
          <div key={s.key} className="relative z-10 flex flex-col items-center gap-2 group">
            <div className={`
              w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-300
              ${isCurrent ? 'bg-primary-500 border-primary-100 scale-125 text-white shadow-lg' : 
                isActive ? 'bg-white border-primary-500 text-primary-500' : 
                'bg-white border-slate-100 text-slate-300'}
            `}>
              <Icon size={18} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Local role logic
  const isAdmin = mockUser.role === 'ADMIN';
  const isTechnician = mockUser.role === 'TECHNICIAN' || isAdmin;
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingTechnician, setIsUpdatingTechnician] = useState(false);

  const fetchTicket = async () => {
    try {
      const response = await getTicketById(id);
      setTicket(response.data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      // Mock for demo
      setTicket({
        id: id || 'TKT-123',
        location: 'Computer Lab 1',
        category: 'Electrical',
        description: 'The AC unit in Lab 1 is making a loud rattling noise and not cooling at all. This is urgent as we have a session there tomorrow.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        contact: 'j.doe@campus.edu',
        assignedTo: 'Tech Sarath',
        images: [
          'https://images.unsplash.com/photo-1581092921461-7d157390fd28?auto=format&fit=crop&q=80&w=400',
          'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=400'
        ],
        comments: [
          { id: 1, userId: 'user-1', userName: 'John Doe', text: 'Checked again, it seems to be sparking a bit now.', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
          { id: 2, userId: 'tech-1', userName: 'Tech Sarath', text: 'On my way to check. Should be fixed by noon.', createdAt: new Date(Date.now() - 3600000).toISOString() }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdatingStatus(true);
    try {
      await updateTicket(id, { status: newStatus });
      setTicket(prev => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAssignTechnician = async (e) => {
    const techName = e.target.value;
    setIsUpdatingTechnician(true);
    try {
      await updateTicket(id, { assignedTo: techName });
      setTicket(prev => ({ ...prev, assignedTo: techName }));
      toast.success(`Technician ${techName || 'removed'} successfully`);
    } catch (error) {
      toast.error('Failed to assign technician');
    } finally {
      setIsUpdatingTechnician(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await addComment(id, commentText);
      const newComment = response.data || {
        id: Date.now(),
        userId: mockUser.id,
        userName: mockUser.name,
        text: commentText,
        createdAt: new Date().toISOString()
      };
      setTicket(prev => ({
        ...prev,
        comments: [...prev.comments, newComment]
      }));
      setCommentText('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(id, commentId);
      setTicket(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId)
      }));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-slate-500 font-medium">Loading ticket details...</p>
    </div>
  );

  if (!ticket) return <div className="text-center py-20">Ticket not found</div>;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      
      {/* Left Column: Details & Comments */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-semibold">Back</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono text-xs">#{ticket.id}</span>
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                {ticket.title || `${ticket.category} Issue at ${ticket.location}`}
              </h1>
            </div>
            
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Edit2 size={14} />
                  Edit
                </Button>
                <Button variant="danger" size="sm" className="gap-2">
                  <Trash2 size={14} />
                  Archive
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Card */}
        <Card className="p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Issue Progress</h3>
          <StatusTimeline currentStatus={ticket.status} />
        </Card>

        {/* Description Body */}
        <Card className="p-8 space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">Problem Description</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {ticket.images && ticket.images.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Attachments ({ticket.images.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ticket.images.map((img, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden border border-slate-100 group cursor-pointer relative shadow-sm">
                    <img src={img} alt="Attachment" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button variant="secondary" size="sm" className="bg-white/90">Preview</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Comments Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <MessageSquare size={20} className="text-primary-600" />
              Comments
              <span className="text-xs font-normal text-slate-400 ml-2">({ticket.comments?.length || 0})</span>
            </h3>
          </div>

          <form onSubmit={handleAddComment} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold shrink-0 shadow-sm border border-primary-50">
              {mockUser.name.charAt(0)}
            </div>
            <div className="flex-1 space-y-3">
              <Textarea 
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={2}
                className="shadow-sm shadow-slate-100"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={!commentText.trim()} className="gap-2 px-6">
                  <Send size={16} />
                  Post
                </Button>
              </div>
            </div>
          </form>

          <div className="space-y-4 mt-8">
            {ticket.comments?.map(comment => (
              <div key={comment.id} className="flex gap-4 group">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                  {comment.userName.charAt(0)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{comment.userName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {mockUser.id === comment.userId && (
                      <button 
                         onClick={() => handleDeleteComment(comment.id)}
                         className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-600">
                    {comment.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Sidebar Info */}
      <div className="space-y-6">
        
        {/* Quick Actions Card (Admin/Tech Only) */}
        {(isAdmin || isTechnician) && (
          <Card className="p-6 border-primary-100 bg-primary-50/20 shadow-lg shadow-primary-100/50">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Wrench size={18} className="text-primary-600" />
              Management Panel
            </h3>
            <div className="space-y-4">
              <Select 
                label="Update Status"
                value={ticket.status}
                onChange={handleStatusChange}
                disabled={isUpdatingStatus}
                options={[
                  { label: 'Open', value: 'OPEN' },
                  { label: 'In Progress', value: 'IN_PROGRESS' },
                  { label: 'Resolved', value: 'RESOLVED' },
                  { label: 'Closed', value: 'CLOSED' },
                ]}
              />
              
              {isAdmin && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Assign Technician</label>
                  <Select 
                    disabled={isUpdatingTechnician}
                    onChange={handleAssignTechnician}
                    options={[
                      { label: 'Unassigned', value: '' },
                      { label: 'Tech Sarath', value: 'Tech Sarath' },
                      { label: 'Tech Nimal', value: 'Tech Nimal' },
                      { label: 'Tech Kamal', value: 'Tech Kamal' },
                    ]}
                    value={ticket.assignedTo || ''}
                  />
                </div>
              )}

              <div className="pt-2">
                <Button variant="primary" className="w-full shadow-lg shadow-primary-200">
                  Add Resolution Note
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Ticket Metadata Card */}
        <Card className="p-6 divide-y divide-slate-100">
          <div className="pb-4 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Information</h3>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
                <span className="text-sm font-semibold text-slate-900">{ticket.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Created On</span>
                <span className="text-sm font-semibold text-slate-900">{format(new Date(ticket.createdAt), 'MMM dd, yyyy @ HH:mm')}</span>
              </div>
            </div>
          </div>

          <div className="py-4 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Reporter</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <User size={20} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-slate-900">Requester</span>
                <span className="text-xs text-slate-500 truncate">{ticket.contact}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
                 <Paperclip size={14} />
                 RESOURCES
               </div>
               <ul className="text-xs text-slate-500 space-y-1">
                 <li>• Campus Maintenance Handbook</li>
                 <li>• IT Policy Document</li>
               </ul>
             </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default TicketDetails;