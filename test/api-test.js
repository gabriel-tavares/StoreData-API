const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Função para fazer requisições
async function makeRequest(endpoint, data = null) {
  try {
    const config = {
      method: data ? 'POST' : 'GET',
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { success: false, error: error.message };
  }
}

async function testHealthCheck() {
  console.log('🏥 Testando Health Check...');
  
  const result = await makeRequest('/health');
  
  if (result.success) {
    console.log('✅ Health Check OK');
    console.log(`   Status: ${result.status}`);
    console.log(`   Uptime: ${result.uptime}s`);
    console.log(`   Environment: ${result.environment}`);
  } else {
    console.log('❌ Health Check falhou:', result.error);
  }
  
  console.log('');
}

async function testGooglePlayScraping() {
  console.log('📱 Testando Google Play Scraping...');
  
  const testData = {
    googleAppId: 'br.com.icatuseguros.appicatu',
    reviewsCount: 5
  };
  
  const result = await makeRequest('/scrape', testData);
  
  if (result.success) {
    console.log('✅ Google Play Scraping OK');
    
    if (result.data.googlePlay) {
      const app = result.data.googlePlay.app;
      console.log(`   App: ${app.title}`);
      console.log(`   Desenvolvedor: ${app.developer}`);
      console.log(`   Nota: ${app.score}`);
      console.log(`   Total de avaliações: ${app.reviews}`);
      console.log(`   Histograma:`, app.histogram);
      console.log(`   Avaliações coletadas: ${result.data.googlePlay.reviews.length}`);
      
      // Mostrar primeira avaliação
      if (result.data.googlePlay.reviews.length > 0) {
        const firstReview = result.data.googlePlay.reviews[0];
        console.log(`   Primeira avaliação:`);
        console.log(`     Usuário: ${firstReview.userName}`);
        console.log(`     Nota: ${firstReview.score}⭐`);
        console.log(`     Data: ${firstReview.date}`);
        console.log(`     Texto: ${firstReview.text.substring(0, 100)}...`);
      }
    } else {
      console.log('   ⚠️ Dados do Google Play não encontrados');
    }
  } else {
    console.log('❌ Google Play Scraping falhou:', result.error);
  }
  
  console.log('');
}

async function testAppleAppStoreScraping() {
  console.log('🍎 Testando Apple App Store Scraping...');
  
  const testData = {
    appleAppId: 1667555669,
    reviewsCount: 5
  };
  
  const result = await makeRequest('/scrape', testData);
  
  if (result.success) {
    console.log('✅ Apple App Store Scraping OK');
    
    if (result.data.appleStore) {
      const app = result.data.appleStore.app;
      console.log(`   App: ${app.title}`);
      console.log(`   Desenvolvedor: ${app.developer}`);
      console.log(`   Nota: ${app.score}`);
      console.log(`   Total de avaliações: ${app.reviews}`);
      console.log(`   Histograma:`, app.histogram);
      console.log(`   Avaliações coletadas: ${result.data.appleStore.reviews.length}`);
      
      // Mostrar primeira avaliação
      if (result.data.appleStore.reviews.length > 0) {
        const firstReview = result.data.appleStore.reviews[0];
        console.log(`   Primeira avaliação:`);
        console.log(`     Usuário: ${firstReview.userName}`);
        console.log(`     Nota: ${firstReview.score}⭐`);
        console.log(`     Título: ${firstReview.title}`);
        console.log(`     Data: ${firstReview.date}`);
        console.log(`     Texto: ${firstReview.text.substring(0, 100)}...`);
      }
    } else {
      console.log('   ⚠️ Dados da Apple Store não encontrados');
    }
  } else {
    console.log('❌ Apple App Store Scraping falhou:', result.error);
  }
  
  console.log('');
}

async function testBothStoresScraping() {
  console.log('🌐 Testando Scraping de Ambas as Lojas...');
  
  const testData = {
    googleAppId: 'br.com.icatuseguros.appicatu',
    appleAppId: 1667555669,
    reviewsCount: 3
  };
  
  const result = await makeRequest('/scrape', testData);
  
  if (result.success) {
    console.log('✅ Scraping de Ambas as Lojas OK');
    
    if (result.data.googlePlay) {
      console.log(`   Google Play: ${result.data.googlePlay.app.title}`);
      console.log(`     Avaliações: ${result.data.googlePlay.reviews.length}`);
    }
    
    if (result.data.appleStore) {
      console.log(`   Apple Store: ${result.data.appleStore.app.title}`);
      console.log(`     Avaliações: ${result.data.appleStore.reviews.length}`);
    }
    
    if (Object.keys(result.errors).length > 0) {
      console.log('   ⚠️ Erros encontrados:', result.errors);
    }
  } else {
    console.log('❌ Scraping de Ambas as Lojas falhou:', result.error);
  }
  
  console.log('');
}

async function testSingleStoreScraping() {
  console.log('🎯 Testando Scraping de Loja Específica...');
  
  // Teste Google Play
  console.log('   Testando Google Play...');
  const googleResult = await makeRequest('/scrape/single', {
    store: 'google',
    appId: 'br.com.icatuseguros.appicatu',
    reviewsCount: 3
  });
  
  if (googleResult.success) {
    console.log(`     ✅ ${googleResult.data.app.title} - ${googleResult.data.reviews.length} avaliações`);
  } else {
    console.log(`     ❌ Erro: ${googleResult.error}`);
  }
  
  // Teste Apple Store
  console.log('   Testando Apple Store...');
  const appleResult = await makeRequest('/scrape/single', {
    store: 'apple',
    appId: 1667555669,
    reviewsCount: 3
  });
  
  if (appleResult.success) {
    console.log(`     ✅ ${appleResult.data.app.title} - ${appleResult.data.reviews.length} avaliações`);
  } else {
    console.log(`     ❌ Erro: ${appleResult.error}`);
  }
  
  console.log('');
}

async function testErrorHandling() {
  console.log('🚨 Testando Tratamento de Erros...');
  
  // Teste com parâmetros inválidos
  const invalidResult = await makeRequest('/scrape', {
    invalidParam: 'test'
  });
  
  if (!invalidResult.success) {
    console.log('✅ Validação de parâmetros funcionando');
    console.log(`   Erro: ${invalidResult.error}`);
  } else {
    console.log('❌ Validação de parâmetros não funcionou');
  }
  
  // Teste com app inexistente
  const notFoundResult = await makeRequest('/scrape/single', {
    store: 'google',
    appId: 'com.app.inexistente',
    reviewsCount: 1
  });
  
  if (!notFoundResult.success) {
    console.log('✅ Tratamento de app inexistente funcionando');
    console.log(`   Erro: ${notFoundResult.error}`);
  } else {
    console.log('❌ Tratamento de app inexistente não funcionou');
  }
  
  console.log('');
}

async function runAllTests() {
  console.log('🚀 Iniciando testes da API...\n');
  
  await testHealthCheck();
  await testGooglePlayScraping();
  await testAppleAppStoreScraping();
  await testBothStoresScraping();
  await testSingleStoreScraping();
  await testErrorHandling();
  
  console.log('✨ Todos os testes concluídos!');
}

// Executar testes se chamado diretamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testHealthCheck,
  testGooglePlayScraping,
  testAppleAppStoreScraping,
  testBothStoresScraping,
  testSingleStoreScraping,
  testErrorHandling,
  runAllTests
};
