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
   it exists then do nothing if it doesn't create field and set it to false.
   We use it once to add the fields to every user document and afterwards we comment it out in case we need it
   in the future.  
   */

// usersCollection.get().then(querySnapshot => {
//     querySnapshot.forEach(doc => {
//       const data = doc.data();
//       // Check if the Verified field exists in the current document
//       if (!data.hasOwnProperty("Verified")) {
//         // If the Verified field doesn't exist, add it with a default value of false
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