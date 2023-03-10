var postId = localStorage.getItem("postID");
var imageFile;
function fillForm(id){
    db.collection("posts").doc(id).get().then(doc =>{
        document.getElementById("title").value = doc.data().title;
        document.getElementById("location").value = doc.data().location;
        document.getElementById("description").value = doc.data().description;
        document.getElementById("mypic-goes-here").src = doc.data().image;
    })
}
fillForm(postId);

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

function uploadPic(){
    console.log("inside uploadPic" + postId);
    //stores image in firebase storage as the postdocid.jpg
    let storageRef = storage.ref("images/" + postId + ".jpg");
    
    storageRef.put(imageFile)
    .then(function(){
        console.log("Uploaded to CLoud Storage");
        storageRef.getDownloadURL()
        .then(function(url){
            console.log("got th download URL");
            db.collection("posts").doc(postId).update({
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

function updatePost(){
    let titletxt = document.getElementById("title").value;
    let locationtxt = document.getElementById("location").value;
    let descriptiontxt = document.getElementById("description").value;
    db.collection("posts").doc(postId).update({
        title: titletxt,
        location: locationtxt,
        description: descriptiontxt,
        time_posted: firebase.firestore.FieldValue.serverTimestamp()
    })
    if (document.getElementById("mypic-input").value != ""){
        uploadPic();
    }
    window.location.href = "ThankYou.html";
}