import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, AlertCircle, Globe } from 'lucide-react';

interface Message {
    content: string;
    sender: 'bot' | 'user';
    html?: boolean;
}

interface QuickOption {
    text: string;
    value: string;
}

// Language type
type Language = 'en' | 'hi';

const RepoBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [language, setLanguage] = useState<Language>('en');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Define quick options for both languages
    const quickOptions: Record<Language, QuickOption[]> = {
        en: [
            { text: "How to report a crime", value: "how to report a crime" },
            { text: "Emergency contacts", value: "emergency contacts" },
            { text: "Report anonymously", value: "report anonymously" },
            { text: "What happens after reporting", value: "what happens after reporting" }
        ],
        hi: [
            { text: "अपराध की रिपोर्ट कैसे करें", value: "अपराध की रिपोर्ट कैसे करें" },
            { text: "आपातकालीन संपर्क", value: "आपातकालीन संपर्क" },
            { text: "गुमनाम रिपोर्ट करें", value: "गुमनाम रिपोर्ट करें" },
            { text: "रिपोर्ट करने के बाद क्या होता है", value: "रिपोर्ट करने के बाद क्या होता है" }
        ]
    };

    // Define bot responses for both languages
    const botResponses: Record<Language, Record<string, string>> = {
        en: {
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
            <li><strong>Police, Fire, Medical:</strong> 100 (Police), 101 (Fire), 102 (Ambulance)</li>
            <li><strong>National Emergency Number:</strong> 112</li>
            <li><strong>Women Helpline:</strong> 1090 or 1091</li>
            <li><strong>Child Helpline:</strong> 1098</li>
            <li><strong>Cyber Crime Helpline:</strong> 1930</li>
          </ul>
        </div>
        Is there a specific emergency service you need more information about?
      `,
            'report anonymously': `
        <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
          <h3 class="font-medium text-purple-300 mb-2">Report Anonymously</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Online portal:</strong> Use our SafetyNet app's anonymous reporting feature</li>
            <li><strong>Public safety app:</strong> Many states have dedicated apps for anonymous crime reporting</li>
            <li><strong>Crime Stoppers:</strong> Call your local Crime Stoppers hotline</li>
            <li><strong>Witness protection:</strong> Ask about programs when reporting serious crimes</li>
          </ul>
        </div>
        Your safety is important. Would you like more information about privacy protections when reporting?
      `,
            'what happens after reporting': `
        <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
          <h3 class="font-medium text-purple-300 mb-2">What Happens After Reporting</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>FIR/Case number:</strong> You'll receive a FIR number for your report</li>
            <li><strong>Investigation:</strong> Police will gather evidence and may contact you for more details</li>
            <li><strong>Documentation:</strong> Ask for a copy of your report for your records</li>
            <li><strong>Follow-up:</strong> You can track your case status with your FIR number</li>
            <li><strong>Legal process:</strong> If a suspect is identified, the case may proceed to court</li>
          </ul>
        </div>
        Would you like information about victim services and support resources?
      `,
            'theft': `
        <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
          <h3 class="font-medium text-purple-300 mb-2">Reporting Theft</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>Document all stolen items (descriptions, serial numbers, photos)</li>
            <li>Report to local police station to file an FIR</li>
            <li>For stolen credit cards/phones, contact your bank/service provider immediately</li>
            <li>For vehicles, report to police and your insurance company</li>
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
            <li>Seek medical attention and obtain medical documentation</li>
            <li>Call emergency services (100) or visit your local police station</li>
            <li>Document any injuries with photos if possible</li>
            <li>Note details about the assailant and incident</li>
            <li>Consider contacting victim support services</li>
          </ul>
        </div>
        Your safety and wellbeing are the priority. Would you like information about support services for assault victims?
      `,
            'cybercrime': `
        <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
          <h3 class="font-medium text-purple-300 mb-2">Reporting Cybercrime</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>Preserve evidence by taking screenshots and saving messages</li>
            <li>File a complaint at cyber crime portal: cybercrime.gov.in</li>
            <li>Call the National Cyber Crime Helpline: 1930</li>
            <li>Contact local police for filing an FIR in serious cases</li>
            <li>For financial fraud, inform your bank immediately</li>
          </ul>
        </div>
        Cybercrimes are increasing. Would you like specific guidance for a particular type of cybercrime?
      `,
            'domestic violence': `
        <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
          <h3 class="font-medium text-purple-300 mb-2">Reporting Domestic Violence</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>For immediate help call Women Helpline: 1091 or Emergency: 112</li>
            <li>File a complaint at your local police station or with a protection officer</li>
            <li>Seek medical attention and documentation of injuries</li>
            <li>Contact NGOs that provide shelter and legal assistance</li>
            <li>Apply for a protection order under the Domestic Violence Act</li>
          </ul>
        </div>
        Your safety is paramount. Would you like information about domestic violence shelters or support organizations?
      `
        },
        hi: {
            'default': "मुझे क्षमा करें, मैं आपका प्रश्न नहीं समझ पाया। क्या आप अपराध रिपोर्टिंग के बारे में अपना प्रश्न दोबारा पूछ सकते हैं?",
            'greeting': "नमस्ते! मैं RepoBot हूँ, आपका अपराध रिपोर्टिंग सहायक। मैं आज आपकी कैसे मदद कर सकता हूँ?",
            'अपराध की रिपोर्ट कैसे करें': `
        <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
          <h3 class="font-medium text-purple-300 mb-2">अपराध की रिपोर्ट कैसे करें</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>आपातकालीन स्थिति:</strong> यदि अपराध जारी है या कोई खतरे में है, तो तुरंत 100 (पुलिस) पर कॉल करें</li>
            <li><strong>गैर-आपातकालीन:</strong> अपने स्थानीय पुलिस स्टेशन के नंबर पर संपर्क करें</li>
            <li><strong>ऑनलाइन:</strong> कई शहरों में गैर-हिंसक अपराधों के लिए ऑनलाइन रिपोर्टिंग की सुविधा है</li>
            <li><strong>व्यक्तिगत रूप से:</strong> अपने नजदीकी पुलिस स्टेशन जाएं</li>
          </ul>
        </div>
        किस प्रकार के अपराध के बारे में आप अधिक जानकारी चाहते हैं?
      `,
            'आपातकालीन संपर्क': `
        <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
          <h3 class="font-medium text-purple-300 mb-2">आपातकालीन संपर्क</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>पुलिस, अग्निशमन, चिकित्सा:</strong> 100 (पुलिस), 101 (अग्निशमन), 102 (एम्बुलेंस)</li>
            <li><strong>राष्ट्रीय आपातकालीन नंबर:</strong> 112</li>
            <li><strong>महिला हेल्पलाइन:</strong> 1090 या 1091</li>
            <li><strong>चाइल्ड हेल्पलाइन:</strong> 1098</li>
            <li><strong>साइबर क्राइम हेल्पलाइन:</strong> 1930</li>
          </ul>
        </div>
        क्या आपको किसी विशेष आपातकालीन सेवा के बारे में अधिक जानकारी चाहिए?
      `,
            'गुमनाम रिपोर्ट करें': `
        <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
          <h3 class="font-medium text-purple-300 mb-2">गुमनाम रिपोर्ट करें</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>ऑनलाइन पोर्टल:</strong> हमारे SafetyNet ऐप की गुमनाम रिपोर्टिंग सुविधा का उपयोग करें</li>
            <li><strong>पब्लिक सेफ्टी ऐप:</strong> कई राज्यों में गुमनाम अपराध रिपोर्टिंग के लिए समर्पित ऐप्स हैं</li>
            <li><strong>क्राइम स्टॉपर्स:</strong> अपने स्थानीय क्राइम स्टॉपर्स हॉटलाइन पर कॉल करें</li>
            <li><strong>गवाह संरक्षण:</strong> गंभीर अपराधों की रिपोर्ट करते समय कार्यक्रमों के बारे में पूछें</li>
          </ul>
        </div>
        आपकी सुरक्षा महत्वपूर्ण है। क्या आप रिपोर्टिंग के समय गोपनीयता सुरक्षा के बारे में अधिक जानकारी चाहते हैं?
      `,
            'रिपोर्ट करने के बाद क्या होता है': `
        <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
          <h3 class="font-medium text-purple-300 mb-2">रिपोर्ट करने के बाद क्या होता है</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>FIR/केस नंबर:</strong> आपको अपनी रिपोर्ट के लिए एक FIR नंबर मिलेगा</li>
            <li><strong>जांच:</strong> पुलिस सबूत इकट्ठा करेगी और अधिक जानकारी के लिए आपसे संपर्क कर सकती है</li>
            <li><strong>दस्तावेजीकरण:</strong> अपने रिकॉर्ड के लिए अपनी रिपोर्ट की एक प्रति मांगें</li>
            <li><strong>फॉलो-अप:</strong> आप अपने FIR नंबर से अपने केस की स्थिति ट्रैक कर सकते हैं</li>
            <li><strong>कानूनी प्रक्रिया:</strong> यदि संदिग्ध की पहचान की जाती है, तो मामला अदालत में जा सकता है</li>
          </ul>
        </div>
        क्या आप पीड़ित सेवाओं और सहायता संसाधनों के बारे में जानकारी चाहते हैं?
      `,
            'चोरी': `
        <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
          <h3 class="font-medium text-purple-300 mb-2">चोरी की रिपोर्ट करना</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>सभी चोरी हुई वस्तुओं का दस्तावेजीकरण करें (विवरण, सीरियल नंबर, फोटो)</li>
            <li>FIR दर्ज करने के लिए स्थानीय पुलिस स्टेशन में रिपोर्ट करें</li>
            <li>चोरी हुए क्रेडिट कार्ड/फोन के लिए, तुरंत अपने बैंक/सेवा प्रदाता से संपर्क करें</li>
            <li>वाहनों के लिए, पुलिस और अपनी बीमा कंपनी को सूचित करें</li>
            <li>बीमा दावों के लिए पुलिस रिपोर्ट की एक प्रति का अनुरोध करें</li>
          </ul>
        </div>
        क्या आप चाहते हैं कि मैं आपको चोरी की रिपोर्ट के लिए जानकारी तैयार करने में मदद करूं?
      `,
            'हमला': `
        <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
          <h3 class="font-medium text-purple-300 mb-2">हमले की रिपोर्ट करना</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>सबसे पहले अपनी तत्काल सुरक्षा सुनिश्चित करें</li>
            <li>चिकित्सा सहायता लें और चिकित्सा दस्तावेज प्राप्त करें</li>
            <li>आपातकालीन सेवाओं (100) को कॉल करें या अपने स्थानीय पुलिस स्टेशन पर जाएं</li>
            <li>यदि संभव हो तो फोटो के साथ किसी भी चोट का दस्तावेजीकरण करें</li>
            <li>हमलावर और घटना के बारे में विवरण नोट करें</li>
            <li>पीड़ित सहायता सेवाओं से संपर्क करने पर विचार करें</li>
          </ul>
        </div>
        आपकी सुरक्षा और कल्याण प्राथमिकता है। क्या आप हमले के पीड़ितों के लिए सहायता सेवाओं के बारे में जानकारी चाहते हैं?
      `,
            'साइबर अपराध': `
        <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
          <h3 class="font-medium text-purple-300 mb-2">साइबर अपराध की रिपोर्ट करना</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>स्क्रीनशॉट लेकर और संदेशों को सहेजकर सबूत संरक्षित करें</li>
            <li>साइबर क्राइम पोर्टल पर शिकायत दर्ज करें: cybercrime.gov.in</li>
            <li>राष्ट्रीय साइबर अपराध हेल्पलाइन पर कॉल करें: 1930</li>
            <li>गंभीर मामलों में FIR दर्ज करने के लिए स्थानीय पुलिस से संपर्क करें</li>
            <li>वित्तीय धोखाधड़ी के लिए, तुरंत अपने बैंक को सूचित करें</li>
          </ul>
        </div>
        साइबर अपराध बढ़ रहे हैं। क्या आप किसी विशेष प्रकार के साइबर अपराध के लिए विशिष्ट मार्गदर्शन चाहते हैं?
      `,
            'घरेलू हिंसा': `
        <div class="bg-purple-900/60 rounded-lg p-4 border-l-4 border-purple-400 mb-2">
          <h3 class="font-medium text-purple-300 mb-2">घरेलू हिंसा की रिपोर्ट करना</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>तत्काल सहायता के लिए महिला हेल्पलाइन: 1091 या आपातकालीन: 112 पर कॉल करें</li>
            <li>अपने स्थानीय पुलिस स्टेशन या किसी सुरक्षा अधिकारी के पास शिकायत दर्ज करें</li>
            <li>चिकित्सा सहायता और चोटों के दस्तावेजीकरण की मांग करें</li>
            <li>आश्रय और कानूनी सहायता प्रदान करने वाले गैर-सरकारी संगठनों से संपर्क करें</li>
            <li>घरेलू हिंसा अधिनियम के तहत सुरक्षा आदेश के लिए आवेदन करें</li>
          </ul>
        </div>
        आपकी सुरक्षा सर्वोपरि है। क्या आप घरेलू हिंसा आश्रयों या सहायता संगठनों के बारे में जानकारी चाहते हैं?
      `
        }
    };

    // Initialize with welcome message
    useEffect(() => {
        setMessages([
            {
                content: language === 'en'
                    ? "Hello, I'm RepoBot - here to assist with crime reporting. What can I help you with today?"
                    : "नमस्ते, मैं RepoBot हूँ - अपराध रिपोर्टिंग में आपकी सहायता के लिए। आज मैं आपकी कैसे मदद कर सकता हूँ?",
                sender: 'bot'
            }
        ]);
    }, [language]);

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

        // Auto-detect language (very simple detection)
        const detectedLanguage = detectLanguage(inputValue);
        if (detectedLanguage !== language) {
            setLanguage(detectedLanguage);
        }

        // Simulate bot response
        setTimeout(() => {
            const response = getBotResponse(inputValue.toLowerCase(), detectedLanguage);
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
            const response = getBotResponse(option.toLowerCase(), language);
            setMessages(prev => [...prev, {
                content: response,
                sender: 'bot',
                html: response.includes('<div')
            }]);
            setIsTyping(false);
        }, 600);
    };

    // Simple language detection function
    const detectLanguage = (text: string): Language => {
        // Common Hindi characters and patterns
        const hindiPattern = /[\u0900-\u097F]/; // Unicode range for Devanagari script

        // Check if text contains Hindi characters
        if (hindiPattern.test(text)) {
            return 'hi';
        }

        // Otherwise default to English
        return 'en';
    };

    // Get bot response based on user input
    const getBotResponse = (input: string, lang: Language): string => {
        // English responses
        if (lang === 'en') {
            // Check for keywords in the input
            if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
                return botResponses.en['greeting'];
            } else if (input.includes('how') && input.includes('report')) {
                return botResponses.en['how to report a crime'];
            } else if (input.includes('emergency') || input.includes('contact') || input.includes('numbers') || input.includes('phone')) {
                return botResponses.en['emergency contacts'];
            } else if (input.includes('anonymous') || input.includes('privately') || input.includes('secret')) {
                return botResponses.en['report anonymously'];
            } else if ((input.includes('after') && input.includes('report')) || input.includes('next steps') || input.includes('what happens')) {
                return botResponses.en['what happens after reporting'];
            } else if (input.includes('theft') || input.includes('stolen') || input.includes('rob') || input.includes('burglary')) {
                return botResponses.en['theft'];
            } else if (input.includes('assault') || input.includes('attack') || input.includes('beat') || input.includes('hit')) {
                return botResponses.en['assault'];
            } else if (input.includes('cyber') || input.includes('online') || input.includes('hack') || input.includes('internet') || input.includes('fraud')) {
                return botResponses.en['cybercrime'];
            } else if (input.includes('domestic') || input.includes('spouse') || input.includes('wife') || input.includes('husband') || input.includes('partner') || input.includes('family violence')) {
                return botResponses.en['domestic violence'];
            } else {
                return botResponses.en['default'];
            }
        }
        // Hindi responses
        else {
            if (input.includes('नमस्ते') || input.includes('हैलो') || input.includes('हाय')) {
                return botResponses.hi['greeting'];
            } else if (input.includes('कैसे') && (input.includes('रिपोर्ट') || input.includes('सूचना'))) {
                return botResponses.hi['अपराध की रिपोर्ट कैसे करें'];
            } else if (input.includes('आपातकालीन') || input.includes('संपर्क') || input.includes('नंबर') || input.includes('फोन')) {
                return botResponses.hi['आपातकालीन संपर्क'];
            } else if (input.includes('गुमनाम') || input.includes('अनाम') || input.includes('बिना नाम')) {
                return botResponses.hi['गुमनाम रिपोर्ट करें'];
            } else if ((input.includes('बाद') && input.includes('रिपोर्ट')) || input.includes('अगले कदम') || input.includes('क्या होता है')) {
                return botResponses.hi['रिपोर्ट करने के बाद क्या होता है'];
            } else if (input.includes('चोरी') || input.includes('चुराया') || input.includes('लूट')) {
                return botResponses.hi['चोरी'];
            } else if (input.includes('हमला') || input.includes('मारपीट') || input.includes('पिटाई')) {
                return botResponses.hi['हमला'];
            } else if (input.includes('साइबर') || input.includes('ऑनलाइन') || input.includes('हैक') || input.includes('इंटरनेट') || input.includes('धोखाधड़ी')) {
                return botResponses.hi['साइबर अपराध'];
            } else if (input.includes('घरेलू') || input.includes('पति') || input.includes('पत्नी') || input.includes('हिंसा') || input.includes('परिवार')) {
                return botResponses.hi['घरेलू हिंसा'];
            } else {
                return botResponses.hi['default'];
            }
        }
    };

    const handleEmergency = () => {
        alert(language === 'en'
            ? 'For immediate emergencies, please call 911 (or your local emergency number) now!'
            : 'तत्काल आपात स्थिति के लिए, कृपया अभी 112 (या अपना स्थानीय आपातकालीन नंबर) पर कॉल करें!');
        // Could also add code to directly launch the phone dialer
    };

    const toggleLanguage = () => {
        const newLanguage = language === 'en' ? 'hi' : 'en';
        setLanguage(newLanguage);
        // Add a message to indicate language change
        setMessages(prev => [...prev, {
            content: newLanguage === 'en'
                ? "Language changed to English. How can I help you today?"
                : "भाषा हिंदी में बदल दी गई है। आज मैं आपकी कैसे मदद कर सकता हूँ?",
            sender: 'bot'
        }]);
    };

    return (
        <>
            {/* Chat button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-300"
                aria-label="Open chat"
            >
                <MessageSquare size={24} />
            </button>

            {/* Chat interface */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 w-96 h-[500px] bg-gray-900 rounded-lg shadow-xl flex flex-col overflow-hidden border border-purple-600">
                    {/* Header */}
                    <div className="bg-purple-600 p-3 flex justify-between items-center">
                        <div className="flex items-center">
                            <AlertCircle size={20} className="text-white mr-2" />
                            <h3 className="text-white font-medium">{language === 'en' ? 'Crime Reporting Assistant' : 'अपराध रिपोर्टिंग सहायक'}</h3>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={toggleLanguage}
                                className="mr-2 text-white hover:bg-purple-700 rounded-full p-1"
                                aria-label="Change language"
                            >
                                <Globe size={18} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-purple-700 rounded-full p-1"
                                aria-label="Close chat"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-3/4 rounded-lg px-4 py-2 ${message.sender === 'user'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-700 text-gray-100'
                                        }`}
                                >
                                    {message.html ? (
                                        <div dangerouslySetInnerHTML={{ __html: message.content }} />
                                    ) : (
                                        <p>{message.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-gray-700 text-white rounded-lg px-4 py-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick options */}
                    <div className="px-4 py-2 bg-gray-900 overflow-x-auto whitespace-nowrap">
                        <div className="flex space-x-2">
                            {quickOptions[language].map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickOption(option.value)}
                                    className="bg-gray-800 hover:bg-purple-700 text-white text-sm rounded-full px-3 py-1 whitespace-nowrap border border-gray-700"
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Emergency button */}
                    <button
                        onClick={handleEmergency}
                        className="mx-4 my-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
                    >
                        <AlertCircle size={18} className="mr-2" />
                        {language === 'en' ? 'Emergency Help' : 'आपातकालीन सहायता'}
                    </button>

                    {/* Input area */}
                    <div className="p-4 border-t border-gray-700 bg-gray-900">
                        <div className="flex">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-l-md py-2 px-4 focus:outline-none focus:border-purple-500"
                                placeholder={language === 'en' ? "Type your message here..." : "अपना संदेश यहां लिखें..."}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={inputValue.trim() === ''}
                                className="bg-purple-600 hover:bg-purple-700 text-white rounded-r-md px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RepoBot;