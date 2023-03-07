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

