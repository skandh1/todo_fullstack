import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [value, setValue] = useState([]);
  const [currVal, setCurrVal] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/todos");
        setValue(response.data);
        setError(""); // Clear error
      } catch (err) {
        console.error(err);
        setError("Failed to fetch todos. Please try again later.");
      }
    };

    fetchTodos();
  }, []);

  // };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitHandler();
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!currVal) return setError("Please enter a todo item.");
      const response = await axios.post("http://localhost:5000/api/todos", {
        description: currVal,
      });
      const newTodo = response.data;
      setValue((prev) => [...prev, newTodo]);
      setCurrVal(""); // Clear input field
      setError(""); // Clear error
    } catch (err) {
      console.error(err);
      setError("Failed to add todo. Please try again.");
    }
  };
  const inputHandler = (e) => {
    setCurrVal(e.target.value);
  };

  const deleteHandler = async (id, index) => {
    try {
      await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "DELETE",
      });
      const newValue = value.filter((_, i) => i !== index);
      setValue(newValue);
    } catch (err) {
      console.error(err);
      setError("Failed to delete todo. Please try again.");
    }
  };

  const updateHandler = async (id, index) => {
    const newDescription = prompt("Enter new description:");
    if (!newDescription) return setError("Please enter a valid description.");

    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newDescription }),
      });
      const updatedTodo = await response.json();
      const newValue = value.map((item, i) =>
        i === index ? updatedTodo : item
      );
      setValue(newValue);
      setError(""); // Clear error
    } catch (err) {
      console.error(err);
      setError("Failed to update todo. Please try again.");
    }
  };

  setTimeout(() => setError(""), 2000);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="font-bold text-3xl text-center mb-6">Todo List</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Main input section */}
     
          <form action="" className="flex mb-6" onSubmit={submitHandler}>
            <input
              type="text"
              value={currVal}
              onKeyDown={handleKeyPress}
              onChange={inputHandler}
              placeholder="Enter a todo item"
              className="flex-1 border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
            />
            <button
              className="ml-4 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
              
            >
              Add Todo
            </button>
          </form>


        {/* Todos list */}
        <div className="space-y-4">
          {value && value.length > 0 ? (
            value.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <p className="text-lg text-gray-700">{item.description}</p>
                <div className="flex space-x-2">
                  <button
                    className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                    onClick={() => updateHandler(item.id, index)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
                    onClick={() => deleteHandler(item.id, index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No items in the todo list.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
