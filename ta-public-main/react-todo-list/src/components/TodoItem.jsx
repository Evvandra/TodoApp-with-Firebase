import { async } from "@firebase/util";
import { doc, updateDoc, deleteDoc  } from "firebase/firestore";
import { useState } from "react";
import { db } from '../firebase/config.js';

export function TodoItem({ completed, id, title, toggleTodo, deleteTodo, editTodo }) {
  const [checked, setChecked] = useState(completed);

  async function handleDelete() {
    const todoDocRef = doc(db, "todos", id);
    try {
        await deleteDoc(todoDocRef)
    } catch (error) {
        alert(error)
    }
}

  async function handleChecked(e) {
    const checked = e.target.checked;
    setChecked(checked);
    const todoDocRef = doc(db, "todos", id);
    try {
        await updateDoc(todoDocRef, {
            completed: checked,
        })
    } catch (error) {
        alert(error)
    }
  }

  return (
    <li key={id}>
      <label className={`grow text-black ${completed ? 'line' : ''}`}>
        <input
          type="checkbox"
          checked={completed}
          onChange={handleChecked}
        />
        {title}
      </label>
      <button className="btn flex-none" onClick={() => editTodo(id)}>
        Edit
      </button>
      <button className="btn btn-danger flex-none" onClick={handleDelete}>
        Delete
      </button>
    </li>
  );
}