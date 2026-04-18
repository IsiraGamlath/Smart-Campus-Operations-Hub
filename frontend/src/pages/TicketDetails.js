import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  AlertCircle, 
  MessageSquare, 
  Paperclip,
  Trash2,
  Calendar,
  User,
  Shield,
  Send,
  Edit2,
  CheckCircle,
  XCircle,
  Hash
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { 
  getTicketById, 
  updateTicket, 
  deleteTicket, 
  addComment, // legacy
  deleteComment,
  deleteImage,
  getComments,
  createComment,
  uploadTicketImages
} from '../services/ticketService';
import { Button, Card, Badge, Textarea, Select, Input } from '../components/ui';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const configs = {
    OPEN: { variant: 'blue', label: 'Open' },
    IN_PROGRESS: { variant: 'yellow', label: 'In Progress' },
    RESOLVED: { variant: 'green', label: 'Resolved' },
    CLOSED: { variant: 'gray', label: 'Closed' },
  };

  const config = configs[status] || configs.OPEN;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const PriorityBadge = ({ priority }) => {
  const configs = {
    LOW: { variant: 'gray', label: 'Low' },
    MEDIUM: { variant: 'blue', label: 'Medium' },
    HIGH: { variant: 'red', label: 'High' },
  };

  const config = configs[priority] || configs.MEDIUM;
  return <Badge variant={config.variant} className="border border-current bg-opacity-10">{config.label}</Badge>;
};

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]); // Separate comments state
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [commentText, setCommentText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // MOCK USER for UI demo
  const mockUser = { id: 'admin-123', name: 'Admin User', role: 'ADMIN' };

  useEffect(() => {
    fetchTicket();
    fetchComments(); // Fetch comments separately as requested
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await getTicketById(id);
      setTicket(response.data);
      setEditData(response.data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Ticket not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await updateTicket(id, editData);
      setTicket(response.data);
      setIsEditing(false);
      toast.success('Ticket updated successfully');
    } catch (error) {
      toast.error('Failed to update ticket');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await updateTicket(id, { status: newStatus });
      setTicket(response.data);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteTicket(id);
      toast.success('Ticket deleted');
      navigate('/tickets');
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await createComment(id, commentText); // User's requested POST /api/comments
      setCommentText('');
      toast.success('Comment added');
      
      // REFRESH COMMENTS IMMEDIATELY
      await fetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(id, commentId);
      setTicket(response.data);
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleRemoveImage = async (imgUrl) => {
    try {
      const response = await deleteImage(id, imgUrl);
      setTicket(response.data);
      toast.success('Image removed');
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium italic">Syncing with operations hub...</p>
    </div>
  );

  if (!ticket) return (
    <div className="text-center py-20 px-4">
      <h2 className="text-2xl font-bold text-slate-800">Ticket Not Found</h2>
      <p className="text-slate-500 mt-2 italic">The requested resource could not be found in the database.</p>
      <Button onClick={() => navigate('/tickets')} className="mt-6" variant="ghost">Return to Dashboard</Button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 py-4 -mx-4 px-4 border-b border-transparent hover:border-slate-200 transition-colors">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/tickets')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black tracking-widest uppercase">
              <Hash size={12} />
              {ticket.id.slice(-8)}
            </div>
            <h1 className="text-xl font-bold text-slate-900 group">
              Ticket Details
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button variant="ghost" className="gap-2" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} /> Edit Details
              </Button>
              <Button variant="ghost" className="text-red-600 hover:bg-red-50 gap-2 border-red-100" onClick={handleDeleteTicket}>
                <Trash2 size={16} /> Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isUpdating}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={isUpdating} className="px-6">
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
                <Badge variant="purple">{ticket.category}</Badge>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <Input 
                    label="Incident Title"
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                  />
                  <Textarea 
                    label="Description"
                    rows={6}
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight uppercase underline decoration-primary-200 underline-offset-8 decoration-4">
                    {ticket.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap selection:bg-primary-100 italic">
                    {ticket.description}
                  </p>
                </div>
              )}

              {/* Attachments (Base64) */}
              {ticket.image && (
                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Paperclip size={16} className="text-primary-500" />
                    Attachment
                  </h3>
                  <div className="max-w-md rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                    <img 
                      src={`data:image/jpeg;base64,${ticket.image}`} 
                      alt="Attachment" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Comments Section */}
          <div className="space-y-6 pt-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <MessageSquare size={20} className="text-primary-600" />
              Communication Log
            </h3>

            <form onSubmit={handleAddComment} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold shrink-0 border border-primary-200 shadow-sm">
                A
              </div>
              <div className="flex-1 space-y-3">
                <Textarea 
                  placeholder="Share an update or ask for more details..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="bg-white"
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={!commentText.trim()} className="px-8 shadow-blue-200 shadow-lg">
                    Post Update
                  </Button>
                </div>
              </div>
            </form>

            <div className="space-y-4">
              {comments && comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0 border border-slate-200">
                      {(comment.author || comment.userId || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {comment.author || comment.userId || comment.userName}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-600 leading-relaxed">
                        {comment.text || comment.content}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 text-sm italic">No communications logged yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-6">
          <Card className="p-6 space-y-6 border-l-4 border-l-primary-500 shadow-xl">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-tighter flex items-center gap-2">
              <Shield size={16} className="text-primary-600" /> Management Dashboard
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Status Control</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`text-[10px] font-black py-2 rounded-lg border-2 transition-all ${
                      ticket.status === s 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                        : 'border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  <User size={20} />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Assigned To</span>
                  <Select 
                    value={ticket.assignedTo || ''} 
                    onChange={(e) => handleUpdate({ ...ticket, assignedTo: e.target.value })}
                    className="text-xs h-8 py-0 font-bold border-none bg-transparent hover:bg-slate-50"
                    options={[
                      { label: 'Unassigned', value: '' },
                      { label: 'Tech Sarath', value: 'Tech Sarath' },
                      { label: 'Tech Nimal', value: 'Tech Nimal' },
                      { label: 'Tech Kamal', value: 'Tech Kamal' },
                    ]}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  <MapPin size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Asset Location</span>
                  <span className="text-sm font-bold text-slate-900 truncate">{ticket.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  <Calendar size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Reported</span>
                  <span className="text-sm font-bold text-slate-900">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;