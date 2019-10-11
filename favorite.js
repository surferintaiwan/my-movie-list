(function () {
	const BASE_URL = 'https://movie-list.alphacamp.io'
	const INDEX_URL = BASE_URL + '/api/v1/movies/'
	const POSTER_URL = BASE_URL + '/posters/'
	const dataPanel = document.querySelector('#data-panel')
	const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []

	displayDataList(data)

	function displayDataList(data) {
		let htmlContent = ''
		data.forEach(item => {
			htmlContent += `
				<div class="col-sm-3">
		          <div class="card mb-2">
		            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
		            <div class="card-body movie-item-body">
		              <h5 class="card-title">${item.title}</h5>
		            </div>
		            <div class="card-footer">
		              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
		              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
		            </div>
		          </div>
		        </div>
			`
		})
		dataPanel.innerHTML = htmlContent	
	}

	
	function showMovie(id) {
			let finalPoster = INDEX_URL + id
			axios.get(finalPoster)
			.then(response => {
				const modalTitle = document.querySelector('#show-movie-title')
				const modalImage = document.querySelector('#show-movie-image')
				const modalDate = document.querySelector('#show-movie-date')
				const modalDescription = document.querySelector('#show-movie-description')
				modalTitle.textContent = response.data.results.title
				modalImage.innerHTML = `
					<img src="${POSTER_URL}${response.data.results.image}" class="img-fluid" alt="Responsive image">
				`
				modalDate.textContent = response.data.results.release_date
				modalDescription.textContent = response.data.results.description

			})
			.catch(error => console.log(error))	
	}
	
	function removeFavoriteMovie(id) {
		const index = data.findIndex(item => item.id === Number(id))
		data.splice(index, 1)
		localStorage.setItem('favoriteMovies', JSON.stringify(data))
		displayDataList(data)
	}

	dataPanel.addEventListener('click', function() {
		if (event.target.matches('.btn-show-movie')) {
			showMovie(event.target.dataset.id)
		} 
		else if (event.target.matches('.btn-remove-favorite')) {
			removeFavoriteMovie(event.target.dataset.id)
			
		}
	})



})()