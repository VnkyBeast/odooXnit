import { useEffect, useState } from 'react';

const Chatbot = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
        script.async = true;
        script.onload = () => setLoaded(true);
        document.body.appendChild(script);
    }, []);

    return (
        <>
            {loaded && (
                <div
                    dangerouslySetInnerHTML={{
                        __html: `
              <df-messenger
                intent="WELCOME"
                chat-title="REPOBOT"
                agent-id="be8174be-40a3-4e9b-8206-dd3a5b963dda"
                language-code="en"
                chat-icon="https://img.icons8.com/emoji/48/robot.png"
                background-color="#1f1b2e"
                font-color="#e0b3ff">
              </df-messenger>
            `,
                    }}
                />
            )}
        </>
    );
};

export default Chatbot;