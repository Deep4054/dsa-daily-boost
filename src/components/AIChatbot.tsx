import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  ExternalLink,
  Sparkles,
  Brain,
  Code,
  BookOpen
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  topic?: string;
}

interface AIChatbotProps {
  selectedTopic?: string;
}

export const AIChatbot = ({ selectedTopic }: AIChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatType, setChatType] = useState<'dsa-help' | 'general'>('dsa-help');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
      topic: selectedTopic
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: userMessage.content,
          chatType,
          topic: selectedTopic,
          context: messages.slice(-5) // Send last 5 messages for context
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        topic: selectedTopic
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openExternalAI = (platform: string) => {
    const urls = {
      'chatgpt': 'https://chat.openai.com',
      'claude': 'https://claude.ai',
      'perplexity': 'https://perplexity.ai',
      'gemini': 'https://gemini.google.com'
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Learning Assistant
          </CardTitle>
          {selectedTopic && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              {selectedTopic}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={chatType === 'dsa-help' ? 'default' : 'outline'}
            onClick={() => setChatType('dsa-help')}
            className="flex items-center gap-1"
          >
            <Brain className="h-3 w-3" />
            DSA Help
          </Button>
          <Button
            size="sm"
            variant={chatType === 'general' ? 'default' : 'outline'}
            onClick={() => setChatType('general')}
            className="flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            General AI
          </Button>
        </div>

        <div className="flex gap-1 flex-wrap">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openExternalAI('chatgpt')}
            className="h-7 px-2 text-xs"
          >
            ChatGPT <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openExternalAI('claude')}
            className="h-7 px-2 text-xs"
          >
            Claude <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openExternalAI('perplexity')}
            className="h-7 px-2 text-xs"
          >
            Perplexity <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openExternalAI('gemini')}
            className="h-7 px-2 text-xs"
          >
            Gemini <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        <ScrollArea className="flex-1 pr-3">
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {chatType === 'dsa-help' 
                    ? 'Ask me anything about DSA concepts, algorithms, or problem-solving strategies!'
                    : 'Chat with AI about anything or get help with your studies.'
                  }
                </p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask about ${selectedTopic || 'DSA topics'}...`}
            disabled={loading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};