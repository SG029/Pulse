// // src/components/DailyGoals.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { db } from '../firebase';
// import { ref, push, onValue, update, remove } from 'firebase/database';

// const DailyGoals = () => {
//   const { currentUser } = useAuth();
//   const [goals, setGoals] = useState({});
//   const [newGoal, setNewGoal] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (currentUser) {
//       const goalsRef = ref(db, `users/${currentUser.uid}/dailyGoals`);
//       const unsubscribe = onValue(goalsRef, (snapshot) => {
//         const data = snapshot.val();
//         setGoals(data || {});
//         setLoading(false);
//       });

//       return () => unsubscribe();
//     }
//   }, [currentUser]);

//   const addGoal = async (e) => {
//     e.preventDefault();
//     if (newGoal.trim() === '') return;

//     try {
//       const goalsRef = ref(db, `users/${currentUser.uid}/dailyGoals`);
//       await push(goalsRef, {
//         text: newGoal,
//         completed: false,
//         createdAt: new Date().toISOString(),
//         lastReset: new Date().toDateString()
//       });
//       setNewGoal('');
//     } catch (error) {
//       console.error('Error adding goal:', error);
//     }
//   };

//   const toggleGoal = async (goalId) => {
//     try {
//       const goalRef = ref(db, `users/${currentUser.uid}/dailyGoals/${goalId}`);
//       const currentGoal = goals[goalId];
//       const today = new Date().toDateString();
      
//       // Reset if it's a new day
//       if (currentGoal.lastReset !== today) {
//         await update(goalRef, {
//           completed: !currentGoal.completed,
//           lastReset: today
//         });
//       } else {
//         await update(goalRef, {
//           completed: !currentGoal.completed
//         });
//       }
//     } catch (error) {
//       console.error('Error updating goal:', error);
//     }
//   };

//   const deleteGoal = async (goalId) => {
//     try {
//       const goalRef = ref(db, `users/${currentUser.uid}/dailyGoals/${goalId}`);
//       await remove(goalRef);
//     } catch (error) {
//       console.error('Error deleting goal:', error);
//     }
//   };

//   // Reset completed status for goals from previous days
//   useEffect(() => {
//     const today = new Date().toDateString();
//     Object.entries(goals).forEach(([goalId, goal]) => {
//       if (goal.lastReset !== today && goal.completed) {
//         const goalRef = ref(db, `users/${currentUser.uid}/dailyGoals/${goalId}`);
//         update(goalRef, {
//           completed: false,
//           lastReset: today
//         });
//       }
//     });
//   }, [goals, currentUser]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Goals</h2>
      
//       <form onSubmit={addGoal} className="mb-6">
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={newGoal}
//             onChange={(e) => setNewGoal(e.target.value)}
//             placeholder="Add a new daily goal..."
//             className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//           />
//           <button
//             type="submit"
//             className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//           >
//             Add Goal
//           </button>
//         </div>
//       </form>

//       <div className="space-y-3">
//         {Object.entries(goals).length === 0 ? (
//           <p className="text-gray-500 text-center py-8">No daily goals yet. Add one above!</p>
//         ) : (
//           Object.entries(goals).map(([goalId, goal]) => (
//             <div
//               key={goalId}
//               className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
//                 goal.completed
//                   ? 'bg-green-50 border-green-200'
//                   : 'bg-gray-50 border-gray-200'
//               }`}
//             >
//               <div className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   checked={goal.completed}
//                   onChange={() => toggleGoal(goalId)}
//                   className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <span
//                   className={`text-lg ${
//                     goal.completed
//                       ? 'text-green-700 line-through'
//                       : 'text-gray-800'
//                   }`}
//                 >
//                   {goal.text}
//                 </span>
//               </div>
//               <button
//                 onClick={() => deleteGoal(goalId)}
//                 className="text-red-500 hover:text-red-700 focus:outline-none"
//               >
//                 <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="mt-6 text-sm text-gray-600">
//         <p>✨ Daily goals reset automatically each day!</p>
//       </div>
//     </div>
//   );
// };

// export default DailyGoals;



import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { ref, push, onValue, update, remove } from 'firebase/database';

const DailyGoals = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState({});
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const goalsRef = ref(db, `users/${currentUser.uid}/dailyGoals`);
      const unsubscribe = onValue(goalsRef, (snapshot) => {
        const data = snapshot.val();
        setGoals(data || {});
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const addGoal = async (e) => {
    e.preventDefault();
    if (newGoal.trim() === '') return;

    try {
      const goalsRef = ref(db, `users/${currentUser.uid}/dailyGoals`);
      await push(goalsRef, {
        text: newGoal,
        completed: false,
        createdAt: new Date().toISOString(),
        lastReset: new Date().toDateString()
      });
      setNewGoal('');
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const toggleGoal = async (goalId) => {
    try {
      const goalRef = ref(db, `users/${currentUser.uid}/dailyGoals/${goalId}`);
      const currentGoal = goals[goalId];
      const today = new Date().toDateString();

      if (currentGoal.lastReset !== today) {
        await update(goalRef, {
          completed: !currentGoal.completed,
          lastReset: today
        });
      } else {
        await update(goalRef, {
          completed: !currentGoal.completed
        });
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const goalRef = ref(db, `users/${currentUser.uid}/dailyGoals/${goalId}`);
      await remove(goalRef);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  useEffect(() => {
    const today = new Date().toDateString();
    Object.entries(goals).forEach(([goalId, goal]) => {
      if (goal.lastReset !== today && goal.completed) {
        const goalRef = ref(db, `users/${currentUser.uid}/dailyGoals/${goalId}`);
        update(goalRef, {
          completed: false,
          lastReset: today
        });
      }
    });
  }, [goals, currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const total = Object.keys(goals).length;
  const completed = Object.values(goals).filter(goal => goal.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Goals</h2>

      <form onSubmit={addGoal} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add a new daily goal..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Goal
          </button>
        </div>
      </form>

      {/* Progress Bar */}
      {total > 0 && (
        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1 text-right">{percent}% completed</p>
        </div>
      )}

      <div className="space-y-3">
        {total === 0 ? (
          <p className="text-gray-500 text-center py-8">No daily goals yet. Add one above!</p>
        ) : (
          Object.entries(goals).map(([goalId, goal]) => (
            <div
              key={goalId}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                goal.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoal(goalId)}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span
                  className={`text-lg ${
                    goal.completed
                      ? 'text-green-700 line-through'
                      : 'text-gray-800'
                  }`}
                >
                  {goal.text}
                </span>
              </div>
              <button
                onClick={() => deleteGoal(goalId)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>✨ Daily goals reset automatically each day!</p>
      </div>
    </div>
  );
};

export default DailyGoals;
