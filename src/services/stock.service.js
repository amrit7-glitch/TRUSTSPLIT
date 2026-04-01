const BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart";

export const getStockPrice = async (symbol) => {
    try {
        const response = await fetch(`${BASE_URL}/${symbol}?interval=1d&range=1d`);
        const data = await response.json();

        const meta = data.chart.result[0].meta;

        return {
            symbol,
            companyName: meta.longName || meta.shortName || symbol,
            currentPrice: meta.regularMarketPrice,
            previousClose: meta.chartPreviousClose,
            change: meta.regularMarketPrice - meta.chartPreviousClose,
            changePercent: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose * 100).toFixed(2),
            currency: meta.currency,
            exchange: meta.exchangeName,
        };
    } catch (error) {
        throw new Error(`Failed to fetch stock price for ${symbol}`);
    }
};

export const searchStocks = async (query) => {
    try {
        const response = await fetch(
            `https://query1.finance.yahoo.com/v1/finance/search?q=${query}&newsCount=0&enableFuzzyQuery=false`
        );
        const data = await response.json();

        // filter only NSE stocks
        const stocks = data.quotes
            .filter(q => q.exchange === "NSI" || q.symbol.endsWith(".NS"))
            .map(q => ({
                symbol: q.symbol,
                companyName: q.longname || q.shortname,
                exchange: q.exchange,
                type: q.quoteType
            }));

        return stocks;
    } catch (error) {
        throw new Error("Failed to search stocks");
    }
};