function submitPost() {
    // disable submit button and display loading spinner
    document.getElementById("submit").disabled = true;
    document.getElementById("load").setAttribute("style", "display:inline;");
    
    // check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // get values of text inputs
            let titletxt = document.getElementById("title").value;
            let locationtxt = document.getElementById("location").value;
            let descriptiontxt = document.getElementById("description").value;
            
            // check if help or receive radio button is selected
            if (document.getElementById('option1').checked) {
                var help = "wants to help";
            } else if (document.getElementById('option2').checked) {
                var help = "help wanted";
            } else {
                // display error message and stop function execution if neither radio button is selected
                alert("ERROR, HELP OR RECEIVE NOT SELECTED PLEASE SELECT ONE");
                document.getElementById("submit").disabled = false;
                document.getElementById("load").setAttribute("style", "display:none;");
                return;
            }
            
            // check if an image has been uploaded
            if (document.getElementById("mypic-input").value == "") {
                alert("ERROR, NO IMAGE HAS BEEN UPLOADED, PLEASE UPLOAD AN IMAGE");
                document.getElementById("submit").disabled = false;
                document.getElementById("load").setAttribute("style", "display:none;");
                return;
            }

            const resultElem = document.getElementById("result-goes-here");
            const tags = [];
          
            for (let i = 0; i < resultElem.children.length; i++) {
              const childElem = resultElem.children[i];
              const childId = childElem.id;
              tags.push(childId);
            }
            // console.log(childIds); // prints an array of child element IDs

            // document.getElementById("submit").disabled = false;
            //     document.getElementById("load").setAttribute("style", "display:none;");
            // return;
            // insert text inputs into new instance of "posts" collection in Firestore
            db.collection("posts").add({
                owner: user.uid,
                description: descriptiontxt,
                location: locationtxt,
                title: titletxt,
                time_posted: firebase.firestore.FieldValue.serverTimestamp(),
                helping: help,
                tag: tags
            }).then(doc => {

                 // Get the element with the id "result-goes-here"
                // var oInput = document.getElementById("result-goes-here");
                // console.log("oinput" + oInput);
                // // Loop through all the child nodes of the "result-goes-here" element
                // for (var ii = 0; ii < oInput.childNodes.length; ii++) {
                //     // Get the id of the current child node
                //     var childId = oInput.childNodes[ii].id;
                //     console.log("ChildId: " + childId); 
                //     db.collection("posts").doc(doc.id).set({
                //         tags : firebase.firestore.FieldValue.arrayUnion(childId)
                //     }, {
                //         merge: true
                //     })
                    
                // }
                
                console.log("Post uploaded");
                console.log(doc.id);
                
                // call uploadPic function with the new post's ID
                uploadPic(doc.id);
            });


        } else {
            // display error message if user is not logged in
            console.log("ERROR USER NOT LOGGED IN");
            document.getElementById("submit").disabled = false;
            document.getElementById("load").setAttribute("style", "display:none;");
        }
    });
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



// Attach a click event listener to an element with the id "demolist"
document.getElementById('tagList').addEventListener("click", addTag);

// Initialize a variable i with the value 1
var i = 1;

// This function is called when the "demolist" element is clicked
function addTag(e) {
  // Get the element with the id "result-goes-here"
  var oInput = document.getElementById('result-goes-here');

  // Loop through all the child nodes of the "result-goes-here" element
  for (var ii = 0; ii < oInput.childNodes.length; ii++) {
    // Get the id of the current child node
    var childId = oInput.childNodes[ii].id;
    // If a child node with the same text as the clicked element already exists, exit the function
    if (childId === e.target.innerText) {
      return;
    }
  }

  // Get the element with the id "tag-template"
  let cardTemplate = document.getElementById("tag-template");
  // Create a clone of the template
  let newtag = cardTemplate.content.cloneNode(true);
  // Set the text of the cloned element to the text of the clicked element
  newtag.querySelector("#tag").innerText = e.target.innerText;
  // Append the cloned element to the "result-goes-here" element
  document.getElementById("result-goes-here").appendChild(newtag);
  // Set the id of the "tag" element in the cloned element to "tag" + i
  document.getElementById("tag").id = "tag" + i;
  // Set the id of the "close" element in the cloned element to "close" + i
  document.getElementById("close").id = "close" + i;
  // Set the id of the parent node of the "tag" element in the cloned element to the text of the clicked element
  document.getElementById("tag" + i).parentNode.id = e.target.innerText;
  // Add a class to the "tag" element in the cloned element with the text of the clicked element
  document.getElementById("tag" + i).classList.add(e.target.innerText);
  // Add a click event listener to the "close" element in the cloned element
  document.getElementById("close" + i).addEventListener("click", () => {
    // Remove the parent node of the "tag" element in the cloned element
    document.getElementById(e.target.innerText).remove();
  });

  // Increment the variable i
  i++;
}