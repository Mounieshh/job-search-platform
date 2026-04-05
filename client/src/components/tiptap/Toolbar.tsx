import type { Editor } from "@tiptap/react"
import { Toggle } from "../ui/toggle"
import { Bold, Heading1, Italic, List } from "lucide-react"

type EditorProps = {
    editor: Editor | null
}

export default function Toolbar({ editor }: EditorProps) {
    if (!editor) return null

    return (
        <div className="border border-input bg-transparent rounded-none">
            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
            ><Heading1 /></Toggle>


            <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                    editor.chain().focus().toggleBold().run()
                }
            ><Bold /></Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                    editor.chain().focus().toggleItalic().run()
                }
            ><Italic /></Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
            ><List /></Toggle>
        </div>
    )
}