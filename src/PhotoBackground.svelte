<script>
	import { fade } from 'svelte/transition';
	import { config } from  './config.js';
    import { scheduleFunction } from  './jinFunctions.js';

	const SLIDESHOW_INTERVAL = 30;
	const GETNEWPHOTOS_INTERVAL = 60;

	export let db;
	console.log({db});

	function authenticate() {
		const authInstance = gapi.auth2.getAuthInstance();

		if (authInstance.isSignedIn.get()) {
			console.log("User already signed in.");
		} else {
			//authInstance.signIn({scope: "https://www.googleapis.com/auth/photoslibrary https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata"})
			authInstance.signIn({scope: "https://www.googleapis.com/auth/photoslibrary.readonly"})
			.then(function() { console.log("Sign-in successful"); },
				function(err) { console.error("Error signing in", err); });
		}
		return authInstance;
	}

	let googlePhotosClientLoaded = false;
	function loadClient() {
		gapi.client.setApiKey(config.API_KEY);
		return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest")
			.then(function() { 
				googlePhotosClientLoaded = true; 
				console.log("GAPI client loaded for API"); 
				
				clearOldPhotos();
	 			schedule_displayRandomPhoto(0);
				schedule_getPictures(0);
			},
				function(err) { console.error("Error loading GAPI client for API", err); });
	}

	// change background image
	function changeBackgroundImage(imgUrl) {
		const img = new Image();

		img.onload = function() {
			document.querySelector('html').style.backgroundImage = `url(${img.src})`;
		};

		img.src = imgUrl;
	}


	async function clearOldPhotos() {
		const newlyUpdatedPhotos = await db.photos.orderBy('modified').reverse().limit(100).toArray();
		const averageModifiedTime = newlyUpdatedPhotos.reduce((accumulator, item) => accumulator + item.modified, 0) / newlyUpdatedPhotos.length
		const inactiveTolerance = 60 * 60 * 24 * 7;
		console.log('clearOldPhotos:', {newlyUpdatedPhotos, averageModifiedTime, inactiveTolerance});

		const thresholdTime = averageModifiedTime - inactiveTolerance;
		const deleteTransaction = await db.photos.where('modified').below(thresholdTime).delete();
		console.log('clearOldPhotos:', {deleteTransaction});
	};	

	const schedule_displayRandomPhoto = (scheduleSeconds = SLIDESHOW_INTERVAL) => scheduleFunction('displayRandomPhoto', displayRandomPhoto, scheduleSeconds);
	async function displayRandomPhoto() {
		const totalNoOfPhotos = await db.photos.count();
		const randomPhotoIndex = Math.round(Math.random() * totalNoOfPhotos);
		const randomPhotoItem = await db.photos.offset(randomPhotoIndex).limit(1).first();
		const randomPhotoId = randomPhotoItem.id;
		console.log('displayRandomPhoto:', {totalNoOfPhotos, randomPhotoIndex, randomPhotoItem, randomPhotoId});

		return gapi.client.photoslibrary.mediaItems.get({
      		"mediaItemId": randomPhotoId,
    	})
        .then(
			function(response) {
				// Handle the results here (response.result has the parsed body).
				console.log("Photo data (Google):", response);
				changeBackgroundImage(`${response.result.baseUrl}=w0-h0`);
				schedule_displayRandomPhoto();
			},
			function(err) {
				console.error("Execute error", err); 
				schedule_displayRandomPhoto(0);
			}
		);
	 }


	let pageToken = '';
	const schedule_getPictures = (scheduleSeconds = GETNEWPHOTOS_INTERVAL) => scheduleFunction('getPictures', getPictures, scheduleSeconds);
	// Make sure the client is loaded and sign-in is complete before calling this method.
	function getPictures() {
		return gapi.client.photoslibrary.mediaItems.search({
			"resource": {
				"pageSize": 100,
				pageToken
			},
		}).then(async function(response) {
			// Handle the results here (response.result has the parsed body).
			console.log("getPictures: ", response);
			const { result } = response;

			const newPhotoIds = result.mediaItems.filter(item => {
				const validPhotoTest = [
					item.mimeType.includes('image/'),
					(item.filename.toLowerCase().includes("screenshot") === false),
					// check if metadata exists (disabled for now)
					// (Object.keys(item.mediaMetadata.photo).length > 0),
				];

				return validPhotoTest.every(item => item === true);
			}).map(item => item.id);

			const nowTime = Math.round((new Date).getTime() / 1000);
			await db.photos.bulkPut(newPhotoIds.map(item => { 
				return {'id': item, 'modified': nowTime};
			})).catch((err) => {
				console.error("Dexie error", err); 
			});;

			pageToken = result.nextPageToken;
			schedule_getPictures();
		}, function(err) { 
			console.error("Execute error", err); 
			schedule_getPictures();
		});
	}

	gapi.load("client:auth2", function() {
		gapi.auth2.init({client_id: config.CLIENT_ID}).then( () => {
			const authInstance = gapi.auth2.getAuthInstance();
			if (authInstance.isSignedIn.get()) loadClient();
		});
	});
</script>

<style>
	div.content {
		width: 100%;
		height: 100%;
	}
</style>

<div class="content" on:click={() => schedule_displayRandomPhoto(0)} on:dblclick={()=>document.body.requestFullscreen()} on:taphold={()=>document.body.requestFullscreen()}>
{#if googlePhotosClientLoaded}
	<!-- <button on:click={getPictures}>execute</button> -->
{:else}
	<h1>You are not authenticated.</h1>
	<button on:click={() => authenticate().then(loadClient)}>authorize and load</button>

{/if}
</div>