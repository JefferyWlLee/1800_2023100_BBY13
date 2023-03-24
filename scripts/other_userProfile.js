function getPostAuthor() {
    let params = new URLSearchParams(window.location.search);
    let userId = params.get("userId");

    db.collection("users").doc(userId).get()
        .then(userDoc => {
            var userName = userDoc.data().name;
            var userProfileImg = userDoc.data().profileimg;
            document.getElementById("otherUserprofile-name").innerHTML = userName;
            document.getElementById("otherUserprofile-img").src = userProfileImg;
        })
        .catch(error => {
            console.log("Error fetching user data:", error);
        });
}

getPostAuthor();