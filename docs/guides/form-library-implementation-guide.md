# Form Library Implementation Guide

This guide provides detailed implementation instructions for React Hook Form in FinTrack. For the decision rationale, see [ADR-007: Form Library Selection](../adr/ADR-007-form-library-selection.md).

## Table of Contents

- [Installation](#installation)
- [Basic Form Component](#basic-form-component)
- [Form with Zod Validation](#form-with-zod-validation)
- [Custom Form Hook](#custom-form-hook)
- [Usage Example](#usage-example)
- [Best Practices](#best-practices)

## Installation

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

## Basic Form Component

```typescript
// src/components/forms/TransactionForm.tsx
import React from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
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

## Form with Zod Validation

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

## Custom Form Hook

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

## Usage Example

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

## Best Practices

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

## References

- [ADR-006: Chart Library Selection](../adr/ADR-006-chart-library-selection.md) - Chart library decision
- [ADR-007: Form Library Selection](../adr/ADR-007-form-library-selection.md) - Form library decision
- [ADR-008: Splash Screen Library Selection](../adr/ADR-008-splash-screen-library-selection.md) - Splash screen library decision
- [React Hook Form Documentation](https://react-hook-form.com/) - React Hook Form docs
