(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  axios.get(INDEX_URL)
  .then( (response) => {
  	response.data.results.forEach(x => {
  		data.push(x)
  	})
  	//displayDataList(data)
  	getTotalPages(data)
  	getPageData(1, data)
  })
  .catch(error => console.log(error))

const dataPanel = document.getElementById('data-panel')


// print the photos of all movies
	function displayDataList(data) {
		let htmlContent = ''
		data.forEach((item, index) => {
			htmlContent += `
			<div class="col-sm-3">
	        	<div class="card mb-2">
		        	<img class="card-img-top" src="${POSTER_URL}${item.image}" alt="Card image cap">
		        	<div class="card-body movie-item-body">
		          		<h6>${item.title}</h6>
		          	</div>
		          	<!-- "More" button -->
	         	 	<div class="card-footer">
	              		<button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
	              		<button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
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

	function addFavoriteItem(id) {
		const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
		const movie = data.find(item => item.id === Number(id))
		if (list.some(item => item.id === Number(id))) {
			alert(`${movie.title} is already in your favorite list.`)
		} else {
			list.push(movie)
			alert(`Added ${movie.title} to your favorite list!`)
		}
		localStorage.setItem('favoriteMovies', JSON.stringify(list))
	}

// listen to data panel
	dataPanel.addEventListener('click',function() {
		if (event.target.matches('.btn-show-movie')) {
			showMovie(event.target.dataset.id)
		} else if(event.target.matches('.btn-add-favorite')){
			addFavoriteItem(event.target.dataset.id)
		}
	})


// results of search bar
	const searchForm = document.querySelector('#search')
	const searchInput = document.querySelector('#search-input')

	searchForm.addEventListener('submit', event => {
		let results = []
		event.preventDefault()
		const regex = new RegExp(searchInput.value, 'i')
		results = data.filter(movie=> movie.title.match(regex))
		// displayDataList(results)
		getTotalPages(results)
		getPageData(1, results)
	})

	const pagination =document.querySelector('#pagination')
	const ITEM_PER_PAGE = 12

	function getTotalPages(data) {
		let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
		let pageItemContent = ''
		for (let i = 0; i < totalPages; i++) {
			pageItemContent += `
				<li class="page-item">
        			<a class="page-link" href="javascript:;" data-page="${i+1}">${i+1}</a>
        		</li>
			`
		}
		pagination.innerHTML = pageItemContent
	}

	pagination.addEventListener('click',function() {
		if (event.target.tagName === 'A') {
			getPageData(event.target.dataset.page, data)
		}
	})

	// let paginationData = []
	function getPageData (pageNum, data) {
		// paginationData = data || paginationData
		let offset = (pageNum - 1) * ITEM_PER_PAGE
		let pageData = data.slice(offset, offset + ITEM_PER_PAGE)
		
		displayDataList(pageData)
	}

})()





