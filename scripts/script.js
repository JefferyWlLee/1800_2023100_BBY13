function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            user_Name = user.displayName;

            //method #1:  insert with html only
            //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
            //method #2:  insert using jquery
            $("#name-goes-here").text(user_Name); //using jquery

        } else {
            // No user is signed in.
        }
    });
}
insertName(); //run the function

// This section deals with making changes in user profile page
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




// This section deals with posting on the main page

function submitPost() {
    alert("SUBMIT POST METHOD HAS BEEN TRIGGERED");
    //checks if user is logged in
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //grabbing text inputs
            let titletxt = document.getElementById("title").value;
            let locationtxt = document.getElementById("location").value;
            let descriptiontxt = document.getElementById("description").value;
            //inserting text inputs into new instance of posts collection
            db.collection("posts").add({
                owner: user.uid,
                description: descriptiontxt,
                location: locationtxt,
                title: titletxt,
                time_posted: firebase.firestore.FieldValue.serverTimestamp()
                //then runs the upload pic javascript
            }).then(doc => {
                console.log("Post uploaded");
                console.log(doc.id);
                uploadPic(doc.id);
            })
        } else {
            console.log("ERROR USER NOT LOGGED IN")
        }
    })

}
//universal image file reference
let imageFile;
//checks if in image has been chosen and displays it
function listenFileSelect() {
    let fileInput = document.getElementById("mypic-input");
    const image = document.getElementById("mypic-goes-here");

    fileInput.addEventListener('change', function (e) {
        imageFile = e.target.files[0];
        let blob = URL.createObjectURL(imageFile);
        image.src = blob;
    })
}

//uploads photo to fire base
function uploadPic(postDocID) {
    console.log("inside uploadPic" + postDocID);
    //stores image in firebase storage as the postdocid.jpg
    let storageRef = storage.ref("images/" + postDocID + ".jpg");

    storageRef.put(imageFile)
        .then(function () {
            console.log("Uploaded to CLoud Storage");
            storageRef.getDownloadURL()
                .then(function (url) {
                    console.log("got th download URL");
                    db.collection("posts").doc(postDocID).update({
                        "image": url
                    })
                        .then(function () {
                            console.log("added pic URL to firebase")
                        })
                })
        })
        .catch((error) => {
            console.log("Error uploading to cloud server")
        })
}

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("postTemplate");

    db.collection(collection).get()
        .then(allPosts => {
            allPosts.forEach(doc => {
                var title = doc.data().title;
                var description = doc.data().description;
                var location = doc.data().location;
                var time = doc.data().time_posted;
                var docID = doc.id;
                var owner = doc.data().owner;
                let image = doc.data().image;
                let newcard = cardTemplate.content.cloneNode(true);
                let date = new Date(time.seconds * 1000);

                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-length').innerHTML = date;
                newcard.querySelector('.card-text').innerHTML = description;
                newcard.querySelector('.card-image').src = image;

                document.getElementById(collection + "-go-here").appendChild(newcard);
            })
        })

}
displayCardsDynamically("posts");

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("userprofile");

    db.collection(collection).get()
        .then(allUsers=> {
            allUsers.forEach(doc => {
                var name = doc.data().name;
                var location = doc.data().location;
                let newcard = cardTemplate.content.cloneNode(true);

                newcard.querySelector('#userName').innerHTML = "Name: " + name;
                newcard.querySelector('#userLocation').innerHTML = "Location: " + location;
                document.getElementById(collection + "-go-here").appendChild(newcard);
            })
        })
}

displayCardsDynamically("users");