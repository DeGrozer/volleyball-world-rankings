/**
 * Ranking Fetcher Module
 * Fetches real-time FIVB World Ranking data directly from official API
 * No localhost or backend required - purely client-side
 */
const RankingFetcher = (function() {
	
	/**
	 * FIVB Official API Endpoints
	 * Women: 0, Men: 1
	 * Format: /worldranking/volleyball/{gender}/{page}/{count}
	 * Page: 0, 1, 2... (pagination)
	 * Count: items per page (50 recommended)
	 */
	const FIVB_API_BASE = 'https://en.volleyballworld.com/api/v1/worldranking/volleyball';
	
	// Cache for rankings data
	let rankingsCache = {
		men: null,
		women: null,
		lastFetch: {
			men: null,
			women: null
		}
	};
	
	// Federation name to country ISO3 mapping (for flag lookup)
	const federationToIso3 = {
		'United States': '840',
		'Brazil': '076',
		'Poland': '616',
		'Italy': '380',
		'Japan': '392',
		'China': '156',
		'France': '250',
		'Germany': '276',
		'Russia': '643',
		'Serbia': '688',
		'Argentina': '032',
		'Canada': '124',
		'Netherlands': '528',
		'Turkey': '792',
		'Iran': '364',
		'Egypt': '818',
		'Tunisia': '788',
		'Cuba': '192',
		'Slovenia': '705',
		'Bulgaria': '100',
		'Australia': '036',
		'Mexico': '484',
		'South Korea': '410',
		'Belgium': '056',
		'Czech Republic': '203',
		'Ukraine': '804',
		'Finland': '246',
		'Portugal': '620',
		'Dominican Republic': '214',
		'Kenya': '404',
		'Cameroon': '120',
		'Thailand': '764',
		'Mongolia': '496',
		'Peru': '604',
		'Greece': '300',
		'Spain': '724',
		'Puerto Rico': '630',
		'Virgin Islands': '850'
	};
	
	/**
	 * Fetch current rankings from FIVB official API
	 * @async
	 * @param {string} gender - 'men' or 'women'
	 * @returns {Promise<Array>} Array of ranking objects
	 */
	async function fetchCurrentRankings(gender) {
		// Use cache if fresh (within 1 hour)
		const cacheTime = rankingsCache.lastFetch[gender];
		const now = Date.now();
		if (rankingsCache[gender] && cacheTime && (now - cacheTime) < 3600000) {
			console.log(`✓ Using cached ${gender} rankings`);
			return rankingsCache[gender];
		}
		
		try {
			const genderCode = gender === 'women' ? 0 : 1;
			
			console.log(`Fetching ${gender} rankings from FIVB API...`);
			
			// Fetch from pages 0 and 1 (50 teams each = 100 total)
			const allTeams = [];
			const pages = [0, 1];
			
			for (const page of pages) {
				const apiUrl = `${FIVB_API_BASE}/${genderCode}/${page}/50`;
				
				console.log(`  Fetching page ${page}: ${apiUrl}`);
				
				const response = await fetch(apiUrl);
				
				if (!response.ok) {
					throw new Error(`HTTP ${response.status} on page ${page}`);
				}
				
				const data = await response.json();
				
				if (data.teams && data.teams.length > 0) {
					allTeams.push(...data.teams);
				}
			}
			
			// Transform FIVB API data to our format
			const rankings = allTeams
				.filter(team => team.decimalPoints && team.decimalPoints !== '')
				.map((team, index) => ({
					rank: index + 1,
					federationName: team.federationName,
					countryName: team.federationName,
					points: parseFloat(team.decimalPoints),
					iso3: federationToIso3[team.federationName] || null,
					participationPoints: team.participationPoints || 0,
					gamesPlayed: team.gamesPlayed || 0,
					updatedDate: new Date().toISOString()
				}));
			
			// Cache the results
			rankingsCache[gender] = rankings;
			rankingsCache.lastFetch[gender] = now;
			
			console.log(`✓ Fetched ${rankings.length} ${gender} rankings`);
			return rankings;
			
		} catch (error) {
			console.error(`Error fetching ${gender} rankings:`, error);
			throw error;
		}
	}
	
	/**
	 * Get ranking for a specific country
	 * @async
	 * @param {string} countryName - Country/Federation name
	 * @param {string} gender - 'men' or 'women'
	 * @returns {Promise<Object>} Ranking data or null
	 */
	async function getCountryRanking(countryName, gender) {
		const rankings = await fetchCurrentRankings(gender);
		
		// Normalize country name for matching
		const normalizedInput = normalizeCountryName(countryName);
		
		// Search with flexible matching
		const ranking = rankings.find(r => {
			const normalizedFed = normalizeCountryName(r.federationName);
			return normalizedFed === normalizedInput || 
			       r.federationName.toLowerCase().includes(normalizedInput) ||
			       normalizedInput.includes(normalizedFed.toLowerCase());
		});
		
		return ranking || null;
	}
	
	/**
	 * Normalize country name for matching between globe and FIVB API
	 * Globe uses full names, FIVB uses short names
	 */
	function normalizeCountryName(name) {
		const lowerName = name.toLowerCase().trim();
		
		// Map common variations
		const nameMap = {
			'united states of america': 'united states',
			'usa': 'united states',
			'u.s.a.': 'united states',
			'russian federation': 'russia',
			// South Korea
			'republic of korea': 'korea',
			'south korea': 'korea',
			'korea, republic of': 'korea',
			// North Korea
			'north korea': 'dpr korea',
			"korea, democratic people's republic of": 'dpr korea',
			'democratic peoples republic of korea': 'dpr korea',
			// Others
			'democratic republic of the congo': 'democratic republic of congo',
			'republic of the congo': 'congo',
			'united kingdom': 'great britain',
			'england': 'great britain',
			'czech republic': 'czechia',
			'ivory coast': "côte d'ivoire",
			'vietnam': 'viet nam',
			'taiwan': 'chinese taipei',
			'holland': 'netherlands',
			'uae': 'united arab emirates',
			'bosnia and herzegovina': 'bosnia and herzegovina',
			'türkiye': 'turkey',
			'turkiye': 'turkey'
		};
		
		return nameMap[lowerName] || lowerName;
	}
	
	/**
	 * Get top N rankings
	 * @async
	 * @param {number} limit - Number of top teams to return
	 * @param {string} gender - 'men' or 'women'
	 * @returns {Promise<Array>} Top N rankings
	 */
	async function getTopRankings(limit, gender) {
		const rankings = await fetchCurrentRankings(gender);
		return rankings.slice(0, limit);
	}
	
	/**
	 * Format ranking data for display
	 * @param {Object} ranking - Ranking object
	 * @returns {Object} Formatted ranking data
	 */
	function formatRankingDisplay(ranking) {
		if (!ranking) return null;
		
		return {
			rank: ranking.rank,
			country: ranking.federationName,
			points: ranking.points.toFixed(2),
			participationPoints: ranking.participationPoints?.toFixed(2) || '0',
			gamesPlayed: ranking.gamesPlayed || 'N/A',
			iso3: ranking.iso3,
			lastUpdated: ranking.updatedDate
		};
	}
	
	/**
	 * Clear cache (force fresh fetch)
	 * @param {string} gender - Optional: specific gender to clear
	 */
	function clearCache(gender) {
		if (gender) {
			rankingsCache[gender] = null;
			rankingsCache.lastFetch[gender] = null;
		} else {
			rankingsCache = {
				men: null,
				women: null,
				lastFetch: { men: null, women: null }
			};
		}
		console.log('✓ Ranking cache cleared');
	}
	
	/**
	 * Get all cached rankings
	 */
	function getCachedRankings() {
		return rankingsCache;
	}
	
	return {
		fetchCurrentRankings,
		getCountryRanking,
		getTopRankings,
		formatRankingDisplay,
		clearCache,
		getCachedRankings
	};
})();
