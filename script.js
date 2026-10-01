// ==========================================
// Car Management System
// ==========================================


// Get saved cars from LocalStorage

let cars =
    JSON.parse(localStorage.getItem("cars")) || [];


// DOM Elements

const carForm =
    document.getElementById("carForm");

const carModal =
    document.getElementById("carModal");

const carList =
    document.getElementById("carList");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");


// ==========================================
// Open Modal
// ==========================================

function openModal() {

    document.getElementById("modalTitle").innerText =
        "Add New Car";

    carForm.reset();

    document.getElementById("carId").value = "";

    carModal.classList.add("active");
}


// ==========================================
// Close Modal
// ==========================================

function closeModal() {

    carModal.classList.remove("active");

}


// ==========================================
// Save Car
// ==========================================

carForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const id =
        document.getElementById("carId").value;


    const carData = {

        id: id
            ? Number(id)
            : Date.now(),

        name:
            document.getElementById("carName").value,

        brand:
            document.getElementById("carBrand").value,

        year:
            document.getElementById("carYear").value,

        price:
            Number(
                document.getElementById("carPrice").value
            ),

        status:
            document.getElementById("carStatus").value,

        fuel:
            document.getElementById("carFuel").value

    };


    // Edit existing car

    if (id) {

        cars = cars.map(function(car) {

            if (car.id === Number(id)) {
                return carData;
            }

            return car;

        });

    }

    // Add new car

    else {

        cars.push(carData);

    }


    saveCars();

    renderCars();

    closeModal();

});


// ==========================================
// Save to LocalStorage
// ==========================================

function saveCars() {

    localStorage.setItem(
        "cars",
        JSON.stringify(cars)
    );

}


// ==========================================
// Render Cars
// ==========================================

function renderCars() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedStatus =
        statusFilter.value;


    const filteredCars =
        cars.filter(function(car) {

            const matchesSearch =
                car.name
                    .toLowerCase()
                    .includes(searchText)
                ||
                car.brand
                    .toLowerCase()
                    .includes(searchText);


            const matchesStatus =
                selectedStatus === "all"
                ||
                car.status === selectedStatus;


            return matchesSearch && matchesStatus;

        });


    carList.innerHTML = "";


    if (filteredCars.length === 0) {

        carList.innerHTML = `

            <div class="empty">

                <div>🚗</div>

                <h3>
                    No cars found
                </h3>

                <p>
                    Add a car to get started.
                </p>

            </div>

        `;

        updateStats();

        return;

    }


    filteredCars.forEach(function(car) {

        const card =
            document.createElement("div");

        card.className = "car-card";


        const statusClass =
            car.status === "Available"
                ? "available"
                : "sold";


        card.innerHTML = `

            <div class="car-image">
                🚗
            </div>


            <div class="car-details">

                <div class="car-title">

                    <h3>
                        ${car.brand} ${car.name}
                    </h3>

                    <span
                        class="status ${statusClass}"
                    >
                        ${car.status}
                    </span>

                </div>


                <div class="car-info">

                    📅 Year: ${car.year}
                    <br>

                    ⛽ Fuel: ${car.fuel}

                </div>


                <div class="car-price">

                    ₹${car.price.toLocaleString("en-IN")}

                </div>


                <div class="car-actions">

                    <button
                        class="edit-btn"
                        onclick="editCar(${car.id})"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteCar(${car.id})"
                    >
                        🗑️ Delete
                    </button>

                </div>

            </div>

        `;


        carList.appendChild(card);

    });


    updateStats();

}


// ==========================================
// Edit Car
// ==========================================

function editCar(id) {

    const car =
        cars.find(function(item) {

            return item.id === id;

        });


    if (!car) {
        return;
    }


    document.getElementById("modalTitle").innerText =
        "Edit Car";


    document.getElementById("carId").value =
        car.id;

    document.getElementById("carName").value =
        car.name;

    document.getElementById("carBrand").value =
        car.brand;

    document.getElementById("carYear").value =
        car.year;

    document.getElementById("carPrice").value =
        car.price;

    document.getElementById("carStatus").value =
        car.status;

    document.getElementById("carFuel").value =
        car.fuel;


    carModal.classList.add("active");

}


// ==========================================
// Delete Car
// ==========================================

function deleteCar(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this car?");


    if (!confirmDelete) {
        return;
    }


    cars =
        cars.filter(function(car) {

            return car.id !== id;

        });


    saveCars();

    renderCars();

}


// ==========================================
// Update Statistics
// ==========================================

function updateStats() {

    const total =
        cars.length;


    const available =
        cars.filter(function(car) {

            return car.status === "Available";

        }).length;


    const sold =
        cars.filter(function(car) {

            return car.status === "Sold";

        }).length;


    const totalValue =
        cars.reduce(function(sum, car) {

            return sum + Number(car.price);

        }, 0);


    document.getElementById("totalCars").innerText =
        total;

    document.getElementById("availableCars").innerText =
        available;

    document.getElementById("soldCars").innerText =
        sold;

    document.getElementById("totalValue").innerText =
        "₹" + totalValue.toLocaleString("en-IN");

}


// ==========================================
// Search
// ==========================================

searchInput.addEventListener(
    "input",
    renderCars
);


// ==========================================
// Filter
// ==========================================

statusFilter.addEventListener(
    "change",
    renderCars
);


// ==========================================
// Dark Mode
// ==========================================

document
    .getElementById("darkModeBtn")
    .addEventListener("click", function() {

        document.body.classList.toggle("dark");


        if (
            document.body.classList.contains("dark")
        ) {

            this.innerText = "☀️";

        } else {

            this.innerText = "🌙";

        }

    });


// ==========================================
// Close Modal on Outside Click
// ==========================================

carModal.addEventListener(
    "click",
    function(event) {

        if (event.target === carModal) {
            closeModal();
        }

    }
);


// ==========================================
// Initial Render
// ==========================================

renderCars();
