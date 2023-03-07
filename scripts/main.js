function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("postTemplate");

    db.collection(collection).get()   //the collection called "hikes"
        .then(allPosts=> {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allPosts.forEach(doc => { //iterate thru each doc
                var title = doc.data().title;       // get value of the "name" key
                var description = doc.data().description;  // get value of the "details" key
								var location = doc.data().location;    //get unique ID to each hike to be used for fetching right image
                var time = doc.data().time_posted; //gets the length field
                var docID = doc.id;
                var owner = doc.data().owner;
                let newcard = cardTemplate.content.cloneNode(true);

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-length').innerHTML = time;
                newcard.querySelector('.card-text').innerHTML = description;
                // newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg
                newcard.querySelector('a').href = "eachHike.html?docID="+docID;

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