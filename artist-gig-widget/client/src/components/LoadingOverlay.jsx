import React, { useEffect, useState } from "react";
import "../styles/global.css";

export default function LoadingOverlay({
    messages = [
        "Tuning the strings...",
        "Finding your gigs...",
        "Setting up your stage..."
    ]
}) {

    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {

            setMessageIndex(prev =>
                (prev + 1) % messages.length
            );

        }, 1500);


        return () => clearInterval(interval);

    }, [messages]);


    return (

        <div className="loading-overlay">

            <div className="loading-card">

                <h2 className="loading-logo">
                    🎸 Gig Board
                </h2>


                <div className="loading-spinner"></div>


                <p className="loading-text">
                    {messages[messageIndex]}
                </p>

            </div>

        </div>

    );
}