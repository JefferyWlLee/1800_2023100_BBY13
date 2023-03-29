// ============================Code for reviewing/rating other users (Please don't touch-Yousuf)============================================

const usersCollection = firebase.firestore().collection("users");
const thumb_Up = document.getElementById("thumbUp");
const thumb_Down = document.getElementById("thumbDown");
const reviewContainer = document.getElementById("reviewContainer");

thumb_Up.addEventListener("click", ()=> {
  handleThumbClick(true);
  hideThumbs();
  showReviewContainer();
});

thumb_Down.addEventListener("click", ()=> {
  handleThumbClick(false);
  hideThumbs();
  showReviewContainer()
});

// This function will add or remove classes to review container depending on which classes it already has.
// Along with the "transition end" event listener, it craetes a "fade in effect" for the review container element
function showReviewContainer() {
  if (reviewContainer.classList.contains("form-active")) {
    reviewContainer.classList.remove("form-active");
    reviewContainer.classList.add('form-transition');
    reviewContainer.classList.add('form-hidden');
} else {
    reviewContainer.classList.add('form-visible');
    reviewContainer.classList.add('form-transition');
    reviewContainer.classList.add('form-active');
}
}

reviewContainer.addEventListener('transitionend', function() {
  reviewContainer.classList.remove('form-transition');
  reviewContainer.classList.remove('form-visible');
  reviewContainer.classList.remove('form-hidden');
}, false);

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
// numbers, it then calls the displayStars function (which we haven't defined yet) to display the rating as stars on the user profile page. 
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

// This function takes a user rating out of 5, and generates either a full star, half star or hollow star images (up to 5)
// and injects them into the starContainer div in the user's profile.
// This function is called once when the page is loaded, and once when a user votes by clicking thumb up or down on their profile
function displayStars(rating) {
  const starContainer = document.getElementById("starContainer");
  if (starContainer.childElementCount === 0) {
    // Create full stars
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
      const fullStar = document.createElement("img");
      fullStar.classList.add("ratingStars");
      fullStar.src = "./images/fullStar.svg";
      starContainer.appendChild(fullStar);
    }
    // Create half stars
    const hasHalfStar = (rating % 1) >= 0.5;
    if (hasHalfStar) {
      const halfStar = document.createElement("img");
      halfStar.classList.add("ratingStars");
      halfStar.src = "./images/halfStar.svg";
      starContainer.appendChild(halfStar);
    }
    // Create hollow stars
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      const hollowStar = document.createElement("img");
      hollowStar.classList.add("ratingStars");
      hollowStar.src = "./images/fullStarHollow.svg";
      starContainer.appendChild(hollowStar);
    }
  } else {
    while (starContainer.firstChild) {
      starContainer.removeChild(starContainer.firstChild);
    }
    displayStars(rating);
  }
}

// This function gets the user rating of a user form firestore databse using the userID stored in local storage,
// we need it to call the displayStars function when the page is first loaded
function getUserRating() {
  const userID = localStorage.getItem("userID");
  const userDocRef = db.collection("users").doc(userID);

  return userDocRef.get()
    .then(doc => {
      if (doc.exists) {
        const numThumbsUp = doc.get("ThumbUp-Count") || 0;
        const numThumbsDown = doc.get("ThumbDown-Count") || 0;
        return calculateUserRating(numThumbsUp, numThumbsDown);
      } else {
        console.log("User document doesnt exist!");
        return null;
      }
    })
    .catch(error => {
      console.error("Error getting user document:", error);
      return null;
    });
}
getUserRating().then(userRating => {
  displayStars(userRating);
});


