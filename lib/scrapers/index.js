// Usar google-play-scraper-ts que funciona melhor
const gplayTS = require('google-play-scraper-ts');
const appstore = require('app-store-scraper');
const puppeteer = require('puppeteer');

/**
 * Scraper para Google Play Store
 */
class GooglePlayScraper {
  /**
   * Busca dados básicos do app
   * @param {string} appId - ID do app (ex: br.com.icatuseguros.appicatu)
   * @param {string} country - País (ex: 'br', 'us', 'mx')
   * @returns {Promise<Object>} Dados do app
   */
  async getAppData(appId, country = 'br') {
    try {
      // Usar google-play-scraper-ts que funciona melhor
      const appData = await gplayTS.default.app({ 
        appId,
        country,
        lang: country === 'br' ? 'pt' : 'en'
      });
      
      // Calcular total de avaliações somando o histograma
      const histogram = appData.histogram || {};
      const totalReviews = Object.values(histogram).reduce((sum, count) => sum + count, 0);
      
      return {
        success: true,
        data: {
          id: appData.appId,
          title: appData.title,
          developer: appData.developer,
          score: appData.score,
          reviews: totalReviews, // Usar soma do histograma
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
   * @param {string} country - País (ex: 'br', 'us', 'mx')
   * @returns {Promise<Object>} Lista de avaliações
   */
  async getReviews(appId, num = 10, country = 'br') {
    try {
      // Usar google-play-scraper-ts que funciona melhor
      const reviewsResponse = await gplayTS.default.reviews({
        appId,
        sort: gplayTS.default.sort.NEWEST,
        num,
        country,
        lang: country === 'br' ? 'pt' : 'en'
      });

      // As reviews vêm em um objeto com 'data' e 'nextPaginationToken'
      const reviews = reviewsResponse.data || reviewsResponse;

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
   * @param {string} country - País (ex: 'br', 'us', 'mx')
   * @returns {Promise<Object>} Dados completos
   */
  async getCompleteData(appId, reviewsCount = 10, country = 'br') {
    try {
      const [appData, reviews] = await Promise.all([
        this.getAppData(appId, country),
        this.getReviews(appId, reviewsCount, country)
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
   * @param {string} country - País (ex: 'br', 'us', 'mx')
   * @returns {Promise<Object>} Dados do app
   */
  async getAppData(appId, country = 'br') {
    try {
      const appData = await appstore.app({ 
        id: appId,
        country
      });
      
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
   * @param {string} country - País (ex: 'br', 'us', 'mx')
   * @returns {Promise<Object>} Lista de avaliações
   */
  async getReviews(appId, page = 1, country = 'br') {
    try {
      // Usar método que funciona com múltiplas tentativas
      let reviews = [];
      
      try {
        reviews = await appstore.reviews({
          id: appId,
          sort: appstore.sort.RECENT,
          page,
          country
        });
      } catch (error) {
        // Tentar método alternativo se o primeiro falhar
        try {
          reviews = await appstore.reviews({
            id: appId,
            sort: appstore.sort.HELPFUL,
            page
          });
        } catch (error2) {
          throw error2;
        }
      }

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
          version: review.version,
          replyText: null, // app-store-scraper não suporta respostas
          replyDate: null
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
   * Busca avaliações com respostas do desenvolvedor usando Puppeteer
   * @param {number} appId - ID do app
   * @param {string} country - País (ex: 'br', 'us', 'mx')
   * @returns {Promise<Object>} Lista de avaliações com respostas
   */
  async getReviewsWithReplies(appId, country = 'br') {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true, // Executar em background
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Configurar user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      const url = `https://apps.apple.com/${country}/app/icatu/id${appId}`;
      
      await page.goto(url, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Fazer scroll para carregar mais reviews
      console.log('🔄 Fazendo scroll para carregar mais reviews...');
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Tentar clicar em "Ver mais reviews" se existir
      try {
        const seeMoreButton = await page.$('button[aria-label*="Ver mais"], button[aria-label*="See more"], .we-customer-reviews__see-all');
        if (seeMoreButton) {
          console.log('🔄 Clicando em "Ver mais reviews"...');
          await seeMoreButton.click();
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } catch (error) {
        console.log('ℹ️ Botão "Ver mais" não encontrado ou erro ao clicar:', error.message);
      }
      
      // Extrair avaliações com respostas do desenvolvedor
      const reviewsWithReplies = await page.evaluate(() => {
        const reviews = [];
        
        // Procurar por elementos com classe we-customer-review
        const reviewElements = document.querySelectorAll('.we-customer-review');
        
        reviewElements.forEach((reviewEl, index) => {
          try {
            // Extrair nome do usuário
            const userNameEl = reviewEl.querySelector('.we-customer-review__user');
            const userName = userNameEl ? userNameEl.textContent.trim() : '';
            
            // Extrair data
            const dateEl = reviewEl.querySelector('.we-customer-review__date');
            const date = dateEl ? dateEl.textContent.trim() : '';
            
            // Extrair título
            const titleEl = reviewEl.querySelector('.we-customer-review__title');
            const title = titleEl ? titleEl.textContent.trim() : '';
            
            // Extrair texto da avaliação
            const reviewBodyEl = reviewEl.querySelector('.we-customer-review__body');
            let reviewText = '';
            if (reviewBodyEl) {
              const pEl = reviewBodyEl.querySelector('p');
              reviewText = pEl ? pEl.textContent.trim() : '';
            }
            
            // Extrair resposta do desenvolvedor
            let developerReply = '';
            const responseHeaderEl = reviewEl.querySelector('.we-customer-review__header--response');
            if (responseHeaderEl) {
              // Procurar pelo próximo elemento que contenha a resposta
              const responseBodyEl = reviewEl.querySelector('.we-customer-review__body:last-of-type');
              if (responseBodyEl) {
                const responsePEl = responseBodyEl.querySelector('p');
                developerReply = responsePEl ? responsePEl.textContent.trim() : '';
              }
            }
            
            // Extrair nota (estrelas)
            const ratingEl = reviewEl.querySelector('.we-star-rating');
            let rating = 0;
            if (ratingEl) {
              const ariaLabel = ratingEl.getAttribute('aria-label');
              if (ariaLabel) {
                const match = ariaLabel.match(/(\d+) de 5/);
                if (match) {
                  rating = parseInt(match[1]);
                }
              }
            }
            
            if (userName && reviewText) {
              reviews.push({
                id: `review-${index + 1}`,
                userName: userName,
                score: rating,
                title: title,
                text: reviewText,
                updated: date,
                version: null,
                replyText: developerReply,
                replyDate: null
              });
            }
            
          } catch (error) {
            console.log(`Erro ao processar avaliação ${index + 1}: ${error.message}`);
          }
        });
        
        return reviews;
      });
      
      return {
        success: true,
        data: reviewsWithReplies
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Busca dados completos do app (básicos + avaliações)
   * @param {number} appId - ID do app
   * @param {number} reviewsPage - Página de avaliações
   * @param {string} country - País (ex: 'br', 'us', 'mx')
   * @returns {Promise<Object>} Dados completos
   */
  async getCompleteData(appId, reviewsPage = 1, country = 'br') {
    try {
      const [appData, reviews] = await Promise.all([
        this.getAppData(appId, country),
        this.getReviewsWithReplies(appId, country) // Sempre usar método com respostas
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
   * @param {string} params.country - País (ex: 'br', 'us', 'mx')
   * @returns {Promise<Object>} Dados de ambas as lojas
   */
  async getBothStoresData(params) {
    const { googleAppId, appleAppId, reviewsCount = 10, country = 'br' } = params;
    
    const results = {
      googlePlay: null,
      appleStore: null,
      success: false,
      errors: {}
    };

    // Busca dados do Google Play se fornecido
    if (googleAppId) {
      try {
        results.googlePlay = await this.googlePlay.getCompleteData(googleAppId, reviewsCount, country);
      } catch (error) {
        results.errors.googlePlay = error.message;
      }
    }

    // Busca dados da Apple Store se fornecido
    if (appleAppId) {
      try {
        results.appleStore = await this.appleStore.getCompleteData(appleAppId, reviewsCount, country);
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
   * @param {string} country - País (ex: 'br', 'us', 'mx')
   * @returns {Promise<Object>} Dados da loja
   */
  async getStoreData(store, appId, reviewsCount = 10, country = 'br') {
    if (store === 'google') {
      return await this.googlePlay.getCompleteData(appId, reviewsCount, country);
    } else if (store === 'apple') {
      return await this.appleStore.getCompleteData(appId, reviewsCount, country);
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
