import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  RefreshCcw,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTickets } from '../services/ticketService';
import TicketCard from '../components/tickets/TicketCard';
import { Button, Select } from '../components/ui';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });
  const [view, setView] = useState('grid'); // grid or list

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await getTickets(filters);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
      // Mock data for demo if API fails
      setTickets([
        {
          id: 'TKT-001',
          title: 'Broken AC in Lab 1',
          category: 'Electrical',
          status: 'OPEN',
          priority: 'HIGH',
          location: 'Computer Lab 1',
          createdAt: new Date().toISOString(),
          commentsCount: 2,
          imagesCount: 3
        },
        {
          id: 'TKT-002',
          title: 'Whiteboard markers missing',
          category: 'Furniture',
          status: 'IN_PROGRESS',
          priority: 'LOW',
          location: 'Lecture Hall A',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          commentsCount: 1,
          imagesCount: 0
        },
        {
          id: 'TKT-003',
          title: 'Projector flickering',
          category: 'IT',
          status: 'RESOLVED',
          priority: 'MEDIUM',
          location: 'Seminar Room',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          commentsCount: 5,
          imagesCount: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredTickets = tickets.filter(t => {
    const matchesStatus = !filters.status || t.status === filters.status;
    const matchesPriority = !filters.priority || t.priority === filters.priority;
    const matchesSearch = !filters.search || 
      t.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.location?.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.id.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Maintenance Tickets</h1>
          <p className="text-slate-500 mt-1">Manage and track campus maintenance requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Dashboard
          </Link>
          <Button variant="secondary" onClick={fetchTickets} className="gap-2">
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Link to="/tickets/create">
            <Button className="gap-2">
              <Plus size={18} />
              New Ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by title, location or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full lg:w-40"
            options={[
              { label: 'All Status', value: '' },
              { label: 'Open', value: 'OPEN' },
              { label: 'In Progress', value: 'IN_PROGRESS' },
              { label: 'Resolved', value: 'RESOLVED' },
              { label: 'Closed', value: 'CLOSED' },
            ]}
          />
          <Select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="w-full lg:w-40"
            options={[
              { label: 'All Priority', value: '' },
              { label: 'Low', value: 'LOW' },
              { label: 'Medium', value: 'MEDIUM' },
              { label: 'High', value: 'HIGH' },
            ]}
          />
          
          <div className="h-10 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          
          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 shrink-0">
            <button 
              onClick={() => setView('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                view === 'grid' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                view === 'list' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div>
          {filteredTickets.length > 0 ? (
            <div className={cn(
              "grid gap-6",
              view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {filteredTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No tickets found</h3>
              <p className="text-slate-500">Try adjusting your filters or create a new ticket.</p>
              <Button variant="outline" className="mt-6" onClick={() => setFilters({status: '', priority: '', search: ''})}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
