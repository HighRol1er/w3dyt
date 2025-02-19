import axios from 'axios';
import * as cheerio from 'cheerio';
import { GOOGLE_FINANCE_URL } from '../src/common/constants/google-finance';

async function testExchangeRate() {
  try {
    console.log('Fetching USD/KRW rate...');
    const { data } = await axios.get(GOOGLE_FINANCE_URL.USD_KRW, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);
    const rateText = $('.YMlKec.fxKbKc').text();
    const rate = parseFloat(rateText.replace(/,/g, ''));

    if (isNaN(rate)) {
      console.error('Invalid rate format');
      return;
    }

    console.log('USD/KRW Rate:', rate);
    console.log('Raw text:', rateText);

    // 데이터 구조 확인을 위한 HTML 저장
    console.log('HTML Structure:', $('.YMlKec.fxKbKc').parent().html());
  } catch (error) {
    console.error('Error fetching rate:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testExchangeRate();
