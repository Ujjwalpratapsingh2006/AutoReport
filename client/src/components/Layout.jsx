import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
            {/* Persistent Sidebar */}
            <Sidebar />

            {/* Main Content Area (Dashboard or ChatPage) */}
            <main className="flex-1 relative overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
