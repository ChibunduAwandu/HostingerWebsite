export type OrderLevel = {
  price: number;
  volume: number;
};

const levelVolume = (tick: number, index: number, phaseShift: number) => {
  const wave =
    Math.sin((tick + index * 1.7) * 0.65 + phaseShift) * 0.5 +
    Math.cos((tick + index) * 0.23 + phaseShift) * 0.25 +
    0.5;

  return Math.max(0.16, wave + 0.24 + index * 0.03);
};

export const generateOrderBook = (tick: number, levels = 10) => {
  const bids: OrderLevel[] = Array.from({ length: levels }, (_, index) => ({
    price: 181.4 - index * 0.12,
    volume: levelVolume(tick, index, 0.7)
  }));

  const asks: OrderLevel[] = Array.from({ length: levels }, (_, index) => ({
    price: 181.56 + index * 0.12,
    volume: levelVolume(tick, index, 2.1)
  }));

  return { bids, asks };
};

export const strategyCards = [
  {
    id: 'kelly',
    title: 'Kelly Criterion Position Sizing',
    accent: '#00FF94',
    lines: ['Capital efficiency', 'Edge-aware allocation', 'Downside bounded']
  },
  {
    id: 'mean-reversion',
    title: 'Mean Reversion Strategy',
    accent: '#00D4FF',
    lines: ['Spread compression', 'Signal decay modeling', 'Risk throttling']
  },
  {
    id: 'momentum',
    title: 'Momentum + AdaBoost Predictor',
    accent: '#FF6B35',
    lines: ['Classifier-driven bias', 'Regime adaptation', 'Execution simulation']
  }
];
