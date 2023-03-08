function insertName() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // Get a reference to the Firestore database
        const db = firebase.firestore();
        
        // Get the user document from Firestore
        db.collection("users").doc(user.uid).get().then(doc => {
          if (doc.exists) {
            // Display the user name in the #name-goes-here element
            const user_name = doc.data().name;
            $("#name-goes-here").text(user_name);
          } else {
            console.log("No such document!");
          }
        }).catch(error => {
          console.log("Error getting document:", error);
        });
      } else {
        // No user is signed in.
      }
    });
  }
insertName(); //run the function

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("postTemplate");

    db.collection(collection).get()   //the collection called "hikes"
        .then(allPosts => {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allPosts.forEach(doc => { //iterate thru each doc
                var title = doc.data().title;       // get value of the "name" key
                var description = doc.data().description;  // get value of the "details" key
								var location = doc.data().location;    //get unique ID to each hike to be used for fetching right image
                var time = doc.data().time_posted; //gets firebase time stamp
                var docID = doc.id; //gets doc id
                var owner = doc.data().owner; //gets user.uid
                let image = doc.data().image; // gets image url
                let newcard = cardTemplate.content.cloneNode(true); // references and clones card template
                let date = new Date(time.seconds*1000); // formats time stamp into a date and time
                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-length').innerHTML = date;
                newcard.querySelector('.card-text').innerHTML = description;
                newcard.querySelector('.card-image').src = image;
                // newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg
                // newcard.querySelector('a').href = "eachHike.html?docID="+docID;

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
                
            })
        })
        
}
displayCardsDynamically("posts");