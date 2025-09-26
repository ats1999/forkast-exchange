CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO
    "User" (email, name, "createdAt", password)
VALUES
    (
        'alice@example.com',
        'Alice Johnson',
        CURRENT_TIMESTAMP,
        crypt ('alice@example.com', gen_salt ('bf'))
    ),
    (
        'bob@example.com',
        'Bob Smith',
        CURRENT_TIMESTAMP,
        crypt ('bob@example.com', gen_salt ('bf'))
    ),
    (
        'carol@example.com',
        'Carol White',
        CURRENT_TIMESTAMP,
        crypt ('carol@example.com', gen_salt ('bf'))
    ),
    (
        'david@example.com',
        'David Brown',
        CURRENT_TIMESTAMP,
        crypt ('david@example.com', gen_salt ('bf'))
    ),
    (
        'eve@example.com',
        'Eve Davis',
        CURRENT_TIMESTAMP,
        crypt ('eve@example.com', gen_salt ('bf'))
    ),
    (
        'frank@example.com',
        'Frank Wilson',
        CURRENT_TIMESTAMP,
        crypt ('frank@example.com', gen_salt ('bf'))
    ),
    (
        'grace@example.com',
        'Grace Lee',
        CURRENT_TIMESTAMP,
        crypt ('grace@example.com', gen_salt ('bf'))
    ),
    (
        'hank@example.com',
        'Hank Taylor',
        CURRENT_TIMESTAMP,
        crypt ('hank@example.com', gen_salt ('bf'))
    ),
    (
        'irene@example.com',
        'Irene Anderson',
        CURRENT_TIMESTAMP,
        crypt ('irene@example.com', gen_salt ('bf'))
    ),
    (
        'jack@example.com',
        'Jack Thomas',
        CURRENT_TIMESTAMP,
        crypt ('jack@example.com', gen_salt ('bf'))
    );

INSERT INTO
    "Symbol" (
        symbol,
        name,
        market,
        currency,
        "createdAt",
        "updatedAt"
    )
VALUES
    (
        'AAPL',
        'Apple Inc.',
        'NASDAQ',
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'GOOGL',
        'Alphabet Inc.',
        'NASDAQ',
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'TSLA',
        'Tesla Inc.',
        'NASDAQ',
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'AMZN',
        'Amazon.com Inc.',
        'NASDAQ',
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'MSFT',
        'Microsoft Corp.',
        'NASDAQ',
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'BTCUSD',
        'Bitcoin/USD',
        'CRYPTO',
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'ETHUSD',
        'Ethereum/USD',
        'CRYPTO',
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'EURUSD',
        'Euro/US Dollar',
        'FOREX',
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'USDJPY',
        'US Dollar/Japanese Yen',
        'FOREX',
        'JPY',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'XAUUSD',
        'Gold/USD',
        'COMMODITY',
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );