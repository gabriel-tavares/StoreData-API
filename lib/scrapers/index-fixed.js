// Usar import dinâmico para google-play-scraper
let gplay;
const appstore = require('app-store-scraper');

// Inicializar google-play-scraper
async function initGooglePlay() {
  if (!gplay) {
    gplay = await import('google-play-scraper');
  }
  return gplay;
}

/**
 * Scraper para Google Play Store
 */
class GooglePlayScraper {
  /**
   * Busca dados básicos do app
   * @param {string} appId - ID do app (ex: br.com.icatuseguros.appicatu)
   * @returns {Promise<Object>} Dados do app
   */
  async getAppData(appId) {
    try {
      await initGooglePlay();
      const appData = await gplay.default.app({ appId });
      
      return {
        success: true,
        data: {
          id: appData.appId,
          title: appData.title,
          developer: appData.developer,
          score: appData.score,
          reviews: appData.reviews,
          histogram: appData.histogram,
          price: appData.price,
          free: appData.free,
          currency: appData.currency,
          size: appData.size,
          androidVersion: appData.androidVersion,
          contentRating: appData.contentRating,
          genre: appData.genre,
          genreId: appData.genreId,
          icon: appData.icon,
          screenshots: appData.screenshots,
          description: appData.description,
          summary: appData.summary,
          releaseDate: appData.releaseDate,
          updated: appData.updated,
          version: appData.version,
          url: appData.url
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca avaliações do app
   * @param {string} appId - ID do app
   * @param {number} num - Número de avaliações (padrão: 10)
   * @returns {Promise<Object>} Lista de avaliações
   */
  async getReviews(appId, num = 10) {
    try {
      await initGooglePlay();
      const reviews = await gplay.default.reviews({
        appId,
        sort: gplay.default.sort.NEWEST,
        num
      });

      return {
        success: true,
        data: reviews.map(review => ({
          id: review.id,
          userName: review.userName,
          userImage: review.userImage,
          score: review.score,
          date: review.date,
          text: review.text,
          replyDate: review.replyDate,
          replyText: review.replyText,
          thumbsUp: review.thumbsUp,
          version: review.version
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca dados completos do app (básicos + avaliações)
   * @param {string} appId - ID do app
   * @param {number} reviewsCount - Número de avaliações
   * @returns {Promise<Object>} Dados completos
   */
  async getCompleteData(appId, reviewsCount = 10) {
    try {
      const [appData, reviews] = await Promise.all([
        this.getAppData(appId),
        this.getReviews(appId, reviewsCount)
      ]);

      return {
        success: appData.success && reviews.success,
        data: {
          app: appData.data,
          reviews: reviews.data
        },
        errors: {
          app: appData.success ? null : appData.error,
          reviews: reviews.success ? null : reviews.error
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

/**
 * Scraper para Apple App Store
 */
class AppleAppStoreScraper {
  /**
   * Busca dados básicos do app
   * @param {number} appId - ID do app (ex: 1667555669)
   * @returns {Promise<Object>} Dados do app
   */
  async getAppData(appId) {
    try {
      const appData = await appstore.app({ id: appId });
      
      return {
        success: true,
        data: {
          id: appData.id,
          appId: appData.appId,
          title: appData.title,
          developer: appData.developer,
          developerId: appData.developerId,
          score: appData.score,
          reviews: appData.reviews,
          histogram: appData.histogram,
          price: appData.price,
          free: appData.free,
          currency: appData.currency,
          size: appData.size,
          version: appData.version,
          contentRating: appData.contentRating,
          genre: appData.genre,
          genreId: appData.genreId,
          icon: appData.icon,
          screenshots: appData.screenshots,
          description: appData.description,
          releaseDate: appData.releaseDate,
          updated: appData.updated,
          url: appData.url
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca avaliações do app
   * @param {number} appId - ID do app
   * @param {number} page - Página de avaliações (padrão: 1)
   * @returns {Promise<Object>} Lista de avaliações
   */
  async getReviews(appId, page = 1) {
    try {
      const reviews = await appstore.reviews({
        id: appId,
        sort: appstore.sort.RECENT,
        page
      });

      return {
        success: true,
        data: reviews.map(review => ({
          id: review.id,
          userName: review.userName,
          userUrl: review.userUrl,
          score: review.score,
          title: review.title,
          text: review.text,
          updated: review.updated,
          url: review.url,
          version: review.version
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca dados completos do app (básicos + avaliações)
   * @param {number} appId - ID do app
   * @param {number} reviewsPage - Página de avaliações
   * @returns {Promise<Object>} Dados completos
   */
  async getCompleteData(appId, reviewsPage = 1) {
    try {
      const [appData, reviews] = await Promise.all([
        this.getAppData(appId),
        this.getReviews(appId, reviewsPage)
      ]);

      return {
        success: appData.success && reviews.success,
        data: {
          app: appData.data,
          reviews: reviews.data
        },
        errors: {
          app: appData.success ? null : appData.error,
          reviews: reviews.success ? null : reviews.error
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

/**
 * Scraper híbrido que unifica ambas as lojas
 */
class HybridScraper {
  constructor() {
    this.googlePlay = new GooglePlayScraper();
    this.appleStore = new AppleAppStoreScraper();
  }

  /**
   * Busca dados de ambas as lojas
   * @param {Object} params - Parâmetros de busca
   * @param {string} params.googleAppId - ID do app no Google Play
   * @param {number} params.appleAppId - ID do app na Apple Store
   * @param {number} params.reviewsCount - Número de avaliações
   * @returns {Promise<Object>} Dados de ambas as lojas
   */
  async getBothStoresData(params) {
    const { googleAppId, appleAppId, reviewsCount = 10 } = params;
    
    const results = {
      googlePlay: null,
      appleStore: null,
      success: false,
      errors: {}
    };

    // Busca dados do Google Play se fornecido
    if (googleAppId) {
      try {
        results.googlePlay = await this.googlePlay.getCompleteData(googleAppId, reviewsCount);
      } catch (error) {
        results.errors.googlePlay = error.message;
      }
    }

    // Busca dados da Apple Store se fornecido
    if (appleAppId) {
      try {
        results.appleStore = await this.appleStore.getCompleteData(appleAppId, reviewsCount);
      } catch (error) {
        results.errors.appleStore = error.message;
      }
    }

    // Determina se houve sucesso geral
    results.success = (results.googlePlay?.success || results.appleStore?.success);

    return results;
  }

  /**
   * Busca dados de uma loja específica
   * @param {string} store - 'google' ou 'apple'
   * @param {string|number} appId - ID do app
   * @param {number} reviewsCount - Número de avaliações
   * @returns {Promise<Object>} Dados da loja
   */
  async getStoreData(store, appId, reviewsCount = 10) {
    if (store === 'google') {
      return await this.googlePlay.getCompleteData(appId, reviewsCount);
    } else if (store === 'apple') {
      return await this.appleStore.getCompleteData(appId, reviewsCount);
    } else {
      return {
        success: false,
        error: 'Store deve ser "google" ou "apple"'
      };
    }
  }
}

module.exports = {
  GooglePlayScraper,
  AppleAppStoreScraper,
  HybridScraper
};
