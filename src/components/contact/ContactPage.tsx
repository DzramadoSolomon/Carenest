import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mail, User, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactPageProps {
  onBack: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate email sending with mailto links
      const emailBody = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0ASubject: ${formData.subject}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
      const mailtoLink = `mailto:solomonkendzramado@gmail.com,gabrielagana123@gmail.com?subject=Carenest Contact: ${formData.subject}&body=${emailBody}`;
      
      window.open(mailtoLink, '_blank');
      
      toast({
        title: "Email Client Opened!",
        description: "Your default email client should open with the message pre-filled.",
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open email client. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 sm:mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Contact Our Team</h1>
        <p className="text-gray-600 text-sm sm:text-base">Get in touch with the developers behind Carenest</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Team Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <User className="w-5 h-5 mr-2" />
                Meet Our Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Solomon Kennedy Dzramado</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Lead Developer & Co-Founder</p>
                <div className="flex items-center text-blue-600">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a 
                    href="mailto:solomonkendzramado@gmail.com" 
                    className="hover:underline text-xs sm:text-sm break-all"
                  >
                    solomonkendzramado@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Gabriel Agana Anongwin</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Developer & Co-Founder</p>
                <div className="flex items-center text-green-600">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a 
                    href="mailto:gabrielagana123@gmail.com" 
                    className="hover:underline text-xs sm:text-sm break-all"
                  >
                    gabrielagana123@gmail.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <MessageSquare className="w-5 h-5 mr-2" />
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <Input
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <Textarea
                  name="message"
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="text-sm sm:text-base resize-none"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full text-sm sm:text-base py-2 sm:py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Opening Email...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
