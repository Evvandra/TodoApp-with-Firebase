import React, { useState, useEffect } from 'react';
import '../App.css';
import { Header } from '../components/Header';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import { collection, query, onSnapshot, where, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase/config";

function Todo({userCredential}) {
  const [todos, setTodos] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [todoCounter, setTodoCounter] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const [filter, selectedFilter] = useState("All");
  const user = auth.currentUser;
  
  useEffect(() => {
    const q = query(collection(db, "todos"), where("userID", "==", user.uid));
    onSnapshot(q, (querySnapshot) => {
      setTodos(querySnapshot.docs.map(doc => ({
        id: doc.id, 
        data: doc.data()
      })))
    })
  }, [])

  function addTodo(newItem) {
    setTodos((currentTodos) => [
      ...currentTodos,
      { id: crypto.randomUUID(), number: todoCounter, title: `${todoCounter}. ${newItem}`, completed: false },
    ]);
    setTodoCounter((prevCounter) => prevCounter + 1);
  }

  function toggleTodo(id, completed) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos((currentTodos) => {
      const updatedTodos = currentTodos.filter((todo) => todo.id !== id);
      return updatedTodos.map((todo, index) => ({ ...todo, number: index + 1 }));
    });
  }

  async function editTodo(id) {
    const todoToEdit = todos.find((todo) => todo.id === id);
    setEditItem(todoToEdit);
    setNewItem(todoToEdit.data.title);
  }

  async function editTodoForm(newItem) {
    const todoDocRef = doc(db, "todos", editItem.id); 
    try {
      await updateDoc(todoDocRef, {
        title: newItem
      });
      setEditItem(null);
    } catch (error) {
      alert(error);
    }
  
    console.log(newItem);
  }

  function handleFilterCompleted() {
    console.log("Filter:", filter);
    console.log("Original Todos:", todos);
  
    switch (filter) {
      case "Completed":
        const completedTodos = todos.filter((todo) => todo.data.completed !== undefined && todo.data.completed);
        return completedTodos;
      case "Ongoing":
        const ongoingTodos = todos.filter((todo) => todo.data.completed !== undefined && !todo.data.completed);
        return ongoingTodos;
      default:
        return todos;
    }
  }
  
  return (
    <>
      <Header />
      <div className="flex  w-full bg-white h-96 shadow-xl">
        <div className="flex justify-center place-items-center mx-20">
          <TodoForm editTodoForm={editTodoForm} addTodo={addTodo} editItem={editItem} userCredential={userCredential}/>
        </div>
        <div className="w-full flex justify-center place-items-center ">
          <TodoList 
            todos={handleFilterCompleted()}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            handleFilterCompleted={handleFilterCompleted}
            selectedFilter={selectedFilter}
          />
        </div>
      </div>
      
    </>
  );
}

export default Todo;
