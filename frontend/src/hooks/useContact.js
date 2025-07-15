import { useState } from 'react';
import { contactAPI } from '../services/api';
import { useToast } from './use-toast';

export const useContact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (messageData) => {
    setIsSubmitting(true);
    try {
      const response = await contactAPI.sendMessage(messageData);
      
      if (response.success) {
        toast({
          title: "Message sent successfully!",
          description: response.message,
          duration: 5000,
        });
        return { success: true, data: response };
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to send message';
      toast({
        title: "Error sending message",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    sendMessage,
    isSubmitting
  };
};