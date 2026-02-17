"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Type
} from "lucide-react"
import { Button } from "./button"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base focus:outline-none min-h-[150px] p-4 text-foreground",
            },
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 border-b border-border">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "bg-primary/20 text-primary" : "text-muted-foreground"}
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "bg-primary/20 text-primary" : "text-muted-foreground"}
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive("underline") ? "bg-primary/20 text-primary" : "text-muted-foreground"}
                >
                    <UnderlineIcon className="w-4 h-4" />
                </Button>

                <div className="w-px h-4 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "bg-primary/20 text-primary" : "text-muted-foreground"}
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive("orderedList") ? "bg-primary/20 text-primary" : "text-muted-foreground"}
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>

                <div className="w-px h-4 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive("heading", { level: 3 }) ? "bg-primary/20 text-primary" : "text-muted-foreground"}
                >
                    <Type className="w-4 h-4" />
                </Button>
            </div>

            {/* Content Area */}
            <EditorContent editor={editor} />

            <style jsx global>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #94a3b8;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror {
                    min-height: 150px;
                }
                .ProseMirror:focus {
                    outline: none;
                }
            `}</style>
        </div>
    )
}
