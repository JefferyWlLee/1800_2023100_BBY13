// Code for reviewing/rating other users

const usersCollection = firebase.firestore().collection("users");
const thumb_Up = document.getElementById("thumbUp");
const thumb_Down = document.getElementById("thumbDown");

// thumb_Up.addEventListener("click", ()=> {
    
// });

// function tup_clicked(){
//    if user
// }

// function calculate_Rating() {
//     if tup_clicked()
// }


/* This loops through each document in the users collection, checking if verified field exists, if
   it exists then does nothing if it doesn't exist it creates a field and sets it to false.
   We use it once to add the fields to every user document and afterwards we comment it out in case we need it
   in the future.  
   */

// usersCollection.get().then(querySnapshot => {
//     querySnapshot.forEach(doc => {
//       const data = doc.data();
//       if (!data.hasOwnProperty("Verified")) {
//         doc.ref.set({ Verified: false }, { merge: true })
//           .then(() => {
//             console.log(`Added Verified field to document ${doc.id}`);
//           })
//           .catch(error => {
//             console.error(`Error adding Verified field to document ${doc.id}: ${error}`);
//           });
//       }
//     });
//   })
//   .catch(error => {
//     console.error("Error retrieving user documents:", error);
//   });


// Function to add user rating, number of reviews and Reviews field to every user document in users collection
// We run this in the console to add the fields to the firestore database. 
function addRatingFieldsToUsersCollection() {
  usersCollection.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const updateObject = {};
      if (!data.hasOwnProperty('rating')) {
        updateObject.rating = 5;
      }
      if (!data.hasOwnProperty('Number of reviews')) {
        updateObject['Number of reviews'] = 0;
      }
      if (!data.hasOwnProperty('Reviews')) {
        updateObject.Reviews = "";
      }
      if (!data.hasOwnProperty('ThumbUp-Count')) {
        updateObject['ThumbUp-Count'] = 0;
      }
      if (!data.hasOwnProperty('ThumbDown-Count')) {
        updateObject['ThumbDown-Count'] = 0;
      }
      if (Object.keys(updateObject).length > 0) {
        doc.ref.set(updateObject, { merge: true });
      }
    });
  });
}

 // This function takes the name saved to 'userName' in local storage and sets it as the text content of the p element which displays
 // a user's name on the page. 

 function injectUserNameIntoProfile() {
   const userName = localStorage.getItem('userName');
   console.log("name saved to local storage: " + userName);
   const profileNameElement = document.getElementById('otherUserprofile-name');
   profileNameElement.textContent = userName;
 }
 injectUserNameIntoProfile();
 

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

 