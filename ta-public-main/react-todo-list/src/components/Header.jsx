import Users from "../pages/Users";
import { Link } from "react-router-dom";

export function Header () {
  return (
    <div className="app-container mt-6 mb-6 shadow-xl px-6 py-6 bg-violet-400">
      <header className="flex justify-center my-4 text-white">
        <div>
          <h1 className="uppercase tracking-[.3em] cursor-default select-none text-4xl font-bold">To-Do App</h1>
        </div>
      </header>
    </div>

  );
}