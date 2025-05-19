import React, { useState, useEffect } from "react";
import "./index.css";
import "./styles.css";


localStorage.clear(); 

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [coins, setCoins] = useState(0);
  const [newHabit, setNewHabit] = useState("");
  const [petHunger, setPetHunger] = useState(100);
  const [difficulty, setDifficulty] = useState("Easy");
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [purchasedThemes, setPurchasedThemes] = useState(["default"]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  
  const [currentScreen, setCurrentScreen] = useState("habitTracker"); // ✅ Added missing state
  const [pets, setPets] = useState([
    { name: "Dog", cost: 50 },
    { name: "Cat", cost: 75 },
    { name: "Dragon", cost: 30 },
  ]);
  
  const [inventory, setInventory] = useState([]);

  const petRewards = [
    { id: 1, name: "Dog", cost: 100, type: "dog", image: "dog.png" },
    { id: 2, name: "Cat", cost: 100, type: "cat", image: "cat.png" },
    { id: 3, name: "Dragon", cost: 200, type: "dragon", image: "dragon.png" },
  ];
  const foodItems = [
    { id: 1, name: "Bone", cost: 10, hungerRestore: 20, image: "bone.png" },
    { id: 2, name: "Fish", cost: 10, hungerRestore: 20, image: "fish.png" },
    { id: 3, name: "Meat", cost: 20, hungerRestore: 40, image: "meat.png" },
  ];

  const editHabit = (index) => {
    setEditIndex(index);
    setNewHabit(habits[index].name);
    setDifficulty(habits[index].difficulty);
    setIsEditPopupOpen(true);
  };

  const saveHabit = () => {
    if (newHabit.trim() !== "") {
      const updatedHabits = [...habits];
      updatedHabits[editIndex] = { ...updatedHabits[editIndex], name: newHabit, difficulty };
      setHabits(updatedHabits);
      setIsEditPopupOpen(false);
      setNewHabit("");
      setDifficulty("Easy");
    }
  };
  const buyPet = (pet) => {
  if (coins >= pet.cost) {
    const newCoins = coins - pet.cost;
    const newPets = [...pets, { ...pet, hunger: 100 }];

    setCoins(newCoins);
    setPets(newPets);

    localStorage.setItem("coins", newCoins);
    localStorage.setItem("pets", JSON.stringify(newPets));

    alert(`You purchased a ${pet.name}!`);
  } else {
    alert("Not enough coins!");
  }
};

const feedPet = (petIndex, foodIndex) => {
  if (inventory.length === 0) {
    alert("You don't have any food! Buy some from the shop.");
    return;
  }
  
  const foodItem = inventory[foodIndex];

  if (!foodItem || foodItem.quantity <= 0) {
    alert("You don't have enough of this food!");
    return;
  }

  const updatedPets = [...pets];
  updatedPets[petIndex].hunger = Math.min(100, updatedPets[petIndex].hunger + foodItem.hungerRestore);

  const updatedInventory = [...inventory];
  updatedInventory[foodIndex].quantity -= 1;

  if (updatedInventory[foodIndex].quantity === 0) {
    updatedInventory.splice(foodIndex, 1); // Remove food if all used up
  }

  setPets(updatedPets);
  setInventory(updatedInventory);

  localStorage.setItem("pets", JSON.stringify(updatedPets));
  localStorage.setItem("inventory", JSON.stringify(updatedInventory));
};
  

  const rewards = [
    { id: 1, name: "Dark Theme", cost: 50, theme: "dark" },
    { id: 2, name: "Light Blue Theme", cost: 50, theme: "light-blue" },
    { id: 3, name: "Classic Theme", cost: 0, theme: "default" },
    { id: 4, name: "Green Theme", cost: 50, theme: "green" },
    { id: 5, name: "Red Theme", cost: 50, theme: "red" },
    { id: 6, name: "Purple Theme", cost: 50, theme: "purple" },
    { id: 7, name: "Rainbow Theme", cost: 100, theme: "rainbow" },
  ];

  const addHabit = () => {
    if (newHabit.trim() !== "") {
      setHabits([...habits, { name: newHabit, count: 0, difficulty }]);
      setNewHabit("");
      setDifficulty("Easy");
      setIsPopupOpen(false);
    }
  };

  const completeHabit = (index) => {
    const updatedHabits = [...habits];
    const difficulty = updatedHabits[index].difficulty;
    const reward = difficulty === "Easy" ? 10 : difficulty === "Medium" ? 20 : 30;
    setCoins(coins + reward);
    updatedHabits[index].count += 1;
    setHabits(updatedHabits);
  };
  
  const buyFood = (food, quantity) => {
    const totalCost = food.cost * quantity;
    if (coins >= totalCost) {
      const newCoins = coins - totalCost;
      setCoins(newCoins);
  
      const updatedInventory = [...inventory];
      const existingFoodIndex = updatedInventory.findIndex((item) => item.id === food.id);
  
      if (existingFoodIndex !== -1) {
        updatedInventory[existingFoodIndex].quantity += quantity;
      } else {
        updatedInventory.push({ ...food, quantity });
      }
  
      setInventory(updatedInventory);
      localStorage.setItem("coins", newCoins);
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));
  
      alert(`You bought ${quantity}x ${food.name}!`);
    } else {
      alert("Not enough coins!");
    }
  };

  const buyReward = (reward) => {
    if (!purchasedThemes.includes(reward.theme)) {
    if (coins >= reward.cost) {
      setCoins(coins - reward.cost);
      localStorage.setItem(`purchased_${reward.theme}`, "true");
      
      setPurchasedThemes((prevThemes) => {
        const updatedThemes = [...prevThemes, reward.theme];
        localStorage.setItem("purchasedThemes", JSON.stringify(updatedThemes));
        return updatedThemes;
      });
      
      alert(`You purchased ${reward.name}!`);
    } else {
      alert("Not enough coins!");
    }
  } else {
    setSelectedTheme(reward.theme);
    localStorage.setItem("selectedTheme", reward.theme);
    alert(`${reward.name} theme applied!`);
  }
  };

  const switchTheme = () => {
    if (purchasedThemes.length > 1) {
      const currentIndex = purchasedThemes.indexOf(selectedTheme);
      const nextIndex = (currentIndex + 1) % purchasedThemes.length;
      setSelectedTheme(purchasedThemes[nextIndex]);
      localStorage.setItem("selectedTheme", purchasedThemes[nextIndex]);
    } else {
      alert("You need to buy more themes first!");
    }
  };

  useEffect(() => {
    const savedPets = JSON.parse(localStorage.getItem("pets")) || [];
    const savedInventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const savedCoins = parseInt(localStorage.getItem("coins"), 10) || 0;
    
    setPets(savedPets);
    setInventory(savedInventory);
    setCoins(savedCoins);

    const savedTheme = localStorage.getItem("selectedTheme");
    let themes = ["default"];

    const hungerInterval = setInterval(() => {
      setPets((prevPets) => {
        const updatedPets = prevPets.map((pet) => ({
          ...pet,
          hunger: Math.max(0, pet.hunger - 5),
        }));
        
        localStorage.setItem("pets", JSON.stringify(updatedPets));
        
        return updatedPets;
      });
    }, 15000);

    rewards.forEach((reward) => {
      if (localStorage.getItem(`purchased_${reward.theme}`) === "true") {
        themes.push(reward.theme);
      }
      
    const hungerInterval = setInterval(() => {
      setPetHunger((prev) => Math.max(0, prev - 5));
    }, 15000);

 

    const buyItem = (item) => {
    if (coins >= item.cost) {
      setCoins(coins - item.cost);
      setInventory([...inventory, item]);
      alert(`You bought ${item.name}!`);
    } else {
      alert("Not enough coins!");
    }
  };

  const feedPet = (petIndex, foodIndex) => {
    if (inventory.length === 0) {
      alert("You don't have any food! Buy some from the shop.");
      return;
    }
  
    const foodItem = inventory[foodIndex];
  
    if (!foodItem || foodItem.quantity <= 0) {
      alert("You don't have enough of this food!");
      return;
    }
  
    setPets((prevPets) => {
      const updatedPets = [...prevPets];
      updatedPets[petIndex].hunger = Math.min(100, updatedPets[petIndex].hunger + foodItem.hungerRestore);
      return updatedPets;
    });
  
    setInventory((prevInventory) => {
      const updatedInventory = [...prevInventory];
      updatedInventory[foodIndex].quantity -= 1;
  
      if (updatedInventory[foodIndex].quantity === 0) {
        updatedInventory.splice(foodIndex, 1); // Remove food if all used up
      }
  
      return updatedInventory;
    });
  };
  
  
  
  return () => clearInterval(hungerInterval);
}, []);

    setPurchasedThemes(themes);

    if (savedTheme && themes.includes(savedTheme)) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  return (
    <div className={`container ${selectedTheme}`}>
      <h1 className="title">Habit Tracker</h1>
      
      <div className="coins-container">
        <span className="coins">💰 Coins: {coins}</span>
        
        <div className="top-bar">
          <button className="nav-btn" onClick={() => setCurrentScreen("habitTracker")}>
            🏠 Home
          </button>
          <button className="nav-btn" onClick={() => setCurrentScreen("shop")}>
            🛒 Shop
          </button>
        </div>
      </div> {/* ✅ Fixed misplaced closing div */}

      {currentScreen === "habitTracker" ? (
        <>
          <div className="pet-container">
  <h2>Your Pets</h2>
  {pets.length > 0 ? (
    pets.map((pet, petIndex) => (
      <div key={petIndex} className="pet-item">
        <span>{pet.name} - Hunger: {pet.hunger}%</span>
        <select
  onChange={(e) => {
    const selectedFoodIndex = parseInt(e.target.value, 10);
    setPets((prevPets) => {
      const updatedPets = [...prevPets];
      updatedPets[petIndex].selectedFood = selectedFoodIndex;
      return updatedPets;
    });
  }}
  defaultValue=""
>
  <option value="" disabled>Select Food</option>
  {inventory.map((food, foodIndex) => (
    <option key={foodIndex} value={foodIndex}>
      {food.name} (x{food.quantity}) - Restores {food.hungerRestore}%
    </option>
  ))}
</select>

        <button
          onClick={() => {
            const selectedFoodIndex = pets[petIndex].selectedFood;
            if (selectedFoodIndex !== undefined && inventory[selectedFoodIndex]) {
              feedPet(petIndex, selectedFoodIndex);
            } else {
              alert("Please select food first!");
            }
          }}
        >
          Feed
        </button>
      </div>
    ))
  ) : (
    <p>No pets owned.</p>
  )}
</div>

<div className="add-habit-container">
  <button className="add-habit-btn" onClick={() => setIsPopupOpen(true)}>+ Add Habit</button>
</div>

          {isPopupOpen && (
            <div className="popup-overlay">
              <div className="popup">
                <h2>Add a New Habit</h2>
                <input
                  type="text"
                  className="habit-input"
                  placeholder="Enter habit name"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                
                />
                <div className="difficulty-container">
                  <button className={`difficulty-btn easy-btn ${difficulty === "Easy" ? "selected" : ""}`} onClick={() => setDifficulty("Easy")}>
                    🟢 Easy
                  </button>
                  <button className={`difficulty-btn medium-btn ${difficulty === "Medium" ? "selected" : ""}`} onClick={() => setDifficulty("Medium")}>
                    🟡 Medium
                  </button>
                  <button className={`difficulty-btn hard-btn ${difficulty === "Hard" ? "selected" : ""}`} onClick={() => setDifficulty("Hard")}>
                    🔴 Hard
                  </button>
                </div>
                <div className="popup-buttons">
                  <button className="add-btn" onClick={addHabit}>Add Habit</button>
                  <button className="cancel-btn" onClick={() => setIsPopupOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

{isEditPopupOpen && (
            <div className="popup-overlay">
              <div className="popup">
                <h2>Add a New Habit</h2>
                <input
                  type="text"
                  className="habit-input"
                  placeholder="Enter habit name"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                />
                <div className="difficulty-container">
                  <button className={`difficulty-btn easy-btn ${difficulty === "Easy" ? "selected" : ""}`} onClick={() => setDifficulty("Easy")}>
                    🟢 Easy
                  </button>
                  <button className={`difficulty-btn medium-btn ${difficulty === "Medium" ? "selected" : ""}`} onClick={() => setDifficulty("Medium")}>
                    🟡 Medium
                  </button>
                  <button className={`difficulty-btn hard-btn ${difficulty === "Hard" ? "selected" : ""}`} onClick={() => setDifficulty("Hard")}>
                    🔴 Hard
                  </button>
                </div>
                <div className="popup-buttons">
                  <button className="add-btn" onClick={saveHabit}>Save</button>
                  <button className="cancel-btn" onClick={() => setIsEditPopupOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          <ul className="habit-list">
            {habits.map((habit, index) => (
              <li key={index} className="habit-item">
                <span className="habit-name">{habit.name} <span className="habit-difficulty">({habit.difficulty})</span></span>
                <span className="habit-count">streaks🔥: {habit.count} times</span>
                <button className="complete-btn" onClick={() => completeHabit(index)}>
                  ✔ Complete
                </button>
                <button className="complete-btn" onClick={() => editHabit(index)}>Edit</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h1 className="title">Shop</h1>
          <div className="shop-container">
            <h2 className="shop-title">🎁 Themes</h2>
            <div className="shop-items">
              {rewards.map((reward) => (
                <div key={reward.id} className="shop-item">
                  <div className={`theme-preview ${reward.theme}`}></div>
                  <span className="reward-name">{reward.name}</span>
                  <span className="reward-cost">💰 {reward.cost} Coins</span>
                  <button className="buy-btn" onClick={() => buyReward(reward)}>
                    {purchasedThemes.includes(reward.theme) ? "Activate" : "Buy"}
                  </button>
                </div>
                
              ))}
<div className="shop-pet-container">
  <h2 className="shop-title-pets">Pets</h2>
  <div className="shop-items">
    {petRewards.length > 0 ? (
      petRewards.map((pet, index) => (
        <div key={index} className="pet-item">
          <span className="pet-name">{pet.name}</span>
          <span className="pet-cost">💰 {pet.cost} Coins</span>
          <button className="buy-btn" onClick={() => buyPet(pet)}>Buy</button>
        </div>
      ))
    ) : (
      <p>No pets available.</p>
    )}
  </div>
</div>
<div className="shop-food-container">
  <h2 className="shop-title-food">Food</h2>
  <div className="shop-items">
    {foodItems.map((food, index) => (
      <div key={index} className="food-item">
        <span className="food-name">{food.name}</span>
        <span className="food-cost">
          💰 {food.cost} Coins | Restores {food.hungerRestore}%
        </span>
        <input
          type="number"
          min="1"
          defaultValue="1"
          className="food-quantity"
          id={`food-quantity-${food.id}`}
        />
        <button
          className="buy-btn"
          onClick={() => {
            const quantity = parseInt(document.getElementById(`food-quantity-${food.id}`).value, 10);
            if (quantity > 0) buyFood(food, quantity);
          }}
        >
          Buy
        </button>
      </div>
    ))}
  </div>
</div>


      <button className="switch-theme-btn" onClick={switchTheme}>🔄 shuffle Theme</button>
    
        </div>
        </div>
        </>
      )}
        </div>
        
        )}
