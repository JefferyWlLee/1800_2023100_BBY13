


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
                var userName;
                
                db.collection("users").doc(owner).get().then(userDoc => {
                    //get username of whoever made the post 
                    userName = userDoc.data().name;
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-length').innerHTML = date;
                    newcard.querySelector('.card-text').innerHTML = userName;
                    newcard.querySelector('.card-image').src = image;
                    newcard.querySelector('a').href = "each_post.html?docID="+docID;

                   

                    //attach to gallery, Example: "hikes-go-here"
                    document.getElementById(collection + "-go-here").appendChild(newcard);

                    //i++;   //Optional: iterate variable to serve as unique ID
                 })
                
            })
        })
        
}
displayCardsDynamically("posts");