'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import { toast } from 'sonner';
import { submitContactForm } from '@/lib/actions/contact.action';

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactUsModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    defaultValues: { name: '', email: '', message: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const result = await submitContactForm(data);
      if (result.success) {
        toast.success("Message sent!", { description: "We'll get back to you shortly." });
        setIsOpen(false);
        reset();
      } else {
        toast.error("Failed to send", { description: result.error });
      }
    } catch (e: any) {
      toast.error('An error occurred', { description: e?.message || 'Check your network and try again.' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="wl-btn-ghost">Contact Us</button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-[var(--card)] border-[var(--nb-border-color)] text-[var(--text-primary)]" style={{ borderRadius: 'var(--nb-radius)', border: 'var(--nb-border-width) solid var(--nb-border-color)', boxShadow: 'var(--nb-shadow)' }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-[var(--font-display)]">Contact Support</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Having an issue with Moneymint? Drop us a line below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <InputField
            name="name"
            label="Name"
            placeholder="John Doe"
            register={register}
            error={errors.name}
            validation={{ required: 'Name is required' }}
          />
          <InputField
            name="email"
            label="Email"
            placeholder="john@example.com"
            register={register}
            error={errors.email}
            validation={{ 
              required: 'Email is required', 
              pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message: 'Valid email required' } 
            }}
          />
          
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-semibold capitalize">Message</label>
            <textarea
              {...register('message', { required: 'Message is required' })}
              className="w-full bg-[var(--background)] text-[var(--text-primary)] rounded-[var(--nb-radius)] border-[var(--nb-border-width)] border-[var(--nb-border-color)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
              rows={4}
              placeholder="How can we help?"
            />
            {errors.message && <span className="text-xs text-red-500 font-medium mt-1">{errors.message.message}</span>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full wl-btn-accent transition-transform hover:-translate-y-0.5 mt-2" style={{ height: '48px' }}>
            {isSubmitting ? 'Sending Request...' : 'Send Message'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
