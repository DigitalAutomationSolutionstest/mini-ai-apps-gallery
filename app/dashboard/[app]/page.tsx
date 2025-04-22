import { notFound } from "next/navigation"
import { PDFApp } from "@/components/apps/PDFApp"
import { ImageApp } from "@/components/apps/ImageApp"
import { CodeApp } from "@/components/apps/CodeApp"
import { AudioApp } from "@/components/apps/AudioApp"

export default function AppPage({ params }: { params: { app: string } }) {
  const { app } = params

  const apps: Record<string, JSX.Element> = {
    pdf: <PDFApp />,
    image: <ImageApp />,
    code: <CodeApp />,
    audio: <AudioApp />,
  }

  if (!apps[app]) return notFound()

  return (
    <div className="max-w-4xl mx-auto w-full">
      {apps[app]}
    </div>
  )
} 