import { BackgroundBeams } from "@/components/ui/background-beams"
import { CreateForm } from "./form"

export default function CreatePage() {
  return (
    <div className="relative min-h-screen pt-24">
      <BackgroundBeams className="opacity-50" />
      <div className="relative z-10 flex min-h-[calc(100vh-6rem)] items-center justify-center px-4">
        <CreateForm />
      </div>
    </div>
  )
}
