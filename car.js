
var myCars = [];

var h1element = document.querySelector("#my-heading");
console.log("My h1 element", h1element);

var myButton = document.querySelector("#my-button");
console.log("My button element", myButton);

myButton.onclick = function () {
    console.log("My button was clicked");

    var carNameInput = document.querySelector("#car-name");
    console.log("My input element:", carNameInput);
    console.log("input element text:", carNameInput.value);
    var carModelInput = document.querySelector("#car-model");
    var carYearInput = document.querySelector("#car-year");
    var carColorInput = document.querySelector("#car-color");
    var carDrivetrainInput = document.querySelector("#car-drivetrain");


    createCarOnServer(carNameInput.value, carModelInput.value, carYearInput.value, carColorInput.value, carDrivetrainInput.value);
    carNameInput.value = "";
    carModelInput.value = "";
    carYearInput.value = "";
    carColorInput.value = "";
    carDrivetrainInput.value = "";
};

var userButton = document.querySelector("#user-button");
console.log("User button element", userButton);

userButton.onclick = function () {
    console.log("User button was clicked");

    var first_name = document.querySelector("#first-name");
    var last_name = document.querySelector("#last-name");
    var email = document.querySelector("#email");
    var password = document.querySelector("#password");


    createUserOnServer(first_name.value, last_name.value, email.value, password.value);
    first_name.value = "";
    last_name.value = "";
    email.value = "";
    password.value = "";
};

var loginButton = document.querySelector("#login-button");

loginButton.onclick = function () {
  console.log("login button was pressed");
  var email = document.querySelector("#loginEmail");
  var password = document.querySelector("#loginPassword");

  userLogin(email.value, password.value);
  email.value = "";
  password.value = "";
}
/*var randomButton = document.querySelector("#random-car-button");
console.log("random button query", randomButton);

randomButton.onclick = function () {
  console.log("The random button was clicked");
  //random index for random friend (o to length of friends array)
  var randomIndex = Math.floor(Math.random() * myCars.length);
  //index my array of friends: a variable with the string
  var randomName = myCars[randomIndex];
  //query the span
  var randomNameSpan = document.querySelector("#random-car-name");
  //assign innHTML of the span to the friend name string
  randomNameSpan.innerHTML = randomName + " was picked.";
};
*/

function loadCarsFromServer() {
  fetch("http://localhost:8080/cars", {
    credentials: 'include',
  }).then(function (response) {
    var z = document.querySelector("#container2");
    if (response.status == 401) {
      // hide cars stuff show log register stuff
      z.style.display = "none";
      return;
    } else {
      var x = document.querySelector("#userContainer");
      var y = document.querySelector("#loginContainer");
      x.style.display = "none";
      y.style.display = "none";
      z.style.display = "block";
    }
    // hide register show cars stuff
    response.json().then(function (data) {
        console.log("Data received from server:", data);
        myCars = data;
        //or
        // myAnswers = data.record
        var myList = document.querySelector("#my-car-list");
        myList.innerHTML = "";
        console.log("My list element:", myList);

       //for Car in Cars
        myCars.forEach(function (car) { 

        var newItem = document.createElement("li");

        var nameDiv = document.createElement("div");
        nameDiv.innerHTML = car.name;
        nameDiv.classList.add("car-name");
        newItem.appendChild(nameDiv);
        
        var dataDiv = document.createElement("div");
        dataDiv.innerHTML = car.model;
        dataDiv.classList.add("car-model");
        newItem.appendChild(dataDiv);

        var yearDiv = document.createElement("div");
        yearDiv.innerHTML = car.year;
        yearDiv.classList.add("car-year");
        newItem.appendChild(yearDiv);
        
        var colorDiv = document.createElement("div");
        colorDiv.innerHTML = car.color;
        colorDiv.classList.add("car-color");
        newItem.appendChild(colorDiv);
        
        var drivetrainDiv = document.createElement("div");
        drivetrainDiv.innerHTML = car.drivetrain;
        drivetrainDiv.classList.add("car-drivetrain");
        newItem.appendChild(drivetrainDiv);

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = function () {
          console.log("Delete button was clicked", car.name);
          if (confirm("Are you sure?")) {
            deleteCarFromServer(car.id);
          }
        };
        newItem.appendChild(deleteButton);
        
        var editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.onclick = function () {
          console.log("Edit button was clicked", car.name);

          var nameField = document.createElement("input");
          nameField.type = "text";
          nameField.id = "editName";
          nameField.placeholder = "enter car name";
          nameField.value = car.name;
          newItem.appendChild(nameField);

          var modelField = document.createElement("input");
          modelField.type = "text";
          modelField.id = "editModel";
          modelField.placeholder = "enter car model";
          modelField.value = car.model;
          newItem.appendChild(modelField);

          var yearField = document.createElement("input");
          yearField.type = "number";
          yearField.id = "editYear";
          yearField.placeholder = "enter car year";
          yearField.value = car.year;
          newItem.appendChild(yearField);

          var colorField = document.createElement("input");
          colorField.type = "text";
          colorField.id = "editColor";
          colorField.placeholder = "enter car color";
          colorField.value = car.color;
          newItem.appendChild(colorField);

          var drivetrainField = document.createElement("input");
          drivetrainField.type = "text";
          drivetrainField.id = "editDrivetrain";
          drivetrainField.placeholder = "enter car drivetrain";
          drivetrainField.value = car.drivetrain;
          newItem.appendChild(drivetrainField);

          var saveButton = document.createElement("button");
          saveButton.innerHTML = "Save";
          saveButton.onclick = function () {
            console.log("Edit button was clicked", car.name);
            if (confirm("Save Changes?")) {
              editCarOnServer(car.id, nameField.value, modelField.value, yearField.value, colorField.value, drivetrainField.value);
            }
          };
          newItem.appendChild(saveButton);

        }
        newItem.appendChild(editButton);

        myList.appendChild(newItem);
       });
    });
  });
}

function createCarOnServer(carName, carModel, carYear, carColor, carDrivetrain) {
  console.log("creating car name:", carName);

  var data = "name=" + encodeURIComponent(carName);
  data += "&model=" + encodeURIComponent(carModel);
  data += "&year=" + encodeURIComponent(carYear);
  data += "&color=" + encodeURIComponent(carColor);
  data += "&drivetrain=" + encodeURIComponent(carDrivetrain);
  console.log("sending to sever:", data);

  fetch("https://s23-deploy-levihafen-production.up.railway.app/cars", {
    //request details:
    method: "POST",
    body: data,
    credentials: 'include',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }

  }).then(function (response) {
    //when the server responds:
    if (response.status == 201) {
      loadCarsFromServer();
    } else {
      console.log("server responseded with", response.status, "when trying the create a car");
    }
    
  });
}

function deleteCarFromServer(carId) {
  fetch("https://s23-deploy-levihafen-production.up.railway.app/cars/" + carId, {
    method: "DELETE",
    credentials: 'include',
  }).then(function (response) {
    if (response.status == 200) {
      loadCarsFromServer();
    }
  });
}

function editCarOnServer(carId, carName, carModel, carYear, carColor, carDrivetrain) {
  console.log("updating car name:", carName);

  var data = "name=" + encodeURIComponent(carName);
  data += "&model=" + encodeURIComponent(carModel);
  data += "&year=" + encodeURIComponent(carYear);
  data += "&color=" + encodeURIComponent(carColor);
  data += "&drivetrain=" + encodeURIComponent(carDrivetrain);
  console.log("sending to sever:", data);

  fetch("https://s23-deploy-levihafen-production.up.railway.app/cars/" + carId, {
    //request details:
    method: "PUT",
    body: data,
    credentials: 'include',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }

  }).then(function (response) {
    //when the server responds:
    if (response.status == 200) {
      loadCarsFromServer();
    } else {
      console.log("server responseded with", response.status, "when trying the update a car");
    }
    
  });
}

function loadUserFromServer(email) {
  fetch("https://s23-deploy-levihafen-production.up.railway.app/users/" + email, {
    credentials: 'include',
  }).then(function (response) {
    response.json().then(function (data) {
        console.log("Data received from server:", data);
        user = data;


      });
    });
}

function createUserOnServer(first_name, last_name, email, password) {
  console.log("creating user", first_name, last_name);

  var data = "first_name=" + encodeURIComponent(first_name);
  data += "&last_name=" + encodeURIComponent(last_name);
  data += "&email=" + encodeURIComponent(email);
  data += "&password=" + encodeURIComponent(password);
  console.log("sending to sever:", data);

  fetch("https://s23-deploy-levihafen-production.up.railway.app/users", {
    //request details:
    method: "POST",
    body: data,
    credentials: 'include',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }

  }).then(function (response) {
    //when the server responds:
    if (response.status == 201) {
      loadUserFromServer();
    } else {
      alert("Email already taken")
      console.log("server responseded with", response.status, "when trying the create a user");
    }
    //loadCarsFromServer();
  });
}

function userLogin(email, password) {
  console.log("attempting to login");

  var data = "email=" + encodeURIComponent(email);
  data += "&password=" + encodeURIComponent(password);

  fetch("https://s23-deploy-levihafen-production.up.railway.app/sessions", {
    //request details:
    method: "POST",
    body: data,
    credentials: 'include',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }

  }).then(function (response) {
    //when the server responds:
    if (response.status == 200) {
      //alert("logged in");
      console.log("Received", response.status, "logged in");
      loadUserFromServer(email);
    } else {
      alert("Email or Password is incorrect");
      console.log("server responseded with", response.status, "when trying login");
    }
    loadCarsFromServer();
  });
}

//loadUserFromServer();
loadCarsFromServer();


/*when the page loads:
1. fetch resouce collection
  if 404:
    not logged in,
    show login register,
    hide resouce stuff
    when login succeeds: go back and get the data and try again
  elif 200:
    logged in,
    show resouce stuff,
    hide login register
2.
*/