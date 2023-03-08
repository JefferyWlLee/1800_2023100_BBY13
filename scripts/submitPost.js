function submitPost(){
    alert("SUBMIT POST METHOD HAS BEEN TRIGGERED");
    //checks if user is logged in
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
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
//universal image file reference
var imageFile;
//checks if in image has been chosen and displays it
function listenFileSelect(){
    let fileInput = document.getElementById("mypic-input");
    const image = document.getElementById("mypic-goes-here");
    console.log("listenFIleSelect has been called");
    fileInput.addEventListener('change', function(e){
        console.log("file has been chosen");
        imageFile = e.target.files[0];
        console.log(imageFile);
        let blob = URL.createObjectURL(imageFile);
        console.log(blob);
        image.src = blob;
        console.log(image.src);
    })
}
listenFileSelect();

//uploads photo to fire base
function uploadPic(postDocID){
    console.log("inside uploadPic" + postDocID);
    //stores image in firebase storage as the postdocid.jpg
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