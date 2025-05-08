import React, { useState, useEffect } from 'react';
import { mealService } from './services/api';
import './App.css';

function App() {
  const [meals, setMeals] = useState([]);
  const [formData, setFormData] = useState({
    mealId: '',
    userName: '',
    mealName: '',
    calories: '',
    dateEntered: '',
    cuisineType: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const data = await mealService.getAllMeals();
      setMeals(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch meals: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingMeal) {
        await mealService.updateMeal(editingMeal.mealId, formData);
        setEditingMeal(null);
      } else {
        await mealService.createMeal(formData);
      }
      setFormData({
        mealId: '',
        userName: '',
        mealName: '',
        calories: '',
        dateEntered: '',
        cuisineType: ''
      });
      await fetchMeals();
      setError('');
    } catch (err) {
      setError('Failed to ' + (editingMeal ? 'update' : 'create') + ' meal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setFormData({
      mealId: meal.mealId,
      userName: meal.userName,
      mealName: meal.mealName,
      calories: meal.calories,
      dateEntered: meal.dateEntered,
      cuisineType: meal.cuisineType
    });
  };

  const handleDelete = async (mealId) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        setLoading(true);
        await mealService.deleteMeal(mealId);
        await fetchMeals();
        setError('');
      } catch (err) {
        setError('Failed to delete meal: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingMeal(null);
    setFormData({
      mealId: '',
      userName: '',
      mealName: '',
      calories: '',
      dateEntered: '',
      cuisineType: ''
    });
  };

  return (
    <div className="App">
      <h1>Meal Management System</h1>
      
      <form onSubmit={handleSubmit} className="meal-form">
        <h2>{editingMeal ? 'Edit Meal' : 'Add New Meal'}</h2>
        <div className="form-group">
          <input
            type="text"
            name="mealId"
            value={formData.mealId}
            onChange={handleInputChange}
            placeholder="Meal ID"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            placeholder="User Name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="mealName"
            value={formData.mealName}
            onChange={handleInputChange}
            placeholder="Meal Name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleInputChange}
            placeholder="Calories"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            name="dateEntered"
            value={formData.dateEntered}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="cuisineType"
            value={formData.cuisineType}
            onChange={handleInputChange}
            placeholder="Cuisine Type"
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (editingMeal ? 'Update Meal' : 'Add Meal')}
          </button>
          {editingMeal && (
            <button type="button" onClick={handleCancel} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="meals-list">
        <h2>Meals List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Meal ID</th>
                <th>User Name</th>
                <th>Meal Name</th>
                <th>Calories</th>
                <th>Date</th>
                <th>Cuisine Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {meals.map(meal => (
                <tr key={meal.mealId}>
                  <td>{meal.mealId}</td>
                  <td>{meal.userName}</td>
                  <td>{meal.mealName}</td>
                  <td>{meal.calories}</td>
                  <td>{meal.dateEntered}</td>
                  <td>{meal.cuisineType}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(meal)}
                      className="edit-button"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(meal.mealId)}
                      className="delete-button"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App; 