function displayHikeInfo() {
    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"
    console.log( ID );

   
    db.collection( "posts" )
        .doc( ID )
        .get()
        .then( doc => {
            //getting all the details about the post
            var postImage = doc.data().image;
            var posttitle = doc.data().title;
            var postDescription = doc.data().description;
            var postLocation = doc.data().location;
            var postedTime = doc.data().time_posted;
            var postOwner = doc.data().owner;
            let date = new Date(postedTime.seconds*1000); // formats time stamp into a date and time
            db.collection("users").doc(postOwner).get().then(userDoc => {
                var username = userDoc.data().name;
                document.getElementById("name-here").innerHTML = "Posted By " + username;
                document.getElementById("description-here").innerHTML = postDescription;
                document.getElementById("location-here").innerHTML = "Location: " + postLocation;
                document.getElementById("time-here").innerHTML = date;
                 document.getElementById( "title" ).innerHTML = posttitle;
                let imgEvent = document.querySelector( ".post-img" );
                imgEvent.src = postImage;
            })
            
           
        } );
}
displayHikeInfo();