const express = require('express');
const { HybridScraper } = require('../lib/scrapers');
const Joi = require('joi');

const router = express.Router();
const scraper = new HybridScraper();

// Schemas de validação
const scrapeSchema = Joi.object({
  googleAppId: Joi.string().optional(),
  appleAppId: Joi.number().integer().positive().optional(),
  reviewsCount: Joi.number().integer().min(1).max(50).default(10),
  country: Joi.string().length(2).default('br')
}).or('googleAppId', 'appleAppId');

const singleStoreSchema = Joi.object({
  store: Joi.string().valid('google', 'apple').required(),
  appId: Joi.alternatives().try(
    Joi.string().when('store', { is: 'google', then: Joi.required() }),
    Joi.number().integer().positive().when('store', { is: 'apple', then: Joi.required() })
  ).required(),
  reviewsCount: Joi.number().integer().min(1).max(50).default(10),
  country: Joi.string().length(2).default('br')
});

// Schema para endpoints específicos
const specificEndpointSchema = Joi.object({
  store: Joi.string().valid('google', 'apple').required(),
  appId: Joi.alternatives().try(
    Joi.string().when('store', { is: 'google', then: Joi.required() }),
    Joi.number().integer().positive().when('store', { is: 'apple', then: Joi.required() })
  ).required(),
  country: Joi.string().length(2).default('br'),
  reviewsCount: Joi.number().integer().min(1).max(100000).default(10)
});

/**
 * GET /api/app-data/:store/:appId
 * Busca apenas dados básicos do app (sem avaliações)
 */
router.get('/app-data/:store/:appId', async (req, res) => {
  try {
    const { store, appId } = req.params;
    const { country = 'br' } = req.query;

    // Validar entrada
    const { error, value } = specificEndpointSchema.validate({
      store,
      appId: store === 'google' ? appId : parseInt(appId),
      country
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros inválidos',
        details: error.details.map(d => d.message)
      });
    }

    // Buscar apenas dados básicos
    let result;
    if (value.store === 'google') {
      result = await scraper.googlePlay.getAppData(value.appId, value.country);
    } else {
      result = await scraper.appleStore.getAppData(value.appId, value.country);
    }

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Erro ao buscar dados básicos',
        message: result.error
      });
    }

    // Preparar resposta
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      store: value.store,
      appId: value.appId,
      country: value.country,
      data: {
        id: result.data.id,
        title: result.data.title,
        developer: result.data.developer,
        score: result.data.score,
        reviews: result.data.reviews,
        histogram: result.data.histogram,
        price: result.data.price,
        free: result.data.free,
        currency: result.data.currency,
        size: result.data.size,
        version: result.data.version,
        genre: result.data.genre,
        icon: result.data.icon,
        screenshots: result.data.screenshots,
        description: result.data.description,
        releaseDate: result.data.releaseDate,
        updated: result.data.updated,
        url: result.data.url
      }
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Erro no endpoint de dados básicos:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

/**
 * GET /api/reviews/:store/:appId
 * Busca apenas avaliações do app (sem dados básicos)
 */
router.get('/reviews/:store/:appId', async (req, res) => {
  try {
    const { store, appId } = req.params;
    const { country = 'br', reviewsCount = 10 } = req.query;

    // Validar entrada
    const { error, value } = specificEndpointSchema.validate({
      store,
      appId: store === 'google' ? appId : parseInt(appId),
      country,
      reviewsCount: parseInt(reviewsCount)
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros inválidos',
        details: error.details.map(d => d.message)
      });
    }

    // Buscar apenas avaliações
    let result;
    if (value.store === 'google') {
      result = await scraper.googlePlay.getReviews(value.appId, value.reviewsCount, value.country);
    } else {
      // Para Apple, sempre usar método com respostas do desenvolvedor
      result = await scraper.appleStore.getReviewsWithReplies(value.appId, value.country);
    }

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Erro ao buscar avaliações',
        message: result.error
      });
    }

    // Preparar resposta
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      store: value.store,
      appId: value.appId,
      country: value.country,
      reviewsCount: value.reviewsCount,
      actualCount: result.data.length,
      data: result.data.map(review => ({
        id: review.id,
        userName: review.userName,
        score: review.score,
        date: review.date || review.updated,
        text: review.text,
        title: review.title || null,
        replyText: review.replyText || null,
        replyDate: review.replyDate || null,
        version: review.version,
        thumbsUp: review.thumbsUp || null
      }))
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Erro no endpoint de avaliações:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

/**
 * GET /api/complete/:store/:appId
 * Busca dados completos (básicos + avaliações) - método atual
 */
router.get('/complete/:store/:appId', async (req, res) => {
  try {
    const { store, appId } = req.params;
    const { country = 'br', reviewsCount = 10 } = req.query;

    // Validar entrada
    const { error, value } = specificEndpointSchema.validate({
      store,
      appId: store === 'google' ? appId : parseInt(appId),
      country,
      reviewsCount: parseInt(reviewsCount)
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros inválidos',
        details: error.details.map(d => d.message)
      });
    }

    // Buscar dados completos
    const result = await scraper.getStoreData(value.store, value.appId, value.reviewsCount, value.country);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Erro ao buscar dados completos',
        message: result.error
      });
    }

    // Preparar resposta
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      store: value.store,
      appId: value.appId,
      country: value.country,
      reviewsCount: value.reviewsCount,
      data: {
        app: {
          id: result.data.app.id,
          title: result.data.app.title,
          developer: result.data.app.developer,
          score: result.data.app.score,
          reviews: result.data.app.reviews,
          histogram: result.data.app.histogram,
          price: result.data.app.price,
          free: result.data.app.free,
          currency: result.data.app.currency,
          size: result.data.app.size,
          version: result.data.app.version,
          genre: result.data.app.genre,
          icon: result.data.app.icon,
          screenshots: result.data.app.screenshots,
          description: result.data.app.description,
          releaseDate: result.data.app.releaseDate,
          updated: result.data.app.updated,
          url: result.data.app.url
        },
        reviews: result.data.reviews.map(review => ({
          id: review.id,
          userName: review.userName,
          score: review.score,
          date: review.date || review.updated,
          text: review.text,
          title: review.title || null,
          replyText: review.replyText || null,
          replyDate: review.replyDate || null,
          version: review.version,
          thumbsUp: review.thumbsUp || null
        }))
      }
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Erro no endpoint de dados completos:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

/**
 * POST /api/scrape
 * Busca dados de ambas as lojas ou uma específica (método original)
 */
router.post('/', async (req, res) => {
  try {
    const { googleAppId, appleAppId, reviewsCount, country } = req.body;

    // Validar entrada
    const { error, value } = scrapeSchema.validate({
      googleAppId,
      appleAppId,
      reviewsCount,
      country
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros inválidos',
        details: error.details.map(d => d.message)
      });
    }

    // Buscar dados
    const result = await scraper.getBothStoresData(value);

    // Preparar resposta
    const response = {
      success: result.success,
      timestamp: new Date().toISOString(),
      data: {
        googlePlay: result.googlePlay?.success ? {
          app: {
            id: result.googlePlay.data.app.id,
            title: result.googlePlay.data.app.title,
            developer: result.googlePlay.data.app.developer,
            score: result.googlePlay.data.app.score,
            reviews: result.googlePlay.data.app.reviews,
            histogram: result.googlePlay.data.app.histogram,
            price: result.googlePlay.data.app.price,
            free: result.googlePlay.data.app.free,
            currency: result.googlePlay.data.app.currency,
            size: result.googlePlay.data.app.size,
            version: result.googlePlay.data.app.version,
            genre: result.googlePlay.data.app.genre,
            icon: result.googlePlay.data.app.icon,
            screenshots: result.googlePlay.data.app.screenshots,
            description: result.googlePlay.data.app.description,
            releaseDate: result.googlePlay.data.app.releaseDate,
            updated: result.googlePlay.data.app.updated,
            url: result.googlePlay.data.app.url
          },
          reviews: result.googlePlay.data.reviews.map(review => ({
            id: review.id,
            userName: review.userName,
            score: review.score,
            date: review.date,
            text: review.text,
            replyText: review.replyText,
            replyDate: review.replyDate,
            version: review.version,
            thumbsUp: review.thumbsUp
          }))
        } : null,
        appleStore: result.appleStore?.success ? {
          app: {
            id: result.appleStore.data.app.id,
            appId: result.appleStore.data.app.appId,
            title: result.appleStore.data.app.title,
            developer: result.appleStore.data.app.developer,
            score: result.appleStore.data.app.score,
            reviews: result.appleStore.data.app.reviews,
            histogram: result.appleStore.data.app.histogram,
            price: result.appleStore.data.app.price,
            free: result.appleStore.data.app.free,
            currency: result.appleStore.data.app.currency,
            size: result.appleStore.data.app.size,
            version: result.appleStore.data.app.version,
            genre: result.appleStore.data.app.genre,
            icon: result.appleStore.data.app.icon,
            screenshots: result.appleStore.data.app.screenshots,
            description: result.appleStore.data.app.description,
            releaseDate: result.appleStore.data.app.releaseDate,
            updated: result.appleStore.data.app.updated,
            url: result.appleStore.data.app.url
          },
          reviews: result.appleStore.data.reviews.map(review => ({
            id: review.id,
            userName: review.userName,
            score: review.score,
            title: review.title,
            text: review.text,
            updated: review.updated,
            version: review.version,
            replyText: review.replyText,
            replyDate: review.replyDate
          }))
        } : null
      },
      errors: result.errors
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Erro no endpoint de scraping:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

/**
 * POST /api/scrape/single
 * Busca dados de uma loja específica (método original)
 */
router.post('/single', async (req, res) => {
  try {
    const { store, appId, reviewsCount, country } = req.body;

    // Validar entrada
    const { error, value } = singleStoreSchema.validate({
      store,
      appId,
      reviewsCount,
      country
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros inválidos',
        details: error.details.map(d => d.message)
      });
    }

    // Buscar dados da loja específica
    const result = await scraper.getStoreData(value.store, value.appId, value.reviewsCount, value.country);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Erro ao buscar dados',
        message: result.error
      });
    }

    // Preparar resposta
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      store: value.store,
      data: {
        app: {
          id: result.data.app.id,
          title: result.data.app.title,
          developer: result.data.app.developer,
          score: result.data.app.score,
          reviews: result.data.app.reviews,
          histogram: result.data.app.histogram,
          price: result.data.app.price,
          free: result.data.app.free,
          currency: result.data.app.currency,
          size: result.data.app.size,
          version: result.data.app.version,
          genre: result.data.app.genre,
          icon: result.data.app.icon,
          screenshots: result.data.app.screenshots,
          description: result.data.app.description,
          releaseDate: result.data.app.releaseDate,
          updated: result.data.app.updated,
          url: result.data.app.url
        },
        reviews: result.data.reviews.map(review => ({
          id: review.id,
          userName: review.userName,
          score: review.score,
          date: review.date || review.updated,
          text: review.text,
          title: review.title || null,
          replyText: review.replyText || null,
          replyDate: review.replyDate || null,
          version: review.version,
          thumbsUp: review.thumbsUp || null
        }))
      }
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Erro no endpoint de scraping single:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

module.exports = router;