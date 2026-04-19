import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  AlertCircle, 
  ChevronRight,
  MessageSquare,
  Paperclip
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, Badge } from '../ui';
import { cn } from '../../utils/cn';

export const StatusBadge = ({ status }) => {
  const configs = {
    OPEN: { variant: 'blue', label: 'Open' },
    IN_PROGRESS: { variant: 'yellow', label: 'In Progress' },
    RESOLVED: { variant: 'green', label: 'Resolved' },
    CLOSED: { variant: 'gray', label: 'Closed' },
  };

  const config = configs[status] || configs.OPEN;

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export const PriorityBadge = ({ priority }) => {
  const configs = {
    LOW: { variant: 'gray', label: 'Low' },
    MEDIUM: { variant: 'blue', label: 'Medium' },
    HIGH: { variant: 'red', label: 'High' },
  };

  const config = configs[priority] || configs.MEDIUM;

  return (
    <Badge variant={config.variant} className="border border-current bg-opacity-10">
      {config.label}
    </Badge>
  );
};

const TicketCard = ({ ticket }) => {
  const { 
    id, 
    title, 
    category, 
    status, 
    priority, 
    location, 
    createdAt,
    commentsCount = 0,
    imagesCount = 0
  } = ticket;

  return (
    <Link to={`/tickets/${id}`}>
      <Card className="group hover:border-primary-300 hover:shadow-md transition-all duration-300 p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="purple" className="text-[10px]">{category}</Badge>
              <span className="text-slate-400 text-xs">#{id.slice(-6)}</span>
            </div>
            
            <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {title || location}
            </h3>
            
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-400" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StatusBadge status={status} />
            <PriorityBadge priority={priority} />
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MessageSquare size={14} />
              <span>{commentsCount}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Paperclip size={14} />
              <span>{imagesCount}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-xs font-bold text-primary-600 group-hover:translate-x-1 transition-transform">
            View Details
            <ChevronRight size={14} />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TicketCard;
