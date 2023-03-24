function submitPost(){
    document.getElementById("submit").disabled = true;
    document.getElementById("load").setAttribute("style", "display:inline;")
    //checks if user is logged in
    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            //grabbing text inputs
            let titletxt = document.getElementById("title").value;
            let locationtxt = document.getElementById("location").value;
            let descriptiontxt = document.getElementById("description").value;
            if(document.getElementById('option1').checked) { //checking if help or received has been selected and ending the function if neither has been selected
                var help = "wants to help";
              }else if(document.getElementById('option2').checked) {
                var help= "help wanted";
              } else {
                alert("ERROR, HELP OR RECEIVE NOT SELECTED PLEASE SELECT ONE");
                document.getElementById("submit").disabled = false;
                document.getElementById("load").setAttribute("style", "display:none;")
                return;
              }
              if (document.getElementById("mypic-input").value == ""){
                alert("ERROR, NO IMAGE HAS BEEN UPLOADED, PLEASE UPLOAD AN IMAGE")
                document.getElementById("submit").disabled = false;
                document.getElementById("load").setAttribute("style", "display:none;")
                return;
            }
            //inserting text inputs into new instance of posts collection
            db.collection("posts").add({
                owner: user.uid,
                description: descriptiontxt,
                location: locationtxt,
                title: titletxt,
                time_posted: firebase.firestore.FieldValue.serverTimestamp(),
                helping: help
                //then runs the upload pic javascript
            }).then(doc =>{
                console.log("Post uploaded");
                console.log(doc.id);
                uploadPic(doc.id);
            })
        } else {
            console.log("ERROR USER NOT LOGGED IN")
            document.getElementById("submit").disabled = false;
            document.getElementById("load").setAttribute("style", "display:none;")
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
                window.location.href = "ThankYou.html";
            })
        })
    })
    .catch((error) => {
        console.log("Error uploading to cloud server")
    })
}



document.getElementById('demolist').addEventListener("click", addTag);
var i = 1;
function addTag(e) { 
    
    console.log(e.target.innerText) //type the result in the browser console
//   document.getElementById('dropdownMenuButton1').innerText = e.target.innerText; // shows the result in the drop down
    let cardTemplate = document.getElementById("tag-template");
    // document.getElementById("result-goes-here").innerHTML = e.target.innerText; //type the result under the drop down in a different line
    let newtag = cardTemplate.content.cloneNode(true);
    newtag.querySelector("#tag").innerText = e.target.innerText;
    document.getElementById("result-goes-here").appendChild(newtag);
    document.getElementById("tag").id = "tag" + i;
    document.getElementById("close").id = "close" + i;
    document.getElementById("tag" + i).parentNode.id = e.target.innerText;
    document.getElementById("tag" + i).classList.add(e.target.innerText);
    console.log(document.getElementById("tag" + i));
    document.getElementById("close" + i).addEventListener("click", () => {

        document.getElementById(e.target.innerText).remove();
    })
    i++;
    
}




