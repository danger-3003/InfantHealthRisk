import {
  Home,
  Settings,
  BrainCircuit,
  BarChart3,
} from "lucide-react"

export const SidebarUrls = [
  {
    key: "predict",
    name: "Predict",
    path: "/predict",
    icon: <BrainCircuit size={16}/>
  },
  {
    key: "results",
    name: "Results",
    path: "/results",
    icon: <BarChart3 size={16}/>
  },
  {
    key: "settings",
    name: "Settings",
    path: "/settings",
    icon: <Settings size={16}/>
  },
]
