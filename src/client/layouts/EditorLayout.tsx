import { Outlet } from 'react-router'

export default function EditorLayout() {
  return (
    <div className="bg-forge-950 h-screen overflow-hidden">
      <Outlet />
    </div>
  )
}
