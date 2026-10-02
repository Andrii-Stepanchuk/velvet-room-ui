import { memo, type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { FORGE } from '../../config/tasksLayout';

export const ForgeField = memo(function ForgeField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <View style={{ marginTop: FORGE.fieldGap }}>
      <Text
        accessibilityRole="header"
        maxFontSizeMultiplier={FORGE.maxFontScale}
        className="font-display-medium text-2xs tracking-md text-accent"
        style={{ marginBottom: FORGE.labelGap }}
      >
        {label}
      </Text>
      {children}
      {hint !== undefined && (
        <Text maxFontSizeMultiplier={1.3} className="mt-2 font-body-medium text-sm text-secondary">
          {hint}
        </Text>
      )}
    </View>
  );
});
