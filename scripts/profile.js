var userProfileEdit = document.querySelector('#editBtn-UserProfile');
userProfileEdit.addEventListener("click", flipEditForm);

function flipEditForm() {
    let hiddenForm = document.getElementById('hiddenForm');
    hiddenForm.style.display = "block";

    const imageInput = document.getElementById('imageFile');
    const userImageElement = document.getElementById('userprofile-img');

    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            userImageElement.src = reader.result;
        })

        reader.readAsDataURL(file);
    })
}

function confirmChanges_Clicked() {
    let userNameChange = document.getElementById('myName').value;
    let userLocationChange = document.getElementById('myLocation').value;

    let userName = document.getElementById('userName');
    let userLocation = document.getElementById('userLocation');
    userName.textContent = userNameChange;
    userLocation.innerText = userLocationChange;

    let hiddenForm = document.getElementById('hiddenForm');
    hiddenForm.style.display = "none";

}

var confirmChangesBtn = document.getElementById('confirmChangesBtn');
confirmChangesBtn.addEventListener('click', confirmChanges_Clicked);

var currentUser;

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userLocation = userDoc.data().location;
                    document.getElementById("name-goes-here").innerHTML = userName;
                    document.getElementById("location-goes-here").innerHTML = userLocation;

                    //if the data fields are not empty, then write them in to the form.
                    // if (userName != null) {
                    //     document.getElementById("nameInput").value = userName;
                    // }
                    // if (userLocation != null) {
                    //     document.getElementById("cityInput").value = userLocation;
                    // }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }


    });
}

//call the function to run it 
populateUserInfo();

function editUserInfo() {
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    userName = document.getElementById('myName').value;
    userLocation = document.getElementById('myLocation').value;

    currentUser.update({
        name: userName,
        location: userLocation
    })
        .then(() => {
            console.log("Document successfully updated!");
        })

    document.getElementById('personalInfoFields').disabled = true;
}

