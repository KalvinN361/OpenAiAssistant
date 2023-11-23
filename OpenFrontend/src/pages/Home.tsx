import Typewriter from 'typewriter-effect';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import Forecaster from '../assets/images/Forecaster.png';
import Cookies from 'js-cookie';
import { api } from '../libs/api';

export const Home: React.FC = () => {
    const [userInput, setUserInput] = useState('');
    const [showPremadeMessages, setShowPremadeMessages] = useState(true);
    const [conversation, setConversation] = useState<
        {
            content: React.ReactNode;
            role: string;
            displayedContent?: React.ReactNode;
        }[]
    >([]);
    const [premadeMessages, setPremadeMessages] = useState([
        "Score Bill Murray's Fame",
        'What is Project Venkman',
        'Compare two celebrities',
        'What is Bill Murray Club',
    ]);
    const conversationEndRef = React.useRef<HTMLDivElement | null>(null);
    const conversationContainerRef = React.useRef<HTMLDivElement | null>(null);

    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const handleSubmit = async (event?: React.FormEvent, message?: string) => {
        event?.preventDefault();
        setShowPremadeMessages(false);
        const content = message || userInput;

        // Add user's input to the conversation
        setConversation((prevConversation) => [
            ...prevConversation,
            { content: content, role: 'user' },
        ]);

        setUserInput('');

        // Add loading message to the conversation
        setConversation((prevConversation) => [
            ...prevConversation,
            {
                content: '',
                role: 'assistant',
            },
        ]);

        setLoading(true);
        setIsTyping(true);
        try {
            const response = await api.post('/api/assistant', {
                content: content,
                thread_id: Cookies.get('thread_id'),
            });
            console.log(response);
            Cookies.set('thread_id', response.data.thread_id);

            const assistantMessages = response.data.messages.filter(
                (msg: { role: string }) => msg.role === 'assistant'
            );

            if (assistantMessages.length > 0) {
                setConversation((prevConversation) => {
                    let newConversation = [...prevConversation];
                    newConversation[newConversation.length - 1].content =
                        assistantMessages[0].content;
                    return newConversation;
                });
            }
            setIsTyping(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

        setUserInput('');
    };
    const handlePremadeMessage = (message: string) => {
        setUserInput(message);
        handleSubmit(undefined, message);
        setShowPremadeMessages(false);
    };
    useEffect(() => {
        const cursorElement = document.querySelector('.Typewriter__cursor');
        if (cursorElement instanceof HTMLElement) {
            if (isTyping) {
                cursorElement.style.display = '';
            } else {
                cursorElement.style.display = 'none';
            }
        }
    }, [isTyping]);
    useEffect(() => {
        console.log(conversationEndRef.current);
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    conversationEndRef.current?.scrollIntoView({
                        behavior: 'smooth',
                    });
                }
            });
        });

        if (conversationContainerRef.current) {
            observer.observe(conversationContainerRef.current, {
                childList: true,
                subtree: true,
            });
        }

        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        const handleWindowLoad = () => {
            Cookies.remove('thread_id');
        };

        window.addEventListener('load', handleWindowLoad);

        return () => {
            window.removeEventListener('load', handleWindowLoad);
        };
    }, []);
    return (
        <div className="bg-[#343541] min-h-screen flex flex-col">
            {showPremadeMessages && (
                <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <img
                        src={Forecaster}
                        alt="Descriptive Alt Text"
                        className="mb-4 xxxs:w-12 xxxs:h-12 xxs:w-12 xxs:h-12 xs:w-12 xs:h-12 w-24 h-24 rounded-full mx-auto"
                    />
                    <h1 className="xxxs:text-xl xxs:text-xl xs:text-xl md:text-2xl font-semibold text-white">
                        Project Venkman Forecaster
                    </h1>
                    <h2 className="xxxs:text-base xxs:text-base xs:text-base md:text-xl text-[#8994AC]">
                        Scores fame and forecasts membership value.
                    </h2>
                    <p className="xxxs:text-xs xxs:text-xs xs:text-xs md:text-sm text-[#8994AC]">
                        By{' '}
                        <a
                            className="underline"
                            href="https://www.billmurray.club/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            projectvenkman.com
                        </a>
                    </p>
                </div>
            )}
            <div className="bg-[#343541] flex-grow rounded-xl shadow-lg flex flex-col">
                <div className="xxxs:p-0 xxs-p-0 xs:p-0 p-6 flex-grow">
                    <h2 className="xxxs:text-2xl xxs:text-2xl xs:text-2xl md:text-3xl font-semibold text-white mt-4 ml-4">
                        Project Venkman Forecaster
                    </h2>
                    <div
                        ref={conversationContainerRef}
                        className="mt-4 rounded p-4 flex-grow overflow-auto h-[75vh] px-4 md:px-32"
                    >
                        {conversation.map((msg, index) => (
                            <div key={index} className="mb-4">
                                <p className="font-bold text-lg text-white">
                                    {msg.role === 'assistant'
                                        ? 'Project Venkman Forecaster'
                                        : 'You'}
                                </p>
                                <div className="flex items-center text-white mt-2">
                                    {msg.role === 'assistant' ? (
                                        index === conversation.length - 1 ? (
                                            <Typewriter
                                                key={isTyping.toString()}
                                                options={{
                                                    delay: 10,
                                                    strings: [
                                                        typeof msg.content ===
                                                        'string'
                                                            ? msg.content
                                                            : '',
                                                    ],
                                                    autoStart: true,
                                                    loop: false,
                                                    cursor: '●',
                                                    deleteSpeed: Infinity,
                                                }}
                                                onInit={(typewriter) => {
                                                    if (
                                                        typeof msg.content ===
                                                        'string'
                                                    ) {
                                                        typewriter
                                                            .typeString(
                                                                msg.content
                                                            )
                                                            .callFunction(
                                                                () => {
                                                                    console.log(
                                                                        'ran'
                                                                    );
                                                                }
                                                            )
                                                            .start();
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <p>{msg.content}</p>
                                        )
                                    ) : (
                                        <p>{msg.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={conversationEndRef} />
                    </div>
                    <div className="fixed bottom-24 xxxs:bottom-4 xxs:bottom-4 xs:bottom-4 w-full flex justify-center items-center flex-col px-4 md:px-0 max-w-[1920px]">
                        {' '}
                        {showPremadeMessages && (
                            <div className="mb-4 grid grid-cols-2 gap-4 w-full md:w-[50%] mx-auto">
                                {premadeMessages.map((message, index) => (
                                    <button
                                        disabled={loading}
                                        key={index}
                                        onClick={() =>
                                            handlePremadeMessage(message)
                                        }
                                        className="bg-[#343541] xxxs:text-xs xxs:text-xs xs:text-xs md:text-base text-white border border-[#565869] py-2 px-4 rounded-xl hover:bg-gray-300"
                                    >
                                        {message}
                                    </button>
                                ))}
                            </div>
                        )}
                        <form
                            onSubmit={handleSubmit}
                            className="mt-4 flex p-6 mx-auto xxxs:w-full xxs:w-full xs:w-full md:w-[60%] relative"
                        >
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Message Project Venkman Forecaster..."
                                className="flex-grow p-3 border border-gray-300 bg-transparent rounded-xl pr-12 placeholder-[#8C8C93] text-white" // Add padding right here
                            />
                            <button
                                type="submit"
                                className={`w-9 h-9 flex items-center justify-center p-[15px] rounded-lg absolute right-8 top-1/2 transform -translate-y-1/2 ${
                                    userInput ? 'bg-white' : 'bg-[#494A54]'
                                }`}
                                disabled={loading || !userInput}
                            >
                                <FontAwesomeIcon
                                    icon={faArrowUp}
                                    size="sm"
                                    style={{ color: '#30303A' }}
                                />
                            </button>
                        </form>
                        <p className="text-sm text-gray-500 text-center">
                            The Project Venkman Forecaster can make mistakes.
                            Consider checking important information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
