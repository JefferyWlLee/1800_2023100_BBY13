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
        if (user) {
            const currentUserRef = db.collection("users").doc(user.uid);
            currentUserRef.get().then(userDoc => {
                const userName = userDoc.data().name;
                const userLocation = userDoc.data().location;
                const userProfileImg = userDoc.data().profileimg;
                document.getElementById("name-goes-here").innerHTML = userName;
                document.getElementById("location-goes-here").innerHTML = userLocation;
                const image = document.getElementById("userprofile-img");
                if (image) {
                    image.src = userProfileImg;
                } else {
                    console.error("Image element not found");
                }
            });
        } else {
            console.log("No user is signed in");
        }
    });
}

populateUserInfo();

function editUserInfo() {
    // document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    userName = document.getElementById('myName').value;
    userLocation = document.getElementById('myLocation').value;
    imageFile = document.getElementById('imageFile').files[0];

    const currentUserRef = db.collection('users').doc(currentUser.id);

    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`profile-images/${currentUser.id}/${imageFile.name}`);
    fileRef.put(imageFile).then(() => {
        console.log('File uploaded successfully.');

        fileRef.getDownloadURL().then((url) => {

            const updatedData = {
                name: userName,
                location: userLocation,
                profileimg: url
            };

            currentUserRef.update(updatedData).then(() => {
                console.log("Document successfully updated!");
            });
        });
    });

    document.getElementById('personalInfoFields').disabled = true;
}


// pull other user's profile but need id

// function populateUserInfo(userId) {
//     db.collection("users").doc(userId).get()
//       .then(userDoc => {
//         var userName = userDoc.data().name;
//         var userLocation = userDoc.data().location;
//         document.getElementById("name-goes-here").innerHTML = userName;
//         document.getElementById("location-goes-here").innerHTML = userLocation;
//       })
//       .catch(error => {
//         console.log("Error fetching user data:", error);
//       });
//   }