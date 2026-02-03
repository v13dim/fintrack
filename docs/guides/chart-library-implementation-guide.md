# Chart Library Implementation Guide

This guide provides detailed implementation instructions for Victory Native charts in FinTrack. For the decision rationale, see [ADR-006: Chart Library Selection](../adr/ADR-006-chart-library-selection.md).

## Table of Contents

- [Installation](#installation)
- [Basic Pie Chart](#basic-pie-chart)
- [Line Chart for Trends](#line-chart-for-trends)
- [Custom Chart Component](#custom-chart-component)
- [Usage Example](#usage-example)
- [Best Practices](#best-practices)

## Installation

Victory Native requires several peer dependencies for full functionality:

```bash
npm install victory-native react-native-svg react-native-reanimated react-native-gesture-handler @shopify/react-native-skia react-native-worklets
# or
yarn add victory-native react-native-svg react-native-reanimated react-native-gesture-handler @shopify/react-native-skia react-native-worklets
```

**Peer Dependencies**:

- `react-native-svg` - Required for rendering SVG graphics
- `react-native-reanimated` - Required for animations (version 4.x for React Native 0.83+)
- `react-native-gesture-handler` - Required for gesture handling
- `@shopify/react-native-skia` - Required for high-performance rendering
- `react-native-worklets` - Required by react-native-reanimated for worklet support

**Important Setup Steps**:

1. **For iOS**, run pod install:

```bash
cd ios && pod install
```

2. **Configure Babel** - Add Reanimated plugin to `babel.config.js` (must be last):

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // ... other plugins
    'react-native-reanimated/plugin', // Must be last
  ],
};
```

3. **Import Gesture Handler** - Add to the top of `index.js`:

```javascript
import 'react-native-gesture-handler';
```

## Basic Pie Chart

```typescript
// src/components/charts/PieChart.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';
import { Category } from 'db/types';

interface PieChartProps {
  data: Array<{
    category: Category;
    amount: number;
  }>;
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  const chartData = data.map(item => ({
    x: item.category.name,
    y: item.amount,
    color: item.category.color,
  }));

  return (
    <View style={styles.container}>
      <VictoryPie
        data={chartData}
        width={size}
        height={size}
        colorScale={chartData.map(item => item.color)}
        innerRadius={size * 0.3}
        labelRadius={size * 0.4}
        style={{
          labels: {
            fill: '#333',
            fontSize: 12,
            fontWeight: 'bold',
          },
        }}
        animate={{
          duration: 500,
          easing: 'bounce',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## Line Chart for Trends

```typescript
// src/components/charts/LineChart.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';

interface LineChartProps {
  data: Array<{
    date: Date;
    amount: number;
  }>;
  color?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, color = '#2196F3' }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40;

  const chartData = data.map(item => ({
    x: item.date,
    y: item.amount,
  }));

  return (
    <View style={styles.container}>
      <VictoryChart
        width={chartWidth}
        height={250}
        theme={VictoryTheme.material}
        padding={{ left: 50, right: 20, top: 20, bottom: 50 }}
      >
        <VictoryAxis
          tickFormat={t => {
            const date = new Date(t);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }}
        />
        <VictoryAxis dependentAxis tickFormat={t => `$${t}`} />
        <VictoryLine
          data={chartData}
          style={{
            data: { stroke: color, strokeWidth: 2 },
          }}
          animate={{
            duration: 500,
            easing: 'bounce',
          }}
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## Custom Chart Component

```typescript
// src/components/charts/CategoryExpenseChart.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';
import { Category } from 'db/types';

interface CategoryExpenseChartProps {
  expenses: Array<{
    category: Category;
    amount: number;
  }>;
}

export const CategoryExpenseChart: React.FC<CategoryExpenseChartProps> = ({ expenses }) => {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  const chartData = expenses.map(item => ({
    x: item.category.name,
    y: item.amount,
    color: item.category.color,
    percentage: ((item.amount / total) * 100).toFixed(1),
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses by Category</Text>
      <VictoryPie
        data={chartData}
        width={300}
        height={300}
        colorScale={chartData.map(item => item.color)}
        innerRadius={80}
        labelRadius={120}
        labels={({ datum }) => `${datum.percentage}%`}
        style={{
          labels: {
            fill: '#333',
            fontSize: 14,
            fontWeight: 'bold',
          },
        }}
        animate={{
          duration: 500,
        }}
      />
      <View style={styles.legend}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.x}: ${item.y.toFixed(2)} ({item.percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  legend: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
  },
});
```

## Usage Example

```typescript
// src/screens/Analytics/Analytics.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { CategoryExpenseChart } from 'components/charts/CategoryExpenseChart';
import { LineChart } from 'components/charts/LineChart';
import { useTransactions } from 'hooks/useTransactions';

export const AnalyticsScreen: React.FC = () => {
  const { transactions, expensesByCategory, monthlyTrends } = useTransactions();

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <CategoryExpenseChart expenses={expensesByCategory} />
        <LineChart data={monthlyTrends} color='#4CAF50' />
      </View>
    </ScrollView>
  );
};
```

## Best Practices

1. **Lazy Loading**: Load charts only when needed
2. **Data Preparation**: Prepare data before passing to charts
3. **Memoization**: Use React.memo for chart components
4. **Performance**: Limit data points for line charts (aggregate if needed)

```typescript
// ✅ Good - Memoized chart component
export const CategoryExpenseChart = React.memo<CategoryExpenseChartProps>(({ expenses }) => {
  // Chart implementation
});
```

## References

- [ADR-006: Chart Library Selection](../adr/ADR-006-chart-library-selection.md) - Chart library decision
- [ADR-007: Form Library Selection](../adr/ADR-007-form-library-selection.md) - Form library decision
- [ADR-008: Splash Screen Library Selection](../adr/ADR-008-splash-screen-library-selection.md) - Splash screen library decision
- [Victory Native Documentation](https://formidable.com/open-source/victory/docs/native/) - Victory Native docs
