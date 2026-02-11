import React, { useEffect, useRef } from 'react';

interface WordPressContentProps {
    content: string;
    className?: string;
}

export const WordPressContent: React.FC<WordPressContentProps> = ({ content, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !content) return;

        // Create a temporary container to parse the string
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;

        // Find all script tags
        const scripts = tempDiv.getElementsByTagName('script');
        const scriptElements: HTMLScriptElement[] = [];

        // Process scripts
        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            const newScript = document.createElement('script');

            // Copy attributes
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });

            // Copy content
            newScript.innerHTML = script.innerHTML;
            scriptElements.push(newScript);
        }

        // Clear and set content (without scripts first)
        containerRef.current.innerHTML = content;

        // Re-add scripts to trigger execution
        // We need to remove the scripts from the container first to avoid duplication/issues
        // but innerHTML = content already put them there (non-executable).
        // Let's remove the non-executable ones and replace them, or just append the executable ones.
        // A cleaner approach is often to append them to the container or document.body

        scriptElements.forEach(script => {
            // If it has a src, we should probably append strict async/defer logic or just append
            // For inline scripts, appending works.
            // Identify if the script is already there (it is, but lifeless).
            // Let's just append the new live script to the container.
            containerRef.current?.appendChild(script);
        });

        // Cleanup function? 
        // Not really possible to "undo" script execution easily without reloading context.

    }, [content]);

    return (
        <div
            ref={containerRef}
            className={className}
        />
    );
};
