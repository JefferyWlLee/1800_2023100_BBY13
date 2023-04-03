
function showUserPicture() {
  // Get the user's profile picture URL
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
        const currentUserRef = db.collection("users").doc(user.uid);
        currentUserRef.get().then(userDoc => {
            
            const userProfileImg = userDoc.data().profileimg;
           
            const image = document.getElementById("user-profile-picture");
            if (image) {
                image.src = userProfileImg;
            } else {
                console.error("Image element not found");
            }
        });
    } else {
        console.log("No user is signed in");
    }
});
}
document.addEventListener("DOMContentLoaded", function() {
    showUserPicture();
  });

//done by yousuf