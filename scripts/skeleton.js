//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton(){
    console.log($('#navbarPlaceholder').load('./text/loggedin_nav.html'));
    console.log($('#unlognavbarPlaceholder').load('./text/unloggedin_nav.html'));
    console.log($('#footerPlaceholder').load('./text/footer.html'));
}
loadSkeleton();  //invoke the function

function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
        window.location.href = "index.html";
      }).catch((error) => {
        // An error happened.
      });
}
