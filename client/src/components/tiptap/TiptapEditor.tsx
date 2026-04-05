import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import { useEffect } from 'react';

import Toolbar from './Toolbar';

interface TiptapEditorProps {
    value?: string;
    onChange: (value: string) => void;
}

const TiptapEditor = ({ 
    value = '', 
    onChange
}: TiptapEditorProps) => {
    
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc pl-6 my-2',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal pl-6 my-2',
                    },
                },
            }),
            Heading.configure({
                levels: [1, 2, 3],
                HTMLAttributes: {
                    class: 'font-semibold tracking-tight',
                },
            }),
        ],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none min-h-[320px] p-5 focus:outline-none',
            },
            handleKeyDown(view, event) {
                if (event.key === 'Tab') {
                    event.preventDefault();
                    const { state, dispatch } = view;
                    const { tr, selection } = state;
                    dispatch(tr.insertText('    ', selection.from, selection.to));
                    return true;
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== undefined) {
            const currentContent = editor.getHTML();
            
            if (value !== currentContent) {
                editor.commands.setContent(value, {
                    emitUpdate: false,  
                });
            }
        }
    }, [editor, value]);

    return (
        <div className="border border-input rounded-md overflow-hidden w-full bg-background">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapEditor;