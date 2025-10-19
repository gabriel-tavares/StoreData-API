const { GooglePlayScraper, AppleAppStoreScraper, HybridScraper } = require('../lib/scrapers');

// Apps de teste
const TEST_APPS = {
  google: 'br.com.icatuseguros.appicatu',
  apple: 1667555669
};

// Função para formatar logs
function logSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

function logSubSection(title) {
  console.log('\n' + '-'.repeat(40));
  console.log(`  ${title}`);
  console.log('-'.repeat(40));
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.log(`❌ ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logData(label, value) {
  console.log(`📊 ${label}: ${value}`);
}

async function testGooglePlayScraper() {
  logSection('TESTE GOOGLE PLAY SCRAPER');
  
  logInfo(`App ID: ${TEST_APPS.google}`);
  const scraper = new GooglePlayScraper();
  
  try {
    // Teste 1: Dados básicos do app
    logSubSection('DADOS BÁSICOS DO APP');
    const appData = await scraper.getAppData(TEST_APPS.google);
    
    if (appData.success) {
      logSuccess('Dados básicos obtidos com sucesso!');
      logData('Título', appData.data.title);
      logData('Desenvolvedor', appData.data.developer);
      logData('Nota geral', appData.data.score || 'N/A');
      logData('Total de avaliações', appData.data.reviews || 'N/A');
      logData('Histograma', JSON.stringify(appData.data.histogram));
      logData('Preço', `${appData.data.price} ${appData.data.currency}`);
      logData('Gratuito', appData.data.free);
      logData('Tamanho', appData.data.size || 'N/A');
      logData('Versão Android', appData.data.androidVersion || 'N/A');
      logData('Gênero', appData.data.genre);
    } else {
      logError(`Erro ao obter dados básicos: ${appData.error}`);
    }

    // Teste 2: Avaliações
    logSubSection('AVALIAÇÕES');
    const reviews = await scraper.getReviews(TEST_APPS.google, 5);
    
    if (reviews.success) {
      logSuccess(`Avaliações obtidas com sucesso!`);
      logData('Quantidade coletada', reviews.data.length);
      
      reviews.data.forEach((review, index) => {
        console.log(`\n📝 Avaliação ${index + 1}:`);
        logData('Usuário', review.userName);
        logData('Nota', `${review.score}⭐`);
        logData('Data', review.date);
        logData('Avaliação', review.text.substring(0, 100) + '...');
        if (review.replyText) {
          logData('Resposta dev', review.replyText.substring(0, 100) + '...');
        }
      });
    } else {
      logError(`Erro ao obter avaliações: ${reviews.error}`);
    }

    // Teste 3: Dados completos
    logSubSection('DADOS COMPLETOS');
    const completeData = await scraper.getCompleteData(TEST_APPS.google, 3);
    
    if (completeData.success) {
      logSuccess('Dados completos obtidos com sucesso!');
      logData('App', completeData.data.app.title);
      logData('Avaliações coletadas', completeData.data.reviews.length);
    } else {
      logError(`Erro ao obter dados completos: ${completeData.error}`);
    }

  } catch (error) {
    logError(`Erro geral no teste Google Play: ${error.message}`);
  }
}

async function testAppleAppStoreScraper() {
  logSection('TESTE APPLE APP STORE SCRAPER');
  
  logInfo(`App ID: ${TEST_APPS.apple}`);
  const scraper = new AppleAppStoreScraper();
  
  try {
    // Teste 1: Dados básicos do app
    logSubSection('DADOS BÁSICOS DO APP');
    const appData = await scraper.getAppData(TEST_APPS.apple);
    
    if (appData.success) {
      logSuccess('Dados básicos obtidos com sucesso!');
      logData('Título', appData.data.title);
      logData('Desenvolvedor', appData.data.developer);
      logData('Nota geral', appData.data.score);
      logData('Total de avaliações', appData.data.reviews);
      logData('Histograma', JSON.stringify(appData.data.histogram));
      logData('Preço', `${appData.data.price} ${appData.data.currency}`);
      logData('Gratuito', appData.data.free);
      logData('Tamanho', appData.data.size);
      logData('Versão', appData.data.version);
      logData('Gênero', appData.data.genre);
    } else {
      logError(`Erro ao obter dados básicos: ${appData.error}`);
    }

    // Teste 2: Avaliações
    logSubSection('AVALIAÇÕES');
    const reviews = await scraper.getReviews(TEST_APPS.apple, 1);
    
    if (reviews.success) {
      logSuccess(`Avaliações obtidas com sucesso!`);
      logData('Quantidade coletada', reviews.data.length);
      
      reviews.data.forEach((review, index) => {
        console.log(`\n📝 Avaliação ${index + 1}:`);
        logData('Usuário', review.userName);
        logData('Nota', `${review.score}⭐`);
        logData('Título', review.title);
        logData('Data', review.updated);
        logData('Avaliação', review.text.substring(0, 100) + '...');
      });
    } else {
      logError(`Erro ao obter avaliações: ${reviews.error}`);
    }

    // Teste 3: Dados completos
    logSubSection('DADOS COMPLETOS');
    const completeData = await scraper.getCompleteData(TEST_APPS.apple, 1);
    
    if (completeData.success) {
      logSuccess('Dados completos obtidos com sucesso!');
      logData('App', completeData.data.app.title);
      logData('Avaliações coletadas', completeData.data.reviews.length);
    } else {
      logError(`Erro ao obter dados completos: ${completeData.error}`);
    }

  } catch (error) {
    logError(`Erro geral no teste Apple App Store: ${error.message}`);
  }
}

async function testHybridScraper() {
  logSection('TESTE SCRAPER HÍBRIDO');
  
  const scraper = new HybridScraper();
  
  try {
    // Teste: Buscar dados de ambas as lojas
    logSubSection('BUSCA EM AMBAS AS LOJAS');
    const bothStoresData = await scraper.getBothStoresData({
      googleAppId: TEST_APPS.google,
      appleAppId: TEST_APPS.apple,
      reviewsCount: 3
    });
    
    logData('Sucesso geral', bothStoresData.success);
    
    if (bothStoresData.googlePlay) {
      if (bothStoresData.googlePlay.success) {
        logSuccess(`Google Play: ${bothStoresData.googlePlay.data.app.title}`);
        logData('Avaliações', bothStoresData.googlePlay.data.reviews.length);
      } else {
        logError(`Google Play: ${bothStoresData.googlePlay.error}`);
      }
    }
    
    if (bothStoresData.appleStore) {
      if (bothStoresData.appleStore.success) {
        logSuccess(`Apple Store: ${bothStoresData.appleStore.data.app.title}`);
        logData('Avaliações', bothStoresData.appleStore.data.reviews.length);
      } else {
        logError(`Apple Store: ${bothStoresData.appleStore.error}`);
      }
    }
    
    if (Object.keys(bothStoresData.errors).length > 0) {
      logError('Erros encontrados:');
      Object.entries(bothStoresData.errors).forEach(([store, error]) => {
        console.log(`   ${store}: ${error}`);
      });
    }

  } catch (error) {
    logError(`Erro geral no teste híbrido: ${error.message}`);
  }
}

async function runAllTests() {
  console.log('🚀 TESTE FINAL DOS SCRAPERS');
  console.log(`📅 Data: ${new Date().toLocaleString('pt-BR')}`);
  console.log(`🖥️  Sistema: ${process.platform} ${process.arch}`);
  console.log(`📦 Node.js: ${process.version}`);
  
  await testGooglePlayScraper();
  await testAppleAppStoreScraper();
  await testHybridScraper();
  
  logSection('TESTES CONCLUÍDOS');
  logSuccess('Todos os testes foram executados!');
  console.log('\n' + '='.repeat(60));
}

// Executar testes se chamado diretamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testGooglePlayScraper,
  testAppleAppStoreScraper,
  testHybridScraper,
  runAllTests
};
