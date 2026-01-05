/**
 * Main Application Module
 * Orchestrates globe visualization, data loading, and UI interactions
 */
(function() {
	
	// ============================================================================
	// Application State
	// ============================================================================
	let currentGender = 'women';  // Current gender mode (women or men)
	let rankingsData = null;       // Cached rankings for current gender
	let worldMapData = null;       // GeoJSON world map data
	
	// ============================================================================
	// Medals Reference Data
	// ============================================================================
	/**
	 * Historic medals data for major volleyball nations
	 * Includes Olympic, World Championship, and Continental competition medals
	 */
	const medalsData = {
		// USA
		'USA': {
			olympics: { gold: 3, silver: 3, bronze: 2 },
			worldChampionship: { gold: 0, silver: 2, bronze: 1 },
			vnl: { gold: 1, silver: 1, bronze: 2 },
			continental: { name: 'NORCECA', gold: 7, silver: 3, bronze: 1 }
		},
		// Brazil
		'BRA': {
			olympics: { gold: 3, silver: 3, bronze: 2 },
			worldChampionship: { gold: 3, silver: 3, bronze: 2 },
			vnl: { gold: 12, silver: 5, bronze: 4 },
			continental: { name: 'CSV', gold: 15, silver: 8, bronze: 5 }
		},
		// China
		'CHN': {
			olympics: { gold: 3, silver: 2, bronze: 1 },
			worldChampionship: { gold: 2, silver: 1, bronze: 3 },
			vnl: { gold: 5, silver: 4, bronze: 3 },
			continental: { name: 'AVC', gold: 13, silver: 4, bronze: 2 }
		},
		// Italy
		'ITA': {
			olympics: { gold: 0, silver: 3, bronze: 3 },
			worldChampionship: { gold: 3, silver: 2, bronze: 2 },
			vnl: { gold: 4, silver: 6, bronze: 3 },
			continental: { name: 'CEV', gold: 6, silver: 7, bronze: 5 }
		},
		// Poland
		'POL': {
			olympics: { gold: 1, silver: 0, bronze: 2 },
			worldChampionship: { gold: 3, silver: 0, bronze: 1 },
			vnl: { gold: 0, silver: 2, bronze: 4 },
			continental: { name: 'CEV', gold: 1, silver: 3, bronze: 7 }
		},
		// Russia
		'RUS': {
			olympics: { gold: 4, silver: 0, bronze: 2 },
			worldChampionship: { gold: 6, silver: 2, bronze: 2 },
			vnl: { gold: 2, silver: 3, bronze: 5 },
			continental: { name: 'CEV', gold: 16, silver: 5, bronze: 3 },
			banned: true,
			lastRank: 1,
			bannedYear: 2022
		},
		// Japan
		'JPN': {
			olympics: { gold: 1, silver: 4, bronze: 3 },
			worldChampionship: { gold: 2, silver: 4, bronze: 1 },
			vnl: { gold: 1, silver: 2, bronze: 3 },
			continental: { name: 'AVC', gold: 9, silver: 8, bronze: 6 }
		},
		// Serbia
		'SRB': {
			olympics: { gold: 2, silver: 1, bronze: 0 },
			worldChampionship: { gold: 3, silver: 1, bronze: 1 },
			vnl: { gold: 1, silver: 3, bronze: 2 },
			continental: { name: 'CEV', gold: 3, silver: 4, bronze: 2 }
		},
		// Turkey
		'TUR': {
			olympics: { gold: 0, silver: 0, bronze: 1 },
			worldChampionship: { gold: 0, silver: 2, bronze: 2 },
			vnl: { gold: 1, silver: 1, bronze: 2 },
			continental: { name: 'CEV', gold: 4, silver: 3, bronze: 5 }
		},
		// Cuba
		'CUB': {
			olympics: { gold: 3, silver: 1, bronze: 0 },
			worldChampionship: { gold: 0, silver: 1, bronze: 3 },
			vnl: { gold: 0, silver: 0, bronze: 1 },
			continental: { name: 'NORCECA', gold: 12, silver: 5, bronze: 2 }
		},
		// Netherlands
		'NLD': {
			olympics: { gold: 0, silver: 1, bronze: 1 },
			worldChampionship: { gold: 1, silver: 0, bronze: 0 },
			vnl: { gold: 0, silver: 1, bronze: 2 },
			continental: { name: 'CEV', gold: 1, silver: 2, bronze: 3 }
		},
		// Germany
		'DEU': {
			olympics: { gold: 0, silver: 0, bronze: 1 },
			worldChampionship: { gold: 0, silver: 0, bronze: 1 },
			vnl: { gold: 0, silver: 0, bronze: 0 },
			continental: { name: 'CEV', gold: 2, silver: 3, bronze: 4 }
		},
		// Argentina
		'ARG': {
			olympics: { gold: 0, silver: 1, bronze: 1 },
			worldChampionship: { gold: 0, silver: 1, bronze: 0 },
			vnl: { gold: 0, silver: 0, bronze: 1 },
			continental: { name: 'CSV', gold: 7, silver: 6, bronze: 4 }
		},
		// South Korea
		'KOR': {
			olympics: { gold: 0, silver: 0, bronze: 1 },
			worldChampionship: { gold: 0, silver: 0, bronze: 0 },
			vnl: { gold: 0, silver: 0, bronze: 0 },
			continental: { name: 'AVC', gold: 3, silver: 5, bronze: 7 }
		},
		// France
		'FRA': {
			olympics: { gold: 1, silver: 0, bronze: 0 },
			worldChampionship: { gold: 0, silver: 1, bronze: 1 },
			vnl: { gold: 0, silver: 1, bronze: 1 },
			continental: { name: 'CEV', gold: 0, silver: 1, bronze: 3 }
		},
		// Thailand
		'THA': {
			olympics: { gold: 0, silver: 0, bronze: 0 },
			worldChampionship: { gold: 0, silver: 0, bronze: 1 },
			vnl: { gold: 0, silver: 0, bronze: 0 },
			continental: { name: 'AVC', gold: 2, silver: 4, bronze: 6 }
		},
		// Belarus
		'BLR': {
			olympics: { gold: 0, silver: 0, bronze: 0 },
			worldChampionship: { gold: 0, silver: 0, bronze: 0 },
			vnl: { gold: 0, silver: 0, bronze: 0 },
			continental: { name: 'CEV', gold: 0, silver: 1, bronze: 2 },
			banned: true,
			lastRank: 15,
			bannedYear: 2022
		}
	};
	
	/**
	 * Initialize application
	 */
	async function init() {
		try {
			showLoading(true);
			
			// Load world map data
			worldMapData = await DataLoader.loadWorldMap();
			const countries = topojson.feature(worldMapData, worldMapData.objects.countries).features;
			
			// Initialize globe
			GlobeRenderer.init(countries);
			
			// Setup UI interactions
			setupGenderToggle();
			setupZoomControls();
			setupCardClose();
			
			// Setup country selection callback
			window.onCountrySelected = handleCountrySelection;
			
			showLoading(false);
			
		} catch (error) {
			console.error('Initialization error:', error);
			showError('Failed to load application. Please refresh the page.');
		}
	}
	
	/**
	 * Load rankings for gender (no longer needed - RankingFetcher handles caching)
	 */
	async function loadRankings(gender) {
		// RankingFetcher handles caching automatically
		console.log(`Rankings for ${gender} will be fetched on demand`);
	}
	
	/**
	 * Setup gender toggle button
	 */
	function setupGenderToggle() {
		const toggleBtn = document.getElementById('toggleGender');
		if (!toggleBtn) return;
		
		toggleBtn.addEventListener('click', async () => {
			// Toggle gender
			currentGender = currentGender === 'women' ? 'men' : 'women';
			
			// Update button text and theme
			toggleBtn.textContent = currentGender === 'women' ? "Switch to Men's" : "Switch to Women's";
			document.body.className = currentGender;
			
			// Close any open card (rankings will be fetched on demand)
			hideCountryCard();
			GlobeRenderer.clearSelection();
		});
	}
	
	/**
	 * Setup card close button
	 */
	function setupCardClose() {
		const closeBtn = document.querySelector('.close-btn');
		if (closeBtn) {
			closeBtn.addEventListener('click', () => {
				hideCountryCard();
				GlobeRenderer.clearSelection();
			});
		}
	}
	
	/**
	 * Setup zoom controls
	 */
	function setupZoomControls() {
		const zoomInBtn = document.getElementById('zoomIn');
		const zoomOutBtn = document.getElementById('zoomOut');
		
		if (zoomInBtn) {
			zoomInBtn.addEventListener('click', () => {
				GlobeRenderer.zoomIn();
			});
		}
		
		if (zoomOutBtn) {
			zoomOutBtn.addEventListener('click', () => {
				GlobeRenderer.zoomOut();
			});
		}
	}
	
	/**
	 * Handle country selection from globe
	 */
	async function handleCountrySelection(countryId, countryName) {
		// Fetch live ranking from FIVB API
		let ranking = null;
		try {
			ranking = await RankingFetcher.getCountryRanking(countryName, currentGender);
		} catch (error) {
			console.error('Failed to fetch ranking:', error);
		}
		
		// Show card with ranking data
		showCountryCard(countryName, countryId, ranking);
	}
	
	/**
	 * Show country card with ranking data
	 */
	function showCountryCard(countryName, countryId, ranking) {
		const card = document.querySelector('.country-card');
		if (!card) return;
		
		const iso2Code = DataLoader.getIso2Code(countryId);
		const flagUrl = `${API_CONFIG.flags.primary}${iso2Code.toLowerCase()}.png`;
		
		// Update flag
		const flagImg = card.querySelector('.country-flag');
		if (flagImg) {
			flagImg.src = flagUrl;
			flagImg.alt = `${countryName} flag`;
		}
		
		// Update country name
		const nameElement = card.querySelector('.country-name');
		if (nameElement) {
			nameElement.textContent = countryName;
		}
		
		// Clear any existing ranking info first
		const textSection = card.querySelector('.text-center');
		if (textSection) {
			// Remove all existing paragraphs and divs after the country name
			const existingElements = textSection.querySelectorAll('p:not(.country-name), div');
			existingElements.forEach(el => el.remove());
		}
		
		// Add ranking info if available
		let rankingHtml = '<p class="text-gray-500 text-sm mt-2 font-medium">No ranking data available</p>';
		if (ranking) {
			const updateDate = new Date().toLocaleDateString('en-US', { 
				year: 'numeric', 
				month: 'short', 
				day: 'numeric' 
			});
			rankingHtml = `
				<p class="text-gray-500 text-sm mt-2 font-medium">FIVB World Ranking</p>
				<div class="mt-3 space-y-2">
					<p class="text-2xl font-bold text-gray-900">#${ranking.rank}</p>
					<p class="text-md text-gray-700"><span class="font-semibold">${ranking.points.toFixed(2)}</span> points</p>
				</div>
				<p class="text-xs text-gray-400 mt-3">Ranking as of: ${updateDate}</p>
			`;
		}
		
		// Add new ranking info
		if (textSection) {
			textSection.insertAdjacentHTML('beforeend', rankingHtml);
		}
		
		// Show card
		card.classList.add('show');
	}
	
	/**
	 * Hide country card
	 */
	function hideCountryCard() {
		const card = document.querySelector('.country-card');
		if (card) {
			card.classList.remove('show');
		}
	}
	
	/**
	 * Show medals for selected country
	 */
	function showMedals(countryId) {
		const medalsCard = document.querySelector('.medals-card');
		if (!medalsCard) return;
		
		const countryData = medalsData[countryId];
		
		if (!countryData) {
			// No medal data available
			medalsCard.innerHTML = `
				<h3>Tournament Medals</h3>
				<p class="medals-intro">No medal data available for this country</p>
			`;
			medalsCard.classList.add('show');
			return;
		}
		
		// Check if country is banned
		let bannedHtml = '';
		if (countryData.banned) {
			bannedHtml = `
				<div class="banned-status">
					<div class="status-text">🔴 Banned from Competition</div>
					<div class="last-rank">Last Recorded: #${countryData.lastRank} (${countryData.bannedYear})</div>
				</div>
			`;
		}
		
		// Build medals HTML
		const { olympics, worldChampionship, vnl, continental } = countryData;
		
		medalsCard.innerHTML = `
			<h3>Tournament Medals</h3>
			
			<div class="medal-item">
				<div class="medal-tournament">🥇 Olympics</div>
				<div class="medal-counts">
					<span style="color: #ffd700">${olympics.gold}🥇</span>
					<span style="color: #c0c0c0">${olympics.silver}🥈</span>
					<span style="color: #cd7f32">${olympics.bronze}🥉</span>
				</div>
			</div>
			
			<div class="medal-item">
				<div class="medal-tournament">🏆 World Championship</div>
				<div class="medal-counts">
					<span style="color: #ffd700">${worldChampionship.gold}🥇</span>
					<span style="color: #c0c0c0">${worldChampionship.silver}🥈</span>
					<span style="color: #cd7f32">${worldChampionship.bronze}🥉</span>
				</div>
			</div>
			
			<div class="medal-item">
				<div class="medal-tournament">🌍 VNL</div>
				<div class="medal-counts">
					<span style="color: #ffd700">${vnl.gold}🥇</span>
					<span style="color: #c0c0c0">${vnl.silver}🥈</span>
					<span style="color: #cd7f32">${vnl.bronze}🥉</span>
				</div>
			</div>
			
			<div class="medal-item">
				<div class="medal-tournament">🌎 ${continental.name}</div>
				<div class="medal-counts">
					<span style="color: #ffd700">${continental.gold}🥇</span>
					<span style="color: #c0c0c0">${continental.silver}🥈</span>
					<span style="color: #cd7f32">${continental.bronze}🥉</span>
				</div>
			</div>
			
			${bannedHtml}
		`;
		
		// Show card with animation
		setTimeout(() => {
			medalsCard.classList.add('show');
		}, 150);
	}
	
	/**
	 * Show country volleyball history
	 */
	async function showCountryHistory(countryName, countryId) {
		const sidebar = document.querySelector('.info-sidebar');
		if (!sidebar) return;
		
		// Show sidebar with loading state
		sidebar.classList.add('show');
		sidebar.innerHTML = `
			<div class="country-history">
				<h3 class="country-history-title">${countryName} Volleyball</h3>
				<div class="history-content">
					<p class="history-intro">Loading volleyball information from Wikipedia...</p>
				</div>
			</div>
		`;
		
		// Fetch data from Wikipedia API
		try {
			const wikiData = await fetchWikipediaData(countryName);
			
			sidebar.innerHTML = `
				<div class="country-history">
					<h3 class="country-history-title">${countryName} Volleyball</h3>
					<div class="history-content">
						${wikiData}
					</div>
				</div>
			`;
		} catch (error) {
			console.error('Failed to load Wikipedia data:', error);
			sidebar.innerHTML = `
				<div class="country-history">
					<h3 class="country-history-title">${countryName} Volleyball</h3>
					<div class="history-content">
						<p>Information about ${countryName}'s volleyball program.</p>
						<p class="history-intro">This country participates in international volleyball competitions.</p>
					</div>
				</div>
			`;
		}
	}
	
	/**
	 * Fetch volleyball data from Wikipedia
	 */
	async function fetchWikipediaData(countryName) {
		try {
			// Try to get gender-specific volleyball article
			const genderText = currentGender === 'women' ? "women's" : "men's";
			const searchQuery = `${countryName} ${genderText} national volleyball team`;
			const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&origin=*&srlimit=1`;
			
			const searchResponse = await fetch(searchUrl);
			const searchData = await searchResponse.json();
			
			if (searchData.query.search.length === 0) {
				throw new Error('No Wikipedia article found');
			}
			
			const pageTitle = searchData.query.search[0].title;
			const pageId = searchData.query.search[0].pageid;
			
			// Get page extract
			const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageId}&format=json&origin=*`;
			
			const extractResponse = await fetch(extractUrl);
			const extractData = await extractResponse.json();
			
			const extract = extractData.query.pages[pageId].extract;
			
			// Format the content
			const paragraphs = extract.split('\n').filter(p => p.trim().length > 0);
			let content = '<h4>📖 From Wikipedia</h4>';
			
			paragraphs.slice(0, 2).forEach(para => {
				content += `<p>${para}</p>`;
			});
			
			content += `<p class="history-intro"><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}" target="_blank" style="color: #ffd700; text-decoration: underline;">Read more on Wikipedia →</a></p>`;
			
			return content;
			
		} catch (error) {
			console.warn('Wikipedia fetch failed:', error);
			return `
				<h4>🏐 Volleyball Information</h4>
				<p>${countryName} has volleyball teams competing at various international levels.</p>
				<p>For more detailed information, visit the official FIVB website or search for "${countryName} volleyball" online.</p>
			`;
		}
	}
	
	/**
	 * Show/hide loading indicator
	 */
	function showLoading(show) {
		// Could add a loading spinner here
		console.log(show ? 'Loading...' : 'Loaded');
	}
	
	/**
	 * Show error message
	 */
	function showError(message) {
		console.error(message);
		// Could show toast notification here
		alert(message);
	}
	
	// Start application when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
