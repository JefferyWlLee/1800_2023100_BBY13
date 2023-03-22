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
            var postedTime = doc.data().time_posted;
            var postOwner = doc.data().owner;
            let date = new Date(postedTime.seconds*1000);
            db.collection("users").doc(postOwner).get().then(userDoc => {
                var username = userDoc.data().name;
                let currentUser = firebase.auth().currentUser;
                let postOwnerLink = "";
                if (postOwner === currentUser.uid) {
                    postOwnerLink = "my_user_profile.html?userId=" + currentUser.uid;
                } else {
                    postOwnerLink = "other_userProfile.html?userId=" + postOwner;
                }
                document.getElementById("name-here").innerHTML = "Posted By <a href=\"" + postOwnerLink + "\">" + username + "</a>";
                document.getElementById("description-here").innerHTML = postDescription;
                document.getElementById("location-here").innerHTML = "Location: " + postLocation;
                document.getElementById("time-here").innerHTML = date;
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