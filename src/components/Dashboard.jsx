// // src/components/Dashboard.jsx
// import React, { useState } from 'react';
// import { signOut } from 'firebase/auth';
// import { auth } from '../firebase';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import DailyGoals from './DailyGoals';
// import TodoList from './TodoList';

// const Dashboard = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('goals');

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Pulse - Daily Tracker</h1>
//               <p className="text-sm text-gray-600">Welcome back, {currentUser?.email}</p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Navigation Tabs */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8">
//             <button
//               onClick={() => setActiveTab('goals')}
//               className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'goals'
//                   ? 'border-indigo-500 text-indigo-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Daily Goals
//             </button>
//             <button
//               onClick={() => setActiveTab('todos')}
//               className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'todos'
//                   ? 'border-indigo-500 text-indigo-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Todo List
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2">
//             {activeTab === 'goals' && <DailyGoals />}
//             {activeTab === 'todos' && <TodoList />}
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Overview</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Date</span>
//                   <span className="font-medium text-gray-900">
//                     {new Date().toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Day</span>
//                   <span className="font-medium text-gray-900">
//                     {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Tips</h3>
//               <ul className="space-y-2 text-sm text-gray-600">
//                 <li>• Daily goals reset every day at midnight</li>
//                 <li>• Todo items persist until you delete them</li>
//                 <li>• Mark items complete to track your progress</li>
//                 <li>• Use specific, actionable goal descriptions</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;


// src/components/Dashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { signOut } from 'firebase/auth';
// import { auth, db } from '../firebase';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import {
//   collection,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   onSnapshot,
//   query,
//   where,
//   orderBy,
//   serverTimestamp
// } from 'firebase/firestore';

// // DailyGoals Component with Firebase Integration
// const DailyGoals = () => {
//   const { currentUser } = useAuth();
//   const [goals, setGoals] = useState([]);
//   const [newGoal, setNewGoal] = useState('');
//   const [category, setCategory] = useState('personal');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Real-time listener for goals
//   useEffect(() => {
//     if (!currentUser) return;

//     const goalsRef = collection(db, 'goals');
//     const q = query(
//       goalsRef,
//       where('userId', '==', currentUser.uid),
//       orderBy('createdAt', 'desc')
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const goalsData = [];
//       snapshot.forEach((doc) => {
//         goalsData.push({
//           id: doc.id,
//           ...doc.data()
//         });
//       });
//       setGoals(goalsData);
//       setLoading(false);
//     }, (error) => {
//       console.error('Error fetching goals:', error);
//       setError('Failed to load goals');
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [currentUser]);

//   const addGoal = async (e) => {
//     e.preventDefault();
//     if (!newGoal.trim() || !currentUser) return;

//     try {
//       await addDoc(collection(db, 'goals'), {
//         text: newGoal.trim(),
//         category: category,
//         completed: false,
//         userId: currentUser.uid,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp()
//       });
//       setNewGoal('');
//       setError('');
//     } catch (error) {
//       console.error('Error adding goal:', error);
//       setError('Failed to add goal');
//     }
//   };

//   const toggleGoal = async (goalId, currentCompleted) => {
//     try {
//       const goalRef = doc(db, 'goals', goalId);
//       await updateDoc(goalRef, {
//         completed: !currentCompleted,
//         updatedAt: serverTimestamp()
//       });
//       setError('');
//     } catch (error) {
//       console.error('Error updating goal:', error);
//       setError('Failed to update goal');
//     }
//   };

//   const updateGoalCategory = async (goalId, newCategory) => {
//     try {
//       const goalRef = doc(db, 'goals', goalId);
//       await updateDoc(goalRef, {
//         category: newCategory,
//         updatedAt: serverTimestamp()
//       });
//       setError('');
//     } catch (error) {
//       console.error('Error updating goal category:', error);
//       setError('Failed to update goal category');
//     }
//   };

//   const deleteGoal = async (goalId) => {
//     try {
//       await deleteDoc(doc(db, 'goals', goalId));
//       setError('');
//     } catch (error) {
//       console.error('Error deleting goal:', error);
//       setError('Failed to delete goal');
//     }
//   };

//   const getCategoryColor = (category) => {
//     switch (category) {
//       case 'work': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'personal': return 'bg-green-100 text-green-800 border-green-200';
//       case 'health': return 'bg-purple-100 text-purple-800 border-purple-200';
//       case 'learning': return 'bg-orange-100 text-orange-800 border-orange-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="animate-pulse">
//           <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
//           <div className="space-y-3">
//             <div className="h-10 bg-gray-200 rounded"></div>
//             <div className="h-8 bg-gray-200 rounded w-1/2"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-xl font-semibold text-gray-800 mb-6">Daily Goals</h2>
      
//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
//           <p className="text-red-800 text-sm">{error}</p>
//         </div>
//       )}
      
//       {/* Add Goal Form */}
//       <form onSubmit={addGoal} className="mb-6">
//         <div className="space-y-3">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={newGoal}
//               onChange={(e) => setNewGoal(e.target.value)}
//               placeholder="Add a new daily goal..."
//               className="flex-1 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//               style={{ fontSize: '16px', minHeight: '40px' }}
//             />
//             <button
//               type="submit"
//               disabled={!newGoal.trim()}
//               className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Add Goal
//             </button>
//           </div>
//           <div className="flex items-center gap-2">
//             <label htmlFor="category-select" className="text-sm font-medium text-gray-700">
//               Category:
//             </label>
//             <select
//               id="category-select"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//               style={{ fontSize: '16px', minHeight: '40px' }}
//             >
//               <option value="personal">Personal</option>
//               <option value="work">Work</option>
//               <option value="health">Health & Fitness</option>
//               <option value="learning">Learning</option>
//             </select>
//           </div>
//         </div>
//       </form>

//       {/* Goals List */}
//       <div className="space-y-2">
//         {goals.length === 0 ? (
//           <p className="text-gray-500 text-center py-8">No goals yet. Add your first goal above!</p>
//         ) : (
//           goals.map(goal => (
//             <div key={goal.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
//               <input
//                 type="checkbox"
//                 checked={goal.completed}
//                 onChange={() => toggleGoal(goal.id, goal.completed)}
//                 className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//               />
//               <span className={`flex-1 ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
//                 {goal.text}
//               </span>
//               <select
//                 value={goal.category}
//                 onChange={(e) => updateGoalCategory(goal.id, e.target.value)}
//                 className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(goal.category)} capitalize`}
//               >
//                 <option value="personal">Personal</option>
//                 <option value="work">Work</option>
//                 <option value="health">Health</option>
//                 <option value="learning">Learning</option>
//               </select>
//               <button
//                 onClick={() => deleteGoal(goal.id)}
//                 className="text-red-600 hover:text-red-800 px-2 py-1 rounded font-medium"
//               >
//                 Delete
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Goals Summary */}
//       {goals.length > 0 && (
//         <div className="mt-6 pt-4 border-t border-gray-200">
//           <div className="flex justify-between text-sm text-gray-600">
//             <span>Total Goals: {goals.length}</span>
//             <span>Completed: {goals.filter(goal => goal.completed).length}</span>
//             <span>Progress: {goals.length > 0 ? Math.round((goals.filter(goal => goal.completed).length / goals.length) * 100) : 0}%</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // TodoList Component with Firebase Integration
// const TodoList = () => {
//   const { currentUser } = useAuth();
//   const [todos, setTodos] = useState([]);
//   const [newTodo, setNewTodo] = useState('');
//   const [priority, setPriority] = useState('medium');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Real-time listener for todos
//   useEffect(() => {
//     if (!currentUser) return;

//     const todosRef = collection(db, 'todos');
//     const q = query(
//       todosRef,
//       where('userId', '==', currentUser.uid),
//       orderBy('createdAt', 'desc')
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const todosData = [];
//       snapshot.forEach((doc) => {
//         todosData.push({
//           id: doc.id,
//           ...doc.data()
//         });
//       });
//       setTodos(todosData);
//       setLoading(false);
//     }, (error) => {
//       console.error('Error fetching todos:', error);
//       setError('Failed to load todos');
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [currentUser]);

//   const addTodo = async (e) => {
//     e.preventDefault();
//     if (!newTodo.trim() || !currentUser) return;

//     try {
//       await addDoc(collection(db, 'todos'), {
//         text: newTodo.trim(),
//         priority: priority,
//         completed: false,
//         userId: currentUser.uid,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp()
//       });
//       setNewTodo('');
//       setError('');
//     } catch (error) {
//       console.error('Error adding todo:', error);
//       setError('Failed to add todo');
//     }
//   };

//   const toggleTodo = async (todoId, currentCompleted) => {
//     try {
//       const todoRef = doc(db, 'todos', todoId);
//       await updateDoc(todoRef, {
//         completed: !currentCompleted,
//         updatedAt: serverTimestamp()
//       });
//       setError('');
//     } catch (error) {
//       console.error('Error updating todo:', error);
//       setError('Failed to update todo');
//     }
//   };

//   const updateTodoPriority = async (todoId, newPriority) => {
//     try {
//       const todoRef = doc(db, 'todos', todoId);
//       await updateDoc(todoRef, {
//         priority: newPriority,
//         updatedAt: serverTimestamp()
//       });
//       setError('');
//     } catch (error) {
//       console.error('Error updating todo priority:', error);
//       setError('Failed to update todo priority');
//     }
//   };

//   const deleteTodo = async (todoId) => {
//     try {
//       await deleteDoc(doc(db, 'todos', todoId));
//       setError('');
//     } catch (error) {
//       console.error('Error deleting todo:', error);
//       setError('Failed to delete todo');
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return 'bg-red-100 text-red-800 border-red-200';
//       case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'low': return 'bg-green-100 text-green-800 border-green-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="animate-pulse">
//           <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
//           <div className="space-y-3">
//             <div className="h-10 bg-gray-200 rounded"></div>
//             <div className="h-8 bg-gray-200 rounded w-1/2"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-xl font-semibold text-gray-800 mb-6">Todo List</h2>
      
//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
//           <p className="text-red-800 text-sm">{error}</p>
//         </div>
//       )}
      
//       {/* Add Todo Form */}
//       <form onSubmit={addTodo} className="mb-6">
//         <div className="space-y-3">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={newTodo}
//               onChange={(e) => setNewTodo(e.target.value)}
//               placeholder="Add a new todo item..."
//               className="flex-1 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               style={{ fontSize: '16px', minHeight: '40px' }}
//             />
//             <button
//               type="submit"
//               disabled={!newTodo.trim()}
//               className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Add Todo
//             </button>
//           </div>
//           <div className="flex items-center gap-2">
//             <label htmlFor="priority-select" className="text-sm font-medium text-gray-700">
//               Priority:
//             </label>
//             <select
//               id="priority-select"
//               value={priority}
//               onChange={(e) => setPriority(e.target.value)}
//               className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               style={{ fontSize: '16px', minHeight: '40px' }}
//             >
//               <option value="low">Low Priority</option>
//               <option value="medium">Medium Priority</option>
//               <option value="high">High Priority</option>
//             </select>
//           </div>
//         </div>
//       </form>

//       {/* Todos List */}
//       <div className="space-y-2">
//         {todos.length === 0 ? (
//           <p className="text-gray-500 text-center py-8">No todos yet. Add your first todo above!</p>
//         ) : (
//           todos.map(todo => (
//             <div key={todo.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
//               <input
//                 type="checkbox"
//                 checked={todo.completed}
//                 onChange={() => toggleTodo(todo.id, todo.completed)}
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//               />
//               <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
//                 {todo.text}
//               </span>
//               <select
//                 value={todo.priority}
//                 onChange={(e) => updateTodoPriority(todo.id, e.target.value)}
//                 className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(todo.priority)} capitalize`}
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>
//               <button
//                 onClick={() => deleteTodo(todo.id)}
//                 className="text-red-600 hover:text-red-800 px-2 py-1 rounded font-medium"
//               >
//                 Delete
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Todos Summary */}
//       {todos.length > 0 && (
//         <div className="mt-6 pt-4 border-t border-gray-200">
//           <div className="flex justify-between text-sm text-gray-600">
//             <span>Total Todos: {todos.length}</span>
//             <span>Completed: {todos.filter(todo => todo.completed).length}</span>
//             <span>High Priority: {todos.filter(todo => todo.priority === 'high').length}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Main Dashboard Component
// const Dashboard = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('goals');

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Pulse - Daily Tracker</h1>
//               <p className="text-sm text-gray-600">Welcome back, {currentUser?.email}</p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Navigation Tabs */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8">
//             <button
//               onClick={() => setActiveTab('goals')}
//               className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'goals'
//                   ? 'border-indigo-500 text-indigo-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Daily Goals
//             </button>
//             <button
//               onClick={() => setActiveTab('todos')}
//               className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'todos'
//                   ? 'border-indigo-500 text-indigo-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Todo List
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2">
//             {activeTab === 'goals' && <DailyGoals />}
//             {activeTab === 'todos' && <TodoList />}
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Overview</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Date</span>
//                   <span className="font-medium text-gray-900">
//                     {new Date().toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Day</span>
//                   <span className="font-medium text-gray-900">
//                     {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Tips</h3>
//               <ul className="space-y-2 text-sm text-gray-600">
//                 <li>• Goals and todos sync across all your devices</li>
//                 <li>• Click on priority/category tags to edit them</li>
//                 <li>• Data is automatically saved to the cloud</li>
//                 <li>• Use specific, actionable descriptions</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;




import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DailyGoals from './DailyGoals';
import TodoList from './TodoList';

// Main Dashboard Component
const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('goals');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pulse - Daily Tracker</h1>
              <p className="text-sm text-gray-600">Welcome back, {currentUser?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('goals')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'goals'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Daily Goals
            </button>
            <button
              onClick={() => setActiveTab('todos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'todos'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Todo List
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'goals' && <DailyGoals />}
            {activeTab === 'todos' && <TodoList />}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium text-gray-900">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Day</span>
                  <span className="font-medium text-gray-900">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Goals reset daily, todos persist until completed</li>
                <li>• Use priorities to organize your tasks effectively</li>
                <li>• Data is automatically saved to Firebase</li>
                <li>• Click on todos to edit them inline</li>
                <li>• Set daily goals to build consistent habits</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;