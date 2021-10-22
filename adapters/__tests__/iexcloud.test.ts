import nock from 'nock'
import iexcloud from '../src/iexcloud'
import BigNumber from 'bignumber.js'

afterEach(() => {
  jest.clearAllMocks()
  nock.cleanAll()
})

it('should fetch price from iexcloud', async () => {
  nock('https://cloud.iexapis.com')
    .get('/stable/tops?symbols=FB&token=API_TOKEN')
    .reply(200, function (_) {
      return `[
          {
            "symbol": "FB",
            "bidSize": 200,
            "bidPrice": 120.8,
            "askSize": 100,
            "askPrice": 122.5,
            "volume": 205208,
            "lastSalePrice": 121.41,
            "lastSaleSize": 100,
            "lastSaleTime": 1480446908666,
            "lastUpdated": 1480446923942,
            "sector": "softwareservices",
            "securityType": "commonstock"
          }
        ]`
    })

  const prices = await iexcloud(['FB'], 'API_TOKEN')
  expect(prices[0].token).toStrictEqual('FB')
  expect(prices[0].currency).toStrictEqual('USD')
  expect(prices[0].amount).toStrictEqual(new BigNumber(121.41))
  expect(prices[0].timestamp).toStrictEqual(new BigNumber(1480446908666))
})

it('should fetch multiple prices from iexcloud', async () => {
  nock('https://cloud.iexapis.com')
    .get('/stable/tops?symbols=TSLA,AAPL,FB&token=API_TOKEN')
    .reply(200, function (_) {
      return `[
          {
            "symbol":"TSLA",
            "sector":"consumerdurables",
            "securityType":"cs",
            "bidPrice":0,
            "bidSize":0,
            "askPrice":0,
            "askSize":0,
            "lastUpdated":1623096987115,
            "lastSalePrice":605.14,
            "lastSaleSize":10,
            "lastSaleTime":1623095998146,
            "volume":480662
          },
          {
            "symbol":"AAPL",
            "sector":"electronictechnology",
            "securityType":"cs",
            "bidPrice":0,
            "bidSize":0,
            "askPrice":0,
            "askSize":0,
            "lastUpdated":1623099600004,
            "lastSalePrice":126,
            "lastSaleSize":100,
            "lastSaleTime":1623097192802,
            "volume":1401779
          },
          {
            "symbol":"FB",
            "sector":"technologyservices",
            "securityType":"cs",
            "bidPrice":0,
            "bidSize":0,
            "askPrice":0,
            "askSize":0,
            "lastUpdated":1623097044336,
            "lastSalePrice":336.59,
            "lastSaleSize":15,
            "lastSaleTime":1623095999551,
            "volume":598873
          }
        ]`
    })

  const prices = await iexcloud(['TSLA', 'AAPL', 'FB'], 'API_TOKEN')
  expect(prices[0].token).toStrictEqual('TSLA')
  expect(prices[0].amount).toStrictEqual(new BigNumber(605.14))
  expect(prices[0].timestamp).toStrictEqual(new BigNumber(1623095998146))
  expect(prices[1].token).toStrictEqual('AAPL')
  expect(prices[1].amount).toStrictEqual(new BigNumber(126))
  expect(prices[1].timestamp).toStrictEqual(new BigNumber(1623097192802))
  expect(prices[2].token).toStrictEqual('FB')
  expect(prices[2].amount).toStrictEqual(new BigNumber(336.59))
  expect(prices[2].timestamp).toStrictEqual(new BigNumber(1623095999551))
})