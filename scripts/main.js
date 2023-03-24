


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
                var helping = doc.data().helping; //is the poster looking for help or giving help?
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-length').innerHTML = date;
                newcard.querySelector('.card-image').src = image;
                newcard.querySelector('.card-help').innerHTML = helping;

                // Changed querySelector paramter from 'a' to '.card-Button' - Yousuf
                newcard.querySelector('.card-Button').href = "each_post.html?docID="+docID;
                newcard.getElementById('otherUser_page').href = "other_userProfile.html";
                db.collection("users").doc(owner).get().then(userDoc => {
                    //get username of whoever made the post 
                    var userName = userDoc.data().name;
                    
                    
                    newcard.querySelector('.card-text').innerHTML = "Posted By: " + userName;

                    /* Note to Jeff: This line adds a click event listeenr to each p element created which calls 
                       saveUserNameToLocalStorage function when clicked - Yousuf */  
                    newcard.querySelector('.card-text').addEventListener("click",  (event)=> {
                        saveUserNameToLocalStorage(event);
                    });
                    

                    //attach to gallery, Example: "hikes-go-here"
                    document.getElementById(collection + "-go-here").appendChild(newcard);

                    //i++;   //Optional: iterate variable to serve as unique ID
                 })
                
            })
        })
        
}
displayCardsDynamically("posts");

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


/* This function saves the user name of the user clicked upon by targeting the p element that contains the name, 
targeting everything after "Posted by " and saving it to local storage as 'userName' */

function saveUserNameToLocalStorage(event) {
    // This targets the clicked p element
    const postElement = event.target;
    const postText = postElement.textContent;
    const userNameStartIndex = postText.indexOf("Posted by ") + "Posted by ".length;
  
    // Slice it to only target the parts AFTER "Posted by " and save it to userName variable
    const userName = postText.slice(userNameStartIndex);
    localStorage.setItem('userName', userName);
    console.log("user name has been saved to local storage");
  }
