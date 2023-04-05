var userProfileEdit = document.querySelector('#editBtn-UserProfile');
userProfileEdit.addEventListener('click', flipEditForm);

function flipEditForm() {
	let hiddenForm = document.getElementById('hiddenForm');
	hiddenForm.style.display = 'block';

	const imageInput = document.getElementById('imageFile');
	const userImageElement = document.getElementById('userprofile-img');

	imageInput.addEventListener('change', function () {
		const file = imageInput.files[0];
		const reader = new FileReader();

		reader.addEventListener('load', function () {
			userImageElement.src = reader.result;
		});

		reader.readAsDataURL(file);
	});
}

function confirmChanges_Clicked() {
	let userNameChange = document.getElementById('myName').value;
	let userLocationChange = document.getElementById('myLocation').value;

	let userName = document.getElementById('userName');
	let userLocation = document.getElementById('userLocation');
	userName.textContent = 'Name: ' + userNameChange;
	userLocation.innerText = 'Location: ' + userLocationChange;

	let hiddenForm = document.getElementById('hiddenForm');
	hiddenForm.style.display = 'none';
}

var confirmChangesBtn = document.getElementById('confirmChangesBtn');
confirmChangesBtn.addEventListener('click', confirmChanges_Clicked);

var currentUser;

function populateUserInfo() {
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			// Get a reference to the current user's document in the "users" collection of Firestore
			const currentUserRef = db.collection('users').doc(user.uid);
			// Retrieve the user document's data and populate the user's name, location, and profile image in the HTML
			currentUserRef.get().then((userDoc) => {
				const userName = userDoc.data().name;
				const userLocation = userDoc.data().location;
				const userProfileImg = userDoc.data().profileimg;
				document.getElementById('name-goes-here').innerHTML = userName;
				document.getElementById('location-goes-here').innerHTML = userLocation;
				const image = document.getElementById('userprofile-img');
				// If the user profile image element exists in the HTML, set the source to the URL retrieved from Firestore
				if (image) {
					image.src = userProfileImg;
				} else {
					// Otherwise, log an error message to the console
					console.error('Image element not found');
				}
			});
		} else {
			// If no user is signed in, log a message to the console
			console.log('No user is signed in');
		}
	});
}

populateUserInfo();

function editUserInfo() {
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			const userId = user.uid;
			const userDocRef = firebase.firestore().collection('users').doc(userId);
			userDocRef
				.get()
				.then(function (doc) {
					if (doc.exists) {
						// Get the user's name, location, and profile image from the user's document data
						const userData = doc.data();
						const username = userData.name;
						const userLocation = userData.location;
						const userProfilePic = userData.profileimg;
						// Populate the user's name and location in the corresponding input fields
						document.getElementById('myName').value = username;
						document.getElementById('myLocation').value = userLocation;
					} else {
						// Log an error message if the user's document does not exist
						console.log('No document');
					}
				})
				.catch(function (error) {
					// Log an error message if there was an issue retrieving the user's document
					console.log('Error getting document:', error);
				});
		} else {
			// If no user is signed in, log a message to the console
			console.log('No user is signed in.');
		}
	});
}

function saveUserInfo() {
	const currentUser = firebase.auth().currentUser;
	if (!currentUser) {
		console.error('No current user found.');
		return;
	}

	const currentUserRef = db.collection('users').doc(currentUser.uid);

	const userName = document.getElementById('myName').value || currentUser.displayName;
	const userLocation = document.getElementById('myLocation').value || currentUser.location;
	const imageFile = document.getElementById('imageFile').files[0];

	if (imageFile) {
		const storageRef = firebase.storage().ref();
		const fileRef = storageRef.child(`profile-images/${currentUser.uid}/${imageFile.name}`);
		fileRef
			.put(imageFile)
			.then(() => {
				console.log('File uploaded successfully.');

				fileRef
					.getDownloadURL()
					.then((url) => {
						const updatedData = {
							name: userName,
							location: userLocation,
							profileimg: url,
						};

						currentUserRef
							.update(updatedData)
							.then(() => {
								console.log('Document successfully updated!');
							})
							.catch((error) => {
								console.error('Error updating document:', error);
							});
					})
					.catch((error) => {
						console.error('Error getting download URL:', error);
					});
			})
			.catch((error) => {
				console.error('Error uploading file:', error);
			});
	} else {
		const updatedData = {
			name: userName,
			location: userLocation,
		};

		currentUserRef
			.update(updatedData)
			.then(() => {
				console.log('Document successfully updated!');
			})
			.catch((error) => {
				console.error('Error updating document:', error);
			});
	}

	document.getElementById('personalInfoFields').setAttribute('disabled', true);
}
