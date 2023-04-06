function displayPostInfo() {
    let params = new URL( window.location.href );
    let ID = params.searchParams.get( "docID" );
    localStorage.setItem('postID', ID);
    console.log( ID );

    db.collection( "posts" )
        .doc( ID )
        .get()
        .then( doc => {
            var postImage = doc.data().image;
            var posttitle = doc.data().title;
            var postDescription = doc.data().description;
            var postLocation = doc.data().location;
            var postedTime = doc.data().time_posted.toDate().toLocaleDateString();
            var postOwner = doc.data().owner;
            db.collection("users").doc(postOwner).get().then(userDoc => {
                var username = userDoc.data().name;
                let currentUser = firebase.auth().currentUser;
                let postOwnerLink = "";
                if (postOwner === currentUser.uid) {
                    postOwnerLink = "my_user_profile.html?userId=" + currentUser.uid;
                } else {
                    postOwnerLink = "other_userProfile.html?userId=" + postOwner;
                }
                document.getElementById("name-here").innerHTML = "Posted By <a id=\"targetName\" href=\"" + postOwnerLink + "\">" + username + "</a>";
                document.getElementById("description-here").innerHTML = postDescription;
                document.getElementById("location-here").innerHTML = "Location: " + postLocation;
                document.getElementById("time-here").innerHTML = postedTime;
                document.getElementById( "title" ).innerHTML = posttitle;
                let imgEvent = document.querySelector( ".post-img" );
                imgEvent.src = postImage;
            })
        } );
}

displayPostInfo();


function assessCurrentUser() {
    var ID = localStorage.getItem("postID");
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
       db.collection("posts").doc(ID).get().then(
            userDoc => {
                var postOwner = userDoc.data().owner;
                console.log(postOwner);
                if (user) {
                    var currentUser = user.uid;
                    if (currentUser == postOwner){
                         
                        document.getElementById("edit-button").setAttribute("style", "display:inline;");
                        document.getElementById("delete-button").setAttribute("style", "display:inline;");
                    }
                   

                } else {
                    
                // No user is signed in.
                }
            }
        )
        
    });
}
assessCurrentUser(); //run the function

function redirect(){
    window.location.href = 'editPost.html';
}

function deletePost() {
    if (confirm("Are You Sure you Want to Delete?")){
        let params = new URL( window.location.href );
        let ID = params.searchParams.get( "docID" );
        db.collection("posts").doc(ID).delete().then(() => {
            console.log("Document successfully deleted!");
            window.location.href = "ThankYou.html";
        })
        
    } else {
        return;
    }
}


// Adding functions from main.js script
function saveUserNameToLocalStorage(event) {
    const postElement = event.target;
    const userName = postElement.innerHTML;
    localStorage.setItem('userName', userName);
    console.log("save user name to local storage function called!")
  }
  
  const targetName = document.getElementById("targetName");
    
  targetName.addEventListener("click", (event) => {
    saveUserNameToLocalStorage(event);
    saveUserIdToLocal();
  });

  // This function takes the user name saved in local storage, searches our firestore database for matching Name field in a user 
// document in the users collection, and saves the id of that user to local storage as "userID"
function saveUserIdToLocal() {

    const userName = localStorage.getItem("userName");
    return db.collection("users")
      .where("name", "==", userName)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const userId = querySnapshot.docs[0].id;
          localStorage.setItem("userID", userId);
          return userId;
        }
        return null;
      })
      .catch(error => {
        // This handles any errors that can psosibly occur while querying firestore 
        console.error("Error getting user ID:", error);
        return null;
      });
  }
  
  // Here we call the function when page is loaded
  saveUserIdToLocal().then(userId => {
    console.log("User ID:", userId);
    localStorage.setItem("userID", userId);
  }).catch(error => {
    console.error("Error getting user ID:", error);
  });


//   function injectUserNameIntoProfile() {
//     const userName = localStorage.getItem('userName');
//     console.log("name saved to local storage: " + userName);
//     const profileNameElement = document.getElementById('otherUserprofile-name');
//     profileNameElement.textContent = userName;
//   }
//   injectUserNameIntoProfile();