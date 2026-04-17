import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Send,
  Info,
  ChevronRight
} from 'lucide-react';
import { createTicket, uploadTicketImages } from '../services/ticketService';
import { Button, Input, Select, Textarea, Card } from '../components/ui';
import toast from 'react-hot-toast';

const CreateTicket = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [form, setForm] = useState({
    location: '',
    category: '',
    description: '',
    priority: 'MEDIUM',
    contact: ''
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
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.description || form.description.length < 10) 
      newErrors.description = 'Description must be at least 10 characters';
    if (!form.contact) newErrors.contact = 'Contact details are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading('Creating your ticket...');

    try {
      const response = await createTicket({
        title: `${form.category} Issue at ${form.location}`,
        ...form
      });
      
      const ticketId = response.data?.id;

      if (images.length > 0 && ticketId) {
        await uploadTicketImages(ticketId, images);
      }

      toast.success('Ticket created successfully!', { id: loadingToast });
      navigate(`/tickets`);
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
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group mb-4"
      >
        <div className="p-1.5 rounded-full bg-white border border-slate-200 group-hover:bg-slate-50 transition-colors">
          <ArrowLeft size={16} />
        </div>
        <span className="text-sm font-semibold">Back to Dashboard</span>
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create New Ticket</h1>
          <p className="text-slate-500 mt-1">Report a maintenance issue or incident on campus.</p>
        </div>
        <div className="hidden sm:block">
          <div className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold border border-primary-100 uppercase tracking-wider">
            Step 1 of 1
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-8 shadow-xl shadow-slate-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Resource/Location"
              name="location"
              value={form.location}
              onChange={handleInputChange}
              error={errors.location}
              options={[
                { label: 'Select Location', value: '' },
                { label: 'Computer Lab 1', value: 'Computer Lab 1' },
                { label: 'Computer Lab 2', value: 'Computer Lab 2' },
                { label: 'Lecture Hall A', value: 'Lecture Hall A' },
                { label: 'Main Library', value: 'Main Library' },
                { label: 'Campus Cafeteria', value: 'Campus Cafeteria' },
                { label: 'Student Hostel', value: 'Student Hostel' },
              ]}
            />
            
            <Select
              label="Issue Category"
              name="category"
              value={form.category}
              onChange={handleInputChange}
              error={errors.category}
              options={[
                { label: 'Select Category', value: '' },
                { label: 'Electrical', value: 'Electrical' },
                { label: 'IT & Network', value: 'IT' },
                { label: 'Furniture', value: 'Furniture' },
                { label: 'Plumbing', value: 'Plumbing' },
                { label: 'General Maintenance', value: 'General' },
              ]}
            />
          </div>

          <Textarea
            label="Problem Description"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleInputChange}
            error={errors.description}
            placeholder="Please provide details about the issue..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-8">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 block">Priority Level</label>
              <div className="flex gap-3">
                {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border-2 ${
                      form.priority === p 
                        ? p === 'HIGH' ? 'bg-red-50 border-red-500 text-red-700' :
                          p === 'MEDIUM' ? 'bg-blue-50 border-blue-500 text-blue-700' :
                          'bg-slate-50 border-slate-500 text-slate-700'
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Contact Details (Email/Phone)"
              name="contact"
              value={form.contact}
              onChange={handleInputChange}
              error={errors.contact}
              placeholder="How can we reach you?"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4 border-t border-slate-100 pt-8">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Attach Images (Optional)</label>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{previews.length} / 3</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {previews.map((src, index) => (
                <div key={index} className="aspect-square relative rounded-xl overflow-hidden border border-slate-200 group shadow-sm">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {previews.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 transition-all group scale-100 active:scale-95"
                >
                  <Upload size={24} className="mb-2 group-hover:bounce" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-lg text-blue-700 text-xs border border-blue-100">
              <Info size={14} className="shrink-0" />
              <p>Adding clear photos of the issue helps technicians resolve it faster.</p>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2 px-8" disabled={isSubmitting}>
            {isSubmitting ? (
              <>Sending...</>
            ) : (
              <>
                <Send size={18} />
                Submit Ticket
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
