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

function flipEditForm(){
    let hiddenForm = document.getElementById('hiddenForm');
    hiddenForm.style.display = "block";
}

function confirmChanges_Clicked (){
    let userNameChange = document.getElementById('myName').value;
    let userLocationChange = document.getElementById('myLocation').value;

    let userName = document.getElementById('userName');
    let userLocation = document.getElementById('userLocation');
    userName.textContent = userNameChange;
    userLocation.innerText = userLocationChange;

    let hiddenForm = document.getElementById('hiddenForm');
    hiddenForm.style.display = "none";

}

var confirmChangesBtn =  document.getElementById('confirmChangesBtn');
confirmChangesBtn.addEventListener('click', confirmChanges_Clicked);



// This section deals with posting on the main page

function submitPost(){
    alert("SUBMIT POST METHOD HAS BEEN TRIGGERED");
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            let titletxt = document.getElementById("title").value;
            let locationtxt = document.getElementById("location").value;
            let descriptiontxt = document.getElementById("description").value;

            db.collection("posts").add({
                owner: user.uid,
                description: descriptiontxt,
                location: locationtxt,
                title: titletxt,
                time_posted: firebase.firestore.FieldValue.serverTimestamp()
            }).then(doc =>{
                console.log("Post uploaded");
                console.log(doc.id);
                uploadPic(doc.id);
            })
        } else {
            console.log("ERROR USER NOT LOGGED IN")
        }
    })
    
}
let imageFile;
function listenFileSelect(){
    let fileInput = document.getElementById("mypic-input");
    const image = document.getElementById("mypic-goes-here");

    fileInput.addEventListener('change', function(e){
        imageFile = e.target.files[0];
        let blob = URL.createObjectURL(imageFile);
        image.src = blob;
    })
}

function uploadPic(postDocID){
    console.log("inside uploadPic" + postDocID);
    let storageRef = storage.ref("images/" + postDocID + ".jpg");
    
    storageRef.put(imageFile)
    .then(function(){
        console.log("Uploaded to CLoud Storage");
        storageRef.getDownloadURL()
        .then(function(url){
            console.log("got th download URL");
            db.collection("posts").doc(postDocID).update({
                "image": url
            })
            .then(function(){
                console.log("added pic URL to firebase")
            })
        })
    })
    .catch((error) => {
        console.log("Error uploading to cloud server")
    })
}
//