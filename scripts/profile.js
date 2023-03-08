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
            console.log ("No user is signed in");
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

