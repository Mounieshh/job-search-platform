import { mergeAttributes } from '@tiptap/core'
import Heading from '@tiptap/extension-heading'
import { BulletList, ListKeymap } from '@tiptap/extension-list'
import { useEditor, EditorContent, EditorContext } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useMemo } from 'react'
import Toolbar from './Toolbar'

interface TiptapEditorProps {

    onChange?: (value: any) => void
    
    initialContent?: string | object
}

const CustomHeading = Heading.extend({
    renderHTML({ node, HTMLAttributes }) {
        const classes: Record<number, string> = {
            1: 'text-3xl font-bold',
            2: 'text-2xl font-semibold',
            3: 'text-xl font-medium',
        }
        return [
            `h${node.attrs.level}`,
            mergeAttributes(HTMLAttributes, { class: classes[node.attrs.level] }),
            0
        ]
    }
})


const TiptapEditor = ({ onChange, initialContent }: TiptapEditorProps) => {


    

    
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: false }),
            CustomHeading.configure({ levels: [1, 2, 3] }),
            BulletList.configure({
                HTMLAttributes: {
                    class: "list-disc pl-10 space-y-1 my-2"
                }
            }),
            ListKeymap
        ],
        content: initialContent || null,
        editorProps: {
            attributes: {
                class: "max-w-none w-full min-h-[300px] p-4 focus:outline-none"
            },
            handleKeyDown(view, event) {
                if (event.key === 'Tab') {
                    event.preventDefault()
                    const { state, dispatch } = view
                    const { tr, selection } = state
                    dispatch(tr.insertText('    ', selection.from, selection.to))
                    return true
                }
                return false
            }
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        }
    })

    useEffect(() => {
        if (editor && initialContent) {
            editor.commands.setContent(initialContent)
        }
    }, [initialContent, editor])

    const providerValue = useMemo(() => ({ editor }), [editor])

    return (
        <EditorContext.Provider value={providerValue}>
            <div className="border rounded-md overflow-hidden w-full">
                <Toolbar editor={editor} />
                <EditorContent editor={editor} />
            </div>
        </EditorContext.Provider>
    )
}

export default TiptapEditor