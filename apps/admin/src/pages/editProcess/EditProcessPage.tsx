import { useState } from "react"
import ControlBar from "./components/ControlBar"
import ProcessEditor from "./components/ProcessEditor"
import NavBar from "../../components/NavBar"

function EditProcessPage() {
  const [processName, setProcessName] = useState("")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <ControlBar processName={processName} onProcessNameChange={setProcessName} />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <ProcessEditor />
      </main>
    </div>
  )
}

export default EditProcessPage
