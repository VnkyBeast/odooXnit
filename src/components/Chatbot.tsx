import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, AlertCircle } from 'lucide-react';

interface Message {
    content: string;
    sender: 'bot' | 'user';
    html?: boolean;
}

interface QuickOption {
    text: string;
    value: string;
}

const RepoBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const quickOptions: QuickOption[] = [
        { text: "How to report a crime", value: "how to report a crime" },
        { text: "Emergency contacts", value: "emergency contacts" },
        { text: "Report anonymously", value: "report anonymously" },
        { text: "What happens after reporting", value: "what happens after reporting" }
    ];

    const botResponses = {
        'default': "I'm sorry, I don't understand. Could you please rephrase your question about crime reporting?",
        'greeting': "Hello! I'm RepoBot, your crime reporting assistant. How can I help you today?",
        'how to report a crime': `
      <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
        <h3 class="font-medium text-purple-300 mb-2">How to Report a Crime</h3>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Emergency:</strong> Call 911 immediately if the crime is in progress or someone is in danger</li>
          <li><strong>Non-emergency:</strong> Contact your local police department's non-emergency number</li>
          <li><strong>Online:</strong> Many police departments offer online reporting for non-violent crimes</li>
          <li><strong>In person:</strong> Visit your nearest police station</li>
        </ul>
      </div>
      What type of crime would you like more specific reporting information about?
    `,
        'emergency contacts': `
      <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
        <h3 class="font-medium text-purple-300 mb-2">Emergency Contacts</h3>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Police, Fire, Medical:</strong> 911</li>
          <li><strong>National Human Trafficking Hotline:</strong> 1-888-373-7888</li>
          <li><strong>Domestic Violence Hotline:</strong> 1-800-799-7233</li>
          <li><strong>Child Abuse Hotline:</strong> 1-800-422-4453</li>
          <li><strong>Suicide Prevention Lifeline:</strong> 988</li>
        </ul>
      </div>
      Is there a specific emergency service you need more information about?
    `,
        'report anonymously': `
      <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
        <h3 class="font-medium text-purple-300 mb-2">Report Anonymously</h3>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Crime Stoppers:</strong> Call 1-800-222-TIPS (8477)</li>
          <li><strong>Online anonymous reporting:</strong> Many police departments have dedicated anonymous tip forms</li>
          <li><strong>Tip411:</strong> Text your local police department's code to 847411</li>
          <li><strong>Witness protection:</strong> Ask about options when reporting serious crimes</li>
        </ul>
      </div>
      Your safety is important. Would you like more information about privacy protections when reporting?
    `,
        'what happens after reporting': `
      <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
        <h3 class="font-medium text-purple-300 mb-2">What Happens After Reporting</h3>
        <ul class="list-disc pl-5 space-y-1">
          <li><strong>Case number:</strong> You'll receive a case number for your report</li>
          <li><strong>Investigation:</strong> An officer may contact you for more details</li>
          <li><strong>Evidence collection:</strong> Police will gather relevant evidence</li>
          <li><strong>Follow-up:</strong> You can check on your case status using your case number</li>
          <li><strong>Prosecution:</strong> If a suspect is identified, the case may go to court</li>
        </ul>
      </div>
      Would you like information about victim services and support resources?
    `,
        'theft': `
      <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
        <h3 class="font-medium text-purple-300 mb-2">Reporting Theft</h3>
        <ul class="list-disc pl-5 space-y-1">
          <li>Document all stolen items (descriptions, serial numbers, photos)</li>
          <li>Report to local police department via non-emergency line or online</li>
          <li>For stolen credit cards, also contact your bank immediately</li>
          <li>For identity theft, report to the FTC at IdentityTheft.gov</li>
          <li>Request a copy of the police report for insurance claims</li>
        </ul>
      </div>
      Would you like me to help you prepare information for a theft report?
    `,
        'assault': `
      <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
        <h3 class="font-medium text-purple-300 mb-2">Reporting Assault</h3>
        <ul class="list-disc pl-5 space-y-1">
          <li>Ensure your immediate safety first</li>
          <li>Seek medical attention for any injuries</li>
          <li>Call 911 or contact local police</li>
          <li>Document any injuries with photos if possible</li>
          <li>Note details about the assailant and incident</li>
          <li>Request information about victim advocates</li>
        </ul>
      </div>
      Your safety and wellbeing are the priority. Would you like information about support services for assault victims?
    `
    };

    // Initialize with welcome message
    useEffect(() => {
        setMessages([
            {
                content: "Hello, I'm RepoBot - here to assist with crime reporting. What can I help you with today?",
                sender: 'bot'
            }
        ]);
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        // Add user message
        setMessages(prev => [...prev, { content: inputValue, sender: 'user' }]);
        setInputValue('');

        // Simulate bot typing
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const response = getBotResponse(inputValue.toLowerCase());
            setMessages(prev => [...prev, {
                content: response,
                sender: 'bot',
                html: response.includes('<div')
            }]);
            setIsTyping(false);
        }, 600);
    };

    const handleQuickOption = (option: string) => {
        // Add user message
        setMessages(prev => [...prev, { content: option, sender: 'user' }]);

        // Simulate bot typing
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const response = getBotResponse(option.toLowerCase());
            setMessages(prev => [...prev, {
                content: response,
                sender: 'bot',
                html: response.includes('<div')
            }]);
            setIsTyping(false);
        }, 600);
    };

    // Get bot response based on user input
    const getBotResponse = (input: string) => {
        // Check for keywords in the input
        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            return botResponses['greeting'];
        } else if (input.includes('how') && input.includes('report')) {
            return botResponses['how to report a crime'];
        } else if (input.includes('emergency') || input.includes('contact')) {
            return botResponses['emergency contacts'];
        } else if (input.includes('anonymous') || input.includes('privately')) {
            return botResponses['report anonymously'];
        } else if ((input.includes('after') && input.includes('report')) || input.includes('next steps')) {
            return botResponses['what happens after reporting'];
        } else if (input.includes('theft') || input.includes('stolen') || input.includes('rob')) {
            return botResponses['theft'];
        } else if (input.includes('assault') || input.includes('attack') || input.includes('beat')) {
            return botResponses['assault'];
        } else {
            return botResponses['default'];
        }
    };

    const handleEmergency = () => {
        alert('In a real application, this would connect to emergency services.\nFor actual emergencies, please call 911 directly.');
    };

    return (
        <>
            {/* Chatbot toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed right-6 bottom-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-30"
            >
                <MessageSquare size={24} />
            </button>

            {/* Emergency button */}
            <button
                onClick={handleEmergency}
                className="fixed right-6 bottom-24 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 z-30 flex items-center space-x-2"
            >
                <AlertCircle size={20} />
                <span className="font-medium">Emergency</span>
            </button>

            {/* Chat panel */}
            <div
                className={`fixed bottom-6 right-6 w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl z-20 transition-all duration-300 flex flex-col border border-purple-500/30 ${isOpen ? 'h-3/4 max-h-[600px] opacity-100' : 'h-0 opacity-0 pointer-events-none'
                    }`}
            >
                {/* Chat header */}
                <div className="p-4 bg-purple-900 rounded-t-2xl border-b border-purple-800 flex items-center">
                    <div className="bg-purple-700 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                        <MessageSquare size={20} className="text-purple-200" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">RepoBot</h3>
                        <p className="text-purple-300 text-sm">Crime Reporting Assistant</p>
                    </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-4 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
                        >
                            <div
                                className={`p-3 rounded-2xl ${msg.sender === 'user'
                                        ? 'bg-purple-700 text-white rounded-br-none'
                                        : 'bg-gray-800 text-gray-200 rounded-bl-none'
                                    }`}
                            >
                                {msg.html
                                    ? <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                                    : msg.content
                                }
                            </div>
                        </div>
                    ))}

                    {/* Quick options after first bot message */}
                    {messages.length === 1 && (
                        <div className="flex flex-wrap gap-2 mt-2 mb-4">
                            {quickOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleQuickOption(option.value)}
                                    className="bg-gray-800 hover:bg-purple-900 text-purple-300 px-3 py-2 rounded-full text-sm transition-colors"
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    )}

                    {isTyping && (
                        <div className="flex items-center space-x-2 mb-4 max-w-[85%]">
                            <div className="bg-gray-800 text-white p-3 rounded-2xl rounded-bl-none">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="p-4 border-t border-purple-900/50">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            ref={inputRef}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-800 border border-purple-500/30 rounded-full py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="ml-2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RepoBot;