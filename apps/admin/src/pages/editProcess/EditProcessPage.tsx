import { useState } from "react"
import ControlBar from "./components/ControlBar"
import ProcessEditor from "./components/ProcessEditor"

function EditProcessPage() {
  const [processName, setProcessName] = useState("")

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ControlBar processName={processName} onProcessNameChange={setProcessName} />
      <main className="flex-1 overflow-y-auto">
        <ProcessEditor />
      </main>
    </div>
  )
}

export default EditProcessPage
