# Library Implementation Guide

This guide provides detailed implementation instructions for selected libraries in FinTrack. For the decision rationale, see [ADR-006: Library Selection](../adr/ADR-006-library-selection.md).

## Table of Contents

- [Victory Native (Charts)](#victory-native-charts)
- [React Hook Form (Forms)](#react-hook-form-forms)
- [react-native-bootsplash (Splash Screen)](#react-native-bootsplash-splash-screen)
- [Best Practices](#best-practices)

## Victory Native (Charts)

### Installation

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

### Basic Pie Chart

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

### Line Chart for Trends

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

### Custom Chart Component

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

### Usage Example

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

## React Hook Form (Forms)

### Installation

```bash
npm install react-hook-form
# or
yarn add react-hook-form
```

For validation, you can also install:

```bash
npm install @hookform/resolvers zod
# or
yarn add @hookform/resolvers zod
```

### Basic Form Component

```typescript
// src/components/forms/TransactionForm.tsx
import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Transaction } from 'db/types';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  initialData?: Partial<TransactionFormData>;
}

interface TransactionFormData {
  amount: string;
  type: 'income' | 'expense';
  categoryId: string;
  date: Date;
  note?: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, initialData }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues: initialData || {
      amount: '',
      type: 'expense',
      date: new Date(),
    },
  });

  const onFormSubmit = (data: TransactionFormData) => {
    onSubmit({
      ...data,
      amount: parseFloat(data.amount),
    });
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name='amount'
        rules={{
          required: 'Amount is required',
          min: { value: 0.01, message: 'Amount must be greater than 0' },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder='Amount'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType='numeric'
            />
            {errors.amount && <Text style={styles.error}>{errors.amount.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name='note'
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder='Note (optional)'
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
          />
        )}
      />

      <Button title='Submit' onPress={handleSubmit(onFormSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});
```

### Form with Zod Validation

```typescript
// src/components/forms/CategoryForm.tsx
import React from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  icon: z.string().min(1, 'Icon is required'),
  color: z
    .string()
    .min(1, 'Color is required')
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  type: z.enum(['income', 'expense', 'both'], {
    errorMap: () => ({ message: 'Invalid type' }),
  }),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => void;
  initialData?: Partial<CategoryFormData>;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit, initialData }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || {
      name: '',
      icon: '📦',
      color: '#607D8B',
      type: 'expense',
    },
  });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name='name'
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder='Category Name'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name='color'
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder='Color (hex)'
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            {errors.color && <Text style={styles.error}>{errors.color.message}</Text>}
          </View>
        )}
      />

      <Button title='Submit' onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});
```

### Custom Form Hook

```typescript
// src/hooks/useTransactionForm.ts
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const transactionFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(
      value => {
        const num = parseFloat(value);
        return !isNaN(num) && num > 0;
      },
      { message: 'Amount must be greater than 0' },
    ),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.date(),
  note: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionFormSchema>;

export const useTransactionForm = (
  initialData?: Partial<TransactionFormData>,
): UseFormReturn<TransactionFormData> => {
  return useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: initialData || {
      amount: '',
      type: 'expense',
      date: new Date(),
    },
  });
};
```

### Usage Example

```typescript
// src/screens/AddTransaction/AddTransaction.tsx
import React from 'react';
import { View } from 'react-native';
import { TransactionForm } from 'components/forms/TransactionForm';
import { useTransactionForm } from 'hooks/useTransactionForm';
import { transactionService } from 'services/transactionService';

export const AddTransactionScreen: React.FC = () => {
  const form = useTransactionForm();

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      await transactionService.create({
        ...data,
        amount: parseFloat(data.amount),
      });
      // Navigate back or show success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <View>
      <TransactionForm onSubmit={handleSubmit} />
    </View>
  );
};
```

## react-native-bootsplash (Splash Screen)

### Installation

```bash
npm install react-native-bootsplash
# or
yarn add react-native-bootsplash
```

### iOS Setup

1. Add splash screen image to `ios/fintrack/Images.xcassets/LaunchImage.imageset/`
2. Update `ios/fintrack/Info.plist`:

```xml
<key>UILaunchStoryboardName</key>
<string>LaunchScreen</string>
```

3. Run:

```bash
cd ios && pod install
```

### Android Setup

1. Add splash screen image to `android/app/src/main/res/drawable/splash.png`
2. Create `android/app/src/main/res/values/styles.xml`:

```xml
<resources>
    <style name="BootTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="android:windowBackground">@drawable/splash</item>
    </style>
</resources>
```

3. Update `android/app/src/main/AndroidManifest.xml`:

```xml
<activity
    android:name=".MainActivity"
    android:theme="@style/BootTheme"
    ...>
</activity>
```

### Implementation

```typescript
// src/components/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

export const SplashScreen: React.FC = () => {
  useEffect(() => {
    const init = async () => {
      // Initialize app (load data, setup, etc.)
      await initializeApp();

      // Hide splash screen
      await RNBootSplash.hide({ fade: true });
    };

    init();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('assets/images/logo.png')} style={styles.logo} resizeMode='contain' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
```

### App Initialization

```typescript
// src/utils/appInitialization.ts
import { getRealm } from 'db';
import { store } from 'store';
import { hydrateStore } from 'store/hydration';

export const initializeApp = async (): Promise<void> => {
  try {
    // Initialize database
    const realm = getRealm();

    // Hydrate Redux store from database
    await hydrateStore();

    // Other initialization tasks
    // - Load user settings
    // - Check authentication
    // - Setup notifications
    // etc.

    return Promise.resolve();
  } catch (error) {
    console.error('App initialization failed:', error);
    throw error;
  }
};
```

### Usage in App.tsx

```typescript
// App.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from 'navigation';
import { initializeApp } from 'utils/appInitialization';

export const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeApp();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsReady(true);
        await RNBootSplash.hide({ fade: true });
      }
    };

    init();
  }, []);

  if (!isReady) {
    return null; // Splash screen is shown natively
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};
```

### Programmatic Control

```typescript
// Show splash screen again (e.g., during logout)
import RNBootSplash from 'react-native-bootsplash';

const handleLogout = async () => {
  // Clear data
  await clearUserData();

  // Show splash screen
  await RNBootSplash.show();

  // Navigate to login
  navigation.navigate('Login');

  // Hide splash screen after navigation
  setTimeout(() => {
    RNBootSplash.hide({ fade: true });
  }, 500);
};
```

## Best Practices

### Charts

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

### Forms

1. **Validation**: Use Zod for schema validation
2. **Error Handling**: Show clear error messages
3. **Performance**: Use uncontrolled components (React Hook Form default)
4. **Accessibility**: Add accessibility labels

```typescript
// ✅ Good - Accessible form
<TextInput
  accessibilityLabel='Transaction amount'
  accessibilityHint='Enter the transaction amount in dollars'
  // ...
/>
```

### Splash Screen

1. **Timing**: Hide splash screen after app initialization
2. **Error Handling**: Always hide splash screen, even on errors
3. **Smooth Transition**: Use fade animation
4. **Native Implementation**: Prefer native splash screen over React component

## References

- [ADR-006: Library Selection](../adr/ADR-006-library-selection.md) - Decision rationale
- [Victory Native Documentation](https://formidable.com/open-source/victory/docs/native/) - Victory Native docs
- [React Hook Form Documentation](https://react-hook-form.com/) - React Hook Form docs
- [react-native-bootsplash Documentation](https://github.com/zoontek/react-native-bootsplash) - Bootsplash docs
