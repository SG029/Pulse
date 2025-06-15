// // src/components/TodoList.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { db } from '../firebase';
// import { ref, push, onValue, update, remove } from 'firebase/database';

// const TodoList = () => {
//   const { currentUser } = useAuth();
//   const [todos, setTodos] = useState({});
//   const [newTodo, setNewTodo] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all'); // all, completed, pending

//   useEffect(() => {
//     if (currentUser) {
//       const todosRef = ref(db, `users/${currentUser.uid}/todos`);
//       const unsubscribe = onValue(todosRef, (snapshot) => {
//         const data = snapshot.val();
//         setTodos(data || {});
//         setLoading(false);
//       });

//       return () => unsubscribe();
//     }
//   }, [currentUser]);

//   const addTodo = async (e) => {
//     e.preventDefault();
//     if (newTodo.trim() === '') return;

//     try {
//       const todosRef = ref(db, `users/${currentUser.uid}/todos`);
//       await push(todosRef, {
//         text: newTodo,
//         completed: false,
//         createdAt: new Date().toISOString(),
//         priority: 'medium',
//         category: 'general'
//       });
//       setNewTodo('');
//     } catch (error) {
//       console.error('Error adding todo:', error);
//     }
//   };

//   const toggleTodo = async (todoId) => {
//     try {
//       const todoRef = ref(db, `users/${currentUser.uid}/todos/${todoId}`);
//       await update(todoRef, {
//         completed: !todos[todoId].completed,
//         completedAt: !todos[todoId].completed ? new Date().toISOString() : null
//       });
//     } catch (error) {
//       console.error('Error updating todo:', error);
//     }
//   };

//   const deleteTodo = async (todoId) => {
//     if (window.confirm('Are you sure you want to delete this todo?')) {
//       try {
//         const todoRef = ref(db, `users/${currentUser.uid}/todos/${todoId}`);
//         await remove(todoRef);
//       } catch (error) {
//         console.error('Error deleting todo:', error);
//       }
//     }
//   };

//   const setPriority = async (todoId, priority) => {
//     try {
//       const todoRef = ref(db, `users/${currentUser.uid}/todos/${todoId}`);
//       await update(todoRef, { priority });
//     } catch (error) {
//       console.error('Error updating priority:', error);
//     }
//   };

//   const editTodo = async (todoId, newText) => {
//     if (newText.trim() === '') return;
//     try {
//       const todoRef = ref(db, `users/${currentUser.uid}/todos/${todoId}`);
//       await update(todoRef, { 
//         text: newText,
//         updatedAt: new Date().toISOString()
//       });
//     } catch (error) {
//       console.error('Error updating todo:', error);
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high':
//         return 'bg-red-100 border-red-200 text-red-800';
//       case 'medium':
//         return 'bg-yellow-100 border-yellow-200 text-yellow-800';
//       case 'low':
//         return 'bg-green-100 border-green-200 text-green-800';
//       default:
//         return 'bg-gray-100 border-gray-200 text-gray-800';
//     }
//   };

//   const getPriorityIcon = (priority) => {
//     switch (priority) {
//       case 'high':
//         return '🔴';
//       case 'medium':
//         return '🟡';
//       case 'low':
//         return '🟢';
//       default:
//         return '⚪';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   // Filter todos based on selected filter
//   const filteredTodos = Object.entries(todos).filter(([, todo]) => {
//     switch (filter) {
//       case 'completed':
//         return todo.completed;
//       case 'pending':
//         return !todo.completed;
//       default:
//         return true;
//     }
//   });

//   // Sort todos: incomplete first, then by priority, then by creation date
//   const sortedTodos = filteredTodos.sort(([, a], [, b]) => {
//     // First sort by completion status
//     if (a.completed !== b.completed) {
//       return a.completed - b.completed;
//     }
    
//     // Then by priority
//     const priorityOrder = { high: 3, medium: 2, low: 1 };
//     if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
//       return priorityOrder[b.priority] - priorityOrder[a.priority];
//     }
    
//     // Finally by creation date (newest first for incomplete, oldest first for completed)
//     const dateA = new Date(a.createdAt);
//     const dateB = new Date(b.createdAt);
//     return a.completed ? dateA - dateB : dateB - dateA;
//   });

//   const totalTodos = Object.keys(todos).length;
//   const completedTodos = Object.values(todos).filter(todo => todo.completed).length;
//   const pendingTodos = totalTodos - completedTodos;

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Todo List</h2>
        
//         {/* Stats */}
//         <div className="flex space-x-4 text-sm">
//           <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
//             Total: {totalTodos}
//           </div>
//           <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
//             Done: {completedTodos}
//           </div>
//           <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
//             Pending: {pendingTodos}
//           </div>
//         </div>
//       </div>
      
//       {/* Add Todo Form */}
//       <form onSubmit={addTodo} className="mb-6">
//         <div className="flex flex-col sm:flex-row gap-2">
//           <input
//             type="text"
//             value={newTodo}
//             onChange={(e) => setNewTodo(e.target.value)}
//             placeholder="Add a new todo..."
//             className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             maxLength="200"
//           />
//           <button
//             type="submit"
//             className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
//           >
//             Add Todo
//           </button>
//         </div>
//       </form>

//       {/* Filter Buttons */}
//       <div className="flex space-x-2 mb-6">
//         <button
//           onClick={() => setFilter('all')}
//           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//             filter === 'all'
//               ? 'bg-indigo-600 text-white'
//               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//           }`}
//         >
//           All ({totalTodos})
//         </button>
//         <button
//           onClick={() => setFilter('pending')}
//           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//             filter === 'pending'
//               ? 'bg-indigo-600 text-white'
//               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//           }`}
//         >
//           Pending ({pendingTodos})
//         </button>
//         <button
//           onClick={() => setFilter('completed')}
//           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//             filter === 'completed'
//               ? 'bg-indigo-600 text-white'
//               : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//           }`}
//         >
//           Completed ({completedTodos})
//         </button>
//       </div>

//       {/* Todos List */}
//       <div className="space-y-3">
//         {sortedTodos.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-6xl mb-4">📝</div>
//             <p className="text-gray-500 text-lg">
//               {filter === 'all' 
//                 ? 'No todos yet. Add one above!' 
//                 : `No ${filter} todos found.`}
//             </p>
//           </div>
//         ) : (
//           sortedTodos.map(([todoId, todo]) => (
//             <TodoItem
//               key={todoId}
//               todoId={todoId}
//               todo={todo}
//               onToggle={toggleTodo}
//               onDelete={deleteTodo}
//               onPriorityChange={setPriority}
//               onEdit={editTodo}
//               getPriorityColor={getPriorityColor}
//               getPriorityIcon={getPriorityIcon}
//             />
//           ))
//         )}
//       </div>

//       {/* Progress Bar */}
//       {totalTodos > 0 && (
//         <div className="mt-8">
//           <div className="flex justify-between text-sm text-gray-600 mb-2">
//             <span>Progress</span>
//             <span>{Math.round((completedTodos / totalTodos) * 100)}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div 
//               className="bg-green-500 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
//             ></div>
//           </div>
//         </div>
//       )}

//       <div className="mt-6 text-sm text-gray-600">
//         <p>💡 Todos persist until you delete them. Set priorities to organize your tasks!</p>
//       </div>
//     </div>
//   );
// };

// // TodoItem Component
// const TodoItem = ({ todoId, todo, onToggle, onDelete, onPriorityChange, onEdit, getPriorityColor, getPriorityIcon }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editText, setEditText] = useState(todo.text);

//   const handleEdit = () => {
//     if (editText.trim() !== todo.text && editText.trim() !== '') {
//       onEdit(todoId, editText);
//     }
//     setIsEditing(false);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleEdit();
//     } else if (e.key === 'Escape') {
//       setEditText(todo.text);
//       setIsEditing(false);
//     }
//   };

//   return (
//     <div
//       className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
//         todo.completed
//           ? 'bg-gray-50 border-gray-200 opacity-75'
//           : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
//       }`}
//     >
//       <div className="flex items-center space-x-3 flex-1 min-w-0">
//         <input
//           type="checkbox"
//           checked={todo.completed}
//           onChange={() => onToggle(todoId)}
//           className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
//         />
        
//         <div className="flex-1 min-w-0">
//           {isEditing ? (
//             <input
//               type="text"
//               value={editText}
//               onChange={(e) => setEditText(e.target.value)}
//               onBlur={handleEdit}
//               onKeyDown={handleKeyPress}
//               className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               autoFocus
//               maxLength="200"
//             />
//           ) : (
//             <div className="flex items-center space-x-2">
//               <span
//                 className={`text-lg flex-1 cursor-pointer ${
//                   todo.completed
//                     ? 'text-gray-500 line-through'
//                     : 'text-gray-800'
//                 }`}
//                 onClick={() => !todo.completed && setIsEditing(true)}
//                 title={todo.completed ? '' : 'Click to edit'}
//               >
//                 {todo.text}
//               </span>
//               {!todo.completed && (
//                 <span className="text-sm">
//                   {getPriorityIcon(todo.priority)}
//                 </span>
//               )}
//             </div>
//           )}
          
//           {/* Creation/Completion Date */}
//           <div className="text-xs text-gray-400 mt-1">
//             {todo.completed && todo.completedAt ? (
//               `Completed: ${new Date(todo.completedAt).toLocaleDateString()}`
//             ) : (
//               `Created: ${new Date(todo.createdAt).toLocaleDateString()}`
//             )}
//           </div>
//         </div>
//       </div>
      
//       <div className="flex items-center space-x-2 ml-4">
//         {/* Priority Badge */}
//         {!todo.completed && (
//           <span
//             className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
//               todo.priority
//             )}`}
//           >
//             {todo.priority}
//           </span>
//         )}

//         {/* Priority Selector */}
//         {!todo.completed && (
//           <select
//             value={todo.priority}
//             onChange={(e) => onPriorityChange(todoId, e.target.value)}
//             className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
//           >
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//           </select>
//         )}

//         {/* Edit Button */}
//         {!todo.completed && !isEditing && (
//           <button
//             onClick={() => setIsEditing(true)}
//             className="text-gray-500 hover:text-indigo-600 focus:outline-none transition-colors duration-200"
//             title="Edit todo"
//           >
//             <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//             </svg>
//           </button>
//         )}

//         {/* Delete Button */}
//         <button
//           onClick={() => onDelete(todoId)}
//           className="text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200"
//           title="Delete todo"
//         >
//           <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TodoList;



// src/components/TodoList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { ref, push, onValue, update, remove } from 'firebase/database';

const TodoList = () => {
  const { currentUser } = useAuth();
  const [todos, setTodos] = useState({});
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completed, pending

  useEffect(() => {
    if (currentUser) {
      const todosRef = ref(db, `users/${currentUser.uid}/todos`);
      const unsubscribe = onValue(todosRef, (snapshot) => {
        const data = snapshot.val();
        setTodos(data || {});
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim() === '' || !currentUser) return;

    try {
      const todosRef = ref(db, `users/${currentUser.uid}/todos`);
      await push(todosRef, {
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        priority: 'medium',
        category: 'general'
      });
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (todoId) => {
    try {
      const todoRef = ref(db, `users/${currentUser.uid}/todos/${todoId}`);
      await update(todoRef, {
        completed: !todos[todoId].completed,
        completedAt: !todos[todoId].completed ? new Date().toISOString() : null
      });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (todoId) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        const todoRef = ref(db, `users/${currentUser.uid}/todos/${todoId}`);
        await remove(todoRef);
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const setPriority = async (todoId, priority) => {
    try {
      const todoRef = ref(db, `users/${currentUser.uid}/todos/${todoId}`);
      await update(todoRef, { priority });
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const editTodo = async (todoId, newText) => {
    if (newText.trim() === '') return;
    try {
      const todoRef = ref(db, `users/${currentUser.uid}/todos/${todoId}`);
      await update(todoRef, { 
        text: newText,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-green-100 border-green-200 text-green-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Filter todos based on selected filter
  const filteredTodos = Object.entries(todos).filter(([, todo]) => {
    switch (filter) {
      case 'completed':
        return todo.completed;
      case 'pending':
        return !todo.completed;
      default:
        return true;
    }
  });

  // Sort todos: incomplete first, then by priority, then by creation date
  const sortedTodos = filteredTodos.sort(([, a], [, b]) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed - b.completed;
    }
    
    // Then by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    // Finally by creation date (newest first for incomplete, oldest first for completed)
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return a.completed ? dateA - dateB : dateB - dateA;
  });

  const totalTodos = Object.keys(todos).length;
  const completedTodos = Object.values(todos).filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Todo List</h2>
        
        {/* Stats */}
        <div className="flex space-x-4 text-sm">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Total: {totalTodos}
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Done: {completedTodos}
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            Pending: {pendingTodos}
          </div>
        </div>
      </div>
      
      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
            maxLength="200"
            style={{ 
              fontSize: '16px', 
              minHeight: '48px',
              color: '#1f2937',
              backgroundColor: '#ffffff'
            }}
          />
          <button
            type="submit"
            disabled={!newTodo.trim()}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Todo
          </button>
        </div>
      </form>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({totalTodos})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filter === 'pending'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending ({pendingTodos})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filter === 'completed'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed ({completedTodos})
        </button>
      </div>

      {/* Todos List */}
      <div className="space-y-3">
        {sortedTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">
              {filter === 'all' 
                ? 'No todos yet. Add one above!' 
                : `No ${filter} todos found.`}
            </p>
          </div>
        ) : (
          sortedTodos.map(([todoId, todo]) => (
            <TodoItem
              key={todoId}
              todoId={todoId}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onPriorityChange={setPriority}
              onEdit={editTodo}
              getPriorityColor={getPriorityColor}
              getPriorityIcon={getPriorityIcon}
            />
          ))
        )}
      </div>

      {/* Progress Bar */}
      {totalTodos > 0 && (
        <div className="mt-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round((completedTodos / totalTodos) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p>💡 Todos persist until you delete them. Set priorities to organize your tasks!</p>
      </div>
    </div>
  );
};

// TodoItem Component
const TodoItem = ({ todoId, todo, onToggle, onDelete, onPriorityChange, onEdit, getPriorityColor, getPriorityIcon }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (editText.trim() !== todo.text && editText.trim() !== '') {
      onEdit(todoId, editText);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
        todo.completed
          ? 'bg-gray-50 border-gray-200 opacity-75'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todoId)}
          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
        />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyPress}
              className="w-full px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
              maxLength="200"
              style={{ 
                fontSize: '16px', 
                color: '#1f2937',
                backgroundColor: '#ffffff'
              }}
            />
          ) : (
            <div className="flex items-center space-x-2">
              <span
                className={`text-lg flex-1 cursor-pointer ${
                  todo.completed
                    ? 'text-gray-500 line-through'
                    : 'text-gray-800'
                }`}
                onClick={() => !todo.completed && setIsEditing(true)}
                title={todo.completed ? '' : 'Click to edit'}
              >
                {todo.text}
              </span>
              {!todo.completed && (
                <span className="text-sm">
                  {getPriorityIcon(todo.priority)}
                </span>
              )}
            </div>
          )}
          
          {/* Creation/Completion Date */}
          <div className="text-xs text-gray-400 mt-1">
            {todo.completed && todo.completedAt ? (
              `Completed: ${new Date(todo.completedAt).toLocaleDateString()}`
            ) : (
              `Created: ${new Date(todo.createdAt).toLocaleDateString()}`
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 ml-4">
        {/* Priority Badge */}
        {!todo.completed && (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
              todo.priority
            )}`}
          >
            {todo.priority}
          </span>
        )}

        {/* Priority Selector */}
        {!todo.completed && (
          <select
            value={todo.priority}
            onChange={(e) => onPriorityChange(todoId, e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-gray-900"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        )}

        {/* Edit Button */}
        {!todo.completed && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-indigo-600 focus:outline-none transition-colors duration-200"
            title="Edit todo"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={() => onDelete(todoId)}
          className="text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200"
          title="Delete todo"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TodoList;