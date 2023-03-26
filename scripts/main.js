function displayCardsDynamically(collection) {
    document.getElementById("posts-go-here").innerHTML = "";
    let cardTemplate = document.getElementById("postTemplate");
    
    db.collection(collection).get()   //the collection called "hikes"
        .then(allPosts => {
            //var i = 1;  //Optional: if you want to have a unique ID for each post
            allPosts.forEach(doc => { //iterate thru each doc
                var title = doc.data().title;       // get value of the "name" key
                var time = doc.data().time_posted.toDate().toLocaleDateString(); //gets firebase time stamp
                var docID = doc.id; //gets doc id
                var owner = doc.data().owner; //gets user.uid
                let image = doc.data().image; // gets image url
                let tags = doc.data().tag //gets the tags associated with the post
                tags = tags.toString();
                let newcard = cardTemplate.content.cloneNode(true); // references and clones card template
                var helping = doc.data().helping; //is the poster looking for help or giving help?
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-length').innerHTML = time;
                newcard.querySelector('.card-image').src = image;
                newcard.querySelector('.card-help').innerHTML = helping;
                newcard.querySelector('.tags-go-here').innerHTML = "tags: " + tags;
                // Changed querySelector paramter from 'a' to '.card-Button' - Yousuf '.card-text'
                newcard.querySelector('.card-Button').href = "each_post.html?docID="+docID;
                db.collection("users").doc(owner).get().then(userDoc => {
                    //get username of whoever made the post 
                    var userName = userDoc.data().name;
                    let currentUser = firebase.auth().currentUser;

                    let nameElement = newcard.querySelector('.card-text');
                    let nameLinkElement = document.createElement('a');
                    nameLinkElement.innerHTML = "Posted By: " + userName;

                    //Check if the current user is the owner of the post
                    if (owner === currentUser.uid) {
                        nameLinkElement.href = "my_user_profile.html";
                    } else {
                        nameLinkElement.href = "other_userProfile.html?userId=" + owner;
                    }

                    nameElement.innerHTML = "";
                    nameElement.appendChild(nameLinkElement);
                    
                    // newcard.querySelector('.card-text').innerHTML = "Posted By: " + userName;

                    /* Note to Jeff: This line adds a click event listeenr to each p element created which calls 
                       saveUserNameToLocalStorage function when clicked - Yousuf */  
                    newcard.querySelector('.card-text').addEventListener("click",  (event)=> {
                        saveUserNameToLocalStorage(event);
                    });
                    

                    //attach to gallery, Example: "hikes-go-here"
                    document.getElementById(collection + "-go-here").appendChild(newcard);
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
            // console.log(user.uid); //print the uid in the browser console
            // console.log(user.displayName);  //print the user name in the browser console
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
    const userNameStartIndex = postText.indexOf("Posted by: ") + "Posted by: ".length + 1;
  
    // Slice it to only target the parts AFTER "Posted by " and save it to userName variable
    const userName = postText.slice(userNameStartIndex);
    localStorage.setItem('userName', userName);
  }

  function filter(keyword) {
    console.log(keyword);
    document.getElementById("posts-go-here").innerHTML = "";
  
    db.collection("posts").where("tag", "array-contains", keyword)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var title = doc.data().title;       // get value of the "name" key
            var time = doc.data().time_posted.toDate().toLocaleDateString(); //gets firebase time stamp
            var docID = doc.id; //gets doc id
            var owner = doc.data().owner; //gets user.uid
            let image = doc.data().image; // gets image url
            let tags = doc.data().tag //gets the tags associated with the post
            tags = tags.toString();
            let newcard = postTemplate.content.cloneNode(true); // references and clones card template
            var helping = doc.data().helping; //is the poster looking for help or giving help?
            newcard.querySelector('.card-title').innerHTML = title;
            newcard.querySelector('.card-length').innerHTML = time;
            newcard.querySelector('.card-image').src = image;
            newcard.querySelector('.card-help').innerHTML = helping;
            newcard.querySelector('.tags-go-here').innerHTML = "tags: " + tags;
            // Changed querySelector paramter from 'a' to '.card-Button' - Yousuf '.card-text'
            newcard.querySelector('.card-Button').href = "each_post.html?docID="+docID;
            db.collection("users").doc(owner).get().then(userDoc => {
                //get username of whoever made the post 
                var userName = userDoc.data().name;
                let currentUser = firebase.auth().currentUser;

                let nameElement = newcard.querySelector('.card-text');
                let nameLinkElement = document.createElement('a');
                nameLinkElement.innerHTML = "Posted By: " + userName;

                //Check if the current user is the owner of the post
                if (owner === currentUser.uid) {
                    nameLinkElement.href = "my_user_profile.html";
                } else {
                    nameLinkElement.href = "other_userProfile.html?userId=" + owner;
                }

                nameElement.innerHTML = "";
                nameElement.appendChild(nameLinkElement);
                
                // newcard.querySelector('.card-text').innerHTML = "Posted By: " + userName;

                /* Note to Jeff: This line adds a click event listeenr to each p element created which calls 
                   saveUserNameToLocalStorage function when clicked - Yousuf */  
                newcard.querySelector('.card-text').addEventListener("click",  (event)=> {
                    saveUserNameToLocalStorage(event);
                });
                

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById("posts-go-here").appendChild(newcard);
        });
      })
      
    })}