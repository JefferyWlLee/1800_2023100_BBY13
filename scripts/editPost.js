var postId = localStorage.getItem("postID");
var i = 0;
var imageFile;
function fillForm(id){
    db.collection("posts").doc(id).get().then(doc =>{
        var tag = doc.data().tag;
        document.getElementById("title").value = doc.data().title;
        document.getElementById("location").value = doc.data().location;
        document.getElementById("description").value = doc.data().description;
        document.getElementById("mypic-goes-here").src = doc.data().image;
        tag.forEach(function (item, index) {
            // Get the element with the id "tag-template"
            let cardTemplate = document.getElementById("tag-template");
            // Create a clone of the template
            let newtag = cardTemplate.content.cloneNode(true);
            // Set the text of the cloned element to the text of the clicked element
            newtag.querySelector("#tag").innerText = item;
            // Append the cloned element to the "result-goes-here" element
            document.getElementById("result-goes-here").appendChild(newtag);
            // Set the id of the "tag" element in the cloned element to "tag" + i
            document.getElementById("tag").id = "tag" + index;
            // Set the id of the "close" element in the cloned element to "close" + i
            document.getElementById("close").id = "close" + index;
            // Set the id of the parent node of the "tag" element in the cloned element to the text of the clicked element
            document.getElementById("tag" + index).parentNode.id = item;
            // Add a class to the "tag" element in the cloned element with the text of the clicked element
            document.getElementById("tag" + index).classList.add(item);
            // Add a click event listener to the "close" element in the cloned element
            document.getElementById("close" + index).addEventListener("click", () => {
            // Remove the parent node of the "tag" element in the cloned element
            document.getElementById(item).remove();
            i++;
            });
        })
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
                window.location.href = "ThankYou.html";
            })
        })
    })
    .catch((error) => {
        console.log("Error uploading to cloud server")
    })
}

function updatePost(){
    
    if(confirm("Are You Sure You Want to Save?")){
        const resultElem = document.getElementById("result-goes-here");
        const tags = [];
          
        for (let i = 0; i < resultElem.children.length; i++) {
            const childElem = resultElem.children[i];
            const childId = childElem.id;
            tags.push(childId);
        }
        if (tags.length == 0){
            tags.push("");
        }
        document.getElementById("load").setAttribute("style", "display:inline;")
        let titletxt = document.getElementById("title").value;
        let locationtxt = document.getElementById("location").value;
        let descriptiontxt = document.getElementById("description").value;
        db.collection("posts").doc(postId).update({
        title: titletxt,
        location: locationtxt,
        description: descriptiontxt,
        time_posted: firebase.firestore.FieldValue.serverTimestamp(),
        tag:tags
        }).then(function (e) {
        if (document.getElementById("mypic-input").value != ""){
        uploadPic();
    } else{
         window.location.href = "ThankYou.html";
    }
    })
    }
    
}


// Attach a click event listener to an element with the id "taglist"
document.getElementById('tagList').addEventListener("click", addTag);

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
    

        
    
   
