// ============================Code for reviewing/rating other users (Please don't touch-Yousuf)============================================

const usersCollection = firebase.firestore().collection("users");
const thumb_Up = document.getElementById("thumbUp");
const thumb_Down = document.getElementById("thumbDown");

thumb_Up.addEventListener("click", ()=> {
  handleThumbClick(true);
  hideThumbs();
});

thumb_Down.addEventListener("click", ()=> {
  handleThumbClick(false);
  hideThumbs();
});

//This function is called when thumb up or down is clicked to hide the thumb up or down buttons to prevent repeat voting
function hideThumbs(){
  const rateUserElement = document.getElementById("rateUser");
  rateUserElement.style.display = "none";
}

// This function has a simple algorithm for calculcating a user's rating (out of 5) based on the number of thumb ups or thumb downs
// entered as parameter. It returns a num out of 5 rounded to nearest increment. We will use this later on
function calculateUserRating(numThumbsUp, numThumbsDown) {
  const totalVotes = numThumbsUp + numThumbsDown;
  const thumbsUpPercentage = totalVotes > 0 ? numThumbsUp / totalVotes : 0;
  const rating = Math.round(thumbsUpPercentage * 10) / 2;

  return rating;
}

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


// This function updates the user profile using the userID to find the user in firestore, check if they have a profileimg field,
// and then injects that value of the field into the profile image div.src attribute. It does the same for Review field (without 
// the checking for if it exists) and injects the review into the review div on the page
function updateUserProfile() {
  const userID = localStorage.getItem("userID");
  const userDocRef = db.collection("users").doc(userID);

  const profileImg = document.getElementById("otherUserprofile-img");
  const userReviewsDiv = document.getElementById("userReviewDiv");

  return userDocRef.get()
    .then(doc => {
      if (doc.exists) {
        const profileImgUrl = doc.get("profileimg");
        if (profileImgUrl) {
          profileImg.src = profileImgUrl;
        }
        const reviews = doc.get("Reviews");
        userReviewsDiv.textContent = reviews;
      } else {
        console.log("No such user document!");
      }
    })
    .catch(error => {
      console.error("Error getting user document:", error);
    });
}

updateUserProfile()
  .then(() => {
    console.log("User profile updated!");
  });

// This function has boolean paramter, if true, it increments the "ThumbUp-Count" field in the user document on firebase, otherwise
// it increments the ThumbDown-Count. It then calls calculateUserRating function we defined earlier to calc user rating using these two
// numbers, it then calls the displayStars function (which we haven't defined yet) to display the rating has stars on the user profile page. 
function handleThumbClick(isThumbUp) {
  const userID = localStorage.getItem("userID");
  const userDocRef = db.collection("users").doc(userID);
  let numThumbsUp, numThumbsDown;
  userDocRef.get()
    .then(doc => {
      if (doc.exists) {
        numThumbsUp = doc.get("ThumbUp-Count") || 0;
        numThumbsDown = doc.get("ThumbDown-Count") || 0;

        if (isThumbUp) {
          numThumbsUp++;
          userDocRef.update({ "ThumbUp-Count": numThumbsUp });
        } else {
          numThumbsDown++;
          userDocRef.update({ "ThumbDown-Count": numThumbsDown });
        }

        const userRating = calculateUserRating(numThumbsUp, numThumbsDown);

        displayStars(userRating);
      } else {
        console.log("User document doesnt exist!");
      }
    });
}
