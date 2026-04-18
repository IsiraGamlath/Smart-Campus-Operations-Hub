import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Send,
  Info
} from 'lucide-react';
import { createTicket, uploadTicketImages } from '../services/ticketService';
import { Button, Input, Select, Textarea, Card } from '../components/ui';
import toast from 'react-hot-toast';

const CreateTicket = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [form, setForm] = useState({
    title: '',
    location: '',
    category: '',
    description: '',
    priority: 'MEDIUM',
    assignedTo: '',
    resolutionNotes: ''
  });
  
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    URL.revokeObjectURL(previews[index]);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = 'Title is required';
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.description || form.description.length < 10) 
      newErrors.description = 'Description must be at least 10 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading('Creating ticket...');

    try {
      // 1. Prepare FormData
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("priority", form.priority);
      formData.append("location", form.location);
      formData.append("category", form.category);
      formData.append("assignedTo", form.assignedTo);
      formData.append("resolutionNotes", form.resolutionNotes);
      formData.append("contact", form.assignedTo); // Map contact correctly if needed

      if (images.length > 0) {
        formData.append("image", images[0]); // Send first image as requested singular field
      }

      // 2. Create Ticket with Image in one step
      await createTicket(formData);

      toast.success('Ticket created successfully!', { id: loadingToast });
      navigate('/tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/tickets')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group mb-4"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-semibold">Back to Dashboard</span>
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create New Ticket</h1>
          <p className="text-slate-500 mt-1">Report a campus maintenance issue.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-8 space-y-8 shadow-xl">
          <Input 
            label="Incident Title *"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            error={errors.title}
            placeholder="e.g. Broken AC in Lab 1"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select 
              label="Location *"
              name="location"
              value={form.location}
              onChange={handleInputChange}
              error={errors.location}
              options={[
                { label: 'Select Location', value: '' },
                { label: 'Computer Lab 1', value: 'Computer Lab 1' },
                { label: 'Lecture Hall A', value: 'Lecture Hall A' },
                { label: 'Main Library', value: 'Main Library' },
                { label: 'Cafeteria', value: 'Cafeteria' },
              ]}
            />
            
            <Select 
              label="Category *"
              name="category"
              value={form.category}
              onChange={handleInputChange}
              error={errors.category}
              options={[
                { label: 'Select Category', value: '' },
                { label: 'Electrical', value: 'Electrical' },
                { label: 'IT', value: 'IT' },
                { label: 'Furniture', value: 'Furniture' },
                { label: 'Plumbing', value: 'Plumbing' },
              ]}
            />
          </div>

          <Textarea 
            label="Problem Description *"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleInputChange}
            error={errors.description}
            placeholder="Provide details..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-8">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700">Priority</label>
              <div className="flex gap-3">
                {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                      form.priority === p 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-slate-100 bg-white text-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <Select 
              label="Assign Technician"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleInputChange}
              options={[
                { label: 'Unassigned', value: '' },
                { label: 'Tech Sarath', value: 'Tech Sarath' },
                { label: 'Tech Nimal', value: 'Tech Nimal' },
                { label: 'Tech Kamal', value: 'Tech Kamal' },
              ]}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4 border-t pt-8">
            <label className="text-sm font-semibold text-slate-700">Attachments (Max 3)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {previews.map((src, index) => (
                <div key={index} className="aspect-square relative rounded-xl overflow-hidden border shadow-sm">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-lg"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              
              {previews.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-slate-400 hover:border-primary-400 hover:text-primary-600 transition-all"
                >
                  <Upload size={20} className="mb-1" />
                  <span className="text-[10px] font-bold uppercase">Upload</span>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-blue-700 text-xs">
              <Info size={14} />
              <p>Images help technicians understand the issue quickly.</p>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/tickets')} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2 px-8" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : (
              <><Send size={18} /> Submit Ticket</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
