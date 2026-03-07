/**
 * Filter Options Endpoint - Optimized with Caching
 * This endpoint provides unique values for filter dropdowns
 * Cached for 5 minutes to reduce database load
 */

const QuestionGenModel = require("../../Module/Teacher/GenrateQA");

// Simple in-memory cache
let filterCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutes
};

/**
 * Get unique filter options for dropdowns
 * Returns cached data if available and not expired
 */
async function getFilterOptions(req, res) {
  try {
    const now = Date.now();
    
    // Check if cache is valid
    if (filterCache.data && filterCache.timestamp && (now - filterCache.timestamp < filterCache.ttl)) {
      console.log('Returning cached filter options');
      return res.status(200).json({
        success: true,
        data: filterCache.data,
        cached: true
      });
    }

    console.log('Fetching fresh filter options from database');
    
    // Fetch unique values in parallel
    const [boards, classes, mediums, statuses] = await Promise.all([
      QuestionGenModel.distinct('Board'),
      QuestionGenModel.distinct('Class'),
      QuestionGenModel.distinct('Medium'),
      QuestionGenModel.distinct('status')
    ]);

    const filterOptions = {
      boards: boards.filter(Boolean).sort(),
      classes: classes.filter(Boolean).sort(),
      mediums: mediums.filter(Boolean).sort(),
      statuses: statuses.filter(Boolean).sort()
    };

    // Update cache
    filterCache.data = filterOptions;
    filterCache.timestamp = now;

    return res.status(200).json({
      success: true,
      data: filterOptions,
      cached: false
    });

  } catch (error) {
    console.error('Error fetching filter options:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch filter options',
      message: error.message
    });
  }
}

/**
 * Clear filter cache (call this when new data is added)
 */
function clearFilterCache() {
  filterCache.data = null;
  filterCache.timestamp = null;
  console.log('Filter cache cleared');
}

module.exports = {
  getFilterOptions,
  clearFilterCache
};
